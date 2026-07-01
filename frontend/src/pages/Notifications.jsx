import { useEffect, useState } from 'react';
import { notificationApi } from '../api';
import { toast } from 'react-toastify';
import { Bell, Loader2, CheckCheck, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const TYPE_ICONS = { info: Info, success: CheckCircle, warning: AlertTriangle, error: AlertTriangle };
const TYPE_COLORS = { info: 'text-blue-400 bg-blue-500/10', success: 'text-emerald-400 bg-emerald-500/10', warning: 'text-amber-400 bg-amber-500/10', error: 'text-red-400 bg-red-500/10' };

export default function Notifications() {
  const [data, setData] = useState({ notifications: [], unread_count: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.list();
      if (res.success) setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, is_read: true })), unread_count: 0 }));
      toast.success('All marked as read');
    } catch { toast.error('Failed to mark as read'); }
  };

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      load();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold theme-text">Notifications</h1>
          <p className="theme-text-secondary mt-1">Stay updated with your solar platform</p>
        </div>
        {data.unread_count > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-emerald)' }} /></div>
      ) : data.notifications.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="theme-text-muted">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || Info;
            return (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className="border rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:bg-white/5"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: n.is_read ? 'var(--border-color)' : 'var(--nav-active-border)' }}
              >
                <div className={`p-2 rounded-lg ${TYPE_COLORS[n.type] || 'text-gray-400 bg-gray-500/10'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.is_read ? 'theme-text-muted' : 'theme-text'}`}>{n.title}</p>
                  <p className="text-xs theme-text-muted mt-1">{n.message}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}><TimeAgo date={n.created_at} /></p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent-emerald)' }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}