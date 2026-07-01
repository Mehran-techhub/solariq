import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2 } from 'lucide-react';

export default function AdminPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getPredictions();
        if (res.success) setPredictions(res.data?.predictions || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">All Predictions</h1><p className="theme-text-secondary mt-1">View all solar predictions across the platform</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Prediction ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">User</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Output</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Status</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Confidence</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((p, i) => (
                  <tr key={p.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted">{p.id}</td>
                    <td className="px-5 py-3.5 theme-text-muted text-xs">{p.prediction_id || '—'}</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{p.user_id}</td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--accent-emerald)' }}>{p.predicted_output} kW</td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-0.5 rounded ${p.generation_status === 'Excellent' || p.generation_status === 'Very Good' ? 'text-emerald-400 bg-emerald-500/10' : p.generation_status === 'Good' ? 'text-green-400 bg-green-500/10' : p.generation_status === 'Moderate' ? 'text-yellow-400 bg-yellow-500/10' : 'text-orange-400 bg-orange-500/10'}`}>{p.generation_status || '—'}</span></td>
                    <td className="px-5 py-3.5 theme-text-secondary">{p.confidence_score}%</td>
                    <td className="px-5 py-3.5 theme-text-muted">{p.date} {p.time}</td>
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
