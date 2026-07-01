import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, Activity } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getActivity();
        if (res.success) setLogs(res.data?.logs || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const moduleColors = {
    auth: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    admin: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    solar: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    prediction: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    weather: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    maintenance: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">Activity Logs</h1><p className="theme-text-secondary mt-1">Complete platform activity history</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Activity className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="theme-text-muted">No activity logs available.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Time</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">User</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Action</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Module</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted text-xs">{log.timestamp ? <TimeAgo date={log.timestamp} /> : '—'}</td>
                    <td className="px-5 py-3.5 theme-text">{log.user_name || `User #${log.user_id}`}</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{log.action}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${moduleColors[log.module] || 'text-gray-400 bg-white/5 border-white/10'}`}>{log.module || 'general'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}