import { motion } from 'framer-motion';
import { Smile, ShieldCheck, Layers, Cpu } from 'lucide-react';

const cards = [
  {
    icon: Smile,
    title: 'Easy to Use',
    desc: 'Intuitive interface designed for solar professionals and newcomers alike. No technical expertise required to navigate charts, generate reports, or simulate appliances.',
    color: '#0EA5E9',
    bg: 'rgba(14,165,233,0.08)',
    border: 'rgba(14,165,233,0.15)',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Design',
    desc: 'JWT authentication, encrypted sessions, role-based access control, and activity audit logs protect every record and user account on the platform.',
    color: '#14B8A6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.15)',
  },
  {
    icon: Layers,
    title: 'Scalable Platform',
    desc: 'Built on a scalable backend architecture that handles growing data volumes, multiple users, and expanding feature sets without performance degradation.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.15)',
  },
  {
    icon: Cpu,
    title: 'Future Ready',
    desc: 'The ML prediction architecture is pre-built into the system. As models are trained, they plug directly into the existing pipeline — no major refactoring needed.',
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.15)',
  },
];

export default function WhyChooseSection() {
  return (
    <section id="why" className="py-24 relative" style={{ background: '#020B14' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,165,233,0.04), transparent)',
        }}
      />

      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">Why SolarIQ</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Built for{' '}
            <span className="solar-gradient-text">Real-World Solar Operations</span>
          </h2>
          <p className="solar-section-subtitle max-w-2xl mx-auto">
            Four core principles that make SolarIQ the smart choice for solar energy management.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-6 group cursor-default"
              style={{
                background: card.bg,
                border: `1px solid ${card.border}`,
                transition: 'all 0.3s ease',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}30`,
                }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>

              <h3 className="text-base font-bold text-white mb-3">{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
