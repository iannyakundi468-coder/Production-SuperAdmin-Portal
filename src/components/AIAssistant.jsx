import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Sparkles, Bot, X } from 'lucide-react';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI assistant. I can help interpret financial data, student metrics, and perform calculations. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const { metrics, activity } = useAdmin();

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Mock AI response delay
    setTimeout(() => {
      let aiResponse = "I'm sorry, I didn't quite catch that. Could you ask about finances or student data?";
      const lower = userMsg.toLowerCase();

      if (lower.includes('finance') || lower.includes('money') || lower.includes('fee')) {
        aiResponse = `Looking at the current data, you have collected KES ${metrics.totalCollected.toLocaleString()} this term, with KES ${metrics.pendingFees.toLocaleString()} still pending across ${metrics.failedPayments} overdue accounts. The collection rate could be improved by sending automated reminders to the overdue accounts.`;
      } else if (lower.includes('student') || lower.includes('enroll')) {
        aiResponse = `You currently have ${metrics.totalStudents} students managed by ${metrics.totalTeachers} teachers, spread across ${metrics.activeClasses} active classes. The student-to-teacher ratio is looking healthy at roughly ${Math.round(metrics.totalStudents / metrics.totalTeachers)}:1.`;
      } else if (lower.includes('calculate') || lower.includes('add') || lower.includes('+')) {
        aiResponse = `I can perform basic calculations. Total revenue (Collected + Pending) is KES ${(metrics.totalCollected + metrics.pendingFees).toLocaleString()}.`;
      } else if (lower.includes('activity') || lower.includes('recent')) {
        const latest = activity[0];
        aiResponse = `The most recent activity was ${latest.user} who ${latest.action} ${latest.detail ? `(${latest.detail})` : ''} ${latest.time}.`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
          fontSize: 24,
          zIndex: 999,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Sparkles size={24} />
      </button>

      {/* Slide Panel / Chat Window */}
      {open && (
        <div className="panel-overlay" onClick={() => setOpen(false)}>
          <div className="slide-panel" onClick={e => e.stopPropagation()} style={{ zIndex: 1000 }}>
            <div className="panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center' }}><Bot size={24} /></span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>AI Assistant</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Online</div>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => setOpen(false)} style={{ display: 'flex' }}><X size={16} /></button>
            </div>

            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-base)' }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: 16,
                  borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
                  maxWidth: '85%',
                  fontSize: 14,
                  boxShadow: 'var(--shadow)',
                  border: m.role === 'ai' ? '1px solid var(--border)' : 'none'
                }}>
                  {m.text}
                </div>
              ))}
            </div>

            <div className="panel-footer" style={{ background: 'var(--bg-card)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', width: '100%', gap: 8 }}>
                <input 
                  type="text" 
                  className="input" 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about finance, students..."
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
