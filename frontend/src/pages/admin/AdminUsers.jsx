import { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Loader2 } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getUsers();
        if (res.success) setUsers(res.data?.users || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold theme-text">Users</h1><p className="theme-text-secondary mt-1">All registered users on the platform</p></div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">ID</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Name</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Email</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Role</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Status</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Joined</th>
                  <th className="text-left px-5 py-3 font-medium theme-text-muted">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                    <td className="px-5 py-3.5 theme-text-muted">{u.id}</td>
                    <td className="px-5 py-3.5 font-medium theme-text">{u.full_name}</td>
                    <td className="px-5 py-3.5 theme-text-secondary">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.role === 'admin' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.is_active ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-5 py-3.5 theme-text-muted">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3.5 theme-text-muted">{u.last_login ? <TimeAgo date={u.last_login} /> : '—'}</td>
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