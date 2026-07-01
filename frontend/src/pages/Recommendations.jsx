import { useEffect, useState } from 'react';
import { recommendationsApi } from '../api';
import { Loader2, Lightbulb, Zap, Battery, CloudSun } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const TYPE_ICONS = {
  efficiency: Zap,
  battery: Battery,
  weather: CloudSun,
  general: Lightbulb,
};

const TYPE_COLORS = {
  efficiency: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  battery: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  weather: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  general: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await recommendationsApi.list();
        if (res.success) setRecs(res.data?.recommendations || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Recommendations</h1>
        <p className="text-gray-400 mt-1">AI-powered suggestions to optimize your solar energy usage</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
      ) : recs.length === 0 ? (
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-12 text-center">
          <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No recommendations yet. Generate predictions to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recs.map((r, i) => {
            const Icon = Lightbulb;
            return (
              <div key={r.id || i} className="bg-[#0d141e] border border-white/5 rounded-xl p-5 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-200 leading-relaxed">{r.recommendation_text}</p>
                  <p className="text-xs text-gray-600 mt-2">{r.created_at ? <TimeAgo date={r.created_at} /> : ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}