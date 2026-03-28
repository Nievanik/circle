import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    careerGoal: 'Internship',
    currentStage: 'Exploring',
    fieldOfStudy: '',
    struggleTypes: [],
    supportPreferences: []
  });

  const careerGoalOptions = ['Internship', 'New Jobs', 'Scholarship', 'Exam Prep', 'Career Switch', 'Freelancing', 'Startup'];
  const stageOptions = ['Exploring', 'Getting Started', 'Building Skills', 'Preparing / Practicing', 'Applying', 'Interviewing', 'Transitioning', 'Paused / Recovering'];
  const struggleOptions = ['burnout', 'procrastination', 'loneliness', 'anxiety', 'lack of clarity', 'motivation issues', 'impostor syndrome', 'interview stress', 'academic pressure'];
  const supportOptions = ['1:1 chat', 'small circle', 'accountability partner', 'group discussion', 'anonymous support'];

  const handleCheckbox = (field, value) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(value)) return { ...prev, [field]: list.filter(item => item !== value) };
      return { ...prev, [field]: [...list, value] };
    });
  };

  const nextStep = () => {
    if (step === 1 && !formData.fieldOfStudy) return alert("Please enter your field of study");
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await api.put('/users/profile', formData);
      setUser(res.data.data);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex items-center gap-2 mb-8">
           {[1,2,3].map(i => (
             <div key={i} className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-brand-500' : 'bg-slate-200'}`} />
           ))}
        </div>

        <Card className="p-8 md:p-12 min-h-[500px] relative overflow-hidden bg-white/90 backdrop-blur shadow-xl border-slate-100">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-20">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Career Information</h2>
                  <p className="text-slate-500 font-medium">Let's ground your support matching in your real-world path.</p>
                </div>
                
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">What field are you in?</label>
                  <input 
                    type="text" 
                    className="input-field text-lg" 
                    placeholder="e.g. Computer Science, Graphic Design..." 
                    value={formData.fieldOfStudy} 
                    onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} 
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">What is your current goal?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {careerGoalOptions.map(option => (
                      <button 
                        key={option} 
                        onClick={() => setFormData({...formData, careerGoal: option})}
                        className={`p-3 rounded-xl font-bold text-sm text-center border-2 transition-all ${formData.careerGoal === option ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">Progress stage</label>
                  <select 
                     className="input-field cursor-pointer text-lg capitalize font-medium text-slate-700"
                     value={formData.currentStage}
                     onChange={e => setFormData({...formData, currentStage: e.target.value})}
                  >
                     {stageOptions.map(s => (
                        <option key={s} value={s}>{s.replace('-', ' ')}</option>
                     ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-20">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">What's holding you back?</h2>
                  <p className="text-slate-500 font-medium">Select anything you're struggling with. It's safe here.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {struggleOptions.map(option => (
                    <button 
                      key={option}
                      onClick={() => handleCheckbox('struggleTypes', option)}
                      className={`px-5 py-3 rounded-full font-semibold capitalize border-2 transition-all ${
                        formData.struggleTypes.includes(option) 
                        ? 'bg-red-50 text-red-700 border-red-500 ring-4 ring-red-500/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-20">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How do you prefer support?</h2>
                  <p className="text-slate-500 font-medium">Select the ways you feel most comfortable engaging.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {supportOptions.map(option => (
                    <button 
                      key={option}
                      onClick={() => handleCheckbox('supportPreferences', option)}
                      className={`px-5 py-3 rounded-full font-semibold capitalize border-2 transition-all ${
                        formData.supportPreferences.includes(option) 
                        ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-900/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:px-12 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-between items-center z-20">
            {step > 1 ? (
              <Button variant="ghost" onClick={prevStep} icon={ArrowLeft}>Back</Button>
            ) : <div/>}

            {step < 3 ? (
              <Button onClick={nextStep} className="ml-auto flex items-center shadow-md">Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isLoading} className="ml-auto shadow-md">Complete Profile</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
