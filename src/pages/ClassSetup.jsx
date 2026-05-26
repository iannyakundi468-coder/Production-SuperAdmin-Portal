import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AlertTriangle, BookOpen, X } from 'lucide-react';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={20} /> Confirm Action</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function ClassSetup() {
  const { users, classes, addClass, updateClass, enrollStudent, removeStudent } = useAdmin();

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', teacherId: '', term: 'Term 2 2026', subject: '', capacity: 30 });
  const [confirm, setConfirm] = useState(null);
  const [enrollMap, setEnrollMap] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!form.name || !form.teacherId) return;
    const teacher = teachers.find(t => t.id === form.teacherId);
    addClass({ ...form, teacher: teacher?.name || '', capacity: Number(form.capacity) });
    setForm({ name: '', teacherId: '', term: 'Term 2 2026', subject: '', capacity: 30 });
    setShowForm(false);
  };

  const handleEnroll = (classId) => {
    const studentId = enrollMap[classId];
    if (!studentId) return;
    const cls = classes.find(c => c.id === classId);
    if (cls.students.includes(studentId)) return; // duplicate guard
    if (cls.students.length >= cls.capacity) { alert('Class is full!'); return; }
    enrollStudent(classId, studentId);
    setEnrollMap(p => ({ ...p, [classId]: '' }));
  };

  const confirmRemove = (classId, studentId) => {
    const s = students.find(x => x.id === studentId);
    setConfirm({
      message: `Remove ${s?.name} from this class?`,
      onConfirm: () => { removeStudent(classId, studentId); setConfirm(null); }
    });
  };

  return (
    <div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><BookOpen size={32} /> Academic &amp; Class Setup</h1>
          <p>Create classes, assign teachers, and enroll students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {showForm ? <><X size={16} /> Cancel</> : '+ New Class'}
        </button>
      </div>

      {/* New Class Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>New Class</div>
          <div className="form-row">
            <div className="form-group">
              <label>Class Name</label>
              <input className="input" placeholder="Grade 4 – Morning" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input className="input" placeholder="Mathematics" value={form.subject} onChange={e => set('subject', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Teacher</label>
              <select className="select" value={form.teacherId} onChange={e => set('teacherId', e.target.value)}>
                <option value="">Select teacher…</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Term</label>
              <select className="select" value={form.term} onChange={e => set('term', e.target.value)}>
                {['Term 1 2026', 'Term 2 2026', 'Term 3 2026'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input className="input" type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleAdd}>Create Class</button>
        </div>
      )}

      {/* Classes list */}
      {classes.map(cls => {
        const enrolledStudents = students.filter(s => cls.students.includes(s.id));
        const pct = Math.round((cls.students.length / cls.capacity) * 100);
        return (
          <div key={cls.id} className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div className="card-title">{cls.name}</div>
                <div className="card-subtitle">{cls.subject} · {cls.term} · Teacher: {cls.teacher}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${cls.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{cls.status}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {cls.students.length}/{cls.capacity} enrolled
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => updateClass(cls.id, { status: cls.status === 'active' ? 'inactive' : 'active' })}
                >
                  {cls.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>

            {/* Capacity bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: pct > 85 ? 'var(--red)' : pct > 60 ? 'var(--yellow)' : 'var(--green)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Enrolled students */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {enrolledStudents.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No students enrolled yet.</span>}
              {enrolledStudents.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card-hover)', border: '1px solid var(--border)', borderRadius: 99, padding: '4px 10px' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</span>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                    onClick={() => confirmRemove(cls.id, s.id)}
                  ><X size={14} /></button>
                </div>
              ))}
            </div>

            {/* Enroll student dropdown */}
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                className="select"
                style={{ maxWidth: 260 }}
                value={enrollMap[cls.id] || ''}
                onChange={e => setEnrollMap(p => ({ ...p, [cls.id]: e.target.value }))}
              >
                <option value="">Enroll a student…</option>
                {students
                  .filter(s => !cls.students.includes(s.id))
                  .map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>)
                }
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(cls.id)}>Enroll</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
