import { useEffect, useState } from 'react';
import { reportsApi } from '../api';
import { toast } from 'react-toastify';
import { FileText, Download, Plus, Loader2, Calendar } from 'lucide-react';
import TimeAgo from '../utils/TimeAgo';

const REPORT_TYPES = ['daily', 'weekly', 'monthly'];

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.list();
      if (res.success) setReports(res.data?.reports || []);
    } catch {
      toast.error('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const payload = {
        report_type: reportType,
        report_name: `SolarIQ ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report – ${new Date().toLocaleDateString('en-PK')}`,
        format: 'pdf',
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      };
      await reportsApi.generate(payload);
      toast.success('Report generated successfully!');
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const download = async (id, name) => {
    try {
      const blob = await reportsApi.download(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'SolarIQ-Report'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded.');
    } catch {
      toast.error('Download failed. The file may not exist on the server.');
    }
  };

  const typeColor = { daily: 'text-emerald-400 bg-emerald-400/10', weekly: 'text-blue-400 bg-blue-400/10', monthly: 'text-purple-400 bg-purple-400/10', custom: 'text-amber-400 bg-amber-400/10' };

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-block text-xs font-semibold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-3 py-1 rounded-full mb-3">
          PDF Export
        </span>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 mt-1">Generate professional PDF reports from your solar data.</p>
      </div>

      {/* Generator Panel */}
      <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-5">Generate New Report</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#111823] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {REPORT_TYPES.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)} Report</option>
              ))}
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {reportType === 'custom' && (
            <>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#111823] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-sm font-medium text-gray-400 mb-1.5">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#111823] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
              </div>
            </>
          )}

          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : reports.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((r) => (
            <div key={r.id} className="bg-[#0d141e] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor[r.report_type] || typeColor.custom}`}>
                  {r.report_type}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm leading-snug">{r.report_name}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {r.generated_at ? <TimeAgo date={r.generated_at} /> : '—'}
                </div>
              </div>
              <button
                onClick={() => download(r.id, r.report_name)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-medium border border-white/10 text-gray-300 hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-16 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Reports Generated</h3>
          <p className="text-gray-500 text-sm">Generate your first report using the form above.</p>
        </div>
      )}
    </div>
  );
}
