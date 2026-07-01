import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { BarChart2, Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'top', labels: { color: '#9ca3af', usePointStyle: true, boxWidth: 8 } },
    tooltip: { backgroundColor: '#1f2937', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 12, cornerRadius: 8 },
  },
  scales: {
    x: { ticks: { color: '#6b7280' }, grid: { display: false } },
    y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
  },
};

export default function EnergyConsumptionChart({ analyticsData, loading }) {
  const hasData = analyticsData?.labels?.length > 0 && analyticsData?.generation?.length > 0;

  const chartData = hasData ? {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Solar Generation (kWh)',
        data: analyticsData.generation,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      ...(analyticsData.consumption?.length > 0 ? [{
        label: 'Consumption (kWh)',
        data: analyticsData.consumption,
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
      }] : []),
    ],
  } : null;

  return (
    <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Solar Generation Trend</h3>
          <p className="text-sm text-gray-500">Based on your analytics records</p>
        </div>
      </div>
      <div className="flex-1 min-h-[280px] flex items-center justify-center">
        {loading ? (
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        ) : chartData ? (
          <div className="w-full h-full min-h-[280px]">
            <Line data={chartData} options={chartOpts} />
          </div>
        ) : (
          <div className="text-center">
            <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No analytics data yet.</p>
            <p className="text-gray-600 text-xs mt-1">Add solar records to populate this chart.</p>
          </div>
        )}
      </div>
    </div>
  );
}
