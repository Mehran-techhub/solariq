import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { settingsApi, profileApi, healthApi, predictionApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { User, Settings2, Activity, Loader2, CheckCircle, XCircle, Save, Globe, Sun, Moon, RefreshCw } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const PAKISTAN_TIMEZONES = [
  { value: 'Asia/Karachi', label: 'Pakistan Standard Time (PKT) — Karachi, Lahore, Islamabad' },
  { value: 'Asia/Karachi_Karachi', label: 'Karachi' },
  { value: 'Asia/Karachi_Lahore', label: 'Lahore' },
  { value: 'Asia/Karachi_Islamabad', label: 'Islamabad / Rawalpindi' },
  { value: 'Asia/Karachi_Faisalabad', label: 'Faisalabad' },
  { value: 'Asia/Karachi_Multan', label: 'Multan' },
  { value: 'Asia/Karachi_Peshawar', label: 'Peshawar' },
  { value: 'Asia/Karachi_Quetta', label: 'Quetta' },
  { value: 'Asia/Karachi_Hyderabad', label: 'Hyderabad' },
  { value: 'Asia/Karachi_Gujranwala', label: 'Gujranwala' },
  { value: 'Asia/Karachi_Sialkot', label: 'Sialkot' },
  { value: 'Asia/Karachi_Sukkur', label: 'Sukkur' },
  { value: 'Asia/Karachi_Gilgit', label: 'Gilgit - GB' },
  { value: 'Asia/Karachi_Muzaffarabad', label: 'Muzaffarabad - AJK' },
  { value: 'Asia/Karachi_Gwadar', label: 'Gwadar - Balochistan' },
];

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'preferences', label: 'Preferences', icon: Settings2 },
  { key: 'system', label: 'System Status', icon: Activity },
];

