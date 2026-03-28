import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Target, CheckSquare, Compass, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';

const Sidebar = () => {
  const socket = useSocket();
  const location = useLocation();
  const [hasNewNetworkEvent, setHasNewNetworkEvent] = useState(false);

  useEffect(() => {
    if (location.pathname === '/network') {
      setHasNewNetworkEvent(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) return;
    const handlePing = () => setHasNewNetworkEvent(true);

    socket.on('NEW_CONNECTION_REQUEST', handlePing);
    socket.on('CONNECTION_RESPONSE', handlePing);

    return () => {
      socket.off('NEW_CONNECTION_REQUEST', handlePing);
      socket.off('CONNECTION_RESPONSE', handlePing);
    };
  }, [socket]);

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'My Network', icon: Users, path: '/network', showBadge: hasNewNetworkEvent },
    { name: 'Discover Peers', icon: Search, path: '/discover' },
    { name: 'Support Circles', icon: Target, path: '/circles' },
    { name: 'Emotional Check-In', icon: CheckSquare, path: '/checkin' },
  ];

  return (
    <div className="fixed w-64 h-screen bg-[#0A0F1C] text-slate-300 flex flex-col pt-8 pb-4 border-r border-slate-800/50">
      <div className="px-6 mb-10 flex items-center gap-3 group px-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-tight">Circle</span>
      </div>
      
      <div className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                 isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-500/20 rounded-xl border border-brand-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 mr-3 z-10 transition-colors ${isActive ? 'text-brand-400' : ''}`} />
                <span className="z-10 flex-1">{item.name}</span>
                {item.showBadge && !isActive && (
                   <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50 z-10"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      <div className="px-6 mt-auto">
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 relative overflow-hidden">
          <Shield className="w-16 h-16 absolute -bottom-4 -right-4 text-slate-700/30 rotate-12" />
          <h4 className="text-sm font-bold text-slate-200 mb-1 relative z-10">Safe Space</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">
            For professional aid or emergencies, please dial 988 or seek clinical help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
