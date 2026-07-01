import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { solarApi } from '../api';
import { toast } from 'react-toastify';
import { Sun, Plus, Edit2, Trash2, X, Loader2, Search, Filter } from 'lucide-react';

const defaultValues = { temperature: '', humidity: '', cloud_cover: '', irradiance: '', actual_output: '', record_date: new Date().toISOString().split('T')[0], notes: '' };

function RecordModal({ record, onClose, onSaved }) {
  const isEdit = !!record?.id;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: isEdit ? {
      ...record,
      record_date: record.record_date ? record.record_date.split('T')[0] : '',
    } : defaultValues,
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await solarApi.update(record.id, data);
        toast.success('Record updated successfully!');
      } else {
        await solarApi.create(data);
        toast.success('Solar record added successfully!');
      }
      onSaved();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save record.');
    }
  };

  const Field = ({ label, name, type = 'number', step = '0.1', required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}{required && <span className="text-red-400"> *</span>}</label>
      <input
        type={type} step={step}
        className={`w-full px-3 py-2.5 bg-[#0a0f16] border ${errors[name] ? 'border-red-500/50' : 'border-white/10 focus:border-emerald-500'} rounded-xl text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all`}
        {...register(name, required ? { required: true, valueAsNumber: type === 'number' } : {})}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-400">Required</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d141e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Solar Record' : 'Add Solar Record'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" name="record_date" type="date" step={undefined} required />
            <Field label="Temperature (°C)" name="temperature" required />
            <Field label="Humidity (%)" name="humidity" step="1" required />
            <Field label="Cloud Cover (%)" name="cloud_cover" step="1" required />
            <Field label="Irradiance (W/m²)" name="irradiance" required />
            <Field label="Actual Output (kWh)" name="actual_output" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2.5 bg-[#0a0f16] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all resize-none"
              {...register('notes')}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 transition-all">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
              {isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Solar() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', record }
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await solarApi.list();
      if (res.success) {
        const recs = res.data?.records || [];
        setRecords(recs);
        setFiltered(recs);
      }
    } catch {
      toast.error('Failed to load solar records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    if (!q) { setFiltered(records); return; }
    setFiltered(records.filter(r =>
      (r.record_date || '').toLowerCase().includes(q) ||
      String(r.actual_output || '').includes(q) ||
      (r.notes || '').toLowerCase().includes(q)
    ));
  }, [search, records]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this solar record? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await solarApi.delete(id);
      toast.success('Record deleted.');
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Failed to delete record.');
    } finally {
      setDeleting(null);
    }
  };

  const onSaved = () => {
    setModal(null);
    load();
  };

  return (
    <div className="space-y-8">
      {modal && (
        <RecordModal
          record={modal.mode === 'edit' ? modal.record : null}
          onClose={() => setModal(null)}
          onSaved={onSaved}
        />
      )}

      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <span className="inline-block text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full mb-3">
            Monitoring Records
          </span>
          <h1 className="text-3xl font-bold text-white">Solar Monitoring</h1>
          <p className="text-gray-400 mt-1">Log and manage your solar system performance records.</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Search + Stats */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by date, output, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d141e] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 text-sm text-gray-400">
          <span className="bg-[#0d141e] border border-white/5 px-4 py-2.5 rounded-xl">
            <span className="font-bold text-white">{records.length}</span> total records
          </span>
          {search && (
            <span className="bg-[#0d141e] border border-white/5 px-4 py-2.5 rounded-xl">
              <span className="font-bold text-white">{filtered.length}</span> found
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Date', 'Temp (°C)', 'Humidity (%)', 'Cloud (%)', 'Irradiance (W/m²)', 'Output (kWh)', 'Notes', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-gray-400 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 text-gray-300 whitespace-nowrap">{r.record_date ? new Date(r.record_date).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4 text-gray-300">{r.temperature ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-300">{r.humidity ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-300">{r.cloud_cover ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-300">{r.irradiance ?? '—'}</td>
                    <td className="px-5 py-4 font-bold text-emerald-400">{r.actual_output ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-500 max-w-[150px] truncate">{r.notes || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', record: r })}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          disabled={deleting === r.id}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60"
                          title="Delete"
                        >
                          {deleting === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-16 text-center">
          <Sun className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">{search ? 'No Records Found' : 'No Solar Records Yet'}</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            {search ? 'Try different search terms.' : 'Start logging your solar system performance by adding your first record.'}
          </p>
          {!search && (
            <button onClick={() => setModal({ mode: 'add' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all">
              <Plus className="w-4 h-4" /> Add First Record
            </button>
          )}
        </div>
      )}
    </div>
  );
}
