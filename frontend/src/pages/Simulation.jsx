import { useState, useEffect } from 'react';
import { simulationApi } from '../api';
import { toast } from 'react-toastify';
import { Loader2, Zap, PlayCircle, Clock, AlertTriangle, CheckCircle, Plus, Trash2, X } from 'lucide-react';

const DEFAULT_APPLIANCES = [
  { id: 'ac', name: 'Air Conditioner', wattage: 1500 },
  { id: 'washing_machine', name: 'Washing Machine', wattage: 500 },
  { id: 'refrigerator', name: 'Refrigerator', wattage: 150 },
  { id: 'water_pump', name: 'Water Pump', wattage: 800 },
  { id: 'electric_iron', name: 'Electric Iron', wattage: 1000 },
  { id: 'microwave', name: 'Microwave Oven', wattage: 1200 },
  { id: 'water_heater', name: 'Water Heater', wattage: 2000 },
  { id: 'fan', name: 'Fan', wattage: 75 },
  { id: 'lights', name: 'Lights (x5)', wattage: 50 },
  { id: 'television', name: 'Television', wattage: 120 },
];

const STORAGE_KEY = 'solariq_custom_appliances';

function loadCustomAppliances() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveCustomAppliances(apps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

export default function Simulation() {
  const [customApps, setCustomApps] = useState(() => loadCustomAppliances());
  const [selected, setSelected] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', wattage: '' });

  const allAppliances = [...DEFAULT_APPLIANCES, ...customApps];

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await simulationApi.list();
      if (res.success) setHistory(res.data?.simulations || []);
    } catch { } finally { setLoadingHistory(false); }
  };

  useEffect(() => { loadHistory(); }, []);

  const toggleAppliance = (id) => {
    setSelected(prev => {
      if (prev[id]) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: { hours: 2 } };
    });
  };

  const setHours = (id, hours) => {
    setSelected(prev => ({ ...prev, [id]: { ...prev[id], hours: Number(hours) } }));
  };

  const run = async () => {
    if (!Object.keys(selected).length) { toast.warning('Select at least one appliance.'); return; }
    setLoading(true);
    try {
      const appliances = Object.keys(selected).map(id => {
        const app = allAppliances.find(a => a.id === id);
        return { name: app.name, wattage: app.wattage };
      });
      const res = await simulationApi.run(appliances);
      if (res.success) {
        setResult(res.data);
        toast.success('Simulation completed and saved!');
        loadHistory();
      } else {
        toast.error(res.message || 'Simulation failed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Cannot connect to simulation service.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomAppliance = () => {
    const name = newApp.name.trim();
    const wattage = parseInt(newApp.wattage);
    if (!name) { toast.error('Appliance name is required'); return; }
    if (!wattage || wattage < 1) { toast.error('Wattage must be a positive number'); return; }
    const id = `custom_${Date.now()}`;
    const updated = [...customApps, { id, name, wattage }];
    setCustomApps(updated);
    saveCustomAppliances(updated);
    setNewApp({ name: '', wattage: '' });
    setShowAddModal(false);
    toast.success(`"${name}" added to appliance list`);
  };

  const deleteCustomAppliance = (id) => {
    const updated = customApps.filter(a => a.id !== id);
    setCustomApps(updated);
    saveCustomAppliances(updated);
    const newSelected = { ...selected };
    delete newSelected[id];
    setSelected(newSelected);
    toast.success('Appliance removed');
  };

  const totalEstimatedKwh = Object.keys(selected).reduce((sum, id) => {
    const app = allAppliances.find(a => a.id === id);
    return sum + (app.wattage * (selected[id].hours || 2)) / 1000;
  }, 0);

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="space-y-8">
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0d141e] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Custom Appliance</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Appliance Name</label>
                <input value={newApp.name} onChange={e => setNewApp(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Electric Kettle" className="w-full px-3 py-2.5 bg-[#111823] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Wattage (Watts)</label>
                <input type="number" value={newApp.wattage} onChange={e => setNewApp(p => ({ ...p, wattage: e.target.value }))} placeholder="e.g. 2000" min="1" className="w-full px-3 py-2.5 bg-[#111823] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all" />
              </div>
              <button onClick={addCustomAppliance} className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all">
                Add Appliance
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <span className="inline-block text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-3 py-1 rounded-full mb-3">Load Balancer</span>
        <h1 className="text-3xl font-bold text-white">Appliance Simulation</h1>
        <p className="text-gray-400 mt-1">Select or add appliances to estimate solar vs grid share based on your system capacity.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Appliances</h3>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Custom
            </button>
          </div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {allAppliances.map((app) => {
              const isSelected = !!selected[app.id];
              const isCustom = app.id.startsWith('custom_');
              return (
                <div key={app.id} className={`rounded-xl border transition-colors ${isSelected ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 bg-[#111823]'}`}>
                  <label className="flex items-center gap-3 p-3 cursor-pointer">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleAppliance(app.id)} className="accent-emerald-500 w-4 h-4" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate flex items-center gap-1.5">
                        {app.name}
                        {isCustom && <span className="text-[10px] text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">Custom</span>}
                      </p>
                      <p className="text-xs text-gray-500">{app.wattage}W · {(app.wattage / 1000).toFixed(2)} kW</p>
                    </div>
                    {isCustom && (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCustomAppliance(app.id); }} className="p-1 rounded-md hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </label>
                  {isSelected && (
                    <div className="px-3 pb-3">
                      <label className="text-xs text-gray-500 block mb-1">Hours: {selected[app.id].hours}h</label>
                      <input type="range" min="1" max="12" value={selected[app.id].hours} onChange={(e) => setHours(app.id, e.target.value)} className="w-full h-1.5 accent-emerald-500 cursor-pointer" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCount > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 text-sm text-gray-400">
              <div className="flex justify-between mb-1"><span>Estimated total:</span><span className="text-white font-semibold">{totalEstimatedKwh.toFixed(2)} kWh</span></div>
            </div>
          )}

          <button onClick={run} disabled={loading || !selectedCount} className="w-full mt-4 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-5">Simulation Result</h3>
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Solar Share</p>
                  <p className="text-3xl font-bold text-emerald-400">{result.solar_share}%</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Grid Share</p>
                  <p className="text-3xl font-bold text-red-400">{result.grid_share}%</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Est. Cost</p>
                  <p className="text-2xl font-bold text-amber-400">Rs {result.estimated_cost}</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${result.solar_share}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Total load: {(result.total_wattage / 1000).toFixed(2)} kW</span>
                <span>System capacity: {result.solar_capacity_kw} kW</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 bg-[#111823] rounded-xl p-3 border border-white/5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Suggested operating window: <strong className="text-white">11:30 AM – 02:30 PM</strong></span>
              </div>
              <div className={`mt-3 flex items-center gap-2 text-sm p-3 rounded-xl border ${result.solar_share >= 60 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'}`}>
                {result.solar_share >= 60 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {result.solar_share >= 60 ? 'Solar energy can adequately power the selected appliances.' : 'Grid supplement needed. Consider reducing appliance load or shifting usage time.'}
              </div>
            </div>
          ) : (
            <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-12 text-center">
              <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">Select appliances and run simulation to see results.</p>
            </div>
          )}

          <div className="bg-[#0d141e] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Simulation History</h3>
            </div>
            {loadingHistory ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-emerald-500 animate-spin" /></div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Appliance</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Wattage</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Solar %</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Grid %</th>
                      <th className="text-left px-5 py-3 text-gray-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 15).map((s, i) => (
                      <tr key={s.id || i} className="border-b border-white/5 hover:bg-white/2">
                        <td className="px-5 py-3.5 text-gray-200">{s.appliance_name}</td>
                        <td className="px-5 py-3.5 text-gray-400">{s.wattage}W</td>
                        <td className="px-5 py-3.5 font-semibold text-emerald-400">{s.solar_share}%</td>
                        <td className="px-5 py-3.5 text-red-400">{s.grid_share}%</td>
                        <td className="px-5 py-3.5 text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No simulations run yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}