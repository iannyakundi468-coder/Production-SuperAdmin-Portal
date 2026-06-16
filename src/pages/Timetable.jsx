import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Calendar, Loader2, Play, Users, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <div className="page-wrap animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Master Timetable
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and manage the AI-powered master schedule for your school.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Sidebar */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-fit">
          <h2 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">AI Configuration</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
                <Users size={14} className="text-indigo-500" /> Target Classes
              </label>
              <textarea 
                value={classesInput}
                onChange={e => setClassesInput(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-20"
                placeholder="Comma separated classes..."
                disabled={generating}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
                <Users size={14} className="text-indigo-500" /> Available Teachers
              </label>
              <textarea 
                value={teachersInput}
                onChange={e => setTeachersInput(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-20"
                placeholder="Comma separated teachers..."
                disabled={generating}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1">
                <BookOpen size={14} className="text-indigo-500" /> Core Subjects
              </label>
              <textarea 
                value={subjectsInput}
                onChange={e => setSubjectsInput(e.target.value)}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-20"
                placeholder="Comma separated subjects..."
                disabled={generating}
              />
            </div>

            <button 
              type="submit"
              disabled={generating}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-indigo-500/20"
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              {generating ? 'AI Generating Schedule...' : 'Generate Master Timetable'}
            </button>
          </form>
        </div>

        {/* Timetable View */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p>Loading master timetable...</p>
            </div>
          ) : timetable && timetable.schedule ? (
            <div className="space-y-8">
              {timetable.schedule.map((dayObj, i) => (
                <div key={i} className="animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Clock size={18} className="text-indigo-500" />
                    {dayObj.day}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {dayObj.slots && dayObj.slots.map((slot, j) => (
                      <div key={j} className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-indigo-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                            {slot.time}
                          </span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {slot.class}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-sm mb-1">{slot.subject}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Users size={12} /> {slot.teacher}
                        </p>
                      </div>
                    ))}
                    {(!dayObj.slots || dayObj.slots.length === 0) && (
                      <div className="col-span-full text-center text-sm text-slate-400 py-4 bg-slate-50 rounded border border-dashed border-slate-200">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                <Calendar size={24} className="text-slate-300" />
              </div>
              <p className="font-medium text-slate-600 mb-1">No Master Timetable Found</p>
              <p className="text-sm max-w-sm">Use the AI Configuration panel to generate a clash-free weekly schedule for your school.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
