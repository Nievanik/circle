import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import { Compass, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await register(formData);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-[100px] pointer-events-none"></div>

       <Link to="/" className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-8 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mr-3 shadow-lg shadow-brand-500/20">
            <Compass className="text-white w-6 h-6" />
        </div>
        Circle
      </Link>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md bg-white shadow-soft p-10 rounded-[2rem] border border-slate-100 z-10"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8 font-medium">Your meaningful support network starts here.</p>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 flex items-start text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="input-field" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Email Address</label>
             <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="input-field" placeholder="you@university.edu" />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Password</label>
             <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="input-field" placeholder="••••••••" />
          </div>
          <div>
             <label className="block text-slate-700 font-bold mb-2 text-sm">I see myself as a...</label>
             <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field cursor-pointer">
               <option value="student">Student</option>
               <option value="recent graduate">Recent Graduate</option>
               <option value="professional">Professional</option>
               <option value="career switcher">Career Switcher</option>
             </select>
          </div>
          <Button type="submit" className="w-full py-3.5 mt-4" size="lg" isLoading={isLoading}>
             Join Circle
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
