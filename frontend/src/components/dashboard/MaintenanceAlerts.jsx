import { AlertTriangle, Wrench, ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { maintenanceApi } from '../../api';

const statusConfig = {
  open: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  resolved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  info: { icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function MaintenanceAlerts({ alerts, loading, onRefresh }) {
  const handleResolve = async (id) => {
    try {
      await maintenanceApi.update(id, 'resolved');
      toast.success('Alert marked as resolved.');
      if (onRefresh) onRefresh();
    } catch {
      toast.error('Failed to resolve alert.');
    }
  };

  return (
    <div className="rounded-2xl p-6 h-full flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold theme-text">Maintenance & Alerts</h3>
        <Link to="/maintenance" className="text-xs" style={{ color: 'var(--accent-emerald)' }}>View All &rarr;</Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6" style={{ color: 'var(--accent-emerald)' }} />
        </div>
      ) : alerts?.length > 0 ? (
        <div className="space-y-3 flex-1">
          {alerts.slice(0, 4).map((alert) => {
            const cfg = statusConfig[alert.status] || statusConfig.info;
            const Icon = cfg.icon;
            return (
              <div key={alert.id} className={`flex items-start justify-between gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-start gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${cfg.color}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${cfg.color}`}>{alert.alert_message || 'Alert'}</p>
                  </div>
                </div>
                {alert.status === 'open' && (
                  <button onClick={() => handleResolve(alert.id)} className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-emerald-400 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Wrench className="w-10 h-10 mx-auto mb-2 theme-text-muted" />
            <p className="theme-text-muted text-sm">No active alerts</p>
          </div>
        </div>
      )}
    </div>
  );
}