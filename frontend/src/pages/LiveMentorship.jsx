import React from 'react';
import { motion } from 'framer-motion';
import { Video, Star, Lock, Sparkles } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const LiveMentorship = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center min-h-[70vh] justify-center">
      
      <div className="relative mb-8 group">
         <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
         <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 border-4 border-white shadow-xl flex items-center justify-center">
            <Video className="w-10 h-10 text-amber-500" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
               <Lock className="w-4 h-4 text-white" />
            </div>
         </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-center mb-4 flex items-center justify-center gap-3">
        Live Mentorship <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">PRO</span>
      </h1>
      
      <p className="text-xl text-slate-500 font-medium text-center max-w-2xl leading-relaxed mb-10">
        Connecting 1:1 with a licensed counselor or industry-veteran mentor is a premium feature. Elevate your journey with immediate, professional guidance.
      </p>

      <Card className="w-full max-w-2xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-0 shadow-2xl rounded-[2.5rem]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
           <Star className="w-12 h-12 text-amber-400 mb-6" />
           <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Coming Very Soon!</h2>
           <p className="text-slate-300 font-medium text-lg max-w-lg mx-auto mb-8 leading-relaxed">
             We are currently onboarding top-tier psychological counselors and industry experts into the Circle platform. The Pro tier will drop in our next major update.
           </p>
           
           <div className="flex gap-4">
              <Button icon={Sparkles} className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-white/10" size="lg">Priority Waitlist</Button>
           </div>
        </div>
      </Card>
      
    </motion.div>
  );
};

export default LiveMentorship;
