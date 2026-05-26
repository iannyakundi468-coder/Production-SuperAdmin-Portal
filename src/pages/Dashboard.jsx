import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { GraduationCap, Presentation, AlertTriangle, BookOpen, Zap, Users, CircleDollarSign, Settings as SettingsIcon, ClipboardList } from 'lucide-react';

function MetricCard({ label, value, icon, colorClass, change }) {
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-icon" style={{ background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>{icon}</span>
      </div>
      <div className="metric-value">{value ?? <span className="skeleton" style={{ width: 60, height: 28, display: 'inline-block' }} />}</div>
      <div className="metric-label">{label}</div>
      {change && <div className="metric-change">{change}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { t, metrics, activity, pushActivity } = useAdmin();

  const handleQuickNav = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('dashboard')}</h1>
        <p>School-wide overview and quick actions</p>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <MetricCard label={t('totalStudents')} value={metrics.totalStudents} icon={<GraduationCap size={20} />} colorClass="indigo" change="+2 this term" />
        <MetricCard label={t('totalTeachers')} value={metrics.totalTeachers} icon={<Presentation size={20} />} colorClass="green" />
        <MetricCard label={t('pendingFees')} value={`KES ${metrics.pendingFees.toLocaleString()}`} icon={<AlertTriangle size={20} />} colorClass="yellow" />
        <MetricCard label={t('activeClasses')} value={metrics.activeClasses} icon={<BookOpen size={20} />} colorClass="blue" />
      </div>

      {/* Visual Analytics Overview */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        
        {/* Chart 1: Enrollment Donut */}
        <div className="card" style={{ flex: 1, minWidth: 280 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Enrollment Distribution</div>
              <div className="card-subtitle">User registration ratio</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, gap: 30 }}>
            <svg viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="150.7 251.2" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="75.4 251.2" strokeDashoffset="-150.7" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray="25.1 251.2" strokeDashoffset="-226.1" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                Students (60%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                Parents (30%)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: '600', color: '#64748b' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} />
                Teachers (10%)
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Fee Collections curved Area */}
        <div className="card" style={{ flex: 1, minWidth: 280 }}>
          <div className="card-header">
            <div>
              <div className="card-title">Fee Collections</div>
              <div className="card-subtitle">KES Cashflow Trend (Monthly)</div>
            </div>
          </div>
          <div style={{ padding: '0 20px', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <svg viewBox="0 0 300 100" style={{ width: '100%', height: 100, overflow: 'visible' }}>
              <defs>
                <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f8fafc" strokeWidth="1.5" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f8fafc" strokeWidth="1.5" />

              <path d="M 10,80 Q 75,35 145,55 T 290,15 L 290,100 L 10,100 Z" fill="url(#feeGrad)" />
              <path d="M 10,80 Q 75,35 145,55 T 290,15" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />

              <circle cx="10" cy="80" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="75" cy="35" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="145" cy="55" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="215" cy="30" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="290" cy="15" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: '700', color: '#94a3b8', marginTop: 8, padding: '0 5px' }}>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={18} /> {t('quickActions')}</div>
          </div>
        </div>
        <div className="quick-actions">
          {[
            { label: t('manageUsers'), path: '/users', icon: <Users size={16} /> },
            { label: t('setupClasses'), path: '/classes', icon: <BookOpen size={16} /> },
            { label: t('viewFinance'), path: '/finance', icon: <CircleDollarSign size={16} /> },
            { label: t('systemSettings'), path: '/settings', icon: <SettingsIcon size={16} /> },
          ].map(a => (
            <button key={a.path} className="quick-btn" onClick={() => handleQuickNav(a.path)}>
              <span style={{ display: 'flex', alignItems: 'center' }}>{a.icon}</span> {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity log */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClipboardList size={18} /> {t('recentActivity')}</div>
            <div className="card-subtitle">Live system events</div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => pushActivity('Admin Super', 'viewed dashboard', '')}
          >
            Refresh
          </button>
        </div>
        <div className="activity-list">
          {activity.length === 0 && (
            <div className="empty"><p>No recent activity.</p></div>
          )}
          {activity.map(a => (
            <div key={a.id} className="activity-item">
              <div className="activity-dot" style={{ background: a.color }} />
              <div className="activity-text">
                <strong>{a.user}</strong> {a.action}
                {a.detail && <> — <em>{a.detail}</em></>}
              </div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
