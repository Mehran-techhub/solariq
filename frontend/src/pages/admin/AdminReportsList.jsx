import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2, FileText } from 'lucide-react';

export default function AdminReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getReports();
        if (res.success) setReports(res.data?.reports || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">All Reports</h1><p className="theme-text-secondary mt-1">View all generated reports across the platform</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="theme-text-muted">No reports have been generated yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">User ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Name</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Type</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Generated</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={r.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted">{r.id}</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{r.user_id}</td>
                    <td className="px-5 py-3.5 theme-text">{r.report_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: 'var(--accent-purple)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid', borderColor: 'var(--nav-active-border)' }}>{r.report_type}</span>
                    </td>
                    <td className="px-5 py-3.5 theme-text-muted">{r.generated_at ? new Date(r.generated_at).toLocaleDateString() : '—'}</td>
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