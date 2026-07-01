import { useEffect, useState, useRef } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, CheckCircle, XCircle, Database, Server, Clock, Activity, RefreshCw } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

export default function AdminSystem() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const load = async () => {
    try {
      const res = await adminApi.getHealth();
      if (res.success) setHealth(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 10000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const statusDot = (ok) => ok
    ? <CheckCircle className="w-5 h-5" style={{ color: 'var(--status-dot)' }} />
    : <XCircle className="w-5 h-5 text-red-400" />;

  const services = [
    { label: 'API Server', ok: health?.api === 'running', icon: Server },
    { label: 'MySQL Database', ok: health?.database === 'connected', icon: Database },
    { label: 'Prediction Service', ok: health?.prediction_service_ready ?? false, icon: Activity },
    { label: 'OpenWeather API', ok: health?.weather_api_ready ?? false, icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold theme-text">System Status</h1>
          <p className="theme-text-secondary mt-1">Real-time platform health monitoring</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-lg font-bold theme-text mb-4 flex items-center gap-2"><Server className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} /> Services</h3>
            <div className="space-y-3">
              {services.map(({ label, ok, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-3"><Icon className="w-4 h-4 theme-text-muted" /><span className="text-sm theme-text-secondary">{label}</span></div>
                  <div className="flex items-center gap-2">{statusDot(ok)}<span className={`text-xs font-semibold ${ok ? 'theme-emerald' : 'text-red-400'}`}>{ok ? 'Online' : 'Offline'}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
            <h3 className="text-lg font-bold theme-text mb-4 flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} /> Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-sm theme-text-secondary">Last Updated</span>
                <span className="text-sm theme-text-muted">{health?.timestamp ? <TimeAgo date={health.timestamp} /> : '—'}</span>
              </div>
              <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span className="text-sm theme-text-secondary">Application</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--accent-emerald)' }}>SolarIQ v1.0</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm theme-text-secondary">Engine</span>
                <span className="text-sm theme-text-muted">Flask + MySQL</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}