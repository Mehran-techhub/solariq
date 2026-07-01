import { motion } from 'framer-motion';
import {
  Sun, Activity, BarChart3, Zap, ClipboardList, Brain, CheckCircle2
} from 'lucide-react';

const highlights = [
  { icon: Activity, label: 'Smart Monitoring', desc: 'Real-time tracking of solar panel output, consumption, and system health.' },
  { icon: BarChart3, label: 'Data Visualization', desc: 'Interactive charts and dashboards that turn raw data into actionable insights.' },
  { icon: Zap, label: 'Energy Optimization', desc: 'Appliance simulation to maximize usage during peak solar generation hours.' },
  { icon: ClipboardList, label: 'Historical Analysis', desc: 'Deep-dive into historical records to identify trends and improvement areas.' },
  { icon: Brain, label: 'Decision Support', desc: 'Data-driven recommendations to help you make smarter energy decisions.' },
];

// Minimal illustration using SVG/CSS
function SolarIllustration() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full opacity-20"
        style={{ border: '1px dashed rgba(14,165,233,0.4)' }}
      />
      {/* Middle ring */}
      <div
        className="absolute inset-12 rounded-full opacity-30"
        style={{ border: '1px solid rgba(15,118,110,0.4)' }}
      />

      {/* Center node */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-20"
          style={{
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '50%',
          }}
        />
        <div
          className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center relative z-10"
          style={{
            background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
            boxShadow: '0 0 40px rgba(15,118,110,0.4), 0 0 80px rgba(14,165,233,0.2)',
          }}
        >
          <Sun className="w-10 h-10 text-white" strokeWidth={1.5} />
          <span className="text-white text-xs font-bold mt-1">SolarIQ</span>
        </div>
      </div>

      {/* Orbiting nodes */}
      {[
        { Icon: Activity, color: '#14B8A6', angle: 0, label: 'Monitor' },
        { Icon: BarChart3, color: '#0EA5E9', angle: 72, label: 'Analytics' },
        { Icon: Zap, color: '#F59E0B', angle: 144, label: 'Optimize' },
        { Icon: ClipboardList, color: '#38BDF8', angle: 216, label: 'Reports' },
        { Icon: Brain, color: '#818CF8', angle: 288, label: 'Insights' },
      ].map(({ Icon, color, angle, label }) => {
        const rad = (angle * Math.PI) / 180;
        const r = 38; // % from center
        const x = 50 + r * Math.cos(rad);
        const y = 50 + r * Math.sin(rad);
        return (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: angle / 300 }}
            viewport={{ once: true }}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <span className="text-[10px] font-medium whitespace-nowrap" style={{ color: '#64748B' }}>
              {label}
            </span>
          </motion.div>
        );
      })}

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(15,118,110,0.08), transparent 70%)' }}
      />
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative" style={{ background: '#020B14' }}>
      <div className="solar-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SolarIllustration />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="solar-badge mb-6">About SolarIQ</span>

            <h2 className="solar-section-title mb-5">
              One Platform for All Your{' '}
              <span className="solar-gradient-text">Solar Data</span>{' '}
              Needs
            </h2>

            <p className="solar-section-subtitle mb-6">
              SolarIQ is a centralized intelligent web platform designed to transform 
              how solar energy users monitor, analyze, and optimize their solar installations. 
              We exist because traditional solar monitoring tools are fragmented, 
              outdated, and fail to leverage the power of modern data analytics.
            </p>

            <p className="solar-section-subtitle mb-8">
              Our platform consolidates every aspect of solar energy management — 
              from live generation tracking and weather integration to appliance simulation 
              and automated report generation — into a single, beautiful interface.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(15,118,110,0.15)', border: '1px solid rgba(20,184,166,0.2)' }}
                  >
                    <item.icon className="w-4 h-4 text-solar-greenLight" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">{item.label}</p>
                    <p className="text-xs text-solar-textMuted leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
