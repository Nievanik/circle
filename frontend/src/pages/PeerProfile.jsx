import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import { ArrowLeft, UserPlus, FileSearch, Target, Users, Clock, ShieldCheck, Check } from 'lucide-react';

const PeerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [peerData, setPeerData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'none', 'pending_sent', 'pending_received', 'connected'
  const [requestId, setRequestId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPeerData = async () => {
      try {
        const [peerRes, outReq, inReq, connReq] = await Promise.all([
          api.get(`/users/${id}`),
          api.get('/connections/outgoing'),
          api.get('/connections/incoming'),
          api.get('/connections')
        ]);
        
        setPeerData({ user: peerRes.data.data.user, matchScore: peerRes.data.data.score });

        // Determine relationship state
        const isConnected = connReq.data.data.find(c => c.sender._id === id || c.receiver._id === id);
        if (isConnected) { setConnectionStatus('connected'); return; }

        const pendingSent = outReq.data.data.find(c => c.receiver._id === id);
        if (pendingSent) { setConnectionStatus('pending_sent'); return; }

        const pendingReceived = inReq.data.data.find(c => c.sender._id === id);
        if (pendingReceived) { 
          setConnectionStatus('pending_received'); 
          setRequestId(pendingReceived._id);
          return; 
        }

        setConnectionStatus('none');
      } catch (err) {
        console.error("Failed to fetch peer profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPeerData();
  }, [id]);

  const handleConnect = async () => {
    setActionLoading(true);
    try {
      if (connectionStatus === 'none') {
        await api.post('/connections', { receiverId: id });
        setConnectionStatus('pending_sent');
      } else if (connectionStatus === 'pending_received' && requestId) {
        await api.put(`/connections/${requestId}`, { status: 'accepted' });
        setConnectionStatus('connected');
      }
    } catch (err) {
      alert("Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto pt-10"><Skeleton className="h-96 rounded-3xl" /></div>;
  if (!peerData?.user) return <div className="text-center mt-20">User not found</div>;

  const peer = peerData.user;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto pb-12">
      <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)} className="mb-6 -ml-4 hover:bg-transparent">
        Back
      </Button>

      <Card className="p-8 md:p-12 shadow-xl border-slate-100 rounded-[2rem] relative overflow-hidden">
        {/* Cover Background */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-brand-400 to-indigo-500 opacity-20"></div>
        
        <div className="relative z-10 sm:flex items-start justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-4xl font-black text-white shadow-lg border-4 border-white mt-10 sm:mt-0 relative">
              {peer.name.charAt(0)}
              {connectionStatus === 'connected' && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-white">
                   <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="mt-2 sm:mt-16">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{peer.name}</h1>
              <p className="text-lg font-semibold text-brand-600 capitalize mb-4">{peer.role} &bull; {peer.currentStage}</p>
              
              <div className="flex flex-wrap gap-2">
                 <Badge variant="brand" className="text-sm px-3 py-1 bg-brand-50 border-brand-100">{peerData.matchScore}% Compatibility</Badge>
                 {connectionStatus === 'connected' && <Badge variant="success" className="text-sm px-3 py-1">Connected</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-16 sm:ml-6 flex-shrink-0">
            {connectionStatus === 'none' && (
               <Button size="lg" icon={UserPlus} className="w-full sm:w-auto shadow-md" onClick={handleConnect} isLoading={actionLoading}>Connect</Button>
            )}
            {connectionStatus === 'pending_sent' && (
               <Button size="lg" disabled variant="secondary" className="w-full sm:w-auto">Request Sent</Button>
            )}
            {connectionStatus === 'pending_received' && (
               <Button size="lg" className="w-full sm:w-auto" onClick={handleConnect} isLoading={actionLoading}>Accept Request</Button>
            )}
            {connectionStatus === 'connected' && (
               <Button size="lg" variant="subtle" icon={Check} disabled className="w-full sm:w-auto opacity-100 bg-emerald-50 text-emerald-700">Connected</Button>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center text-brand-600"><Target className="w-4 h-4 mr-2"/> Primary Goal</h3>
                <p className="text-lg font-semibold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{peer.careerGoal || 'Exploring paths'}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center text-red-500"><FileSearch className="w-4 h-4 mr-2"/> Current Struggles</h3>
                <div className="flex flex-wrap gap-2">
                  {peer.struggleTypes?.length ? peer.struggleTypes.map(s => (
                    <Badge variant="danger" key={s} className="px-3 py-1.5">{s.replace('-', ' ')}</Badge>
                  )) : <span className="text-slate-500 font-medium italic">None specified</span>}
                </div>
              </section>
           </div>

           <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center text-emerald-500"><Users className="w-4 h-4 mr-2"/> Support Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {peer.supportPreferences?.length ? peer.supportPreferences.map(s => (
                    <Badge variant="default" key={s} className="px-3 py-1.5 bg-slate-100/50">{s.replace('-', ' ')}</Badge>
                  )) : <span className="text-slate-500 font-medium italic">Any format works</span>}
                </div>
              </section>

              <section className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center text-slate-600"><Clock className="w-4 h-4 mr-2"/> Recent Check-In</h3>
                {peer.latestMoodScore ? (
                   <p className="text-slate-700 font-medium">Recorded a mood score of <strong className="text-slate-900">{peer.latestMoodScore}/10</strong> recently. Reach out!</p>
                ) : (
                   <p className="text-slate-400 font-medium">No recent check-ins.</p>
                )}
              </section>
           </div>
        </div>

      </Card>
    </motion.div>
  );
};

export default PeerProfile;
