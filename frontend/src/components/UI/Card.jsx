import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ children, className, hoverEffect = false, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "bg-white rounded-2xl shadow-soft border border-slate-100 p-6 relative overflow-hidden",
        hoverEffect && "hover:shadow-lg hover:border-slate-200 transition-all duration-300 cursor-pointer group",
        className
      )}
      whileHover={hoverEffect ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = "Card";
export default Card;
