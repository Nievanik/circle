import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import EmptyState from '../components/UI/EmptyState';

const Inbox = () => {
  const { user } = useContext(AuthContext);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get('/connections');
        // Extract the peer from the connection object
        const peers = res.data.data.map(c => {
           return c.sender?._id === user?._id ? c.receiver : c.sender;
        });
        setConnections(peers.filter(p => p !== null));
      } catch (err) {
        console.error("Failed to load connections", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchConnections();
  }, [user]);

  if (loading) return <div className="p-8 text-center font-bold text-slate-500">Loading Inbox...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <MessageSquare className="w-8 h-8 text-brand-500 mr-3" /> Direct Messages
        </h1>
        <p className="text-slate-500 font-medium mt-1">Chat 1:1 with your confirmed connections.</p>
      </header>

      {connections.length === 0 ? (
        <EmptyState title="No Connections Yet" description="Visit 'Discover Peers' to connect with others on similar journeys." icon={Users} />
      ) : (
        <div className="space-y-4">
          {connections.map((peer, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={peer._id}>
              <Link to={`/messages/${peer._id}`}>
                <Card hoverEffect className="p-5 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-100 to-indigo-50 border-2 border-white shadow-sm flex items-center justify-center font-bold text-brand-700 text-xl font-display">
                      {peer.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors">{peer.name}</h3>
                      <p className="text-sm font-medium text-slate-500 capitalize">{peer.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost">Open Chat</Button>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Inbox;
