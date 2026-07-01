import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Sun, Zap, TrendingUp, Cloud, Battery, BarChart3,
  Activity, Gauge, Thermometer, Wind
} from 'lucide-react';

// Animated floating dashboard mockup
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow blobs */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0EA5E9, transparent)' }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0F766E, transparent)' }}
      />

      {/* Main dashboard card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl p-5 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(12,24,41,0.98), rgba(6,15,26,0.99))',
          border: '1px solid rgba(14,165,233,0.18)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.06) inset',
        }}
      >
        {/* Dashboard header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-solar-textMuted font-medium">Solar Performance</p>
            <p className="text-lg font-bold text-white">Today's Overview</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-solar-greenLight rounded-full animate-pulse" />
            <span className="text-xs text-solar-greenLight font-medium">Live</span>
          </div>
        </div>

        {/* Metric cards row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: Sun, label: 'Generation', value: '42.6', unit: 'kWh', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
            { icon: Zap, label: 'Consumption', value: '18.3', unit: 'kWh', color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },
            { icon: Battery, label: 'Efficiency', value: '94', unit: '%', color: '#14B8A6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
            >
              <item.icon className="w-4 h-4 mb-2" style={{ color: item.color }} />
              <p className="text-lg font-bold text-white leading-none">
                {item.value}<span className="text-xs ml-0.5 font-normal" style={{ color: item.color }}>{item.unit}</span>
              </p>
              <p className="text-xs text-solar-textMuted mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)' }}
        >
          <div className="flex items-end gap-1 h-16">
            {[35, 55, 45, 70, 85, 78, 90, 82, 65, 50, 42, 38].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05 + 0.5, duration: 0.6, ease: 'easeOut' }}
                className="flex-1 rounded-t-sm"
                style={{
                  background: i === 7
                    ? 'linear-gradient(to top, #0F766E, #14B8A6)'
                    : 'linear-gradient(to top, rgba(14,165,233,0.4), rgba(14,165,233,0.2))',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {['6am', '9am', '12pm', '3pm', '6pm', 'Now'].map((t) => (
              <span key={t} className="text-[10px] text-solar-textDim">{t}</span>
            ))}
          </div>
        </div>

        {/* Weather & status row */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}
          >
            <Cloud className="w-5 h-5 text-solar-gold" />
            <div>
              <p className="text-xs text-solar-textMuted">Weather</p>
              <p className="text-sm font-semibold text-white">Partly Sunny</p>
              <p className="text-xs text-solar-gold">28°C · 85% solar</p>
            </div>
          </div>
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.12)' }}
          >
            <TrendingUp className="w-5 h-5 text-solar-greenLight" />
            <div>
              <p className="text-xs text-solar-textMuted">Revenue</p>
              <p className="text-sm font-semibold text-white">₹ 1,248</p>
              <p className="text-xs text-solar-greenLight">+14.2% today</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badge cards */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -left-8 top-1/3 rounded-xl px-4 py-3 shadow-xl hidden lg:flex items-center gap-2.5"
        style={{
          background: 'rgba(12,24,41,0.95)',
          border: '1px solid rgba(15,118,110,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(15,118,110,0.2)' }}>
          <Activity className="w-4 h-4 text-solar-greenLight" />
        </div>
        <div>
          <p className="text-xs text-solar-textMuted">System Health</p>
          <p className="text-sm font-bold text-white">Optimal</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -right-8 top-1/4 rounded-xl px-4 py-3 shadow-xl hidden lg:flex items-center gap-2.5"
        style={{
          background: 'rgba(12,24,41,0.95)',
          border: '1px solid rgba(14,165,233,0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(14,165,233,0.15)' }}>
          <BarChart3 className="w-4 h-4 text-solar-blueLight" />
        </div>
        <div>
          <p className="text-xs text-solar-textMuted">Analytics</p>
          <p className="text-sm font-bold text-white">Live Data</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-6 bottom-1/4 rounded-xl px-4 py-3 shadow-xl hidden lg:flex items-center gap-2.5"
        style={{
          background: 'rgba(12,24,41,0.95)',
          border: '1px solid rgba(245,158,11,0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
          <Gauge className="w-4 h-4 text-solar-gold" />
        </div>
        <div>
          <p className="text-xs text-solar-textMuted">Efficiency</p>
          <p className="text-sm font-bold text-white">94.2%</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16"
      style={{ background: '#020B14' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 solar-grid-bg opacity-100" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.12), transparent), radial-gradient(ellipse 60% 50% at 80% 40%, rgba(15,118,110,0.1), transparent), radial-gradient(ellipse 50% 40% at 20% 60%, rgba(245,158,11,0.06), transparent)',
        }}
      />

      <div className="solar-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5"
            >
              <span className="solar-badge">
                <Sun className="w-3.5 h-3.5" />
                Smart Solar Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[1.1] mb-6"
              style={{ color: '#F1F5F9' }}
            >
              Smart Solar Intelligence{' '}
              <span className="solar-gradient-text block mt-1">
                for Better Energy
              </span>
              Decisions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: '#94A3B8' }}
            >
              Monitor solar performance, analyze energy trends, optimize appliance usage, 
              and gain valuable insights through an intelligent web platform built for 
              modern solar users.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link to="/register" className="solar-btn-primary" id="hero-get-started">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                className="solar-btn-secondary"
                onClick={() => {
                  const el = document.querySelector('#features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                id="hero-explore-features"
              >
                Explore Features
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { label: 'Solar Records', value: '10K+' },
                { label: 'Reports Generated', value: '2K+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-solar-textMuted">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #020B14, transparent)' }}
      />
    </section>
  );
}
