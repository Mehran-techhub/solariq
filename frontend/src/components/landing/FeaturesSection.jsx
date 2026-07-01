import { motion } from 'framer-motion';
import {
  Activity, Cloud, BarChart3, MonitorCheck, FileText, Cpu,
  Users, Database, Smartphone, Shield, Brain, TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Solar Monitoring',
    desc: 'Real-time tracking of panel generation, system health, and energy flow with live indicators.',
    color: '#14B8A6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.15)',
  },
  {
    icon: Cloud,
    title: 'Weather Integration',
    desc: 'Automatic weather data updates linked to generation forecasting for accurate prediction context.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.15)',
  },
  {
    icon: BarChart3,
    title: 'Interactive Analytics',
    desc: 'Rich, interactive charts for generation vs. consumption trends, efficiency analysis, and comparisons.',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.15)',
  },
  {
    icon: MonitorCheck,
    title: 'Performance Dashboard',
    desc: 'Centralized overview of all solar metrics, KPIs, and system alerts in a single view.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    icon: FileText,
    title: 'Energy Reports',
    desc: 'Auto-generated PDF/CSV reports with period summaries, charts, and efficiency breakdowns.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.15)',
  },
  {
    icon: Cpu,
    title: 'Appliance Simulation',
    desc: 'Simulate which appliances to run during peak generation to maximize solar self-consumption.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.12)',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Admin, operator, and viewer roles with granular permissions and audit logging.',
    color: '#14B8A6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.12)',
  },
  {
    icon: Database,
    title: 'Data Management',
    desc: 'Full CRUD operations on solar records with import/export capabilities and data integrity checks.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.12)',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    desc: 'Fully optimized for desktop, tablet, and mobile with a consistent, polished experience.',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.08)',
    border: 'rgba(56,189,248,0.12)',
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    desc: 'JWT-based auth with encrypted sessions, CORS protection, and activity audit trails.',
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.15)',
  },
  {
    icon: Brain,
    title: 'ML-Ready Architecture',
    desc: 'System is pre-architected for machine learning prediction models as the next milestone.',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.15)',
    badge: 'Coming Soon',
  },
  {
    icon: TrendingUp,
    title: 'Prediction Architecture',
    desc: 'Forecasting pipeline infrastructure ready for ML model integration and output estimation.',
    color: '#F472B6',
    bg: 'rgba(244,114,182,0.08)',
    border: 'rgba(244,114,182,0.15)',
    badge: 'Roadmap',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative" style={{ background: 'rgba(6,15,26,0.99)' }}>
      {/* Top decoration */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)' }}
      />

      <div className="solar-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">Platform Features</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Everything Built to{' '}
            <span className="solar-gradient-text">Power Your Solar Data</span>
          </h2>
          <p className="solar-section-subtitle max-w-2xl mx-auto">
            From live monitoring to historical analytics, SolarIQ delivers a complete toolkit 
            for modern solar energy management.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              viewport={{ once: true, margin: '-40px' }}
              className="solar-card p-5 relative group cursor-default"
            >
              {/* Badge */}
              {f.badge && (
                <span
                  className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                    color: f.color,
                  }}
                >
                  {f.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: f.bg, border: `1px solid ${f.border}` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>

              <h3
                className="text-sm font-semibold mb-2 text-white"
              >
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                {f.desc}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
