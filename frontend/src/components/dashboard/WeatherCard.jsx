import { Loader2, Cloud, Droplets, Wind, Sun, Sunrise, Sunset, Thermometer, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeatherCard({ weather, loading, onRefresh }) {
  return (
    <div className="rounded-2xl p-6 h-full flex flex-col" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold theme-text">Live Weather</h3>
        <div className="flex items-center gap-2">
          {weather?.weather_condition && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ color: 'var(--accent-blue)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>
              {weather.weather_condition}
            </span>
          )}
          <button onClick={onRefresh} className="p-1.5 rounded-lg transition-colors theme-text-muted" style={{ color: 'var(--text-muted)' }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8" style={{ color: 'var(--accent-emerald)' }} />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center justify-center py-4 mb-4">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full mb-3" style={{ backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>
                <Sun className="w-12 h-12" style={{ color: 'var(--accent-blue)' }} />
              </div>
              <h2 className="text-4xl font-extrabold theme-text">{weather.temperature}°C</h2>
            </div>
          </div>

          {weather.solar_impact && (
            <div className="rounded-xl p-3 mb-4 text-xs text-center" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="theme-text-secondary leading-relaxed">{weather.solar_impact}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="flex items-center gap-2 rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <Droplets className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
              <div><p className="text-xs theme-text-muted">Humidity</p><p className="text-sm font-semibold theme-text">{weather.humidity}%</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl p-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <Wind className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
              <div><p className="text-xs theme-text-muted">Cloud</p><p className="text-sm font-semibold theme-text">{weather.cloud_cover}%</p></div>
            </div>
          </div>
          {weather.generation_outlook && (
            <div className="rounded-xl p-3 mt-3 text-center" style={{ backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <p className="text-xs font-semibold theme-text">Generation Outlook: {weather.generation_outlook}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Cloud className="w-10 h-10 mx-auto mb-2 theme-text-muted" />
            <p className="theme-text-muted text-sm">No weather data</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        <Link to="/weather" className="text-xs block text-center" style={{ color: 'var(--accent-emerald)' }}>View full weather &rarr;</Link>
      </div>
    </div>
  );
}