import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { getWebsiteData, updateSection, generateId } from '../utils/storage';
import SaveBar from '../components/SaveBar';

const ICONS = ['Layers', 'Truck', 'Package', 'Shield', 'CalendarCheck', 'Star', 'Zap', 'Globe', 'BarChart3', 'Settings'];

export default function ServicesEditor() {
  const data = getWebsiteData();
  const [header, setHeader] = useState(data.services);
  const [list, setList] = useState(data.services.list || []);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const markDirty = () => { setDirty(true); setSaved(false); };

  const addService = () => {
    const newService = { id: generateId(), title: 'New Service', icon: 'Layers', description: 'Service description here.' };
    setList(p => [...p, newService]);
    setExpanded(newService.id);
    markDirty();
  };

  const updateService = (id, field, value) => {
    setList(p => p.map(s => s.id === id ? { ...s, [field]: value } : s));
    markDirty();
  };

  const deleteService = (id) => {
    setList(p => p.filter(s => s.id !== id));
    if (expanded === id) setExpanded(null);
    markDirty();
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSection('services', { ...header, list });
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Wrench className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="section-title">Services Editor</h1>
            <p className="section-subtitle">Add, edit, and reorder your service offerings</p>
          </div>
        </div>
        <button onClick={addService} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Section Header Fields */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Section Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['Subtitle Badge', 'subtitle'],
            ['Section Title', 'title'],
          ].map(([label, field]) => (
            <div key={field} className="space-y-1.5">
              <span className="label">{label}</span>
              <input value={header[field] || ''} onChange={e => { setHeader(p => ({ ...p, [field]: e.target.value })); markDirty(); }}
                className="input-field" />
            </div>
          ))}
          <div className="space-y-1.5 md:col-span-2">
            <span className="label">Section Description</span>
            <textarea rows={2} value={header.description || ''} onChange={e => { setHeader(p => ({ ...p, description: e.target.value })); markDirty(); }}
              className="input-field" />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Service Cards ({list.length})
          </h2>
        </div>

        <AnimatePresence>
          {list.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-600 text-sm">
              No services yet. Click "Add Service" to create one.
            </div>
          )}
          {list.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Card Header */}
              <div
                onClick={() => setExpanded(p => p === service.id ? null : service.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{service.title || 'Untitled Service'}</p>
                    <p className="text-slate-500 text-xs truncate max-w-xs">{service.description?.substring(0, 60)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={e => { e.stopPropagation(); deleteService(service.id); }}
                    className="btn-danger py-1 px-2.5 text-[11px]">
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {expanded === service.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Editor */}
              <AnimatePresence>
                {expanded === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 p-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="label">Service Title</span>
                        <input value={service.title} onChange={e => updateService(service.id, 'title', e.target.value)}
                          className="input-field" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="label">Icon Name</span>
                        <select value={service.icon} onChange={e => updateService(service.id, 'icon', e.target.value)}
                          className="input-field">
                          {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="label">Description</span>
                      <textarea rows={3} value={service.description} onChange={e => updateService(service.id, 'description', e.target.value)}
                        className="input-field" />
                    </div>
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
