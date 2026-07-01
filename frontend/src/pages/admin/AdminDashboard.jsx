import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, Users, Zap, FileText, Activity, CheckCircle, XCircle } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6 text-white" /></div>
      <div><p className="text-sm theme-text-muted">{label}</p><p className="text-2xl font-bold theme-text mt-1">{value ?? '—'}</p></div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sRes, hRes] = await Promise.all([adminApi.getStats(), adminApi.getHealth()]);
        if (sRes.success) setStats(sRes.data);
        if (hRes.success) setHealth(hRes.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 text-amber-500 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">Admin Dashboard</h1><p className="theme-text-secondary mt-1">Platform overview and monitoring</p></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.total_users} color="bg-blue-600" />
        <StatCard icon={Zap} label="Solar Records" value={stats?.total_solar_records} color="bg-emerald-600" />
        <StatCard icon={FileText} label="Total Reports" value={stats?.total_reports} color="bg-purple-600" />
        <StatCard icon={Activity} label="Active Today" value={stats?.active_today} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="text-lg font-bold theme-text mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { label: 'Database', status: health?.database === 'connected' },
              { label: 'API Server', status: health?.api === 'running' },
              { label: 'Prediction Service', status: health?.prediction_service_ready ?? false },
              { label: 'Weather API', status: health?.weather_api_ready ?? false },
            ].map(({ label, status }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-sm theme-text-secondary">{label}</span>
                {status ? (
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', padding: '2px 10px', borderRadius: '999px', border: '1px solid', borderColor: 'var(--nav-active-border)' }}>
                    <CheckCircle className="w-3 h-3" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-400" style={{ backgroundColor: 'rgba(239,68,68,0.1)', padding: '2px 10px', borderRadius: '999px', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <XCircle className="w-3 h-3" /> Offline
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <h3 className="text-lg font-bold theme-text mb-4">Recent Logins</h3>
          {stats?.recent_logins?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_logins.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div><p className="text-sm theme-text">{u.full_name}</p><p className="text-xs theme-text-muted">{u.email}</p></div>
                  <span className="text-xs theme-text-muted">{u.last_login ? <TimeAgo date={u.last_login} /> : 'Never'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="theme-text-muted text-sm">No recent logins</p>
          )}
        </div>
      </div>
    </div>
  );
}