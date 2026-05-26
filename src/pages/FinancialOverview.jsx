import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { CircleDollarSign, Download } from 'lucide-react';

const STATUS_OPTIONS = ['all', 'successful', 'failed', 'overdue'];
const TERMS = ['all', 'Term 1 2026', 'Term 2 2026'];

function statusBadge(status) {
  const map = { successful: 'badge-green', failed: 'badge-red', overdue: 'badge-yellow' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

function exportCSV(data) {
  const rows = [
    ['Date', 'Student', 'Parent', 'Amount (KES)', 'Method', 'Status', 'Term', 'Reference'],
    ...data.map(p => [p.date, p.student, p.parent, p.amount, p.method, p.status, p.term, p.ref]),
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function FinancialOverview() {
  const { payments, metrics } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchTerm = termFilter === 'all' || p.term === termFilter;
    const matchFrom = !dateFrom || p.date >= dateFrom;
    const matchTo = !dateTo || p.date <= dateTo;
    return matchStatus && matchTerm && matchFrom && matchTo;
  });

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><CircleDollarSign size={32} /> Financial Oversight</h1>
        <p>Read-only audit view of all school payments. No edits permitted.</p>
      </div>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="label">Total Collected</div>
          <div className="value green">KES {metrics.totalCollected.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="label">Outstanding / Overdue</div>
          <div className="value red">KES {metrics.pendingFees.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="label">Failed / Flagged Transactions</div>
          <div className="value yellow">{metrics.failedPayments}</div>
        </div>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <select className="select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select className="select" style={{ width: 'auto' }} value={termFilter} onChange={e => setTermFilter(e.target.value)}>
            {TERMS.map(t => <option key={t} value={t}>{t === 'all' ? 'All Terms' : t}</option>)}
          </select>
          <input className="input" type="date" style={{ width: 'auto' }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From date" />
          <input className="input" type="date" style={{ width: 'auto' }} value={dateTo} onChange={e => setDateTo(e.target.value)} title="To date" />
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(filtered)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Download size={16} /> Export CSV</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Parent</th>
                <th>Amount (KES)</th>
                <th>Method</th>
                <th>Term</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8}><div className="empty"><p>No payments match the current filters.</p></div></td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} style={p.status !== 'successful' ? { background: p.status === 'overdue' ? 'rgba(245,158,11,0.04)' : 'rgba(239,68,68,0.04)' } : {}}>
                  <td>{p.date}</td>
                  <td><strong>{p.student}</strong></td>
                  <td>{p.parent}</td>
                  <td><strong>KES {p.amount.toLocaleString()}</strong></td>
                  <td>{p.method}</td>
                  <td>{p.term}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
          Showing {filtered.length} of {payments.length} transactions · Read-only audit view
        </div>
      </div>
    </div>
  );
}
