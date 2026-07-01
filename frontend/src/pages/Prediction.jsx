import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { predictionApi, weatherApi } from '../api';
import { toast } from 'react-toastify';
import TimeAgo from '../utils/TimeAgo';
import {
  Loader2, Zap, TrendingUp, Activity, Sun, Cloud, Thermometer, Droplets,
  Wind, Clock, Battery, Cpu, AlertTriangle, Download, Trash2, ChevronDown,
  ChevronUp, Info, Gauge, Calendar, MapPin, PanelTop, ExternalLink, Search, Navigation
} from 'lucide-react';

const SectionCard = ({ title, icon: Icon, color, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 transition-colors hover:bg-white/5" style={{ borderBottom: open ? '1px solid var(--border-color)' : 'none' }}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}><Icon className="w-5 h-5 text-white" /></div>
          <h3 className="text-base font-bold theme-text">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 theme-text-muted" /> : <ChevronDown className="w-4 h-4 theme-text-muted" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
};

const StatBox = ({ label, value, sub, color }) => (
  <div className="rounded-xl p-4 text-center" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
    <p className="text-xs theme-text-muted mb-1">{label}</p>
    <p className={`text-xl font-bold ${color || 'theme-text'}`}>{value ?? '\u2014'}</p>
    {sub && <p className="text-xs theme-text-muted mt-0.5">{sub}</p>}
  </div>
);

const Badge = ({ label, variant }) => {
  const styles = {
    excellent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    good: 'bg-green-500/10 text-green-400 border-green-500/20',
    moderate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    normal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const key = (variant || 'normal').toLowerCase().replace(/\s+/g, '');
  const cls = styles[key] || styles.normal;
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-lg border ${cls}`}>{label}</span>;
};

const TimelineChart = ({ data }) => {
  if (!data || !data.labels || !data.values) return null;
  const max = Math.max(...data.values, 0.01);
  return (
    <div className="mt-4">
      <div className="flex items-end gap-1 h-32" style={{ borderBottom: '1px solid var(--border-color)' }}>
        {data.labels.map((label, i) => {
          const h = (data.values[i] / max) * 100;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] theme-text-muted">{data.values[i].toFixed(1)}</span>
              <div
                className="w-full rounded-t transition-all duration-500"
                style={{ height: `${Math.max(h, 2)}%`, background: 'var(--gradient-emerald)', opacity: 0.7 + (h / 100) * 0.3 }}
              />
              <span className="text-[10px] theme-text-muted -rotate-45 origin-left whitespace-nowrap">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ApplianceTable = ({ appliances }) => {
  if (!appliances || appliances.length === 0) return <p className="theme-text-muted text-sm">No appliance data available</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            <th className="text-left px-3 py-2 font-medium theme-text-muted">Appliance</th>
            <th className="text-center px-3 py-2 font-medium theme-text-muted">Watts</th>
            <th className="text-center px-3 py-2 font-medium theme-text-muted">Status</th>
            <th className="text-right px-3 py-2 font-medium theme-text-muted">Duration</th>
          </tr>
        </thead>
        <tbody>
          {appliances.map((a, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
              <td className="px-3 py-2.5 theme-text">{a.name}</td>
              <td className="px-3 py-2.5 text-center theme-text-muted">{a.watts}</td>
              <td className="px-3 py-2.5 text-center">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${a.can_run === 'Yes' ? 'text-emerald-400 bg-emerald-500/10' : a.can_run === 'Limited' ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {a.can_run}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right theme-text-muted text-xs">{a.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Prediction() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState({ history: true, submitting: false, detecting: false, fetching: false, geocoding: false });
  const [showForm, setShowForm] = useState(true);
  const [coords, setCoords] = useState(null);
  const [cityInput, setCityInput] = useState('');
  const [geoResults, setGeoResults] = useState([]);

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
      temperature: 30, humidity: 50, cloud_cover: 20, solar_irradiance: 800,
      wind_speed: 5, time: '12:00',
      panel_capacity: 5.0, panel_type: 'Monocrystalline', panel_count: 1,
      installation_angle: 30, battery_capacity: 5.0, battery_current: 2.1,
      location: '',
    },
  });

  const loadHistory = useCallback(async () => {
    setLoading(h => ({ ...h, history: true }));
    try {
      const res = await predictionApi.list();
      if (res.success) setHistory(res.data?.predictions || []);
    } catch {} finally { setLoading(h => ({ ...h, history: false })); }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.warn('Geolocation not supported by your browser');
      return;
    }
    setLoading(h => ({ ...h, detecting: true }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lon: longitude });
        setValue('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        toast.success('Location detected');

        setLoading(h => ({ ...h, fetching: true }));
        try {
          const res = await weatherApi.fetch(latitude, longitude);
          if (res.success) {
            const w = res.data;
            setValue('temperature', w.temperature ?? 30);
            setValue('humidity', Math.round(w.humidity ?? 50));
            setValue('cloud_cover', Math.round(w.cloud_cover ?? 20));
            setValue('wind_speed', w.wind_speed ?? 5);
            toast.success('Weather data fetched for your location');
          }
        } catch (e) {
          toast.warn('Could not auto-fetch weather. Enter values manually.');
        }
        setLoading(h => ({ ...h, detecting: false, fetching: false }));
      },
      (err) => {
        toast.error('Location access denied or unavailable');
        setLoading(h => ({ ...h, detecting: false }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchWeatherFromCoords = async () => {
    if (!coords) {
      toast.warn('Detect your location first');
      return;
    }
    setLoading(h => ({ ...h, fetching: true }));
    try {
      const res = await weatherApi.fetch(coords.lat, coords.lon);
      if (res.success) {
        const w = res.data;
        setValue('temperature', w.temperature ?? 30);
        setValue('humidity', Math.round(w.humidity ?? 50));
        setValue('cloud_cover', Math.round(w.cloud_cover ?? 20));
        setValue('wind_speed', w.wind_speed ?? 5);
        toast.success('Weather updated');
      }
    } catch (e) {
      toast.error('Failed to fetch weather');
    } finally { setLoading(h => ({ ...h, fetching: false })); }
  };

  const searchCity = async () => {
    if (!cityInput.trim()) return;
    setLoading(h => ({ ...h, geocoding: true }));
    try {
      const res = await weatherApi.geocode(cityInput.trim());
      if (res.success) {
        const results = res.data?.results || [];
        setGeoResults(results);
        if (results.length === 0) toast.warn('City not found');
        else if (results.length === 1) selectGeoResult(results[0]);
      }
    } catch (e) {
      toast.error('Geocoding failed');
    } finally { setLoading(h => ({ ...h, geocoding: false })); }
  };

  const selectGeoResult = async (loc) => {
    setCoords({ lat: loc.lat, lon: loc.lon });
    setValue('location', loc.display_name);
    setGeoResults([]);
    setCityInput('');
    toast.success(`Selected: ${loc.display_name}`);

    setLoading(h => ({ ...h, fetching: true }));
    try {
      const res = await weatherApi.fetch(loc.lat, loc.lon);
      if (res.success) {
        const w = res.data;
        setValue('temperature', w.temperature ?? 30);
        setValue('humidity', Math.round(w.humidity ?? 50));
        setValue('cloud_cover', Math.round(w.cloud_cover ?? 20));
        setValue('wind_speed', w.wind_speed ?? 5);
        toast.success('Weather fetched for ' + loc.display_name.split(',')[0]);
      }
    } catch (e) {
      toast.warn('Weather data not available, enter manually');
    } finally { setLoading(h => ({ ...h, fetching: false })); }
  };

  const onSubmit = async (form) => {
    setLoading(h => ({ ...h, submitting: true }));
    try {
      const payload = {
        date: new Date().toISOString().split('T')[0],
        time: form.time,
        temperature: form.temperature,
        humidity: form.humidity,
        cloud_cover: form.cloud_cover,
        solar_irradiance: form.solar_irradiance,
        wind_speed: form.wind_speed,
        panel_capacity: form.panel_capacity,
        panel_type: form.panel_type,
        panel_count: form.panel_count,
        installation_angle: form.installation_angle,
        battery_capacity: form.battery_capacity,
        battery_current: form.battery_current,
        location: form.location,
      };
      const res = await predictionApi.create(payload);
      if (res.success) {
        setResult(res.data);
        toast.success(`Prediction ${res.data.prediction_id} generated!`);
        loadHistory();
      } else {
        toast.error(res.message || 'Prediction failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Cannot connect to prediction service.');
    } finally { setLoading(h => ({ ...h, submitting: false })); }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold theme-text">Smart Solar Decision Center</h1>
          <p className="theme-text-secondary mt-1">Transform environmental data into practical energy planning decisions.</p>
        </div>
        <div className="flex gap-2">
          {result && (
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent-emerald)', border: '1px solid var(--border-color)' }}>
              <Download className="w-4 h-4" /> Export Report
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all" style={{ backgroundColor: showForm ? 'var(--accent-emerald-bg)' : 'var(--bg-tertiary)', color: 'var(--accent-emerald)', border: '1px solid var(--nav-active-border)' }}>
            <Sun className="w-4 h-4" /> {showForm ? 'Hide Form' : 'New Prediction'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        {showForm && (
          <div className="lg:col-span-2 rounded-2xl p-6 h-fit" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <h3 className="text-lg font-bold theme-text mb-5 flex items-center gap-2">
              <Gauge className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} />
              Prediction Inputs
            </h3>

            {/* Location Section */}
            <div className="mb-5 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p className="text-xs font-semibold theme-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Location / Weather
              </p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={detectLocation}
                  disabled={loading.detecting}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all text-white" style={{ background: 'var(--gradient-emerald)' }}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {loading.detecting ? 'Detecting...' : 'Detect My Location'}
                </button>
                {coords && (
                  <button
                    onClick={fetchWeatherFromCoords}
                    disabled={loading.fetching}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent-emerald)', border: '1px solid var(--border-color)' }}
                  >
                    <Cloud className="w-3.5 h-3.5" />
                    {loading.fetching ? 'Fetching...' : 'Fetch Weather'}
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={cityInput}
                  onChange={e => setCityInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchCity()}
                  className="flex-1 px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-emerald-500"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <button
                  onClick={searchCity}
                  disabled={loading.geocoding}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--accent-emerald)', border: '1px solid var(--border-color)' }}
                >
                  <Search className="w-3.5 h-3.5" />
                  {loading.geocoding ? '...' : 'Search'}
                </button>
              </div>
              {geoResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {geoResults.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => selectGeoResult(loc)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:bg-white/5"
                      style={{ border: '1px solid var(--border-color)' }}
                    >
                      <span className="theme-text">{loc.display_name}</span>
                      <span className="theme-text-muted ml-2">({loc.lat.toFixed(3)}, {loc.lon.toFixed(3)})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <p className="text-xs font-semibold theme-text-muted uppercase tracking-wide mb-3">Environmental</p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Temperature (\u00b0C)" name="temperature" min={-10} max={60} step="0.1" register={register} error={errors.temperature} icon={Thermometer} />
                  <InputField label="Humidity (%)" name="humidity" min={0} max={100} step="1" register={register} error={errors.humidity} icon={Droplets} />
                  <InputField label="Cloud Cover (%)" name="cloud_cover" min={0} max={100} step="1" register={register} error={errors.cloud_cover} icon={Cloud} />
                  <InputField label="Irradiance (W/m\u00b2)" name="solar_irradiance" min={0} max={1200} step="1" register={register} error={errors.solar_irradiance} icon={Sun} />
                  <InputField label="Wind Speed (km/h)" name="wind_speed" min={0} max={100} step="0.1" register={register} error={errors.wind_speed} icon={Wind} />
                  <InputField label="Time" name="time" type="time" register={register} icon={Clock} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold theme-text-muted uppercase tracking-wide mb-3">Solar System</p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Panel Capacity (kW)" name="panel_capacity" min={0.1} max={20} step="0.1" register={register} icon={PanelTop} />
                  <InputField label="Panel Count" name="panel_count" min={1} max={100} step="1" register={register} icon={PanelTop} />
                  <div>
                    <label className="block text-xs theme-text-muted mb-1">Panel Type</label>
                    <select className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} {...register('panel_type')}>
                      <option>Monocrystalline</option>
                      <option>Polycrystalline</option>
                      <option>Thin Film</option>
                      <option>Bifacial</option>
                    </select>
                  </div>
                  <InputField label="Angle (\u00b0)" name="installation_angle" min={0} max={90} step="1" register={register} icon={MapPin} />
                  <InputField label="Battery Capacity (kWh)" name="battery_capacity" min={0} max={100} step="0.1" register={register} icon={Battery} />
                  <InputField label="Battery Current (kWh)" name="battery_current" min={0} max={100} step="0.1" register={register} icon={Battery} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading.submitting}
                className="w-full flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-70 transition-all" style={{ background: 'var(--gradient-emerald)' }}
              >
                {loading.submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading.submitting ? 'Analyzing...' : 'Run Solar Analysis'}
              </button>
            </form>
          </div>
        )}

        {/* Right: Results */}
        <div className={`${showForm ? 'lg:col-span-3' : 'lg:col-span-5'} space-y-6`}>
          {/* Loading */}
          {loading.submitting && (
            <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" style={{ color: 'var(--accent-emerald)' }} />
              <p className="theme-text-muted">Running comprehensive solar analysis...</p>
            </div>
          )}

          {/* Result: Main Prediction Card */}
          {result && !loading.submitting && (
            <>
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--nav-active-border)', backgroundImage: 'linear-gradient(135deg, var(--accent-emerald-bg) 0%, transparent 50%)' }}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Zap className="w-6 h-6" style={{ color: 'var(--accent-emerald)' }} />
                      <h2 className="text-xl font-bold theme-text">Expected Solar Generation</h2>
                    </div>
                    <p className="text-xs theme-text-muted">
                      {result.prediction_id} &middot; <TimeAgo date={new Date().toISOString()} />
                    </p>
                  </div>
                  <Badge label={result.generation_status} variant={result.generation_status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <StatBox label="Predicted Output" value={`${result.predicted_output ?? '\u2014'} kW`} color="text-emerald-400" sub={`${result.daily_forecast ?? '\u2014'} kWh/day`} />
                  <StatBox label="Confidence" value={`${result.confidence ?? '\u2014'}%`} color="text-blue-400" />
                  <StatBox label="Efficiency" value={`${result.expected_efficiency ?? '\u2014'}%`} color="text-purple-400" />
                  <StatBox label="Weather" value={result.weather_condition || 'Sunny'} color="text-amber-400" />
                </div>

                {result.curve_data && <TimelineChart data={result.curve_data} />}
              </div>

              {/* Energy Status */}
              <SectionCard title="Energy Availability" icon={Battery} color="bg-blue-500/20" defaultOpen={true}>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatBox label="Predicted Generation" value={`${result.predicted_output} kW`} color="text-emerald-400" />
                  <StatBox label="Current Battery" value={`${result.current_battery} kWh`} color="text-blue-400" />
                  <StatBox label="Total Available" value={`${result.total_available} kWh`} color="text-yellow-400" sub={result.energy_availability} />
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--accent-emerald)' }} />
                    <p className="text-sm theme-text-secondary leading-relaxed">{result.energy_insight}</p>
                  </div>
                </div>
              </SectionCard>

              {/* Recommended Appliances */}
              <SectionCard title="Recommended Appliances" icon={Cpu} color="bg-emerald-500/20" defaultOpen={true}>
                <div className="mb-4 flex items-center gap-3">
                  <Clock className="w-4 h-4" style={{ color: 'var(--accent-emerald)' }} />
                  <p className="text-sm theme-text-secondary">
                    Best Usage Window: <strong className="theme-text">{result.recommended_start} \u2014 {result.recommended_end}</strong>
                  </p>
                </div>
                <ApplianceTable appliances={result.appliances} />
                {result.suitable_appliance_load && (
                  <div className="mt-3 rounded-xl p-3 text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    <span className="theme-text-muted">Recommended load: </span>
                    <span className="theme-text font-medium">{result.suitable_appliance_load}</span>
                  </div>
                )}
              </SectionCard>

              {/* Weather Impact */}
              <SectionCard title="Weather Impact Analysis" icon={Cloud} color="bg-amber-500/20" defaultOpen={true}>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <StatBox label="Impact Level" value={result.weather_impact || '\u2014'} color="text-amber-400" />
                  <StatBox label="Reliability" value={result.weather_reliability || '\u2014'} color="text-emerald-400" />
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <p className="text-sm theme-text-secondary leading-relaxed">{result.weather_explanation}</p>
                </div>
              </SectionCard>

              {/* Efficiency Analysis */}
              <SectionCard title="Efficiency Analysis" icon={TrendingUp} color="bg-purple-500/20" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <StatBox label="Predicted Output" value={`${result.predicted_output} kW`} color="text-emerald-400" />
                  <StatBox label="Efficiency Score" value={result.efficiency_score != null ? `${result.efficiency_score}%` : 'Monitoring pending'} color={result.efficiency_performance === 'Excellent' ? 'text-emerald-400' : 'text-amber-400'} sub={result.efficiency_performance} />
                </div>
                {!result.actual_output && (
                  <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    <p className="theme-text-muted">
                      Actual output monitoring will be available once solar generation data is recorded. Efficiency is calculated by comparing actual vs predicted output.
                    </p>
                  </div>
                )}
              </SectionCard>

              {/* Maintenance Analysis */}
              <SectionCard title="Maintenance Status" icon={AlertTriangle} color={result.maintenance_status === 'Normal' ? 'bg-emerald-500/20' : 'bg-amber-500/20'} defaultOpen={false}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge label={result.maintenance_status} variant={result.maintenance_status} />
                </div>
                {result.maintenance_causes && (
                  <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    <p className="text-xs font-semibold theme-text-muted mb-2">Possible Causes</p>
                    <p className="text-sm theme-text">{result.maintenance_causes}</p>
                  </div>
                )}
                <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <p className="text-xs font-semibold theme-text-muted mb-2">Recommendation</p>
                  <p className="text-sm theme-text-secondary">{result.maintenance_recommendation}</p>
                </div>
              </SectionCard>

              {/* Recommendation */}
              {result.recommendation && (
                <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--nav-active-border)' }}>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent-emerald)' }} />
                    <div>
                      <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--accent-emerald)' }}>Decision Recommendation</p>
                      <p className="theme-text-secondary text-sm leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty state */}
          {!result && !loading.submitting && (
            <div className="rounded-2xl p-16 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <Zap className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-xl font-bold theme-text mb-2">Ready for Solar Analysis</h3>
              <p className="theme-text-muted max-w-lg mx-auto text-sm">
                Enter environmental conditions and your solar system details, then run the analysis to receive a complete energy decision report.
              </p>
            </div>
          )}

          {/* Prediction History */}
          <SectionCard title="Prediction History" icon={Calendar} color="bg-cyan-500/20" defaultOpen={true}>
            {loading.history ? (
              <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-emerald)' }} /></div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">ID</th>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">Date</th>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">Output</th>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">Status</th>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">Availability</th>
                      <th className="text-left px-3 py-2 font-medium theme-text-muted">Confidence</th>
                      <th className="text-right px-3 py-2 font-medium theme-text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((p, i) => (
                      <tr key={p.id || i} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover:bg-white/5">
                        <td className="px-3 py-2.5 theme-text-muted text-xs">{p.prediction_id || `#${p.id}`}</td>
                        <td className="px-3 py-2.5 theme-text-muted text-xs">{p.date} {p.time}</td>
                        <td className="px-3 py-2.5 font-semibold text-xs" style={{ color: 'var(--accent-emerald)' }}>{p.predicted_output} kW</td>
                        <td className="px-3 py-2.5"><Badge label={p.generation_status || '\u2014'} variant={p.generation_status} /></td>
                        <td className="px-3 py-2.5 theme-text-secondary text-xs">{p.energy_availability || '\u2014'}</td>
                        <td className="px-3 py-2.5 theme-text-secondary text-xs">{p.confidence_score ?? '\u2014'}%</td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={async () => {
                              if (confirm('Delete this prediction?')) {
                                try {
                                  await predictionApi.delete(p.id);
                                  toast.success('Prediction deleted');
                                  loadHistory();
                                } catch { toast.error('Delete failed'); }
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="theme-text-muted text-sm text-center py-6">No predictions saved yet. Run your first solar analysis above.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

const InputField = ({ label, name, type = 'number', min, max, step = '0.1', register, error, icon: Icon }) => (
  <div>
    <label className="block text-xs theme-text-muted mb-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />}
      {type === 'time' ? (
        <input type="time" className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500" style={{ backgroundColor: 'var(--bg-input)', borderColor: error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)', color: 'var(--text-primary)' }} {...register(name)} />
      ) : (
        <input type={type} step={step} min={min} max={max} className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 ${Icon ? 'pl-9' : ''}`} style={{ backgroundColor: 'var(--bg-input)', borderColor: error ? 'rgba(239,68,68,0.5)' : 'var(--border-color)', color: 'var(--text-primary)' }} {...register(name, min != null ? { valueAsNumber: true } : {})} />
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-400">Required</p>}
  </div>
);
