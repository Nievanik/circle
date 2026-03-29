import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TimeTravelWidget = () => {
  const [simulatedDate, setSimulatedDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('simulated_date');
    if (stored) setSimulatedDate(stored);
  }, []);

  const handleApply = () => {
    if (simulatedDate) {
      sessionStorage.setItem('simulated_date', simulatedDate);
    } else {
      sessionStorage.removeItem('simulated_date');
    }
    // Refresh entirely so all components fetch with new headers
    window.location.reload();
  };

  const clearTime = () => {
     setSimulatedDate('');
     sessionStorage.removeItem('simulated_date');
     window.location.reload();
  };

  if (!isOpen) {
    return (
      <button 
         onClick={() => setIsOpen(true)}
         className="fixed bottom-4 left-4 z-50 bg-slate-900 text-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform border-4 border-white"
         title="Hackathon Time Travel Tool"
      >
         <Clock className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 shadow-brand-500/10 w-64">
      <div className="flex justify-between items-center mb-3">
         <h4 className="font-bold text-sm flex items-center text-slate-900"><Clock className="w-4 h-4 mr-1 text-brand-500" /> Time Travel (Demo Only)</h4>
         <button onClick={() => setIsOpen(false)} className="text-slate-400 font-bold text-xs hover:text-slate-700">Close</button>
      </div>
      <div>
         <label className="block text-xs font-bold text-slate-500 mb-1">Override Current Date</label>
         <input 
           type="date" 
           min={simulatedDate || new Date().toISOString().split('T')[0]}
           value={simulatedDate} 
           onChange={e => setSimulatedDate(e.target.value)} 
           className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-brand-500 font-medium text-slate-800"
         />
      </div>
      <div className="flex gap-2 mt-3">
         <button onClick={handleApply} className="flex-1 bg-brand-500 text-white font-bold text-xs py-2 rounded-lg hover:bg-brand-600 transition-colors">Apply Matrix</button>
         <button onClick={clearTime} className="flex-1 bg-slate-100 text-slate-600 font-bold text-xs py-2 rounded-lg hover:bg-slate-200 transition-colors">Reset to Now</button>
      </div>
    </div>
  );
};

export default TimeTravelWidget;
