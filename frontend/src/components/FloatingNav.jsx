import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const userPages = [
  '/dashboard', '/analytics', '/prediction', '/simulation',
  '/weather', '/reports', '/recommendations', '/maintenance',
  '/notifications', '/profile', '/settings',
];

const adminPages = [
  '/admin/dashboard', '/admin/users', '/admin/activity', '/admin/solar-records',
  '/admin/predictions', '/admin/reports', '/admin/weather',
  '/admin/system', '/admin/notifications', '/admin/settings',
];

const publicPages = ['/', '/login', '/register'];

export default function FloatingNav() {
  const navigate = useNavigate();
  const location = useLocation();

  let pages;
  if (location.pathname.startsWith('/admin')) {
    pages = adminPages;
  } else if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    pages = publicPages;
  } else {
    pages = userPages;
  }

  const idx = pages.indexOf(location.pathname);
  if (idx === -1) return null;

  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx < pages.length - 1 ? pages[idx + 1] : null;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50">
      {prev && (
        <button onClick={() => navigate(prev)} className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }} title="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {next && (
        <button onClick={() => navigate(next)} className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--accent-emerald)' }} title="Next">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
