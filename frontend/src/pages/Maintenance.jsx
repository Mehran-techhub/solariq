import { useEffect, useState } from 'react';
import { maintenanceApi } from '../api';
import { toast } from 'react-toastify';
import { AlertTriangle, ShieldAlert, Wrench, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

const severityConfig = {
  critical: { icon: ShieldAlert, label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', badge: 'bg-red-500/20 text-red-300' },
  warning: { icon: AlertTriangle, label: 'Warning', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'bg-amber-500/20 text-amber-300' },
  info: { icon: Wrench, label: 'Info', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', badge: 'bg-blue-500/20 text-blue-300' },
};

export default function Maintenance() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await maintenanceApi.list();
      if (res.success) setAlerts(res.data?.alerts || []);
    } catch {
      toast.error('Failed to load maintenance alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await maintenanceApi.update(id, 'resolved');
      toast.success('Alert marked as resolved.');
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    } catch {
      toast.error('Failed to update alert status.');
    } finally {
      setResolving(null);
    }
  };

  const active = alerts.filter(a => a.status !== 'resolved');
  const resolved = alerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="inline-block text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3">
            System Health
          </span>
          <h1 className="text-3xl font-bold text-white">Maintenance & Alerts</h1>
          <p className="text-gray-400 mt-1">Rule-based monitoring. ML anomaly detection coming in future version.</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status banner */}
      <div className={`flex items-center gap-4 p-5 rounded-2xl border ${active.length === 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
        {active.length === 0 ? (
          <>
            <div className="p-2 bg-emerald-500/20 rounded-xl"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
            <div>
              <p className="font-semibold text-emerald-300">All Systems Operating Normally</p>
              <p className="text-sm text-emerald-400/60">No active maintenance alerts.</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-amber-500/20 rounded-xl"><AlertTriangle className="w-6 h-6 text-amber-400" /></div>
            <div>
              <p className="font-semibold text-amber-300">{active.length} Active Alert{active.length > 1 ? 's' : ''} Require Attention</p>
              <p className="text-sm text-amber-400/60">Review and resolve the issues listed below.</p>
            </div>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Alerts */}
          {active.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Active Alerts ({active.length})</h2>
              <div className="space-y-3">
                {active.map((alert) => {
                  const cfg = severityConfig[alert.severity] || severityConfig.info;
                  const Icon = cfg.icon;
                  return (
                    <div key={alert.id} className={`flex items-start justify-between gap-4 p-5 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-xl ${cfg.bg}`}>
                          <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                            <span className="text-xs text-gray-500">{alert.created_at ? new Date(alert.created_at).toLocaleDateString() : ''}</span>
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed">{alert.message || alert.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolving === alert.id}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
                      >
                        {resolving === alert.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                        Resolve
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resolved Alerts */}
          {resolved.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-400 mb-3">Resolved ({resolved.length})</h2>
              <div className="space-y-2">
                {resolved.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 opacity-60">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-sm text-gray-400 line-through">{alert.message || alert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {alerts.length === 0 && (
            <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-16 text-center">
              <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance records in the database.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
