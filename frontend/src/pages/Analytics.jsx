import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { analyticsApi } from '../api';
import { Loader2, BarChart2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

const PERIODS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#9ca3af', usePointStyle: true } },
    tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 10, cornerRadius: 8 },
  },
  scales: {
    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
    y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
  },
};

const StatCard = ({ label, value }) => (
  <div className="bg-[#0d141e] border border-white/5 rounded-xl p-5 text-center">
    <p className="text-sm text-gray-400 mb-2">{label}</p>
    <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
  </div>
);

export default function Analytics() {
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(null);
      try {
        const fn = period === 'daily' ? analyticsApi.daily : period === 'monthly' ? analyticsApi.monthly : analyticsApi.weekly;
        const res = await fn();
        if (res.success) setData(res.data);
      } catch {
        // Empty state shown
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const hasData = data?.labels?.length > 0;
  const generationChart = hasData ? {
    labels: data.labels,
    datasets: [
      { label: 'Generation (kWh)', data: data.generation || [], backgroundColor: 'rgba(16, 185, 129, 0.7)', borderColor: '#10b981', borderWidth: 1 },
      { label: 'Consumption (kWh)', data: data.consumption || [], backgroundColor: 'rgba(99, 102, 241, 0.7)', borderColor: '#6366f1', borderWidth: 1 },
    ],
  } : null;

  const efficiencyChart = hasData && data.efficiency?.some(v => v > 0) ? {
    labels: data.labels,
    datasets: [{
      label: 'Efficiency (%)',
      data: data.efficiency || [],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      borderWidth: 2,
    }],
  } : null;

  const avgGen = hasData && data.generation?.length ? (data.generation.reduce((a, b) => a + b, 0) / data.generation.length).toFixed(2) : null;
  const peakGen = hasData && data.generation?.length ? Math.max(...data.generation).toFixed(2) : null;
  const totalGen = hasData && data.generation?.length ? data.generation.reduce((a, b) => a + b, 0).toFixed(2) : null;
  const avgEff = hasData && data.efficiency?.length ? (data.efficiency.reduce((a, b) => a + b, 0) / data.efficiency.length).toFixed(1) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="inline-block text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full mb-3">
            Performance Analytics
          </span>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Long-term solar performance trends from your records.</p>
        </div>
        <div className="flex bg-[#0d141e] border border-white/5 rounded-xl p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.key ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg. Generation (kWh)" value={avgGen} />
        <StatCard label="Peak Generation (kWh)" value={peakGen} />
        <StatCard label="Total Generation (kWh)" value={totalGen} />
        <StatCard label="Avg. Efficiency (%)" value={avgEff} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : generationChart ? (
        <div className="space-y-6">
          <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-5">Solar Output Trend</h3>
            <div className="h-72">
              <Bar data={generationChart} options={chartOpts} />
            </div>
          </div>

          {efficiencyChart && (
            <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-5">Efficiency Analysis</h3>
              <div className="h-64">
                <Line data={efficiencyChart} options={chartOpts} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-16 text-center">
          <BarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Analytics Data Available</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Add solar records to populate analytics charts. Data will be aggregated per {period} period.
          </p>
        </div>
      )}
    </div>
  );
}
