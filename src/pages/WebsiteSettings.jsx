import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getWebsiteData, updateSection, resetToDefaults } from '../utils/storage';
import SaveBar from '../components/SaveBar';

export default function WebsiteSettings() {
  const data = getWebsiteData();
  const [settings, setSettings] = useState(data.settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const set = (field, value) => { setSettings(p => ({ ...p, [field]: value })); setDirty(true); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSection('settings', settings);
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    resetToDefaults();
    window.location.reload();
  };

  const totalSize = (() => {
    try {
      const raw = localStorage.getItem('snt_cms_data') || '';
      return (new Blob([raw]).size / 1024).toFixed(1);
    } catch { return '—'; }
  })();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <Settings className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="section-title">Website Settings</h1>
          <p className="section-subtitle">SEO, branding, and system configuration</p>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>SEO & Meta</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <span className="label">Site Title (Browser Tab)</span>
            <input value={settings.siteTitle || ''} onChange={e => set('siteTitle', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1.5">
            <span className="label">Meta Description</span>
            <textarea rows={3} value={settings.metaDescription || ''} onChange={e => set('metaDescription', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1.5">
            <span className="label">Google Analytics ID (e.g. G-XXXXXXXXXX)</span>
            <input value={settings.googleAnalyticsId || ''} onChange={e => set('googleAnalyticsId', e.target.value)} className="input-field" placeholder="G-XXXXXXXXXX" />
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[['primaryColor', 'Primary Color (Orange)'], ['accentColor', 'Accent Color (Light Orange)']].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <span className="label">{label}</span>
              <div className="flex items-center gap-3">
                <input type="color" value={settings[field] || '#f97316'} onChange={e => set(field, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0.5" />
                <input value={settings[field] || ''} onChange={e => set(field, e.target.value)} className="input-field font-mono" placeholder="#f97316" />
              </div>
              <div className="h-2 rounded-full" style={{ background: settings[field] || '#f97316' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Maintenance Mode</h2>
            <p className="text-slate-500 text-xs mt-0.5">Show a "Coming Soon" banner on the main website</p>
          </div>
          <button
            onClick={() => set('maintenanceMode', !settings.maintenanceMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {settings.maintenanceMode && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            Maintenance mode is ON — visitors will see the maintenance message.
          </motion.div>
        )}
      </div>

      {/* Storage Info */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Storage Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['Storage Engine', 'LocalStorage (Browser)'],
            ['CMS Data Key', 'snt_cms_data'],
            ['Data Size', `${totalSize} KB`],
          ].map(([label, val]) => (
            <div key={label} className="p-3 bg-[#0a0f1e] rounded-xl border border-white/5">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</p>
              <p className="text-slate-300 text-xs font-mono">{val}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          CMS data persists across browser sessions until manually cleared.
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border border-red-500/15 space-y-4">
        <h2 className="text-sm font-bold text-red-400 border-b border-red-500/10 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Danger Zone</h2>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-300 text-sm font-medium">Reset All Content to Defaults</p>
            <p className="text-slate-500 text-xs mt-0.5">Wipes all CMS data and restores the original website content.</p>
          </div>
          {!showReset ? (
            <button onClick={() => setShowReset(true)} className="btn-danger">
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Defaults
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-medium">Are you sure?</span>
              <button onClick={handleReset} className="btn-danger">Yes, Reset Everything</button>
              <button onClick={() => setShowReset(false)} className="btn-secondary text-xs py-2">Cancel</button>
            </div>
          )}
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} dirty={dirty} />
    </div>
  );
}
