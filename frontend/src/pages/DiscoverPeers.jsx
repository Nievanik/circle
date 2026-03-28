import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Target, Users, Search, Activity, UserPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';
import Button from '../components/UI/Button';
import { AuthContext } from '../context/AuthContext';

const DiscoverPeers = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({}); // Stores status lookup by userId
  const [actionLoading, setActionLoading] = useState({}); // Track loading state of buttons by userId

  useEffect(() => {
    const fetchMatchesAndStatus = async () => {
      try {
        const [res, outReq, inReq, connReq] = await Promise.all([
          api.get('/users/matches'),
          api.get('/connections/outgoing'),
          api.get('/connections/incoming'),
          api.get('/connections')
        ]);
        
        setMatches(res.data.data);

        const newStatuses = {};
        
        // Build accepted map
        connReq.data.data.forEach(c => {
           let peerId = c.sender._id === user._id ? c.receiver._id : c.sender._id;
           newStatuses[peerId] = 'connected';
        });

        // Build pending sent
        outReq.data.data.forEach(c => {
           newStatuses[c.receiver._id] = 'pending_sent';
        });

        // Build pending received
        inReq.data.data.forEach(c => {
           newStatuses[c.sender._id] = { type: 'pending_received', reqId: c._id };
        });

        setStatuses(newStatuses);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchesAndStatus();
  }, [user._id]);

  const handleConnect = async (peerId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, [peerId]: true }));
    try {
      if (!currentStatus) {
        await api.post('/connections', { receiverId: peerId });
        setStatuses(prev => ({ ...prev, [peerId]: 'pending_sent' }));
      } else if (currentStatus.type === 'pending_received') {
        await api.put(`/connections/${currentStatus.reqId}`, { status: 'accepted' });
        setStatuses(prev => ({ ...prev, [peerId]: 'connected' }));
      }
    } catch (err) {
      alert("Action failed.");
    } finally {
      setActionLoading(prev => ({ ...prev, [peerId]: false }));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="mb-10 bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Discover Connection</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Our algorithm analyzed your stage and emotional trajectory to find these individuals. Connect to share resources and ease the burden.
          </p>
        </div>
        <div className="hidden md:flex w-24 h-24 bg-brand-50 rounded-2xl items-center justify-center">
          <Activity className="w-10 h-10 text-brand-500" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
             [...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)
        ) : matches.length > 0 ? (
          matches.map((m, i) => {
            const peerId = m.user._id;
            const status = statuses[peerId];
            
            return (
            <motion.div key={peerId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
               <Card hoverEffect className="h-full flex flex-col justify-between p-8 border-slate-200/60 shadow-sm rounded-3xl relative overflow-hidden group">
                <Link to={`/peer/${peerId}`} className="block absolute inset-0 z-0"></Link>
                
                <div className="relative z-10 pointer-events-none">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-xl shadow-md border-2 border-white">
                        {m.user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors pointer-events-auto">{m.user.name}</h3>
                        <p className="text-brand-600 font-semibold capitalize text-sm">{m.user.currentStage || 'Exploring'} &bull; {m.user.role}</p>
                      </div>
                    </div>
                    
                    <Badge variant="brand" className="text-sm px-3 py-1.5 rounded-lg border-brand-200 bg-brand-50 shadow-sm">
                      {m.score}% Match
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 mb-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="flex items-start">
                      <Target className="w-5 h-5 text-slate-400 mr-3 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700 leading-snug"><strong className="text-slate-900 block mb-1">Career Goal</strong> {m.user.careerGoal || 'N/A'}</p>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-5 h-5 text-slate-400 mr-3 shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-700 leading-snug">
                        <strong className="text-slate-900 block mb-1.5">Shared Struggles</strong> 
                        <div className="flex flex-wrap gap-1.5">
                          {m.user.struggleTypes?.length ? m.user.struggleTypes.map(s => (
                             <Badge variant="default" className="text-[10px] bg-white border-slate-200" key={s}>{s.replace('-', ' ')}</Badge>
                          )) : <span className="text-slate-400 italic font-medium">None reported</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 relative z-10">
                  {!status && (
                    <Button icon={UserPlus} className="flex-1 shadow-md bg-slate-900 hover:bg-slate-800 text-white" isLoading={actionLoading[peerId]} onClick={() => handleConnect(peerId, status)}>
                      Connect
                    </Button>
                  )}
                  {status === 'pending_sent' && (
                    <Button className="flex-1" variant="secondary" disabled>Request Sent</Button>
                  )}
                  {status?.type === 'pending_received' && (
                    <Button className="flex-1" onClick={() => handleConnect(peerId, status)} isLoading={actionLoading[peerId]}>
                      Accept Request
                    </Button>
                  )}
                  {status === 'connected' && (
                    <Button className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none" icon={Check} disabled>
                      Connected
                    </Button>
                  )}
                  <Link to={`/peer/${peerId}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Profile</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
            )
          })
        ) : (
          <div className="col-span-2">
            <EmptyState 
               title="We could not find high compatibility matches"
               description="Try adjusting your current stage or struggles on the Dashboard. Matching relies on mutual compatibility so as more users join, this list will populate!"
               icon={Search}
               action={<Link to="/dashboard"><Button>Go to Dashboard</Button></Link>}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DiscoverPeers;
