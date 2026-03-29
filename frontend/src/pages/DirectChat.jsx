import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DirectChat = () => {
  const { id: peerId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useContext(AuthContext);
  
  const [messages, setMessages] = useState([]);
  const [peerName, setPeerName] = useState('...');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch peer data to display name
        const peerRes = await api.get(`/users/${peerId}`);
        setPeerName(peerRes.data.data.name);

        const res = await api.get(`/messages/direct/${peerId}`);
        setMessages(res.data.data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [peerId, user]);

  useEffect(() => {
    if (socket) {
      const handler = (msg) => {
        // Only push if the message belongs to this dual connection
        if (msg.sender._id === peerId || msg.receiver === peerId) {
           setMessages(prev => [...prev, msg]);
        }
      };
      socket.on('new_direct_message', handler);
      return () => socket.off('new_direct_message', handler);
    }
  }, [socket, peerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Optimistic push
    const tempMsg = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: { _id: user._id, name: user.name },
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.post(`/messages/direct/${peerId}`, { content: tempMsg.content });
    } catch (err) {
      alert("Failed to send message");
    }
  };

  if (loading) return <div className="text-center p-12 text-slate-500 font-bold flex justify-center"><Loader2 className="animate-spin mr-2" /> Loading Chat...</div>;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      
      <header className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4 relative z-10">
        <button onClick={() => navigate('/messages')} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-full transition-colors"><ArrowLeft className="w-5 h-5"/></button>
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-700">
           {peerName?.charAt(0)}
        </div>
        <div>
           <h2 className="font-bold text-slate-900 leading-none">{peerName}</h2>
           <span className="text-xs font-medium text-emerald-500">Connected</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg, i) => {
          const isMine = msg.sender._id === user?._id;
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              {!isMine && (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs mr-2 mt-1">
                  {msg.sender?.name?.charAt(0)}
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${isMine ? 'bg-brand-500 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}>
                <p className="text-[15px] leading-relaxed relative z-10">{msg.content}</p>
                <div className={`text-[10px] mt-2 font-medium ${isMine ? 'text-brand-200' : 'text-slate-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            placeholder={`Message ${peerName}...`}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-full py-3 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 transition-colors text-white p-2 rounded-full cursor-pointer flex items-center justify-center"
          >
             <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DirectChat;
