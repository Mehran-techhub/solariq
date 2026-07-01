import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, Sun } from 'lucide-react';

export default function AdminSolarRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getSolarRecords();
        if (res.success) setRecords(res.data?.records || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">All Solar Records</h1><p className="theme-text-secondary mt-1">View all solar generation records across the platform</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">User ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Output</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Temp</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Irradiance</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted">{r.id}</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{r.user_id}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--accent-emerald)' }}>{r.actual_output ?? '—'} kW</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{r.temperature ?? '—'}°C</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{r.irradiance ?? '—'} W/m²</td>
                    <td className="px-5 py-3.5 theme-text-muted">{r.record_date ? new Date(r.record_date).toLocaleDateString() : '—'}</td>
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