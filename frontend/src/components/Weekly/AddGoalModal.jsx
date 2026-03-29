import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { X, Target } from 'lucide-react';
import api from '../../services/api';

const AddGoalModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'applications'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/goals', formData);
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create goal.");
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
                 <h2 className="text-xl font-bold text-slate-900 flex items-center"><Target className="w-5 h-5 mr-2 text-brand-500" /> Focus Your Week</h2>
                 <p className="text-sm font-medium text-slate-500 mt-1">Smaller goals improve consistency. Add a realistic weekly target.</p>
               </div>
               <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Goal Title</label>
                  <input required type="text" className="input-field" placeholder="E.g. Apply to 5 internships" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select className="input-field cursor-pointer capitalize font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                     <option value="applications">Applications</option>
                     <option value="learning">Learning / Upskilling</option>
                     <option value="interview_prep">Interview Prep</option>
                     <option value="networking">Networking</option>
                     <option value="exam_study">Exam Study</option>
                     <option value="scholarship_prep">Scholarship Prep</option>
                     <option value="portfolio_resume">Portfolio / Resume</option>
                     <option value="personal_wellbeing">Personal Wellbeing</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Additional Detail (Optional)</label>
                  <textarea className="input-field resize-none h-20" placeholder="Notes, links, or context" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>Commit Goal</Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddGoalModal;
