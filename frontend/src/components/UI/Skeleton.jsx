import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse bg-slate-200/60 rounded-xl", className)}
      {...props}
    />
  );
};

export default Skeleton;
