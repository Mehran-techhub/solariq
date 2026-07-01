import { useEffect, useState } from 'react';
import { weatherApi } from '../api';
import { toast } from 'react-toastify';
import { Cloud, Droplets, Wind, Thermometer, Sun, RefreshCw, Loader2, Sunrise, Sunset, Clock, MapPin, KeyRound } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const WeatherField = ({ icon: Icon, label, value, color }) => (
  <div className="bg-[#111823] border border-white/5 rounded-xl p-4 flex items-center gap-4">
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-bold text-white mt-0.5">{value ?? '\u2014'}</p>
    </div>
  </div>
);

export default function Weather() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.latest();
      if (res.success) {
        setItems(res.data?.items || []);
        setLastSync(res.data?.last_sync || null);
      }
    } catch {
      setError('Failed to load weather data.');
    } finally {
      setLoading(false);
    }
  };

  const checkSyncStatus = async () => {
    try {
      const res = await weatherApi.syncStatus();
      if (res.success) {
        setApiKeyConfigured(res.data?.api_key_configured);
      }
    } catch {}
  };

  useEffect(() => {
    load();
    checkSyncStatus();
  }, []);

  const fetchLive = async () => {
    setFetching(true);
    setError('');
    try {
      let lat = 33.6844, lon = 73.0479, geoMsg = null;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
          });
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch (geoErr) {
          if (geoErr.code === 1) geoMsg = 'Location denied. Using default coordinates.';
          else if (geoErr.code === 2) geoMsg = 'Location unavailable. Using default coordinates.';
          else geoMsg = 'Location timed out. Using default coordinates.';
        }
      }
      const res = await weatherApi.fetch(lat, lon);
      if (res.success) {
        await load();
        await checkSyncStatus();
        toast.success('Weather data fetched successfully!');
        if (geoMsg) toast.warning(geoMsg);
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to fetch weather.';
      setError(msg);
      toast.error(msg);
    } finally {
      setFetching(false);
    }
  };

  const latest = items[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-3">
            OpenWeather API
          </span>
          <h1 className="text-3xl font-bold text-white">Weather Module</h1>
          <p className="text-gray-400 mt-1">Real-time environmental data that directly impacts solar generation.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSync && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Last sync: <TimeAgo date={lastSync} /></span>
            </span>
          )}
          <button onClick={fetchLive} disabled={fetching || apiKeyConfigured === false}
            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {fetching ? 'Fetching...' : 'Fetch Live Weather'}
          </button>
        </div>
      </div>

      {error && !apiKeyConfigured && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : latest && apiKeyConfigured !== false ? (
        <>
          <div className="bg-gradient-to-br from-[#0d141e] to-[#111a26] border border-white/5 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
            <div className="text-center">
              <div className="inline-flex p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-4">
                <Sun className="w-16 h-16 text-blue-400" />
              </div>
              <h2 className="text-5xl font-extrabold text-white">{latest.temperature}°C</h2>
              <p className="text-gray-400 mt-2 text-lg capitalize">{latest.weather_condition}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 w-full">
              <WeatherField icon={Droplets} label="Humidity" value={`${latest.humidity}%`} color="bg-blue-500/20" />
              <WeatherField icon={Cloud} label="Cloud Cover" value={`${latest.cloud_cover}%`} color="bg-gray-500/20" />
              <WeatherField icon={Wind} label="Wind Speed" value={`${latest.wind_speed} km/h`} color="bg-cyan-500/20" />
              <WeatherField icon={Thermometer} label="UV Index" value={`${latest.uv_index}`} color="bg-orange-500/20" />
              <WeatherField icon={Sunrise} label="Sunrise" value={latest.sunrise || '\u2014'} color="bg-amber-500/20" />
              <WeatherField icon={Sunset} label="Sunset" value={latest.sunset || '\u2014'} color="bg-purple-500/20" />
            </div>
          </div>

          {latest.solar_impact && (
            <div className="bg-[#0d141e] border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Solar Generation Impact</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{latest.solar_impact}</p>
              {latest.generation_outlook && (
                <span className="inline-block mt-3 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Outlook: {latest.generation_outlook}
                </span>
              )}
            </div>
          )}

          {items.length > 1 && (
            <div className="bg-[#0d141e] border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-lg font-bold text-white">Weather History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Time</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Condition</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Temp</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Humidity</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Cloud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((w, i) => (
                      <tr key={w.id || i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="px-5 py-3.5 text-gray-300">{w.fetched_at ? <TimeAgo date={w.fetched_at} /> : '\u2014'}</td>
                        <td className="px-5 py-3.5 text-gray-300 capitalize">{w.weather_condition}</td>
                        <td className="px-5 py-3.5 text-white font-semibold">{w.temperature}°C</td>
                        <td className="px-5 py-3.5 text-gray-300">{w.humidity}%</td>
                        <td className="px-5 py-3.5 text-gray-300">{w.cloud_cover}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-amber-500/10 border border-amber-500/20">
              <MapPin className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Weather Data Yet</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              Fetch live weather data from OpenWeather to see real-time conditions and their impact on your solar generation.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">1. Get API Key</h4>
                </div>
                <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
                  <li>Go to <span className="text-emerald-400">openweathermap.org</span></li>
                  <li>Create free account</li>
                  <li>Go to API Keys section</li>
                  <li>Copy your API key</li>
                </ol>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h4 className="text-sm font-semibold text-white">2. Configure</h4>
                </div>
                <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
                  <li>Open backend <span className="text-emerald-400">.env</span> file</li>
                  <li>Set <span className="text-emerald-400">OPENWEATHER_API_KEY</span></li>
                  <li>Restart the server</li>
                  <li>Click "Fetch Live Weather"</li>
                </ol>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-left">
              <p className="text-xs text-blue-300 font-mono break-all">
                OPENWEATHER_API_KEY=your_api_key_here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
