import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Sparkles, Activity, CheckSquare, Edit2, FileSearch, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';

// Weekly Components
import WeeklyGoalsCard from '../components/Weekly/WeeklyGoalsCard';
import QuickCheckInModal from '../components/Weekly/QuickCheckInModal';
import WeeklyWrapUpModal from '../components/Weekly/WeeklyWrapUpModal';
import InsightPanel from '../components/Insights/InsightPanel';

const struggleOptions = ['burnout', 'procrastination', 'loneliness', 'anxiety', 'lack of clarity', 'motivation issues', 'impostor syndrome', 'interview stress', 'academic pressure'];
const supportOptions = ['1:1 chat', 'small circle', 'accountability partner', 'group discussion', 'anonymous support'];
const careerGoalOptions = ['Internship', 'New Jobs', 'Scholarship', 'Exam Prep', 'Career Switch', 'Freelancing', 'Startup'];
const stageOptions = ['Exploring', 'Getting Started', 'Building Skills', 'Preparing / Practicing', 'Applying', 'Interviewing', 'Transitioning', 'Paused / Recovering'];

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Weekly Module State
  const [weeklyOverview, setWeeklyOverview] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isWrapUpOpen, setIsWrapUpOpen] = useState(false);

  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ struggleTypes: [], supportPreferences: [], careerGoal: '', currentStage: '', role: '', fieldOfStudy: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        struggleTypes: user.struggleTypes || [],
        supportPreferences: user.supportPreferences || [],
        careerGoal: user.careerGoal || 'Internship',
        currentStage: user.currentStage || 'Exploring',
        role: user.role || 'student',
        fieldOfStudy: user.fieldOfStudy || ''
      });
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [matchesRes, weeklyRes, insightsRes] = await Promise.all([
        api.get('/users/matches'),
        api.get('/dashboard/weekly-overview'),
        api.get('/dashboard/insights')
      ]);
      setMatches(matchesRes.data.data.slice(0, 3));
      setWeeklyOverview(weeklyRes.data.data);
      setInsightsData(insightsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', editData);
      setUser(res.data.data);
      setIsEditingProfile(false);
      // Re-fetch insights if profile goal changed
      fetchDashboardData();
    } catch (err) {
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelection = (field, val) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter(i => i !== val) : [...prev[field], val]
    }));
  };

  if (loading) return <div className="p-8 max-w-6xl mx-auto"><Skeleton className="h-64 rounded-3xl mb-8" /><Skeleton className="h-64 rounded-3xl" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 pt-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
            Welcome back, {user?.name?.split(' ')[0]} 
            <Sparkles className="inline w-8 h-8 text-brand-500 ml-2" />
          </h1>
          <p className="text-lg text-slate-500 font-medium">Your support loop and weekly progress.</p>
        </div>
        <div className="flex gap-3">
           {!weeklyOverview?.hasCheckIn ? (
              <Button icon={Activity} onClick={() => setIsCheckInOpen(true)}>Daily Check-in</Button>
           ) : (
              <Button variant="outline" icon={Activity} disabled>Checked in</Button>
           )}
           
           {weeklyOverview?.dayOfWeek === 0 ? (
             !weeklyOverview?.hasSummary ? (
                <Button variant="secondary" icon={CheckSquare} onClick={() => setIsWrapUpOpen(true)}>Wrap Up Week</Button>
             ) : (
               <Button variant="outline" icon={CheckSquare} disabled>Week Wrapped</Button>
             )
           ) : (
             <Button variant="outline" icon={CheckSquare} disabled title="Wrap-up is only available on Sundays">Wrap Up (Sunday)</Button>
           )}
        </div>
      </header>

      {/* Cohort Insight Banner */}
      <InsightPanel insightsData={insightsData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Goals Logic */}
        <div className="lg:col-span-1">
           <WeeklyGoalsCard 
             goals={weeklyOverview?.goals?.items || []} 
             counts={weeklyOverview?.goals?.counts || {total:0, completed:0, partial: 0}} 
             dayOfWeek={weeklyOverview?.dayOfWeek} 
             refreshData={fetchDashboardData} 
           />
        </div>
        
        {/* Profile Snapshot logic (Condensed) */}
        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden flex flex-col p-6 border-slate-200">
          <div className="relative z-10 flex-1">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-slate-800 font-bold text-xl">Identity & Preferences</h3>
                  {!isEditingProfile && <Badge variant="brand" className="capitalize">{user?.currentStage || 'Exploring'}</Badge>}
                  {!isEditingProfile && <Badge variant="default" className="capitalize">{user?.role || 'Student'}</Badge>}
                </div>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="text-slate-400 hover:text-brand-600 transition-colors bg-slate-50 rounded-lg p-2"><Edit2 className="w-4 h-4"/></button>
                )}
             </div>
             
             <AnimatePresence mode="wait">
               {isEditingProfile ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">My Role</label>
                         <select value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} className="input-field text-sm py-2 px-3 capitalize">
                            <option value="student">Student</option>
                            <option value="recent graduate">Recent Graduate</option>
                            <option value="professional">Professional</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Current Goal</label>
                         <select value={editData.careerGoal} onChange={e => setEditData({...editData, careerGoal: e.target.value})} className="input-field text-sm py-2 px-3">
                            {careerGoalOptions.map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                       </div>
                       <div className="col-span-2">
                         <label className="block text-xs font-bold text-slate-500 mb-1">Progress Stage</label>
                         <select value={editData.currentStage} onChange={e => setEditData({...editData, currentStage: e.target.value})} className="input-field text-sm py-2 px-3 capitalize">
                            {stageOptions.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block mb-2">My Current Struggles:</span>
                      <div className="flex flex-wrap gap-2">
                         {struggleOptions.map(s => (
                           <button key={s} onClick={() => toggleSelection('struggleTypes', s)} className={`px-3 py-1 text-xs font-bold rounded-full capitalize border ${editData.struggleTypes.includes(s) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>{s}</button>
                         ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" onClick={handleSaveProfile} isLoading={isSaving}>Save Target Goal</Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 h-full flex flex-col justify-center">
                   <p className="text-slate-600 font-semibold mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                     <span>Current Focus: <strong className="text-slate-900 ml-1">{user?.careerGoal || 'Unset Goal'}</strong></span>
                     <span className="text-sm text-slate-400 font-medium">Stage: {user?.currentStage}</span>
                   </p>
                   {user?.struggleTypes?.length > 0 && (
                     <div className="flex flex-wrap gap-2 items-center">
                       <span className="text-sm font-bold text-slate-400 mr-2">Identified Struggles:</span>
                       {user.struggleTypes.map(s => (
                         <Badge key={s} variant="danger" className="capitalize">{s}</Badge>
                       ))}
                     </div>
                   )}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Intelligently Matched Peers Block */}
      <div className="pt-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligently Matched Peers</h2>
            <p className="text-slate-500 font-medium mt-1">Found based on exact goal and struggle synergies.</p>
          </div>
          <Link to="/discover">
             <Button variant="ghost" icon={ArrowRight}>View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {matches.length > 0 ? (
             matches.map((m, i) => (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={m.user._id}>
                <Card hoverEffect className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600 text-lg">
                          {m.user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 leading-none">{m.user.name}</h3>
                          <span className="text-sm font-medium text-slate-500 capitalize">{m.user.role}</span>
                        </div>
                      </div>
                      <Badge variant="brand">{m.score}% Match</Badge>
                    </div>
                    <div className="mb-6 flex-1">
                       <p className="text-sm text-slate-600"><strong className="text-slate-800">Goal: </strong>{m.user.careerGoal}</p>
                    </div>
                  </div>
                  <Link to={`/peer/${m.user._id}`}>
                    <Button variant="secondary" className="w-full text-slate-600 border-slate-200">View Profile</Button>
                  </Link>
                </Card>
              </motion.div>
             ))
           ) : (
             <div className="col-span-3">
               <EmptyState title="No Overlapping Peers Yet" description="Complete your profile to generate dynamic cohort matches." icon={FileSearch} />
             </div>
           )}
        </div>
      </div>

      {/* Modals */}
      <QuickCheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)} onCreated={fetchDashboardData} />
      <WeeklyWrapUpModal isOpen={isWrapUpOpen} onClose={() => setIsWrapUpOpen(false)} goals={weeklyOverview?.goals?.items || []} counts={weeklyOverview?.goals?.counts} onCreated={fetchDashboardData} />
    </motion.div>
  );
};

export default Dashboard;
