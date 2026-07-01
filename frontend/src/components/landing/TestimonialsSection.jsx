import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Sana Mahmood',
    title: 'Renewable Energy Consultant',
    org: 'GreenPower Advisory',
    quote: 'SolarIQ gives our clients a single, professional platform to track every watt. The analytics quality rivals enterprise tools at a fraction of the complexity.',
    rating: 5,
    initials: 'SM',
    color: '#0EA5E9',
  },
  {
    name: 'Tariq Hussain',
    title: 'Operations Manager',
    org: 'SunEdge Installations',
    quote: 'We used to rely on messy spreadsheets and monthly CSV exports. SolarIQ replaced all of that with real-time dashboards and auto-generated reports our clients love.',
    rating: 5,
    initials: 'TH',
    color: '#14B8A6',
  },
  {
    name: 'Prof. Ayesha Raza',
    title: 'University Researcher',
    org: 'NUST Energy Lab',
    quote: 'As a researcher studying solar adoption patterns, the historical data export and analytics features in SolarIQ are invaluable. The data quality is exceptional.',
    rating: 5,
    initials: 'AR',
    color: '#F59E0B',
  },
  {
    name: 'Usman Farooq',
    title: 'System Administrator',
    org: 'SolarTech Networks',
    quote: 'The role-based access control and audit logs make it straightforward to manage multiple client installations from a single admin panel. Security is genuinely enterprise-grade.',
    rating: 5,
    initials: 'UF',
    color: '#818CF8',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative" style={{ background: 'rgba(6,15,26,0.98)' }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.2), transparent)' }}
      />

      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">Testimonials</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Trusted by Solar{' '}
            <span className="solar-gradient-text">Professionals</span>
          </h2>
          <p className="solar-section-subtitle max-w-xl mx-auto">
            See what energy consultants, operations teams, and researchers say about SolarIQ.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="solar-card p-5 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#F59E0B' }} />
                ))}
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote
                  className="w-6 h-6 mb-2 opacity-40"
                  style={{ color: t.color }}
                />
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`, border: `1px solid ${t.color}30` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{t.name}</p>
                  <p className="text-[10px]" style={{ color: '#64748B' }}>{t.title}</p>
                  <p className="text-[10px]" style={{ color: t.color }}>{t.org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
