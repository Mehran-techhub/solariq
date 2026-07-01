export default function StatCard({ label, value, unit, icon: Icon, trend }) {
  return (
    <div className="cryp-card p-6 hover:border-cryp-lime/30 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className="p-3 rounded-xl bg-cryp-lime/10 text-cryp-lime group-hover:shadow-lime transition-shadow">
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend != null && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-cryp-lime' : 'text-red-400'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-cryp-muted text-sm font-medium">{label}</p>
      <p className="text-3xl font-display font-bold mt-1">
        {value}
        {unit && <span className="text-lg text-cryp-muted font-normal ml-1">{unit}</span>}
      </p>
    </div>
  );
}
