import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import { Compass, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <Link to="/" className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center mb-10 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mr-3 shadow-lg shadow-brand-500/20">
            <Compass className="text-white w-6 h-6" />
        </div>
        Circle
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white shadow-soft p-10 rounded-[2rem] border border-slate-100 relative z-10"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
        <p className="text-slate-500 mb-8 font-medium">Please enter your details to sign in.</p>

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
            <label className="block text-slate-700 font-bold mb-2 text-sm">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" placeholder="you@university.edu" />
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-2 text-sm">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full py-3.5 mt-2" size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          Don't have an account? <Link to="/signup" className="text-brand-600 hover:text-brand-700 transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
