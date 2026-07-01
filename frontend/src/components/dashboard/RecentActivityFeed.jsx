import { Activity, Loader2 } from 'lucide-react';
import TimeAgo from '../../utils/TimeAgo';

const moduleColor = {
  auth: 'bg-blue-500/10 text-blue-400',
  solar: 'bg-emerald-500/10 text-emerald-400',
  report: 'bg-purple-500/10 text-purple-400',
  simulation: 'bg-amber-500/10 text-amber-400',
  weather: 'bg-cyan-500/10 text-cyan-400',
};

export default function RecentActivityFeed({ activities, loading }) {
  return (
    <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6 shadow-sm h-full">
      <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : activities?.length > 0 ? (
        <div className="relative border-l border-white/10 ml-3 space-y-6 pb-2">
          {activities.slice(0, 8).map((item) => {
            const colorClass = moduleColor[item.module] || 'bg-gray-500/10 text-gray-400';
            return (
              <div key={item.id} className="relative pl-6">
                <div className={`absolute -left-[17px] top-1 rounded-full p-1.5 ${colorClass} ring-4 ring-[#0d141e]`}>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{item.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5"><TimeAgo date={item.timestamp} /></p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
          <Activity className="w-10 h-10 text-gray-600" />
          <p className="text-gray-500 text-sm">No activity recorded yet.</p>
        </div>
      )}
    </div>
  );
}
