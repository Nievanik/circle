import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import { UserPlus, Users, Link as LinkIcon, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';

const Network = () => {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const [connections, setConnections] = useState({ incoming: [], outgoing: [], accepted: [] });
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const [inRes, outRes, accRes] = await Promise.all([
          api.get('/connections/incoming'),
          api.get('/connections/outgoing'),
          api.get('/connections')
        ]);
        setConnections({
          incoming: inRes.data.data,
          outgoing: outRes.data.data,
          accepted: accRes.data.data,
        });
      } catch (err) {
        console.error('Failed to fetch network data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetworkData();
  }, []);

  // WebSockets Real-Time Sync
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (req) => {
      setConnections(prev => ({ ...prev, incoming: [req, ...prev.incoming] }));
    };

    const handleResponse = (req) => {
      setConnections(prev => {
        const isAccepted = req.status === 'accepted';
        const updatedOutgoing = prev.outgoing.filter(r => r._id !== req._id);
        
        return {
          ...prev,
          outgoing: updatedOutgoing,
          accepted: isAccepted ? [...prev.accepted, { sender: user, receiver: req.receiver, status: 'accepted', _id: req._id }] : prev.accepted
        };
      });
    };

    socket.on('NEW_CONNECTION_REQUEST', handleNewRequest);
    socket.on('CONNECTION_RESPONSE', handleResponse);

    return () => {
      socket.off('NEW_CONNECTION_REQUEST', handleNewRequest);
      socket.off('CONNECTION_RESPONSE', handleResponse);
    };
  }, [socket, user]);

  const handleConnectionResponse = async (id, status) => {
    try {
      await api.put(`/connections/${id}`, { status });
      const handledReq = connections.incoming.find(req => req._id === id);
      
      setConnections(prev => {
        const updatedIncoming = prev.incoming.filter(req => req._id !== id);
        if (status === 'accepted' && handledReq) {
          return {
            ...prev,
            incoming: updatedIncoming,
            accepted: [...prev.accepted, { ...handledReq, status: 'accepted' }]
          };
        }
        return {
           ...prev,
           incoming: updatedIncoming
        };
      });
    } catch (err) {
      alert('Failed to respond to request');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="mb-10 bg-white p-8 rounded-[2rem] shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">My Network</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
             Review pending connection approvals and manage your established peer group safely.
          </p>
        </div>
        <div className="hidden md:flex w-24 h-24 bg-brand-50 rounded-2xl items-center justify-center">
          <LinkIcon className="w-10 h-10 text-brand-500" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border-slate-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
             <UserPlus className="w-6 h-6 mr-3 text-brand-500"/> Incoming Requests ({connections.incoming.length})
          </h2>
          <div className="space-y-4">
             {loading ? <Skeleton className="h-20 rounded-2xl" /> : connections.incoming.length === 0 ? (
               <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                   <p className="text-sm font-bold text-slate-500 py-2">No pending requests right now.</p>
                   <Link to="/discover">
                      <Button variant="secondary" size="sm" className="mt-2">Discover Peers</Button>
                   </Link>
               </div>
             ) : connections.incoming.map(req => (
               <div key={req._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center shadow-sm hover:border-brand-300 transition-colors group">
                 <Link to={`/peer/${req.sender._id}`} className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                     {req.sender.name.charAt(0)}
                   </div>
                   <div>
                     <span className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-none block">{req.sender.name}</span>
                     <span className="text-xs text-slate-400 font-medium capitalize mt-1 block">{req.sender.role}</span>
                   </div>
                 </Link>
                 <div className="flex gap-2">
                   <Button size="sm" onClick={() => handleConnectionResponse(req._id, 'accepted')} className="flex-1 sm:flex-none">Accept</Button>
                   <Button variant="outline" size="sm" onClick={() => handleConnectionResponse(req._id, 'rejected')} className="text-red-500 border-red-200 hover:bg-red-50 w-auto px-3"><X size={18}/></Button>
                 </div>
               </div>
             ))}
          </div>
        </Card>
        
        <Card className="bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border-slate-100 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center">
             <Users className="w-6 h-6 mr-3 text-emerald-500"/> Accepted Connections ({connections.accepted.length})
          </h2>
           <div className="space-y-4">
             {loading ? <Skeleton className="h-20 rounded-2xl" /> : connections.accepted.length === 0 ? (
               <div className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm">
                  <p className="text-sm font-bold text-slate-500 py-2">Your network is empty.</p>
                  <p className="text-xs text-slate-400">Approve incoming requests or send your own to build your support group.</p>
               </div>
             ) : connections.accepted.map(conn => {
               const peer = conn.sender._id === user._id ? conn.receiver : conn.sender;
               return (
                 <div key={conn._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-emerald-300 transition-colors group">
                   <Link to={`/peer/${peer._id}`} className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                       {peer.name.charAt(0)}
                     </div>
                     <div>
                       <span className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors leading-none block">{peer.name}</span>
                       <span className="text-xs text-slate-400 font-medium capitalize mt-1 block">{peer.role}</span>
                     </div>
                   </Link>
                   <Button variant="ghost" className="text-emerald-600 hover:bg-emerald-50 font-bold" disabled>Connected</Button>
                 </div>
               )
             })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Network;
