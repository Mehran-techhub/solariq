import { motion } from 'framer-motion';
import {
  UserPlus, Sun, Cloud, LayoutDashboard, FileText, Brain, ChevronRight
} from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'User Registers',
    desc: 'Create your account in seconds with email verification and role assignment.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.1)',
    border: 'rgba(14,165,233,0.2)',
  },
  {
    num: '02',
    icon: Sun,
    title: 'Add Solar Information',
    desc: 'Configure your solar panel specs, capacity, location, and installation details.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    num: '03',
    icon: Cloud,
    title: 'Weather Data Updates',
    desc: 'Automatic weather API integration populates irradiance and climate context.',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.1)',
    border: 'rgba(56,189,248,0.2)',
  },
  {
    num: '04',
    icon: LayoutDashboard,
    title: 'Analytics Dashboard',
    desc: 'View real-time generation, consumption charts, efficiency metrics, and trends.',
    color: '#14B8A6',
    bg: 'rgba(20,184,166,0.1)',
    border: 'rgba(20,184,166,0.2)',
  },
  {
    num: '05',
    icon: FileText,
    title: 'Generate Reports',
    desc: 'Export professional PDF/CSV reports with performance summaries and visual charts.',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.2)',
  },
  {
    num: '⚡',
    icon: Brain,
    title: 'ML Prediction',
    desc: 'Planned: Machine Learning models for solar output forecasting and smart recommendations.',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.07)',
    border: 'rgba(129,140,248,0.15)',
    isFuture: true,
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 relative overflow-hidden" style={{ background: '#020B14' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(15,118,110,0.06), transparent)',
        }}
      />

      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">How It Works</span>
          <h2 className="solar-section-title mt-4 mb-4">
            From Setup to{' '}
            <span className="solar-gradient-text">Smarter Decisions</span>
          </h2>
          <p className="solar-section-subtitle max-w-2xl mx-auto">
            SolarIQ guides you through a streamlined workflow — get meaningful solar 
            insights up and running in minutes.
          </p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="relative hidden lg:block">
          {/* Connecting line */}
          <div
            className="absolute top-14 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2) 10%, rgba(14,165,233,0.2) 90%, transparent)' }}
          />

          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 z-10 transition-all duration-300 hover:scale-110 ${step.isFuture ? 'opacity-75' : ''}`}
                  style={{ background: step.bg, border: `1px solid ${step.border}` }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  {step.isFuture && (
                    <span
                      className="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: step.color, color: 'white' }}
                    >
                      Soon
                    </span>
                  )}
                </div>

                {/* Step number */}
                <span
                  className="text-xs font-bold mb-2"
                  style={{ color: step.isFuture ? step.color : '#64748B' }}
                >
                  {step.isFuture ? 'Future' : `Step ${step.num}`}
                </span>

                <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="lg:hidden flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`solar-card p-5 flex gap-4 items-start ${step.isFuture ? 'opacity-80' : ''}`}
            >
              <div
                className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: step.bg, border: `1px solid ${step.border}` }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: step.isFuture ? step.color : '#64748B' }}
                  >
                    {step.isFuture ? '⚡ Future' : `Step ${step.num}`}
                  </span>
                  {step.isFuture && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}30` }}
                    >
                      Planned
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-solar-textMuted leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ML Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.06), rgba(15,118,110,0.06))',
            border: '1px solid rgba(129,140,248,0.15)',
          }}
        >
          <Brain className="w-6 h-6 mx-auto mb-2" style={{ color: '#818CF8' }} />
          <p className="text-sm font-semibold text-white mb-1">Machine Learning Integration — Planned Next Enhancement</p>
          <p className="text-xs" style={{ color: '#64748B' }}>
            The system architecture is pre-built to support predictive ML models for solar output forecasting. 
            This feature is planned as the next major system enhancement post-launch.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
