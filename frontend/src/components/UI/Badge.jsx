import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    brand: "bg-brand-50 text-brand-700 border border-brand-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-red-50 text-red-700 border border-red-100",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold capitalize tracking-wide shadow-sm", variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
