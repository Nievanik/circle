import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, PlusCircle, CheckCircle2, Search, ArrowRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';
import CreateCircleModal from '../components/Circle/CreateCircleModal';

const SupportCircles = () => {
  const [joinedCircles, setJoinedCircles] = useState([]);
  const [discoverCircles, setDiscoverCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined'); // 'joined' | 'discover'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const [joinedRes, discRes] = await Promise.all([
          api.get('/circles/joined'),
          api.get('/circles/discover')
        ]);
        setJoinedCircles(joinedRes.data.data);
        setDiscoverCircles(discRes.data.data);
      } catch (err) {
        console.error('Fetch circles err', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCircles();
  }, [activeTab]); // Refetch if tab changes to ensure fresh state

  const handleJoin = async (circle) => {
    try {
      await api.post(`/circles/${circle._id}/join`);
      // Optimistically move it to joined
      setDiscoverCircles(prev => prev.filter(c => c._id !== circle._id));
      setJoinedCircles(prev => [{...circle, members: [...circle.members, { _id: user._id }]}, ...prev]);
      setActiveTab('joined');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join circle');
    }
  };

  const handleCircleCreated = (newCircle) => {
    setJoinedCircles([{...newCircle, creator: { name: user.name }, members: [{ _id: user._id }]}, ...joinedCircles]);
    setActiveTab('joined');
  };

  const baseCircles = activeTab === 'joined' ? joinedCircles : discoverCircles;
  
  const sortedCircles = [...baseCircles].sort((a, b) => {
    const aMatch = a.theme === user.careerGoal ? 1 : 0;
    const bMatch = b.theme === user.careerGoal ? 1 : 0;
    return bMatch - aMatch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 px-2">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Support Circles</h1>
          <div className="flex bg-slate-200/50 p-1.5 rounded-xl w-fit">
             <button 
                onClick={() => setActiveTab('joined')} 
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'joined' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                My Circles ({joinedCircles.length})
             </button>
             <button 
                onClick={() => setActiveTab('discover')} 
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'discover' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Discover New
             </button>
          </div>
        </div>
        <Button size="lg" icon={PlusCircle} onClick={() => setIsModalOpen(true)} className="shadow-md">Create New Circle</Button>
      </header>

      <AnimatePresence mode="popLayout">
        <motion.div 
           key={activeTab} 
           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
              [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
          ) : sortedCircles.length > 0 ? (
            sortedCircles.map((circle, i) => {
              const matchesGoal = circle.theme === user.careerGoal;
              return (
              <motion.div key={circle._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card hoverEffect className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-100 to-transparent opacity-20 rounded-bl-full pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge variant={matchesGoal ? "brand" : "default"} className={`text-[10px] uppercase tracking-wider font-extrabold ${matchesGoal ? 'bg-brand-500 text-white border-transparent' : ''}`}>
                          {circle.theme.replace('-', ' ')}
                        </Badge>
                        {matchesGoal && (
                           <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] flex items-center gap-1 font-bold tracking-tight">
                              ★ Goal Match
                           </Badge>
                        )}
                      </div>
                      <span className="flex items-center text-sm font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                        <Users className="w-4 h-4 mr-1.5 text-brand-500" />
                        {circle.members.length}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-brand-600 transition-colors">{circle.name}</h3>
                    <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-3 leading-relaxed">{circle.description}</p>
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {circle.tags?.slice(0,3).map(t => (
                        <Badge variant="default" key={t}>#{t}</Badge>
                      ))}
                    </div>
                    
                    {activeTab === 'joined' ? (
                       <Link to={`/circles/${circle._id}`}>
                          <Button className="w-full bg-slate-900 border-none hover:bg-slate-800 shadow-md text-white font-bold" icon={MessageSquare}>
                            Enter Discussion
                          </Button>
                       </Link>
                    ) : (
                      <Button onClick={() => handleJoin(circle)} className="w-full" variant="secondary" icon={ArrowRight}>
                        Join Circle
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
              );
            })
          ) : (
            <div className="col-span-full">
               <EmptyState 
                 title={activeTab === 'joined' ? "You haven't joined any circles yet" : "No discoverable circles available"}
                 description={activeTab === 'joined' ? "Join a thematic group to talk with peers facing the exact same challenges as you." : "Be the first to create a space for people to gather and discuss the hurdles of career building."}
                 icon={activeTab === 'joined' ? Users : Search}
                 action={activeTab === 'joined' ? <Button onClick={() => setActiveTab('discover')} variant="secondary">Browse Circles</Button> : <Button icon={PlusCircle} onClick={() => setIsModalOpen(true)}>Start a Circle</Button>}
               />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <CreateCircleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleCircleCreated} />
    </motion.div>
  );
};

export default SupportCircles;
