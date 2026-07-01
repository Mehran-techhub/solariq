import { useState } from 'react';
import { Power, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const APPLIANCES = [
  { id: 'ac', name: 'Air Conditioner', rating: 1500 },
  { id: 'washing_machine', name: 'Washing Machine', rating: 500 },
  { id: 'refrigerator', name: 'Refrigerator', rating: 150 },
  { id: 'pump', name: 'Water Pump', rating: 800 },
  { id: 'iron', name: 'Electric Iron', rating: 1000 },
  { id: 'microwave', name: 'Microwave Oven', rating: 1200 },
  { id: 'heater', name: 'Water Heater', rating: 2000 },
  { id: 'fan', name: 'Fan', rating: 75 },
  { id: 'lights', name: 'Lights (x5)', rating: 50 },
  { id: 'tv', name: 'Television', rating: 120 },
];

export default function AppliancePlanner({ solarOutputKw }) {
  const [selectedAppliance, setSelectedAppliance] = useState(APPLIANCES[0]);
  const [hours, setHours] = useState(2);

  const estimatedKwh = (selectedAppliance.rating * hours) / 1000;
  const requiredKw = selectedAppliance.rating / 1000;

  // Only show compatibility if we have real solar data
  const hasRealData = solarOutputKw !== null && solarOutputKw !== undefined;
  const isCompatible = hasRealData ? requiredKw <= solarOutputKw : null;

  return (
    <div className="bg-[#0d141e] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white">Appliance Planner</h3>
        <p className="text-sm text-gray-500 mt-1">Plan heavy usage around solar generation</p>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Select Appliance</label>
          <select
            className="w-full bg-[#111823] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            value={selectedAppliance.id}
            onChange={(e) => setSelectedAppliance(APPLIANCES.find((a) => a.id === e.target.value))}
          >
            {APPLIANCES.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name} ({app.rating}W)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Operating Hours: <span className="text-white font-semibold">{hours}h</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <motion.div
          key={selectedAppliance.id + hours}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111823] rounded-xl p-4 border border-white/5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Power className="w-4 h-4 text-emerald-400" /> Est. Consumption
            </span>
            <span className="font-bold text-white">{estimatedKwh.toFixed(2)} kWh</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-400">Required Power</span>
            <span className="font-semibold text-gray-300">{requiredKw.toFixed(2)} kW</span>
          </div>

          {hasRealData ? (
            <div className="flex justify-between items-start pt-3 border-t border-white/5">
              <span className="text-sm text-gray-400">Solar Compatibility</span>
              {isCompatible ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-md">
                  <CheckCircle className="w-4 h-4" /> Compatible
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium bg-amber-400/10 px-2 py-1 rounded-md">
                  <AlertTriangle className="w-4 h-4" /> Exceeds Output
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-600 pt-3 border-t border-white/5">
              Run a simulation or add records to see solar compatibility.
            </p>
          )}

          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Suggested peak window: 11:30 AM – 02:30 PM
          </p>
        </motion.div>
      </div>
    </div>
  );
}
