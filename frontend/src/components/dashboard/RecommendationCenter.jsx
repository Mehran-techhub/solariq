import { Lightbulb, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecommendationCenter({ recommendations, loading }) {
  return (
    <div className="rounded-2xl p-6 flex flex-col h-full" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} />
          <h3 className="text-lg font-bold theme-text">Recommendations</h3>
        </div>
        <Link to="/prediction" className="text-xs" style={{ color: 'var(--accent-emerald)' }}>View All &rarr;</Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6" style={{ color: 'var(--accent-emerald)' }} />
        </div>
      ) : recommendations?.length > 0 ? (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {recommendations.map((rec, idx) => (
            <div key={rec.id || idx} className="flex gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-amber)' }} />
              <p className="text-sm theme-text-secondary leading-relaxed">{rec.recommendation_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <Lightbulb className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
          <p className="theme-text-muted text-sm">No recommendations yet.</p>
          <p className="theme-text-muted text-xs">Run a prediction to generate insights.</p>
        </div>
      )}
    </div>
  );
}