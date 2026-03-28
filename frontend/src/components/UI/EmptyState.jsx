import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const EmptyState = ({ title, description, icon: Icon = Sparkles, action, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-3xl",
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-brand-500 border border-slate-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
};

export default EmptyState;
