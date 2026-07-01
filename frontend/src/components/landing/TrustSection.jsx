import { motion } from 'framer-motion';
import {
  Cpu, ShieldCheck, Smartphone, Cloud, BarChart2, Database,
  MonitorCheck, Globe, Lock
} from 'lucide-react';

const badges = [
  { icon: Cpu, label: 'Professional Architecture' },
  { icon: ShieldCheck, label: 'Secure Authentication' },
  { icon: Smartphone, label: 'Responsive Design' },
  { icon: Globe, label: 'Scalable Platform' },
  { icon: Cloud, label: 'Weather Integration' },
  { icon: BarChart2, label: 'Analytics Dashboard' },
  { icon: Database, label: 'Data Management' },
  { icon: MonitorCheck, label: 'Real-time Monitoring' },
  { icon: Lock, label: 'Role-Based Access' },
];

export default function TrustSection() {
  return (
    <section
      className="py-14 relative overflow-hidden"
      style={{ background: 'rgba(6,15,26,0.98)' }}
    >
      {/* Divider top */}
      <div className="solar-divider mb-12" />

      <div className="solar-container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium mb-8"
          style={{ color: '#64748B' }}
        >
          TRUSTED PLATFORM CAPABILITIES
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.07 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              whileHover={{ y: -2 }}
              className="solar-trust-badge"
            >
              <badge.icon className="w-4 h-4" style={{ color: '#0EA5E9' }} />
              <span className="text-sm">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="solar-divider mt-12" />
    </section>
  );
}
