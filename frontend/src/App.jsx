import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Network from './pages/Network';
import DiscoverPeers from './pages/DiscoverPeers';
import PeerProfile from './pages/PeerProfile';
import SupportCircles from './pages/SupportCircles';
import CircleChat from './pages/CircleChat';
import Inbox from './pages/Inbox';
import DirectChat from './pages/DirectChat';
import LiveMentorship from './pages/LiveMentorship';
import HistoryBoard from './pages/HistoryBoard';
import TimeTravelWidget from './components/UI/TimeTravelWidget';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-surface-50">
    <Sidebar />
    <div className="flex-1 flex flex-col ml-64">
      <Navbar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
    {import.meta.env.MODE !== 'production' && <TimeTravelWidget />}
  </div>
);

function App() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div className="min-h-screen bg-brand-50 flex items-center justify-center text-brand-500 font-bold">Loading Circle...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        
        {/* Protected Routes */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><DashboardLayout><Network /></DashboardLayout></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><DashboardLayout><DiscoverPeers /></DashboardLayout></ProtectedRoute>} />
        <Route path="/peer/:id" element={<ProtectedRoute><DashboardLayout><PeerProfile /></DashboardLayout></ProtectedRoute>} />
        <Route path="/circles" element={<ProtectedRoute><DashboardLayout><SupportCircles /></DashboardLayout></ProtectedRoute>} />
        <Route path="/circles/:id" element={<ProtectedRoute><DashboardLayout><CircleChat /></DashboardLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><DashboardLayout><Inbox /></DashboardLayout></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><DashboardLayout><DirectChat /></DashboardLayout></ProtectedRoute>} />
        <Route path="/mentorship" element={<ProtectedRoute><DashboardLayout><LiveMentorship /></DashboardLayout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><DashboardLayout><HistoryBoard /></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<div className="p-8 text-center text-slate-500">404 - Page feature not found in Hackathon demo.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
