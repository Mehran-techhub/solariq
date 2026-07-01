import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#comparison' },
  { label: 'Analytics', href: '#stats' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (label, href) => {
    setActive(label);
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2 backdrop-blur-2xl'
            : 'py-4'
        }`}
        style={{
          background: scrolled
            ? 'rgba(2,11,20,0.92)'
            : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(14,165,233,0.08)' : 'none',
        }}
      >
        <div className="solar-container flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="SolarIQ Home">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
                boxShadow: '0 4px 14px rgba(15,118,110,0.4)',
              }}
            >
              <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold font-display text-white">
              Solar<span className="solar-gradient-text">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.label, link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === link.label
                    ? 'text-solar-blueLight bg-solar-blue/10'
                    : 'text-solar-textMuted hover:text-white hover:bg-white/5'
                }`}
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="solar-btn-secondary text-sm px-5 py-2.5"
              id="nav-login-btn"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="solar-btn-primary text-sm px-5 py-2.5"
              id="nav-register-btn"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-solar-textMuted hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-4 right-4 z-40 rounded-2xl p-4 shadow-2xl md:hidden"
            style={{
              background: 'rgba(6,15,26,0.97)',
              border: '1px solid rgba(14,165,233,0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.label, link.href)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                    active === link.label
                      ? 'text-solar-blueLight bg-solar-blue/10'
                      : 'text-solar-textMuted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="solar-btn-secondary flex-1 text-sm py-2.5 justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="solar-btn-primary flex-1 text-sm py-2.5 justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
