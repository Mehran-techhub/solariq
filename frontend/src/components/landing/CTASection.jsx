import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sun } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: 'rgba(6,15,26,0.99)' }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(15,118,110,0.1), transparent)',
        }}
      />
      <div className="solar-grid-bg absolute inset-0 opacity-50" />

      <div className="solar-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: 'linear-gradient(135deg, #0F766E, #0EA5E9)',
              boxShadow: '0 0 40px rgba(15,118,110,0.4), 0 0 80px rgba(14,165,233,0.2)',
            }}
          >
            <Sun className="w-8 h-8 text-white" strokeWidth={1.5} />
          </motion.div>

          <span className="solar-badge-gold mb-6">Start Today — It's Free</span>

          <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mt-6 mb-5" style={{ color: '#F1F5F9' }}>
            Start Managing Solar Data{' '}
            <span className="solar-gradient-text">Smarter</span>
          </h2>

          <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#94A3B8' }}>
            Join solar professionals who use SolarIQ to gain better visibility, 
            generate professional reports, and make smarter energy decisions — 
            all from a single intelligent platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="solar-btn-primary text-base px-8 py-4"
              id="cta-create-account"
            >
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="solar-btn-secondary text-base px-8 py-4"
              id="cta-explore-platform"
            >
              Explore Platform
            </Link>
          </div>

          {/* Guarantee strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {['No credit card required', 'Free to get started', 'Secure & private'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-solar-greenLight" />
                <span className="text-xs" style={{ color: '#64748B' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
