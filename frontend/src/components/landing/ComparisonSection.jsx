import { motion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';

const traditional = [
  'Fragmented spreadsheets',
  'Manual data entry',
  'No visual analytics',
  'No report generation',
  'No weather correlation',
  'No appliance simulation',
  'No role-based access',
  'No ML-ready architecture',
];

const solariq = [
  'Centralized web platform',
  'Automated data collection',
  'Interactive visual dashboards',
  'Automated PDF/CSV reports',
  'Live weather integration',
  'Built-in appliance simulator',
  'Role-based access control',
  'ML prediction architecture',
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-24 relative" style={{ background: '#020B14' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(15,118,110,0.05), transparent)',
        }}
      />

      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">Platform Comparison</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Why SolarIQ Over{' '}
            <span className="solar-gradient-text">Traditional Monitoring</span>?
          </h2>
          <p className="solar-section-subtitle max-w-2xl mx-auto">
            Traditional solar monitoring relies on fragmented tools and manual processes. 
            SolarIQ brings everything together in a single, modern, intelligent platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(12,24,41,0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="font-bold text-white">Traditional Monitoring</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Manual & fragmented approach</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {traditional.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-sm" style={{ color: '#64748B' }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SolarIQ column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(14,165,233,0.06))',
              border: '1px solid rgba(20,184,166,0.2)',
              boxShadow: '0 0 40px rgba(15,118,110,0.08)',
            }}
          >
            {/* Shimmer effect */}
            <div className="solar-shimmer-effect absolute inset-0" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
                  boxShadow: '0 4px 12px rgba(15,118,110,0.3)',
                }}
              >
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">SolarIQ Platform</p>
                <p className="text-xs text-solar-greenLight">Modern & intelligent approach</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              {solariq.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(20,184,166,0.15)' }}
                  >
                    <Check className="w-3 h-3 text-solar-greenLight" />
                  </div>
                  <span className="text-sm text-white">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
