import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
import { Sun, LayoutDashboard, LineChart, Zap, Sliders, FileText, CloudSun, Settings2, Wrench, Bell, LogOut, User, Lightbulb, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TimeAgo from '../../utils/TimeAgo';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
  { to: '/prediction', label: 'Prediction', icon: Zap },
  { to: '/simulation', label: 'Simulation', icon: Sliders },
  { to: '/weather', label: 'Weather', icon: CloudSun },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings2 },
];

export default function UserLayout() {
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
        <Link to="/dashboard" className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="p-2 rounded-xl bg-cryp-lime text-cryp-bg shadow-lime">
            <Sun className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl">Solar<span className="text-cryp-lime">IQ</span></span>
        </Link>
        <nav className="flex-1 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `cryp-nav-link ${isActive ? 'active' : ''}`}>
              <Icon className="w-5 h-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-3 mt-3 space-y-1" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-3 px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden" style={{ backgroundColor: avatarUrl ? 'transparent' : 'var(--accent-emerald-bg)', border: avatarUrl ? 'none' : '1px solid var(--nav-active-border)', color: 'var(--accent-emerald)' }}>
              {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" onError={() => setImgError(true)} /> : initials}
            </div>
            <div className="truncate"><p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.full_name}</p><p style={{ color: 'var(--text-muted)' }} className="text-xs">Member</p></div>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border-color)', backdropFilter: 'blur(12px)' }}>
          <div className="lg:hidden flex items-center gap-2"><Sun className="w-6 h-6 text-cryp-lime" /><span className="font-display font-bold theme-text">SolarIQ</span></div>
          <p className="hidden lg:block text-sm" style={{ color: 'var(--text-secondary)' }}>Smart Solar Energy Monitoring & Optimization</p>
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="p-2 rounded-lg hover:bg-white/5 relative" style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-5 h-5" />
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden" style={{ backgroundColor: avatarUrl ? 'transparent' : 'var(--accent-emerald-bg)', border: avatarUrl ? 'none' : '1px solid var(--nav-active-border)', color: 'var(--accent-emerald)' }}>
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
                    {user?.last_login && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--status-dot)' }}></div>
                        Last login: <TimeAgo date={user.last_login} />
                      </div>
                    )}
                    <span className="text-xs font-semibold mt-1 block" style={{ color: 'var(--accent-emerald)' }}>Member</span>
                  </div>
                  <div className="p-1">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--bg-hover)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors" style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.target.style.backgroundColor = 'var(--bg-hover)'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
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