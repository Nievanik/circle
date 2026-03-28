import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-8 z-10 sticky top-0">
      <div className="font-bold text-xl tracking-tight text-slate-800 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-brand-500" /> Circle
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center text-sm font-semibold text-slate-700 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
          <User size={16} className="mr-2 text-brand-500" />
          {user?.name || 'User'}
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center"
          title="Log Out"
        >
          <LogOut size={18} />
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
