import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Database, FileBarChart, CloudSun, Monitor } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Registered Users', value: 500, suffix: '+', color: '#0EA5E9' },
  { icon: Database, label: 'Solar Records', value: 10000, suffix: '+', color: '#14B8A6' },
  { icon: FileBarChart, label: 'Reports Generated', value: 2000, suffix: '+', color: '#F59E0B' },
  { icon: CloudSun, label: 'Weather Updates', value: 50000, suffix: '+', color: '#38BDF8' },
  { icon: Monitor, label: 'Dashboard Views', value: 25000, suffix: '+', color: '#A78BFA' },
];

function AnimatedCounter({ target, suffix, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  const formatted =
    target >= 1000
      ? (count / 1000).toFixed(count >= target ? 1 : 0) + 'K'
      : count;

  return (
    <span ref={ref} className="text-4xl font-bold font-display" style={{ color }}>
      {formatted}{suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section id="stats" className="py-24 relative" style={{ background: 'rgba(6,15,26,0.98)' }}>
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
          <span className="solar-badge mb-4">Platform Statistics</span>
          <h2 className="solar-section-title mt-4 mb-4">
            Numbers That{' '}
            <span className="solar-gradient-text">Speak for Themselves</span>
          </h2>
          <p className="solar-section-subtitle max-w-xl mx-auto">
            SolarIQ is built at scale — from daily data logging to monthly performance reports.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="solar-card p-6 text-center group hover:scale-[1.02] transition-transform duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `${stat.color}12`,
                  border: `1px solid ${stat.color}25`,
                }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>

              <AnimatedCounter target={stat.value} suffix={stat.suffix} color={stat.color} />

              <p className="text-xs mt-2" style={{ color: '#64748B' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
