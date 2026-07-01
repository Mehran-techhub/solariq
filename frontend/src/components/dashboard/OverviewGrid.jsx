import { motion } from 'framer-motion';
import { Database, CloudSun, Activity, FileText, Bell, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const OverviewCard = ({ title, value, unit, icon: Icon, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-[#0d141e] border border-white/5 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${color}`} />
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white">{value ?? '—'}</h3>
              {unit && <span className="text-gray-500 text-sm font-medium">{unit}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function OverviewGrid({ overview, loading }) {
  const weather = overview?.weather_summary;
  const stats = overview?.stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <OverviewCard
        title="Solar Records"
        value={stats?.total_records ?? '—'}
        icon={Database}
        color="bg-emerald-500"
        delay={0.0}
        loading={loading}
      />
      <OverviewCard
        title="Weather"
        value={weather?.weather_condition ?? 'No data'}
        unit={weather?.temperature ? `${weather.temperature}°C` : ''}
        icon={CloudSun}
        color="bg-blue-500"
        delay={0.1}
        loading={loading}
      />
      <OverviewCard
        title="Simulations"
        value={stats?.total_simulations ?? '—'}
        icon={Activity}
        color="bg-purple-500"
        delay={0.2}
        loading={loading}
      />
      <OverviewCard
        title="Reports"
        value={stats?.total_reports ?? '—'}
        icon={FileText}
        color="bg-amber-500"
        delay={0.3}
        loading={loading}
      />
      <OverviewCard
        title="Active Alerts"
        value={stats?.active_alerts ?? '—'}
        icon={Bell}
        color="bg-red-500"
        delay={0.4}
        loading={loading}
      />
      <OverviewCard
        title="Last Sync"
        value={overview ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
        icon={Clock}
        color="bg-cyan-500"
        delay={0.5}
        loading={loading}
      />
    </div>
  );
}