function StatusRow({ label, status, loading }) {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <span className="text-sm theme-text-secondary">{label}</span>
      {loading ? (
        <Loader2 className="w-4 h-5 animate-spin theme-text-muted" />
      ) : status ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>
          <CheckCircle className="w-3 h-3" /> Online
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <XCircle className="w-3 h-3" /> Offline
        </span>
      )}
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, syncFromBackend } = useTheme();
  const [tab, setTab] = useState('profile');
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState(null);
  const healthIntervalRef = useRef(null);

  const { register: rProf, handleSubmit: hProf, reset: resetProf, formState: { isSubmitting: submittingProf } } = useForm();
  const { register: rPref, handleSubmit: hPref, reset: resetPref, formState: { isSubmitting: submittingPref } } = useForm();

  useEffect(() => {
    if (user) resetProf({ full_name: user.full_name, email: user.email, phone: user.phone || '' });
    settingsApi.get().then(res => {
      if (res.success && res.data) {
        resetPref(res.data);
      }
    }).catch(() => {});
  }, [user, resetProf, resetPref, setTheme]);

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await healthApi.check();
      setHealth(res);
    } catch { setHealth(null); }
    try {
      const model = await predictionApi.status();
      setModelStatus(model?.data || null);
    } catch { setModelStatus(null); }
    finally { setHealthLoading(false); }
  };

  useEffect(() => {
    if (tab === 'system') {
      fetchHealth();
      healthIntervalRef.current = setInterval(fetchHealth, 10000);
      return () => { if (healthIntervalRef.current) clearInterval(healthIntervalRef.current); };
    } else {
      if (healthIntervalRef.current) clearInterval(healthIntervalRef.current);
    }
  }, [tab]);

  const saveProfile = async (data) => {
    try {
      await profileApi.update(data);
      toast.success('Profile updated successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update profile.');
    }
  };

  const savePrefs = async (data) => {
    try {
      if (data.theme !== theme) {
        document.documentElement.classList.remove('light-theme');
        if (data.theme === 'light') document.documentElement.classList.add('light-theme');
      }
      setTheme(data.theme);
      const res = await settingsApi.update(data);
      if (res.success) toast.success('Preferences saved!');
      else toast.error(res.message);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save preferences.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold theme-text">Settings</h1>
        <p className="mt-1 text-sm theme-text-secondary">Manage your profile, preferences, and system status.</p>
      </div>

      <div className="flex gap-1 rounded-xl p-1 w-fit border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'theme-emerald-bg' : 'theme-text-muted hover:theme-text'}`}
            style={{ color: tab === key ? 'var(--accent-emerald)' : undefined }}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold theme-text mb-6">Profile Information</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs mb-1 theme-text-muted">Role</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.role ?? '—'}</p>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs mb-1 theme-text-muted">Joined</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs mb-1 theme-text-muted">Last Login</p>
              <p className="text-sm font-semibold theme-text capitalize">{user?.last_login ? <TimeAgo date={user.last_login} /> : '—'}</p>
            </div>
            <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs mb-1 theme-text-muted">Account ID</p>
              <p className="text-sm font-semibold theme-text capitalize">{`#${user?.id ?? '—'}`}</p>
            </div>
          </div>
          <form onSubmit={hProf(saveProfile)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 theme-text-secondary">Full Name</label>
                <input {...rProf('full_name', { required: true })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 theme-text-secondary">Phone</label>
                <input {...rProf('phone')}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5 theme-text-muted">Email (read-only)</label>
                <input value={user?.email || ''} readOnly
                  className="w-full px-3 py-2.5 rounded-xl text-sm cursor-not-allowed"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <button type="submit" disabled={submittingProf}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60" style={{ background: 'var(--gradient-emerald)' }}>
              {submittingProf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Profile
            </button>
          </form>
        </div>
      )}

      {tab === 'preferences' && (
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold theme-text mb-6">Application Preferences</h2>
          <form onSubmit={hPref(savePrefs)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2 theme-text-secondary">
                {theme === 'light' ? <Sun className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} /> : <Moon className="w-4 h-4 text-blue-400" />}
                Theme
              </label>
              <select {...rPref('theme')}
                className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                <option value="dark">Dark Mode — Elegant & Immersive</option>
                <option value="light">Light Mode — Clean & Professional</option>
              </select>
              <p className="text-xs mt-1 theme-text-muted">Switch between dark and light appearance. Changes apply immediately.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-2 theme-text-secondary">
                <Globe className="w-4 h-4" /> Timezone
              </label>
              <select {...rPref('timezone')}
                className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                {PAKISTAN_TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
              <p className="text-xs mt-1 theme-text-muted">Affects weather data timestamps and scheduling</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 theme-text-secondary">OpenWeather API Key</label>
              <input {...rPref('openweather_api_key')} placeholder="Enter your OpenWeather API key"
                className="w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-emerald-500 transition-all"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              <p className="text-xs mt-1 theme-text-muted">Required for live weather data. Get a free key at openweathermap.org</p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...rPref('notifications')} className="accent-emerald-500 w-4 h-4" />
                <span className="text-sm theme-text-secondary">Enable push notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...rPref('email_alerts')} className="accent-emerald-500 w-4 h-4" />
                <span className="text-sm theme-text-secondary">Receive email alerts</span>
              </label>
            </div>
            <button type="submit" disabled={submittingPref}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60" style={{ background: 'var(--gradient-emerald)' }}>
              {submittingPref ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Preferences
            </button>
          </form>
        </div>
      )}

      {tab === 'system' && (
        <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold theme-text">System Status</h2>
            <button onClick={fetchHealth} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all" style={{ color: 'var(--accent-emerald)', backgroundColor: 'var(--accent-emerald-bg)', border: '1px solid var(--nav-active-border)' }}>
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          <div className="text-xs theme-text-muted mb-4">Auto-refreshes every 10 seconds</div>
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            <StatusRow label="Backend Server" status={!!health} loading={healthLoading} />
            <StatusRow label="Database Connection" status={health?.data?.database === 'connected'} loading={healthLoading} />
            <StatusRow label="Prediction Service" status={health?.data?.prediction_service_ready ?? false} loading={healthLoading} />
            <StatusRow label="Weather API" status={health?.data?.weather_api_ready ?? false} loading={healthLoading} />
            <StatusRow label="ML Model" status={modelStatus?.status === 'Active'} loading={healthLoading} />
          </div>
        </div>
      )}
    </div>
  );
}