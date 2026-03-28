import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Sparkles, Calendar, TrendingUp, ArrowRight, UserPlus, Users, Edit2, X, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';

const struggleOptions = ['burnout', 'procrastination', 'loneliness', 'anxiety', 'lack of clarity', 'motivation issues', 'impostor syndrome', 'interview stress', 'academic pressure'];
const supportOptions = ['1:1 chat', 'small circle', 'accountability partner', 'group discussion', 'anonymous support'];
const careerGoalOptions = ['Internship', 'New Jobs', 'Scholarship', 'Exam Prep', 'Career Switch', 'Freelancing', 'Startup'];
const stageOptions = ['Exploring', 'Getting Started', 'Building Skills', 'Preparing / Practicing', 'Applying', 'Interviewing', 'Transitioning', 'Paused / Recovering'];

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Inline edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ 
    struggleTypes: [], supportPreferences: [], careerGoal: '', currentStage: '', role: '', fieldOfStudy: '' 
  });
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [matchesRes] = await Promise.all([
          api.get('/users/matches')
        ]);
        setMatches(matchesRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', editData);
      setUser(res.data.data);
      setIsEditingProfile(false);
    } catch (err) {
      alert("Failed to save profile updates.");
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



  const getWelcomeMoodText = (score) => {
    if (!score) return "Here's your support summary.";
    if (score < 4) return "We know things are tough right now. You're not alone in this.";
    if (score < 8) return "Taking it one step at a time. Here is your summary for today.";
    return "You're doing great! Keep building that momentum.";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
            Welcome back, {user?.name?.split(' ')[0]} 
            <Sparkles className="inline w-8 h-8 text-brand-500 ml-2" />
          </h1>
           <p className="text-lg text-slate-500 font-medium max-w-xl">{getWelcomeMoodText(user?.latestMoodScore)}</p>
        </div>
        <Link to="/checkin">
          <Button icon={Calendar} size="lg">Daily Reflection</Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -4 }} 
          className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-brand-500/20"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h3 className="text-white/80 font-semibold mb-1 relative z-10 text-sm tracking-wide uppercase">Latest Mood Score</h3>
          <div className="text-5xl font-extrabold flex items-center relative z-10 my-4">
            {user?.latestMoodScore || '-'} <span className="text-2xl ml-2 font-medium text-brand-100">/ 10</span>
          </div>
          <div className="flex items-center text-sm font-semibold bg-white/20 w-fit px-3 py-1.5 rounded-full relative z-10 backdrop-blur-sm shadow-sm">
             <TrendingUp className="w-4 h-4 mr-2" />
             Logged recently
          </div>
        </motion.div>
        
        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden flex flex-col justify-center border-brand-100">
          <div className="absolute right-0 bottom-0 opacity-5 w-48 h-48 pointer-events-none">
             <TargetIcon className="w-full h-full text-slate-900" />
          </div>
          
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-slate-800 font-bold text-xl">Profile Snapshot</h3>
                  {!isEditingProfile && <Badge variant="brand" className="capitalize">{user?.currentStage || 'Exploring'}</Badge>}
                  {!isEditingProfile && <Badge variant="default" className="capitalize">{user?.role || 'Student'}</Badge>}
                </div>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} className="text-slate-400 hover:text-brand-600 transition-colors p-2 bg-slate-50 rounded-lg shrink-0">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
             </div>
             
             <AnimatePresence mode="wait">
               {isEditingProfile ? (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">My Role</label>
                         <select value={editData.role} onChange={e => setEditData({...editData, role: e.target.value})} className="input-field text-sm py-2 px-3 capitalize">
                            <option value="student">Student</option>
                            <option value="recent graduate">Recent Graduate</option>
                            <option value="professional">Professional</option>
                            <option value="career switcher">Career Switcher</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Field of Study/Work</label>
                         <input type="text" value={editData.fieldOfStudy} onChange={e => setEditData({...editData, fieldOfStudy: e.target.value})} className="input-field text-sm py-2 px-3" placeholder="Computer Science..." />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 mb-1">Current Goal</label>
                         <select value={editData.careerGoal} onChange={e => setEditData({...editData, careerGoal: e.target.value})} className="input-field text-sm py-2 px-3">
                            {careerGoalOptions.map(g => <option key={g} value={g}>{g}</option>)}
                         </select>
                       </div>
                       <div>
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
                           <button key={s} onClick={() => toggleSelection('struggleTypes', s)} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${editData.struggleTypes.includes(s) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{s.replace('-',' ')}</button>
                         ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block mb-2">How I prefer support:</span>
                      <div className="flex flex-wrap gap-2">
                         {supportOptions.map(s => (
                           <button key={s} onClick={() => toggleSelection('supportPreferences', s)} className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${editData.supportPreferences.includes(s) ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>{s.replace('-',' ')}</button>
                         ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" onClick={handleSaveProfile} isLoading={isSaving}>Save Profile</Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                   <p className="text-slate-600 text-lg font-semibold mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <strong className="text-slate-800">Goal: </strong> 
                     {user?.careerGoal || 'Unset Goal'} 
                     {user?.fieldOfStudy && <span className="text-slate-500 font-medium ml-2 text-sm">(in {user.fieldOfStudy})</span>}
                   </p>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-sm font-semibold text-slate-400 mr-2 self-center">Hurdles:</span>
                     {user?.struggleTypes?.length > 0 ? user.struggleTypes.map(s => (
                       <Badge key={s} variant="danger">{s.replace('-', ' ')}</Badge>
                     )) : <span className="text-sm text-slate-400 self-center">None</span>}
                     
                     <span className="text-sm font-semibold text-slate-400 ml-4 mr-2 self-center">Prefs:</span>
                     {user?.supportPreferences?.length > 0 ? user.supportPreferences.map(s => (
                       <Badge key={s} variant="default">{s}</Badge>
                     )) : <span className="text-sm text-slate-400 self-center">None</span>}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </Card>
      </div>



      {/* Top Recommendations */}
      <div className="pt-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
              Intelligently Matched Peers
            </h2>
            <p className="text-slate-500 font-medium">Because you're both facing similar career hurdles right now.</p>
          </div>
          <Link to="/discover">
             <Button variant="ghost" icon={ArrowRight} className="mt-4 md:mt-0">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
             [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[220px] rounded-3xl" />)
          ) : matches.length > 0 ? (
             matches.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={m.user._id}>
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
                       <p className="text-sm text-slate-600 line-clamp-2">
                         <strong className="text-slate-800">Goal: </strong>{m.user.careerGoal || 'N/A'}
                       </p>
                    </div>
                  </div>

                  <Link to={`/peer/${m.user._id}`}>
                    <Button variant="secondary" className="w-full text-slate-600 font-bold border-slate-200">
                      View Profile
                    </Button>
                  </Link>
                </Card>
              </motion.div>
             ))
          ) : (
             <div className="col-span-3">
               <EmptyState 
                 title="No High-Match Peers Yet"
                 description="We are still calibrating our network to find people on your exact wavelength. Please complete more of your profile, or broaden your search."
                 icon={FileSearch}
                 action={<Button onClick={() => setIsEditingProfile(true)}>Update Profile Details</Button>}
               />
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// SVG Icon Helper
const TargetIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

export default Dashboard;
