import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { X, CheckSquare } from 'lucide-react';
import api from '../../services/api';

const WeeklyWrapUpModal = ({ isOpen, onClose, counts, goals = [], onCreated }) => {
  const [formData, setFormData] = useState({
    overallFeeling: 'okay',
    supportNeededNextWeek: false,
    summaryNote: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/weekly-summary', {
         ...formData,
         goalsCompleted: counts?.completed || 0,
         goalsPartial: counts?.partial || 0,
         goalsIncomplete: (counts?.total || 0) - (counts?.completed || 0) - (counts?.partial || 0)
      });
      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to submit summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
           <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white w-full max-w-lg rounded-3xl shadow-xl relative z-10 overflow-hidden">
             
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center"><CheckSquare className="w-5 h-5 mr-2 text-brand-500" /> Wrap Up Your Week</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Review your trajectory before Monday.</p>
               </div>
               <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"><X className="w-5 h-5"/></button>
             </div>

             <form onSubmit={handleSubmit} className="p-6 space-y-6">
                 
                 <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                    <span className="font-bold text-sm">Goals Completed</span>
                    <span className="text-xl font-extrabold">{counts?.completed || 0}</span>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">This Week's Goal Breakdown</h3>
                    {goals.length === 0 ? (
                       <p className="text-sm font-medium text-slate-400">No goals were logged this week.</p>
                    ) : (
                       <ul className="space-y-2">
                         {goals.map(g => (
                           <li key={g._id} className="flex items-start gap-2">
                             {g.status === 'completed' || g.progressPercent === 100 
                               ? <CheckSquare className="w-4 h-4 text-emerald-500 mt-0.5" /> 
                               : <X className="w-4 h-4 text-slate-300 mt-0.5" />
                             }
                             <span className={`text-sm font-bold ${g.status === 'completed' || g.progressPercent === 100 ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                               {g.title}
                             </span>
                           </li>
                         ))}
                       </ul>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Overall feeling right now?</label>
                    <select className="input-field cursor-pointer capitalize font-bold text-sm" value={formData.overallFeeling} onChange={e => setFormData({...formData, overallFeeling: e.target.value})}>
                       <option value="proud">Proud & Energized</option>
                       <option value="okay">Okay / Neutral</option>
                       <option value="stressed">A little stressed</option>
                       <option value="overwhelmed">Overwhelmed</option>
                       <option value="disappointed">Disappointed</option>
                       <option value="hopeful">Hopeful</option>
                       <option value="exhausted">Exhausted</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                       <input type="checkbox" className="mr-2 w-4 h-4 cursor-pointer accent-brand-500" checked={formData.supportNeededNextWeek} onChange={e => setFormData({...formData, supportNeededNextWeek: e.target.checked})} />
                       I will definitely need social support next week
                    </label>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Brief note to yourself</label>
                    <textarea className="input-field h-24 text-sm" placeholder="I need to set smaller goals. Or: I knocked it out of the park!" value={formData.summaryNote} onChange={e => setFormData({...formData, summaryNote: e.target.value})} />
                 </div>

                 <Button type="submit" className="w-full mt-4 bg-slate-900 text-white" size="lg" isLoading={loading}>Finalize Week</Button>
             </form>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WeeklyWrapUpModal;
