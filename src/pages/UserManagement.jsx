import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AlertTriangle, X, Users, Search, Upload } from 'lucide-react';

const ROLES = ['all', 'teacher', 'parent', 'admin'];

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

function UserPanel({ user, onClose, onSave }) {
  const [form, setForm] = useState({ ...user });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div>
      <div className="panel-overlay" onClick={onClose} />
      <div className="slide-panel">
        <div className="panel-header">
          <strong>{user.id ? 'Edit User' : 'New User'}</strong>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="panel-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input className="input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="jane@school.ke" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select className="select" value={form.role || 'teacher'} onChange={e => set('role', e.target.value)}>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

          </div>
        </div>
        <div className="panel-footer">
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}

function BulkUploadModal({ onClose, addUser }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] ? values[i].trim() : '';
        });
        return obj;
      });
      setPreview(data);
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;
    setUploading(true);
    let success = 0;
    let failed = 0;

    for (let i = 0; i < preview.length; i++) {
      const row = preview[i];
      try {
        // Map CSV fields to backend fields
        if (row.role?.toLowerCase() === 'student') {
          failed++;
          continue; // Prevent student creation via CSV here
        }
        const userPayload = {
          name: row.name,
          email: row.email,
          role: row.role || 'teacher',
          phone: row.phone || row.phonenumber || '',
          department: row.department || ''
        };
        await addUser(userPayload);
        success++;
      } catch (err) {
        failed++;
      }
      setProgress(Math.round(((i + 1) / preview.length) * 100));
    }

    setResults({ success, failed, total: preview.length });
    setUploading(false);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" style={{ maxWidth: 500 }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Upload size={20} /> Bulk Import Users</h3>
        
        {!results ? (
          <>
            <p style={{ marginBottom: 16 }}>Upload a CSV file with columns: <code>name, email, role, phone, department</code><br/><span style={{color: 'var(--error)', fontSize: 12}}>Note: Students must be added by Class Teachers.</span></p>
            
            <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginBottom: 16, display: 'block' }} disabled={uploading} />
            
            {preview.length > 0 && !uploading && (
              <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Found {preview.length} valid rows ready for import.</p>
            )}

            {uploading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ background: '#e2e8f0', borderRadius: 8, height: 8, width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--primary)', height: '100%', width: `${progress}%`, transition: 'width 0.2s' }} />
                </div>
                <p style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>{progress}% Uploaded</p>
              </div>
            )}

            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={onClose} disabled={uploading}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUpload} disabled={uploading || preview.length === 0}>
                {uploading ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h4>Import Complete!</h4>
              <p style={{ color: 'var(--text-muted)' }}>Successfully imported <strong>{results.success}</strong> users.</p>
              {results.failed > 0 && <p style={{ color: 'var(--error)' }}>Failed to import {results.failed} users.</p>}
            </div>
            <div className="dialog-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function UserManagement() {
  const { users, addUser, updateUser, deactivateUser, deleteUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [panelUser, setPanelUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleSave = (form) => {
    if (form.id) {
      updateUser(form.id, form);
    } else {
      const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      addUser({ ...form, avatar: initials });
    }
    setPanelUser(null);
  };

  const handleDelete = (id) => {
    setConfirm({
      message: 'This will permanently delete the user. This cannot be undone.',
      onConfirm: () => { deleteUser(id); setConfirm(null); },
    });
  };

  const roleBadge = (role) => {
    const map = { student: 'blue', teacher: 'green', parent: 'purple', admin: 'red' };
    return <span className={`badge badge-${map[role] || 'gray'}`}>{role}</span>;
  };

  return (
    <div>
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
      {panelUser !== null && (
        <UserPanel
          user={panelUser}
          onClose={() => setPanelUser(null)}
          onSave={handleSave}
        />
      )}
      {showBulkUpload && (
        <BulkUploadModal onClose={() => setShowBulkUpload(false)} addUser={addUser} />
      )}

      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Users size={32} /> User &amp; Role Management</h1>
        <p>View, add, edit, or deactivate students, teachers, and parents.</p>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-wrap" style={{ flex: 1, maxWidth: 320 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}><Search size={16} /></span>
            <input
              className="input"
              style={{ paddingLeft: 34 }}
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="select" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" title="Import CSV" onClick={() => setShowBulkUpload(true)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Upload size={16} /> Import CSV</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPanelUser({})}>+ Add User</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="empty"><p>No users found.</p></div></td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="admin-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{u.avatar}</div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{u.grade || '—'}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setPanelUser(u)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => deactivateUser(u.id)}>
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
