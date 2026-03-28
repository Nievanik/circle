import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../UI/Button';
import { X, Target } from 'lucide-react';
import api from '../../services/api';

const CreateCircleModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: 'Internship',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
         ...formData,
         tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const res = await api.post('/circles', payload);
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      alert("Failed to create circle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-xl relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                 <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-brand-500" /> Start a Support Circle
                 </h2>
                 <p className="text-sm font-medium text-slate-500 mt-1">Create a dedicated space aligned with your goals.</p>
               </div>
               <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Circle Name</label>
                  <input required type="text" className="input-field" placeholder="E.g. Summer 2026 SWE Interns" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Purpose / Description</label>
                  <textarea required className="input-field resize-none h-24" placeholder="What are we focusing on? What's the goal?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Theme</label>
                    <select className="input-field cursor-pointer capitalize font-bold" value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})}>
                       <option value="Internship">Internship</option>
                       <option value="New Jobs">New Jobs</option>
                       <option value="Scholarship">Scholarship</option>
                       <option value="Exam Prep">Exam Prep</option>
                       <option value="Career Switch">Career Switch</option>
                       <option value="Freelancing">Freelancing</option>
                       <option value="Startup">Startup</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tags (comma separated)</label>
                    <input type="text" className="input-field" placeholder="React, Node, FAANG" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                 </div>
               </div>

               <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>Create Circle</Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCircleModal;
