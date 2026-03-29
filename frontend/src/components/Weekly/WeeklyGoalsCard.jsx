import React, { useState } from 'react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import { Target, CheckCircle, Clock, Plus, Circle as CircleIcon } from 'lucide-react';
import AddGoalModal from './AddGoalModal';
import api from '../../services/api';

const WeeklyGoalsCard = ({ goals, counts, refreshData, dayOfWeek }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const handleToggleComplete = async (goal) => {
     try {
       const newStatus = goal.status === 'completed' ? 'in_progress' : 'completed';
       const progress = newStatus === 'completed' ? 100 : 50;
       await api.put(`/goals/${goal._id}`, { status: newStatus, progressPercent: progress });
       refreshData();
     } catch(err) {
       alert("Failed to update goal");
     }
  };

  return (
    <>
      <Card className="h-full flex flex-col p-6 border-slate-200">
        <div className="flex justify-between items-start mb-6">
           <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center">
                 <Target className="w-5 h-5 mr-2 text-brand-500" /> This Week's Goals
              </h3>
              <p className="text-sm font-medium text-slate-500">
                 {counts.completed} of {counts.total} completed
              </p>
           </div>
           {counts.total < 3 ? (
             <Button size="sm" variant="ghost" icon={Plus} onClick={() => setIsAddOpen(true)}>Add</Button>
           ) : (
             <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Limit Complete</span>
           )}
        </div>

        <div className="space-y-3 flex-1">
           {goals.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                <Target className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium text-sm">Set 1–3 goals to create a manageable support plan for the week.</p>
             </div>
           ) : (
             goals.map(goal => (
                <div key={goal._id} className="relative group p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-brand-200 transition-colors cursor-pointer" onClick={() => handleToggleComplete(goal)}>
                  <div className="flex justify-between items-start">
                     <div className="flex flex-1 items-start gap-3">
                        <button className="mt-0.5 shrink-0 text-slate-300 group-hover:text-brand-400 transition-colors">
                           {goal.status === 'completed' ? <CheckCircle className="w-5 h-5 text-emerald-500" fill="#ecfdf5" /> : <CircleIcon className="w-5 h-5" />}
                        </button>
                        <div>
                           <h4 className={`text-sm font-bold leading-tight ${goal.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{goal.title}</h4>
                           <p className="text-xs font-medium text-slate-400 mt-0.5 capitalize">{goal.category.replace('_', ' ')}</p>
                        </div>
                     </div>
                  </div>
                  {/* Progress Bar Visualization */}
                  <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${goal.status === 'completed' ? 'bg-emerald-500' : 'bg-brand-500'} transition-all duration-500`} style={{ width: `${goal.progressPercent}%` }}></div>
                  </div>
                </div>
             ))
           )}
        </div>
      </Card>
      
      <AddGoalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreated={refreshData} />
    </>
  );
};

export default WeeklyGoalsCard;
