import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Calendar, Loader2, Play, Users, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default function Timetable() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Setup form state
  const [classesInput, setClassesInput] = useState('Grade 1, Grade 2');
  const [teachersInput, setTeachersInput] = useState('Mr. Smith, Ms. Doe, Mrs. Wanjiku');
  const [subjectsInput, setSubjectsInput] = useState('Math, English, Kiswahili, Science, PE');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/timetable');
      if (res.timetable && res.timetable.data) {
        setTimetable(JSON.parse(res.timetable.data));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load the master timetable.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setGenerating(true);
    
    const classesArray = classesInput.split(',').map(c => c.trim()).filter(Boolean);
    const teachersArray = teachersInput.split(',').map(t => t.trim()).filter(Boolean);
    const subjectsArray = subjectsInput.split(',').map(s => s.trim()).filter(Boolean);

    if (!classesArray.length || !teachersArray.length || !subjectsArray.length) {
      setError('Please provide at least one class, teacher, and subject.');
      setGenerating(false);
      return;
    }

    try {
      await api.post('/admin/timetable/generate', {
        classes: classesArray,
        teachers: teachersArray,
        subjects: subjectsArray
      });
      await fetchTimetable();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate timetable. Ensure AI binding is configured.');
    } finally {
      setGenerating(false);
    }
  };

  // Inline CSS for the specific grid to handle mobile gracefully
  const gridStyle = {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  };

  return (
    <div style={{ animation: 'fade-in 0.5s ease-in' }}>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar color="var(--accent)" /> Master Timetable
        </h1>
        <p>Generate and manage the AI-powered master schedule for your school.</p>
      </div>

      {error && (
        <div style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red)', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main layout wrapper that gracefully handles mobile stacking */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="timetable-container">
        
        {/* Style tag specifically for making the two-col responsive if screen is wide enough */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .timetable-container { flex-direction: row !important; }
            .timetable-sidebar { width: 320px; flex-shrink: 0; }
            .timetable-main { flex: 1; }
          }
        `}} />

        {/* Configuration Sidebar */}
        <div className="card timetable-sidebar" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <h2 className="card-title">AI Configuration</h2>
          </div>
          <form onSubmit={handleGenerate} className="form-grid">
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="var(--accent)" /> Target Classes
              </label>
              <textarea 
                value={classesInput}
                onChange={e => setClassesInput(e.target.value)}
                className="input"
                style={{ resize: 'vertical', minHeight: '80px' }}
                placeholder="Comma separated classes..."
                disabled={generating}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="var(--accent)" /> Available Teachers
              </label>
              <textarea 
                value={teachersInput}
                onChange={e => setTeachersInput(e.target.value)}
                className="input"
                style={{ resize: 'vertical', minHeight: '80px' }}
                placeholder="Comma separated teachers..."
                disabled={generating}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} color="var(--accent)" /> Core Subjects
              </label>
              <textarea 
                value={subjectsInput}
                onChange={e => setSubjectsInput(e.target.value)}
                className="input"
                style={{ resize: 'vertical', minHeight: '80px' }}
                placeholder="Comma separated subjects..."
                disabled={generating}
              />
            </div>

            <button 
              type="submit"
              disabled={generating}
              className="btn btn-primary"
              style={{ width: '100%', justifyItems: 'center', justifyContent: 'center', marginTop: '16px', padding: '12px' }}
            >
              {generating ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={18} />}
              <span style={{ marginLeft: '6px' }}>{generating ? 'AI Generating...' : 'Generate Timetable'}</span>
            </button>
          </form>
        </div>

        {/* Timetable View */}
        <div className="card timetable-main" style={{ minHeight: '500px' }}>
          {loading ? (
            <div className="empty">
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
              <p>Loading master timetable...</p>
            </div>
          ) : timetable && timetable.schedule ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {timetable.schedule.map((dayObj, i) => (
                <div key={i}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="var(--accent)" />
                    {dayObj.day}
                  </h3>
                  <div style={gridStyle}>
                    {dayObj.slots && dayObj.slots.map((slot, j) => (
                      <div key={j} style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <span className="badge badge-gray" style={{ fontSize: '12px', padding: '4px 10px' }}>{slot.time}</span>
                          <span className="badge badge-purple" style={{ fontSize: '12px', padding: '4px 10px' }}>{slot.class}</span>
                        </div>
                        <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '16px', marginBottom: '6px' }}>{slot.subject}</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <Users size={14} color="var(--text-muted)" /> {slot.teacher}
                        </p>
                      </div>
                    ))}
                    {(!dayObj.slots || dayObj.slots.length === 0) && (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '16px', background: 'var(--bg-base)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', fontSize: '13px', color: 'var(--text-muted)' }}>
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--bg-base)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--border)' }}>
                <Calendar size={28} color="var(--text-muted)" />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '16px' }}>No Master Timetable Found</p>
              <p style={{ maxWidth: '300px', margin: '0 auto' }}>Use the AI Configuration panel to generate a clash-free weekly schedule for your school.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
