import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { X, Activity } from 'lucide-react';
import api from '../../services/api';

const blockersOptions = [
  'low energy', 'burnout', 'procrastination', 'lack of clarity', 
  'loneliness', 'anxiety', 'interview stress', 'academic pressure', 
  'motivation issues', 'impostor syndrome', 'other'
];

const QuickCheckInModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    stressLevel: 5,
    motivationLevel: 5,
    confidenceLevel: 5,
    progressState: 'a_little',
    goalRealism: 'realistic',
    blockers: [],
    reflection: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleBlocker = (blocker) => {
    setFormData(prev => ({
      ...prev,
      blockers: prev.blockers.includes(blocker) 
        ? prev.blockers.filter(b => b !== blocker)
        : [...prev.blockers, blocker]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/daily-checkins', formData);
      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to save check-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-xl rounded-3xl shadow-xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
               <div>
                 <h2 className="text-xl font-bold text-slate-900 flex items-center"><Activity className="w-5 h-5 mr-2 text-brand-500" /> Daily Reflection</h2>
                 <p className="text-sm font-medium text-slate-500 mt-1">A low-friction, emotionally safe snapshot of your progress today.</p>
               </div>
               <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="checkInForm" onSubmit={handleSubmit} className="space-y-6">
                 
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-4">How are you feeling out of 10?</label>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                          <span>Stress ({formData.stressLevel})</span>
                        </div>
                        <input type="range" min="1" max="10" value={formData.stressLevel} onChange={e => setFormData({...formData, stressLevel: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                          <span>Motivation ({formData.motivationLevel})</span>
                        </div>
                        <input type="range" min="1" max="10" value={formData.motivationLevel} onChange={e => setFormData({...formData, motivationLevel: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                          <span>Confidence ({formData.confidenceLevel})</span>
                        </div>
                        <input type="range" min="1" max="10" value={formData.confidenceLevel} onChange={e => setFormData({...formData, confidenceLevel: Number(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">What's getting in the way right now?</label>
                    <div className="flex flex-wrap gap-2">
                      {blockersOptions.map(b => (
                        <button type="button" key={b} onClick={() => toggleBlocker(b)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${formData.blockers.includes(b) ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                          {b}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Current Progress</label>
                      <select className="input-field cursor-pointer font-bold capitalize text-sm" value={formData.progressState} onChange={e => setFormData({...formData, progressState: e.target.value})}>
                         <option value="no_progress">No Progress Yet</option>
                         <option value="a_little">A Little Bit</option>
                         <option value="moderate">Moderate</option>
                         <option value="strong_progress">Strong Progress</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Goals Reality Check</label>
                      <select className="input-field cursor-pointer font-bold capitalize text-sm" value={formData.goalRealism} onChange={e => setFormData({...formData, goalRealism: e.target.value})}>
                         <option value="realistic">Still Realistic</option>
                         <option value="maybe">Unsure / Maybe</option>
                         <option value="needs_reduction">Needs Reduction</option>
                      </select>
                   </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Reflection (Private)</label>
                    <textarea className="input-field resize-none h-20 text-sm" placeholder="What felt hardest this week? What support do you need?" value={formData.reflection} onChange={e => setFormData({...formData, reflection: e.target.value})} />
                 </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white shrink-0">
               <Button type="submit" form="checkInForm" className="w-full" size="lg" isLoading={loading}>Log Reflection Securely</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickCheckInModal;
