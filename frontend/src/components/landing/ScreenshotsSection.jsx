import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, BarChart3, FileText, Cpu, Cloud, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';

// Mini mockup components for each screen
function DashboardScreen() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-solar-textMuted">Dashboard</p>
          <p className="text-sm font-bold text-white">Energy Overview</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full text-solar-greenLight" style={{ background: 'rgba(20,184,166,0.1)' }}>Live</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['42.6 kWh', 'Generated', '#F59E0B'], ['18.3 kWh', 'Consumed', '#0EA5E9'], ['94%', 'Efficiency', '#14B8A6']].map(([v, l, c]) => (
          <div key={l} className="rounded-lg p-2.5" style={{ background: `${c}10`, border: `1px solid ${c}20` }}>
            <p className="text-sm font-bold text-white">{v}</p>
            <p className="text-[10px]" style={{ color: c }}>{l}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3" style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}>
        <div className="flex items-end gap-1 h-12">
          {[40, 60, 50, 80, 90, 75, 85, 70, 55, 45].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 4 ? '#0F766E' : 'rgba(14,165,233,0.3)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-white">Analytics Overview</p>
      <div className="space-y-2">
        {[['Generation Trend', 87, '#14B8A6'], ['Consumption', 62, '#0EA5E9'], ['Efficiency', 94, '#F59E0B']].map(([label, pct, color]) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#94A3B8' }}>{label}</span>
              <span style={{ color }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[['₹ 1,248', 'Revenue', '#14B8A6'], ['+14.2%', 'vs Last Week', '#38BDF8']].map(([v, l, c]) => (
          <div key={l} className="rounded-lg p-3" style={{ background: `${c}08`, border: `1px solid ${c}15` }}>
            <p className="text-base font-bold" style={{ color: c }}>{v}</p>
            <p className="text-[10px] text-solar-textMuted">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericScreen({ title, items, color }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-white">{title}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <div className="flex-1">
              <p className="text-xs font-medium text-white">{item.label}</p>
              <p className="text-[10px] text-solar-textMuted">{item.sub}</p>
            </div>
            <span className="text-xs font-semibold" style={{ color }}>{item.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const screens = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    color: '#14B8A6',
    render: () => <DashboardScreen />,
  },
  {
    id: 'monitoring',
    label: 'Solar Monitoring',
    icon: Activity,
    color: '#0EA5E9',
    render: () => (
      <GenericScreen
        title="Solar Monitoring"
        color="#0EA5E9"
        items={[
          { label: 'Panel Array A', sub: 'Last sync: 2 mins ago', val: '12.4 kW' },
          { label: 'Panel Array B', sub: 'Performance: Optimal', val: '11.8 kW' },
          { label: 'Inverter Status', sub: 'Running at 97.2% eff.', val: 'Active' },
          { label: 'Battery Bank', sub: 'Charge level', val: '87%' },
        ]}
      />
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    color: '#38BDF8',
    render: () => <AnalyticsScreen />,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    color: '#A78BFA',
    render: () => (
      <GenericScreen
        title="Generated Reports"
        color="#A78BFA"
        items={[
          { label: 'June 2025 Summary', sub: 'PDF · 2.4 MB', val: 'Ready' },
          { label: 'Q2 Performance', sub: 'PDF · 5.1 MB', val: 'Ready' },
          { label: 'May 2025 Report', sub: 'CSV · 120 KB', val: 'Ready' },
          { label: 'Annual Overview', sub: 'Generating...', val: '64%' },
        ]}
      />
    ),
  },
  {
    id: 'simulation',
    label: 'Simulation',
    icon: Cpu,
    color: '#F59E0B',
    render: () => (
      <GenericScreen
        title="Appliance Simulation"
        color="#F59E0B"
        items={[
          { label: 'Air Conditioner', sub: '2.5 kW · Recommended 11am-3pm', val: 'Optimal' },
          { label: 'Water Heater', sub: '3 kW · Use during generation peak', val: 'Optimal' },
          { label: 'Washing Machine', sub: '1.2 kW · Flexible timing', val: 'Good' },
          { label: 'EV Charger', sub: '7.4 kW · Avoid peak hours', val: 'Caution' },
        ]}
      />
    ),
  },
  {
    id: 'weather',
    label: 'Weather',
    icon: Cloud,
    color: '#38BDF8',
    render: () => (
      <GenericScreen
        title="Weather Integration"
        color="#38BDF8"
        items={[
          { label: 'Solar Irradiance', sub: 'Current: High', val: '850 W/m²' },
          { label: 'Temperature', sub: 'Ambient air', val: '28°C' },
          { label: 'Cloud Cover', sub: 'Impact: Low', val: '15%' },
          { label: 'Wind Speed', sub: 'Panel cooling effect', val: '12 km/h' },
        ]}
      />
    ),
  },
  {
    id: 'admin',
    label: 'Admin Dashboard',
    icon: ShieldCheck,
    color: '#4ADE80',
    render: () => (
      <GenericScreen
        title="Admin Dashboard"
        color="#4ADE80"
        items={[
          { label: 'Total Users', sub: 'Active accounts', val: '487' },
          { label: 'Total Records', sub: 'Solar data entries', val: '9,842' },
          { label: 'Reports Today', sub: 'Auto-generated', val: '23' },
          { label: 'System Health', sub: 'All services running', val: '100%' },
        ]}
      />
    ),
  },
];

export default function ScreenshotsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + screens.length) % screens.length);
  const next = () => setCurrent((c) => (c + 1) % screens.length);

  const screen = screens[current];

  return (
    <section id="screenshots" className="py-24 relative" style={{ background: 'rgba(6,15,26,0.99)' }}>
      <div className="solar-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="solar-badge mb-4">Platform Showcase</span>
          <h2 className="solar-section-title mt-4 mb-4">
            See SolarIQ{' '}
            <span className="solar-gradient-text">in Action</span>
          </h2>
          <p className="solar-section-subtitle max-w-xl mx-auto">
            Explore each section of the platform — from live monitoring dashboards to 
            automated reports and appliance simulation tools.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Sidebar tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:w-48 flex-shrink-0 solar-scrollbar">
            {screens.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  i === current ? 'text-white' : 'text-solar-textMuted hover:text-white hover:bg-white/5'
                }`}
                style={i === current ? {
                  background: `${s.color}12`,
                  border: `1px solid ${s.color}25`,
                } : {}}
              >
                <s.icon className="w-4 h-4 flex-shrink-0" style={{ color: i === current ? s.color : 'inherit' }} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Screen mockup */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-6 min-h-64"
                style={{
                  background: 'linear-gradient(135deg, rgba(12,24,41,0.98), rgba(6,15,26,0.99))',
                  border: `1px solid ${screen.color}20`,
                  boxShadow: `0 0 40px ${screen.color}08`,
                }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  <div className="flex gap-1.5">
                    {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                    ))}
                  </div>
                  <div
                    className="flex-1 mx-3 h-6 rounded-md flex items-center px-3 text-[10px]"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#475569' }}
                  >
                    solariq.app/{screen.id}
                  </div>
                  <screen.icon className="w-4 h-4" style={{ color: screen.color }} />
                </div>

                {screen.render()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button onClick={prev} className="solar-btn-secondary px-4 py-2 text-xs" id="screenshot-prev">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {screens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                    style={{ background: i === current ? '#0EA5E9' : 'rgba(148,163,184,0.3)' }}
                    aria-label={`Screenshot ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={next} className="solar-btn-secondary px-4 py-2 text-xs" id="screenshot-next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
