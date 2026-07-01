import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, CloudSun } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

export default function AdminWeatherData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getWeather();
        if (res.success) setItems(res.data?.items || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">Weather Data</h1><p className="theme-text-secondary mt-1">All weather records fetched via OpenWeather API</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <CloudSun className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="theme-text-muted">No weather data fetched yet. Configure the API key in Settings.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Temp</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Humidity</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Cloud Cover</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Condition</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Fetched At</th>
                </tr>
              </thead>
              <tbody>
                {items.map((w, i) => (
                  <tr key={w.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted">{w.id || i + 1}</td>
                    <td className="px-5 py-3.5 theme-text">{w.temperature ?? '—'}°C</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{w.humidity ?? '—'}%</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{w.cloud_cover ?? '—'}%</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: 'var(--accent-blue)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid', borderColor: 'var(--nav-active-border)' }}>{w.weather_condition || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5 theme-text-muted">{w.fetched_at ? <TimeAgo date={w.fetched_at} /> : '—'}</td>
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