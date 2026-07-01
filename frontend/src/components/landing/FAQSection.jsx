import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is SolarIQ?',
    a: 'SolarIQ is a centralized intelligent web platform for solar energy monitoring, analytics, and optimization. It consolidates solar data management, weather integration, performance reporting, and appliance simulation into a single, modern interface.',
  },
  {
    q: 'Who can use SolarIQ?',
    a: 'SolarIQ is designed for solar panel owners, energy consultants, system operators, and researchers. Role-based access control allows administrators to manage multiple users and installations from one platform.',
  },
  {
    q: 'Does it require any special hardware?',
    a: 'No special hardware is required. SolarIQ is a web-based platform — all you need is an internet-connected device. You manually enter your solar readings, or the system fetches relevant weather data automatically via API.',
  },
  {
    q: 'How are reports generated?',
    a: 'Reports are automatically generated from the solar records stored in the system. You select a date range and the platform compiles generation totals, efficiency metrics, consumption data, and visual charts into a downloadable PDF or CSV file.',
  },
  {
    q: 'Can Machine Learning be integrated later?',
    a: 'Yes. The SolarIQ architecture was designed with ML integration as the next enhancement. The prediction pipeline infrastructure is already in place — trained models can be plugged in to enable forecasting without major changes to the existing system.',
  },
  {
    q: 'Is the platform responsive on mobile?',
    a: 'Absolutely. SolarIQ is built with a mobile-first responsive design. The dashboard, analytics, reports, and all other sections are fully optimized for smartphones, tablets, and desktops.',
  },
  {
    q: 'Is my data secure on SolarIQ?',
    a: 'Yes. The platform uses JWT-based authentication, encrypted storage, CORS protection, and role-based access control. All user activity is logged, and admin access can be revoked or managed at any time.',
  },
];

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: open ? 'rgba(14,165,233,0.05)' : 'rgba(12,24,41,0.7)',
        border: open ? '1px solid rgba(14,165,233,0.2)' : '1px solid rgba(14,165,233,0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={open}
        id={`faq-item-${index}`}
      >
        <span className="text-sm font-semibold text-white pr-4">{question}</span>
        <div
          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(14,165,233,0.15)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ChevronDown className="w-4 h-4" style={{ color: open ? '#0EA5E9' : '#64748B' }} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p
              className="px-6 pb-5 text-sm leading-relaxed"
              style={{ color: '#94A3B8' }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 relative" style={{ background: '#020B14' }}>
      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="solar-badge mb-4">FAQ</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Frequently Asked{' '}
            <span className="solar-gradient-text">Questions</span>
          </h2>
          <p className="solar-section-subtitle max-w-xl mx-auto">
            Everything you need to know about SolarIQ before getting started.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
