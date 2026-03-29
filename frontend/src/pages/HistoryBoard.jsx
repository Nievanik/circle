import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';
import Card from '../components/UI/Card';

const HistoryBoard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/dashboard/history');
        const checkIns = res.data.data;
        if (checkIns.length === 0) {
           setData([]);
           setLoading(false);
           return;
        }

        // Pad timeline missing dates with null objects to disconnect chart lines visually
        const chartData = [];
        const start = new Date(checkIns[0].dateString);
        const end = new Date(checkIns[checkIns.length - 1].dateString);

        const map = {};
        checkIns.forEach(c => map[c.dateString] = c);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
           const dStr = d.toISOString().split('T')[0];
           const found = map[dStr];
           chartData.push({
             date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
             Stress: found ? found.stressLevel : null,
             Motivation: found ? found.motivationLevel : null
           });
        }

        setData(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 font-bold text-slate-500">Loading Journey Data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Journey History</h1>
        <p className="text-slate-500 font-medium">Your emotional telemetry mapped over time.</p>
      </header>
      
      <Card className="p-6 h-96">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" dataKey="Stress" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Motivation" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 font-medium">No check-in history found yet. Provide a check-in on the dashboard!</div>
        )}
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-brand-50 border-brand-100 flex flex-col justify-center items-center">
             <h4 className="text-brand-800 font-bold mb-1">Total Logs Count</h4>
             <span className="text-3xl font-black text-brand-600">{data.length}</span>
          </Card>
          <Card className="p-4 bg-slate-50 flex flex-col justify-center items-center text-center px-8">
             <p className="text-sm font-medium text-slate-600">The goal isn't linear progress. It's building the self-awareness to catch slumps early and communicate them with your Circle.</p>
          </Card>
      </div>
    </motion.div>
  );
};

export default HistoryBoard;
