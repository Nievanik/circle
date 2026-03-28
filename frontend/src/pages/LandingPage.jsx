import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Users, ArrowRight, Sparkles, Target, ShieldCheck } from 'lucide-react';
import Button from '../components/UI/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
             <Compass className="w-5 h-5 text-white" />
          </div>
          Circle
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 hover:text-slate-900 font-semibold px-4 transition-colors">Log In</Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Soft Background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 text-brand-700 font-semibold text-sm shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4" /> 
            Smarter peer support for career struggles
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8"
          >
            Don't navigate career pressure <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-400">alone.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Circle intelligently connects you with peers facing the exact same struggles and stage. True support, timed perfectly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/signup">
              <Button size="lg" className="px-8" icon={ArrowRight}>
                Find Your Circle
              </Button>
            </Link>
            <Link to="/login">
               <Button size="lg" variant="secondary" className="px-8">
                 Explore the Demo
               </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features - Bento grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Target, 
              title: "Smart Matching", 
              desc: "Our engine maps your emotional state and career goal to recommend the perfect peer matches.",
              bg: "bg-blue-50",
              color: "text-blue-600"
            },
            { 
              icon: Users, 
              title: "Support Circles", 
              desc: "From 'Interview Prep' to 'Burnout Recovery', join thematic circles that mirror your journey.",
              bg: "bg-brand-50",
              color: "text-brand-600"
            },
            { 
              icon: ShieldCheck, 
              title: "Safe & Guided", 
              desc: "Built on psychological safety. Structured check-ins and empathetic design to prevent toxicity.",
              bg: "bg-emerald-50",
              color: "text-emerald-600"
            }
          ].map((f, i) => (
             <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft"
              >
               <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6`}>
                 <f.icon className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
               <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
             </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
