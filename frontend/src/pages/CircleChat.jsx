import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { ArrowLeft, Send, MessageSquare, ShieldCheck, Users } from 'lucide-react';
import Skeleton from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';

const CircleChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [circle, setCircle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Fetches and Polling
  useEffect(() => {
    let intervalId;

    const fetchCircleData = async () => {
      try {
        const [circleRes, msgRes] = await Promise.all([
          api.get(`/circles/${id}`),
          api.get(`/circles/${id}/messages`)
        ]);
        setCircle(circleRes.data.data);
        setMessages(msgRes.data.data);
      } catch (err) {
        if (err.response?.status === 403) {
           alert("You must join this circle to view its discussion.");
           navigate('/circles');
        }
      } finally {
        setLoading(false);
      }
    };

    const pollMessages = async () => {
      try {
        const msgRes = await api.get(`/circles/${id}/messages`);
        setMessages(msgRes.data.data);
      } catch (e) { /* silent fail on poll */ }
    };

    fetchCircleData();
    // Start basic polling for Hackathon demo without Socket overhead (every 5 seconds)
    intervalId = setInterval(pollMessages, 5000);

    return () => clearInterval(intervalId);
  }, [id, navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const res = await api.post(`/circles/${id}/messages`, { content: newMessage });
      const addedMsg = { ...res.data.data, sender: { _id: user._id, name: user.name, role: user.role } };
      setMessages([...messages, addedMsg]);
      setNewMessage('');
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto pt-10"><Skeleton className="h-[600px] rounded-3xl" /></div>;
  if (!circle) return <div className="text-center mt-20">Circle not found</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto flex flex-col h-[85vh]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate('/circles')} className="-ml-3 hover:bg-transparent">
          Back to Circles
        </Button>
      </div>

      <Card className="flex-1 flex flex-col p-6 sm:p-8 shadow-xl border border-slate-200 overflow-hidden relative rounded-[2rem]">
         <div className="absolute top-0 right-0 p-8 opacity-5 w-48 h-48 pointer-events-none">
            <MessageSquare className="w-full h-full text-slate-900" />
         </div>

         {/* Chat Header */}
         <div className="pb-6 border-b border-slate-100 flex justify-between items-start z-10 shrink-0">
           <div>
             <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{circle.name}</h1>
             <p className="text-slate-500 font-medium">#{circle.theme.replace('-', ' ')} &bull; {circle.description}</p>
           </div>
           <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center hidden sm:block shadow-sm">
             <span className="block text-2xl font-black text-brand-600 mb-1 leading-none">{circle.members.length}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center"><Users className="w-3 h-3 mr-1" /> Peers</span>
           </div>
         </div>

         {/* Chat Messages */}
         <div className="flex-1 overflow-y-auto py-6 space-y-6 z-10 custom-scrollbar pr-4">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-70">
                 <EmptyState 
                   title="Welcome to the Circle" 
                   description={`Be the first to step up and introduce yourself to the ${circle.name} group.`} 
                   icon={ShieldCheck} 
                   className="border-none bg-transparent"
                 />
               </div>
            ) : (
               messages.map((msg, i) => {
                 const isMe = msg.sender._id === user._id;
                 const showHeader = i === 0 || messages[i-1].sender._id !== msg.sender._id;

                 return (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {showHeader && (
                        <div className={`text-xs font-bold mb-1.5 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className={isMe ? 'text-brand-600' : 'text-slate-700'}>{isMe ? 'You' : msg.sender.name}</span>
                          {!isMe && msg.sender.role && <span className="text-[10px] text-slate-400 capitalize -mt-0.5">{msg.sender.role}</span>}
                        </div>
                      )}
                      
                      <div className={`px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-md break-words ${
                        isMe 
                        ? 'bg-brand-500 text-white rounded-tr-sm shadow-md shadow-brand-500/10' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/50'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1.5">
                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </motion.div>
                 );
               })
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Chat Input */}
         <form onSubmit={handleSendMessage} className="pt-6 border-t border-slate-100 z-10 shrink-0 flex gap-3">
           <input 
             type="text" 
             className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 focus:bg-white transition-all text-slate-800 font-medium"
             placeholder="Type your message..."
             value={newMessage}
             onChange={e => setNewMessage(e.target.value)}
             disabled={sending}
           />
           <Button type="submit" size="lg" className="w-14 items-center justify-center flex p-0 shrink-0 bg-slate-900 border-none hover:bg-slate-800 shadow-md" isLoading={sending} disabled={!newMessage.trim()}>
             {!sending && <Send className="w-5 h-5 !m-0" />}
           </Button>
         </form>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}}/>
    </motion.div>
  );
};

export default CircleChat;
