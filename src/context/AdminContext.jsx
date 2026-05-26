import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  mockPayments, mockActivity, mockAuditLog, defaultConfig, translations
} from '../data/mockData';
import { api } from '../lib/api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments] = useState(mockPayments);
  const [activity, setActivity] = useState(mockActivity);
  const [auditLog, setAuditLog] = useState(mockAuditLog);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const user = localStorage.getItem('somobloom_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, classesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/classes')
      ]);
      setUsers(usersRes.users || []);
      setClasses(classesRes.classes || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('somobloom_token');
    if (token) {
      fetchData();
      
      // Keep currentAdmin in sync
      try {
        const user = localStorage.getItem('somobloom_user');
        if (user) setCurrentAdmin(JSON.parse(user));
      } catch (e) {}
    } else {
      setLoading(false);
    }
  }, [fetchData]);

  const t = useCallback((key) => {
    return translations[config.language]?.[key] || translations.en[key] || key;
  }, [config.language]);

  // ── User actions ──────────────────────────────────────
  const addUser = async (user) => {
    try {
      let endpoint = '';
      const payload = {
        name: user.name,
        email: user.email,
        password: user.password || Math.random().toString(36).substring(2, 10)
      };

      if (user.role === 'teacher') {
        endpoint = '/admin/teachers';
        payload.department = user.department || '';
      } else if (user.role === 'student') {
        endpoint = '/admin/students';
        payload.studentIdNumber = user.studentId || '';
      } else if (user.role === 'parent') {
        endpoint = '/admin/parents';
        payload.phoneNumber = user.phone || '';
      } else {
        throw new Error(`Unsupported user role: ${user.role}`);
      }

      const res = await api.post(endpoint, payload);
      const newUser = {
        id: res.teacher?.id || res.student?.id || res.parent?.id,
        userId: res.teacher?.userId || res.student?.userId || res.parent?.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date().toISOString(),
        status: 'active',
        department: user.department,
        studentIdNumber: user.studentId,
        phoneNumber: user.phone
      };

      setUsers(prev => [newUser, ...prev]);
      pushActivity(currentAdmin?.name || 'Admin', 'added user', `${newUser.name} (${newUser.role})`);
      pushAudit(`Added new user ${newUser.name} (${newUser.role})`);
    } catch (err) {
      console.error('Failed to add user:', err);
      alert(err.message || 'Failed to add user');
    }
  };

  const updateUser = async (id, patch) => {
    try {
      await api.put(`/admin/users/${id}`, {
        name: patch.name,
        email: patch.email,
        department: patch.department,
        studentIdNumber: patch.studentId,
        phoneNumber: patch.phone
      });

      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u));
      pushAudit(`Updated user ${patch.name || id}`);
    } catch (err) {
      console.error('Failed to update user:', err);
      alert(err.message || 'Failed to update user');
    }
  };

  const deactivateUser = (id) => {
    const u = users.find(x => x.id === id);
    setUsers(prev => prev.map(x => x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x));
    pushAudit(`${u?.status === 'active' ? 'Deactivated' : 'Activated'} user ${u?.name}`);
  };

  const deleteUser = async (id) => {
    try {
      const u = users.find(x => x.id === id);
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(x => x.id !== id));
      pushAudit(`Deleted user ${u?.name}`);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user');
    }
  };

  // ── Class actions ─────────────────────────────────────
  const addClass = async (cls) => {
    try {
      const res = await api.post('/admin/classes', {
        name: cls.name,
        teacherProfileId: cls.teacherId
      });

      const newCls = {
        id: res.class.id,
        name: cls.name,
        teacherId: cls.teacherId,
        teacher: users.find(u => u.id === cls.teacherId)?.name || 'Unassigned',
        students: [],
        status: 'active'
      };

      setClasses(prev => [newCls, ...prev]);
      pushAudit(`Created class "${newCls.name}"`);
    } catch (err) {
      console.error('Failed to create class:', err);
      alert(err.message || 'Failed to create class');
    }
  };

  const updateClass = async (id, patch) => {
    try {
      await api.put(`/admin/classes/${id}`, {
        name: patch.name,
        teacherId: patch.teacherId
      });

      setClasses(prev => prev.map(c => {
        if (c.id !== id) return c;
        const teacherName = patch.teacherId 
          ? (users.find(u => u.id === patch.teacherId)?.name || c.teacher)
          : c.teacher;

        return {
          ...c,
          ...patch,
          teacher: teacherName
        };
      }));
      pushAudit(`Updated class "${patch.name || id}"`);
    } catch (err) {
      console.error('Failed to update class:', err);
      alert(err.message || 'Failed to update class');
    }
  };

  const enrollStudent = async (classId, studentId) => {
    try {
      await api.post(`/admin/classes/${classId}/enrollments`, {
        studentProfileId: studentId
      });

      setClasses(prev => prev.map(c => {
        if (c.id !== classId) return c;
        if (c.students.includes(studentId)) return c;
        return { ...c, students: [...c.students, studentId] };
      }));

      const student = users.find(u => u.id === studentId);
      const cls = classes.find(c => c.id === classId);
      pushAudit(`Enrolled ${student?.name} in ${cls?.name}`);
    } catch (err) {
      console.error('Failed to enroll student:', err);
      alert(err.message || 'Failed to enroll student');
    }
  };

  const removeStudent = (classId, studentId) => {
    setClasses(prev => prev.map(c =>
      c.id === classId ? { ...c, students: c.students.filter(id => id !== studentId) } : c
    ));
  };

  // ── Config actions ────────────────────────────────────
  const updateConfig = (patch) => {
    setConfig(prev => ({ ...prev, ...patch }));
    const key = Object.keys(patch)[0];
    pushAudit(`Updated setting "${key}" to "${patch[key]}"`);
  };

  // ── Helpers ───────────────────────────────────────────
  const pushActivity = (user, action, detail) => {
    setActivity(prev => [
      { id: `a${Date.now()}`, user, action, detail, time: 'just now', color: '#6366f1' },
      ...prev.slice(0, 9)
    ]);
  };

  const pushAudit = (action) => {
    const now = new Date();
    const time = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    setAuditLog(prev => [
      { id: `al${Date.now()}`, time, user: currentAdmin?.name || 'Admin', action, category: 'General' },
      ...prev.slice(0, 19)
    ]);
  };

  // ── Derived metrics ───────────────────────────────────
  const metrics = {
    totalStudents: users.filter(u => u.role === 'student').length,
    totalTeachers: users.filter(u => u.role === 'teacher').length,
    activeClasses: classes.filter(c => c.status === 'active').length,
    pendingFees: payments.filter(p => p.status === 'overdue' || p.status === 'failed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalCollected: payments.filter(p => p.status === 'successful')
      .reduce((sum, p) => sum + p.amount, 0),
    failedPayments: payments.filter(p => p.status === 'failed' || p.status === 'overdue').length,
  };

  return (
    <AdminContext.Provider value={{
      users, classes, payments, activity, auditLog, config, currentAdmin, metrics,
      t, addUser, updateUser, deactivateUser, deleteUser,
      addClass, updateClass, enrollStudent, removeStudent,
      updateConfig, pushActivity
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
};
