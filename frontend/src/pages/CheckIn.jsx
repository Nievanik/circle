import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Smile, Frown, Target, ArrowRight, HeartPulse, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const CheckIn = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    mood: 5,
    stressLevel: 5,
    motivationLevel: 5,
    confidenceLevel: 5,
    struggleToday: '',
    supportNeededToday: '',
  });
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchTodayCheckIn = async () => {
      try {
        const res = await api.get('/checkins/today');
        if (res.data.data) {
          setIsUpdate(true);
          const { mood, stressLevel, motivationLevel, confidenceLevel, struggleToday, supportNeededToday } = res.data.data;
          setFormData({
            mood, stressLevel, motivationLevel, confidenceLevel, struggleToday, supportNeededToday
          });
        }
      } catch (err) {
        console.error("No today checkin found");
      } finally {
        setInitLoading(false);
      }
    };
    fetchTodayCheckIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/checkins', formData);
      setUser({ ...user, latestMoodScore: formData.mood });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to submit check-in');
    } finally {
      setLoading(false);
    }
  };

  const currentLabel = formData.mood < 4 ? { text: 'Struggling', color: 'text-red-500 bg-red-50', icon: Frown } : 
                       formData.mood < 8 ? { text: 'Managing', color: 'text-amber-600 bg-amber-50', icon: Target } : 
                                           { text: 'Thriving', color: 'text-brand-600 bg-brand-50', icon: Smile };
  const Icon = currentLabel.icon;

  if (initLoading) return <div className="text-center mt-20 font-bold text-slate-500">Loading reflection context...</div>

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-8">
      <Card className="p-8 md:p-14 shadow-xl shadow-brand-500/5 rounded-[2.5rem] border-slate-100/50">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-100">
             <HeartPulse className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            {isUpdate ? "Update Reflection" : "Daily Reflection"}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            {isUpdate 
              ? "You've already reflected today, but you can update your current state if things have changed." 
              : "Take a breath. By identifying where your energy is today, we can adapt your goals and recommend appropriate peers."}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-400 to-brand-600"></div>
            <div className="flex justify-between items-center mb-8">
              <label className="text-xl font-extrabold text-slate-800">Overall Mood</label>
              <AnimatePresence mode="wait">
                <motion.div 
                   key={currentLabel.text}
                   initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                   className={`px-4 py-2 rounded-2xl font-bold flex items-center shadow-sm border border-white ${currentLabel.color}`}
                >
                   <Icon className="w-5 h-5 mr-2" />
                   {currentLabel.text} ({formData.mood}/10)
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Custom slider rendering */}
            <input 
              type="range" min="1" max="10" 
              value={formData.mood} 
              onChange={e => setFormData({...formData, mood: parseInt(e.target.value)})}
              className="w-full h-4 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/50 hover:bg-slate-300 transition-all"
            />
            <div className="flex justify-between text-xs text-slate-400 font-bold mt-4 uppercase tracking-widest">
               <span>Low Energy</span>
               <span>Neutral</span>
               <span>Fantastic</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             {[{ label: 'Stress Level', val: 'stressLevel', color: 'accent-amber-500' },
               { label: 'Motivation', val: 'motivationLevel', color: 'accent-blue-500' },
               { label: 'Confidence', val: 'confidenceLevel', color: 'accent-purple-500' }
             ].map(slider => (
               <div key={slider.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                 <label className="block text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest text-center">{slider.label}</label>
                 <input type="range" min="1" max="10" value={formData[slider.val]} onChange={e => setFormData({...formData, [slider.val]: parseInt(e.target.value)})} className={`w-full ${slider.color} cursor-pointer`} />
                 <div className="mt-3 text-center font-extrabold text-xl text-slate-800">{formData[slider.val]}<span className="text-sm font-medium text-slate-400">/10</span></div>
               </div>
             ))}
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-slate-800 font-bold mb-3 text-lg">What is the heaviest thing on your mind today?</label>
              <textarea 
                className="input-field h-32 resize-none leading-relaxed text-lg" 
                placeholder="Ex: I feel completely overwhelmed trying to learn system design while applying..."
                value={formData.struggleToday}
                onChange={e => setFormData({...formData, struggleToday: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-800 font-bold mb-3 text-lg">What kind of support would actually help?</label>
              <textarea 
                className="input-field h-32 resize-none leading-relaxed text-lg" 
                placeholder="Ex: Just someone to vent to who understands the job market..."
                value={formData.supportNeededToday}
                onChange={e => setFormData({...formData, supportNeededToday: e.target.value})}
              ></textarea>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-16 text-lg tracking-wide rounded-2xl" isLoading={loading} icon={isUpdate ? RefreshCw : ArrowRight}>
            {isUpdate ? "Update Today's Reflection" : "Save Reflection"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default CheckIn;
