import React from 'react';
import Card from '../UI/Card';
import { Target, Activity, Flame, Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const getIcon = (type) => {
  switch (type) {
    case 'shared_struggle': return <Shield className="w-5 h-5 text-indigo-500" />;
    case 'pace': return <Activity className="w-5 h-5 text-emerald-500" />;
    case 'stress': return <Flame className="w-5 h-5 text-rose-500" />;
    default: return <Info className="w-5 h-5 text-slate-400" />;
  }
};

const InsightPanel = ({ insightsData }) => {
  if (!insightsData || !insightsData.insights?.length) return null;

  return (
    <Card className="bg-slate-900 text-slate-200 border-none p-6 md:p-8 rounded-[2rem] shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      
      <div className="relative z-10 mb-6 flex justify-between items-start">
        <div>
           <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center">
             You're Not Alone
           </h3>
           {!insightsData.fallback ? (
              <p className="text-brand-300 font-medium text-sm mt-1">Based on {insightsData.cohort.size} similar peers progressing toward {insightsData.cohort.careerGoal}.</p>
           ) : (
              <p className="text-slate-400 font-medium text-sm mt-1">Our cohort aggregate is still generating.</p>
           )}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {insightsData.insights.map((insight, idx) => (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-md">
            <div className={`p-2 rounded-xl mt-0.5 ${insight.type === 'stress' ? 'bg-rose-500/10' : insight.type === 'pace' ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}>
               {getIcon(insight.type)}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
               {insight.message}
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default InsightPanel;
