import { useState, useEffect } from 'react';
import { Cpu, Activity, Server, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { predictionApi } from '../../api';

export default function MLModelStatus() {
  const [status, setStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statusRes, metricsRes] = await Promise.all([
          predictionApi.status(),
          predictionApi.metrics()
        ]);
        if (statusRes.success) setStatus(statusRes.data);
        if (metricsRes.success) setMetrics(metricsRes.data);
      } catch (e) {
        console.error("Failed to load ML model status", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm theme-text-muted">
        <Loader2 className="w-4 h-4 animate-spin" /> Checking ML Model...
      </div>
    );
  }

  if (!status) return null;

  const isActive = status.status === 'Active';

  return (
    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5" style={{ color: isActive ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
            <h3 className="text-sm font-bold theme-text">AI Prediction Engine</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {status.status}
            </span>
          </div>
          <p className="text-xs theme-text-muted">
            {status.type} &middot; Powered by XGBoost/Gradient Boosting
          </p>
        </div>

        {metrics && (
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] theme-text-muted uppercase tracking-wider mb-0.5">Accuracy (R²)</p>
              <p className="text-sm font-bold theme-text">{(metrics.r2_score * 100).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] theme-text-muted uppercase tracking-wider mb-0.5">MAE</p>
              <p className="text-sm font-bold theme-text">{metrics.mae.toFixed(3)} kW</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
