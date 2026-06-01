import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getWebsiteData, updateSection, generateId } from '../utils/storage';
import ImageUploader from '../components/ImageUploader';
import SaveBar from '../components/SaveBar';

const CATEGORIES = ['Dumpers', 'Trippers', 'Flatbeds', 'Cranes', 'Tankers', 'Loaders'];

export default function FleetEditor() {
  const data = getWebsiteData();
  const [header, setHeader] = useState({ subtitle: data.fleet.subtitle, title: data.fleet.title, description: data.fleet.description });
  const [partner, setPartner] = useState(data.fleet.partner);
  const [vehicles, setVehicles] = useState(data.fleet.vehicles || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const markDirty = () => { setDirty(true); setSaved(false); };

  const addVehicle = () => {
    const v = { id: generateId(), name: 'New Vehicle', category: 'Dumpers', capacity: '10 Ton', description: 'Vehicle description.', image: '' };
    setVehicles(p => [...p, v]);
    setExpanded(v.id);
    markDirty();
  };

  const updateVehicle = (id, field, value) => {
    setVehicles(p => p.map(v => v.id === id ? { ...v, [field]: value } : v));
    markDirty();
  };

  const deleteVehicle = (id) => {
    setVehicles(p => p.filter(v => v.id !== id));
    if (expanded === id) setExpanded(null);
    markDirty();
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSection('fleet', { ...header, partner, vehicles });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, value, onChange, type = 'input', rows = 2 }) => (
    <div className="space-y-1.5">
      <span className="label">{label}</span>
      {type === 'textarea'
        ? <textarea rows={rows} value={value} onChange={e => { onChange(e.target.value); markDirty(); }} className="input-field" />
        : <input type={type} value={value} onChange={e => { onChange(e.target.value); markDirty(); }} className="input-field" />}
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Truck className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h1 className="section-title">Fleet Manager</h1>
            <p className="section-subtitle">Manage vehicles and partnership details</p>
          </div>
        </div>
        <button onClick={addVehicle} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Section Header */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Section Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Subtitle Badge" value={header.subtitle} onChange={v => setHeader(p => ({ ...p, subtitle: v }))} />
          <Field label="Title (use \\n for line break)" value={header.title} onChange={v => setHeader(p => ({ ...p, title: v }))} />
          <div className="md:col-span-2">
            <Field label="Description" value={header.description} onChange={v => setHeader(p => ({ ...p, description: v }))} type="textarea" />
          </div>
        </div>
      </div>

      {/* Partner Card */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Partnership Card (e.g. Rashmi Group)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Card Tag Label" value={partner.tag} onChange={v => setPartner(p => ({ ...p, tag: v }))} />
          <Field label="Partner Name" value={partner.name} onChange={v => setPartner(p => ({ ...p, name: v }))} />
          <Field label="Billing Value" value={partner.billing} onChange={v => setPartner(p => ({ ...p, billing: v }))} />
          <Field label="Billing Label" value={partner.label} onChange={v => setPartner(p => ({ ...p, label: v }))} />
          <div className="md:col-span-2">
            <Field label="Partnership Description" value={partner.desc} onChange={v => setPartner(p => ({ ...p, desc: v }))} type="textarea" rows={3} />
          </div>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Fleet Vehicles ({vehicles.length})
        </h2>

        {vehicles.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-600 text-sm">
            No vehicles yet. Click "Add Vehicle" to create one.
          </div>
        )}

        <AnimatePresence>
          {vehicles.map((v, idx) => (
            <motion.div key={v.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-2xl overflow-hidden">
              <div onClick={() => setExpanded(p => p === v.id ? null : v.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{v.name}</p>
                    <p className="text-slate-500 text-xs">{v.category} · {v.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {v.image && <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={v.image} alt="" className="w-full h-full object-cover" />
                  </div>}
                  <button onClick={e => { e.stopPropagation(); deleteVehicle(v.id); }} className="btn-danger py-1 px-2.5 text-[11px]">
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {expanded === v.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              <AnimatePresence>
                {expanded === v.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <span className="label">Vehicle Name</span>
                        <input value={v.name} onChange={e => updateVehicle(v.id, 'name', e.target.value)} className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="label">Category</span>
                        <select value={v.category} onChange={e => updateVehicle(v.id, 'category', e.target.value)} className="input-field">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <span className="label">Capacity</span>
                        <input value={v.capacity} onChange={e => updateVehicle(v.id, 'capacity', e.target.value)} className="input-field" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="label">Description</span>
                      <textarea rows={2} value={v.description} onChange={e => updateVehicle(v.id, 'description', e.target.value)} className="input-field" />
                    </div>
                    <ImageUploader label="Vehicle Photo" value={v.image} hint="Recommended: 800×500px"
                      onChange={val => updateVehicle(v.id, 'image', val)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} dirty={dirty} />
    </div>
  );
}
