import { motion } from 'framer-motion';
import { PlusCircle, PlayCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import TimeAgo from '../../utils/TimeAgo';

export default function WelcomeBanner({ weatherCondition }) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', backgroundImage: 'var(--gradient-card)' }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none rounded-full transform translate-x-1/2 -translate-y-1/2" style={{ background: 'var(--hero-glow)' }} />

      <div className="relative z-10 space-y-2 max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight theme-text">
          {greeting},{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">{firstName}</span>
        </h1>
        <p className="theme-text-secondary text-base">
          {weatherCondition
            ? `Current conditions: ${weatherCondition}. Monitor your solar system performance below.`
            : 'Monitor, analyze and optimize your solar energy system.'}
        </p>
        {user?.last_login && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: 'var(--status-dot)' }}></span>
            Last login: <TimeAgo date={user.last_login} />
          </p>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <Link
          to="/simulation"
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}
        >
          <PlayCircle className="w-4 h-4" /> Run Simulation
        </Link>
        <Link
          to="/prediction"
          className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: 'var(--gradient-emerald)' }}
        >
          <PlusCircle className="w-4 h-4" /> New Prediction
        </Link>
      </div>
    </motion.div>
  );
}