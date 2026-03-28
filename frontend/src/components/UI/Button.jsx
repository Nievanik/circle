import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading = false,
  icon: Icon,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl outline-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 focus:ring-4 focus:ring-brand-500/30",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm focus:ring-4 focus:ring-slate-200",
    outline: "bg-transparent text-slate-700 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-4 focus:ring-slate-200",
    subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent",
    ghost: "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-4 focus:ring-red-500/30",
  };

  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2.5 px-5 text-base",
    lg: "py-3 px-6 text-lg",
    icon: "p-2",
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : Icon ? (
        <Icon className={cn("w-5 h-5", children ? "mr-2" : "")} />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";
export default Button;
