import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { Sun, LayoutDashboard, Users, Zap, FileText, LineChart, Bell, Activity, CloudSun, Settings2, Shield, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TimeAgo from '../../utils/TimeAgo';

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/activity', label: 'Activity Logs', icon: Activity },
  { to: '/admin/solar-records', label: 'Solar Records', icon: Zap },
  { to: '/admin/predictions', label: 'Predictions', icon: LineChart },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/weather', label: 'Weather API', icon: CloudSun },
  { to: '/admin/system', label: 'System Status', icon: Shield },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings2 },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef(null);
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarUrl = (user?.profile_image && !imgError) ? `${import.meta.env.VITE_API_URL || ''}${user.profile_image}` : null;

  useEffect(() => { setImgError(false); }, [user?.profile_image]);

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <aside className="w-64 flex-shrink-0 border-r p-4 flex flex-col hidden lg:flex" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
        <Link to="/admin/dashboard" className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-lg"><Shield className="w-6 h-6" /></div>
          <span className="font-display font-bold text-xl">Solar<span className="text-amber-400">IQ</span><span className="text-xs text-amber-500 ml-1">Admin</span></span>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `cryp-nav-link ${isActive ? 'active' : ''}`}>
              <Icon className="w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-3 mt-3 space-y-1" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Link to="/dashboard" className="cryp-nav-link" style={{ color: 'var(--text-secondary)' }}><Sun className="w-5 h-5" /> Switch to User View</Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)', backdropFilter: 'blur(12px)' }}>
          <div className="lg:hidden flex items-center gap-2"><Shield className="w-6 h-6 text-amber-400" /><span className="font-display font-bold theme-text">SolarIQ Admin</span></div>
          <p className="hidden lg:block text-sm" style={{ color: 'var(--text-secondary)' }}>Platform Administration & Monitoring</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/notifications" className="p-2 rounded-lg hover:bg-white/5 relative" style={{ color: 'var(--text-secondary)' }}><Bell className="w-5 h-5" /></Link>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden" style={{ backgroundColor: avatarUrl ? 'transparent' : 'rgba(245,158,11,0.2)', border: avatarUrl ? 'none' : '1px solid rgba(245,158,11,0.4)', color: '#FBBF24' }}>
                  {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} /> : initials}
                </div>
                <span className="hidden sm:block text-sm font-medium theme-text">{user?.full_name}</span>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl z-50 overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-sm font-medium theme-text">{user?.full_name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                    <span className="text-xs font-semibold mt-1 block" style={{ color: 'var(--accent-amber)' }}>Admin</span>
                    {user?.last_login && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-dot)' }}></div>
                        Last login: <TimeAgo date={user.last_login} />
                      </div>
                    )}
                  </div>
                  <div className="p-1">
                    <Link to="/admin/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--bg-hover)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                      <Settings2 className="w-4 h-4" /> Settings
                    </Link>
                    <hr style={{ borderColor: 'var(--border-color)' }} />
                    <button onClick={() => { setDropdownOpen(false); logout(); navigate('/login'); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto custom-scrollbar" style={{ backgroundImage: 'var(--hero-glow)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}