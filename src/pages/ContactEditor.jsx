import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Mail, Globe } from 'lucide-react';
import { getWebsiteData, updateSection } from '../utils/storage';
import SaveBar from '../components/SaveBar';

export default function ContactEditor() {
  const data = getWebsiteData();
  const [contact, setContact] = useState(data.contact);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const set = (field, value) => { setContact(p => ({ ...p, [field]: value })); setDirty(true); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSection('contact', contact);
    setSaving(false); setSaved(true); setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, value, field, type = 'input', rows = 3 }) => (
    <div className="space-y-1.5">
      <span className="label">{label}</span>
      {type === 'textarea'
        ? <textarea rows={rows} value={value || ''} onChange={e => set(field, e.target.value)} className="input-field" />
        : <input type={type} value={value || ''} onChange={e => set(field, e.target.value)} className="input-field" />}
    </div>
  );

  const mapEmbedSrc = `https://maps.google.com/maps?q=${contact.mapQ || 'Kharagpur'}&output=embed`;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <Phone className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="section-title">Contact Details</h1>
          <p className="section-subtitle">Phone numbers, addresses, email, and map configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phone & WhatsApp */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Phone className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Helplines & WhatsApp</h2>
          </div>
          <Field label="Helplines Section Title" value={contact.helplinesTitle} field="helplinesTitle" />
          <Field label="Contact Persons (Names)" value={contact.contactPersons} field="contactPersons" />
          <div className="grid grid-cols-1 gap-3">
            <Field label="Phone Number 1" value={contact.phone1} field="phone1" />
            <Field label="Phone Number 2" value={contact.phone2} field="phone2" />
            <Field label="Phone Number 3" value={contact.phone3} field="phone3" />
          </div>
          <Field label="WhatsApp Prefill Message (URL encoded)" value={contact.whatsappPrefill} field="whatsappPrefill" />
        </div>

        {/* Email & Web */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Mail className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Email & Online</h2>
          </div>
          <Field label="Email Address" value={contact.email} field="email" type="email" />
          <Field label="Website URL" value={contact.website} field="website" />
        </div>

        {/* Registered Office */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <MapPin className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Registered Office</h2>
          </div>
          <Field label="Office Title" value={contact.registeredOfficeTitle} field="registeredOfficeTitle" />
          <Field label="Full Address (use \\n for line breaks)" value={contact.registeredOfficeAddress} field="registeredOfficeAddress" type="textarea" rows={4} />
        </div>

        {/* Workshop Office */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <MapPin className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Workshop & Yard</h2>
          </div>
          <Field label="Office Title" value={contact.workshopOfficeTitle} field="workshopOfficeTitle" />
          <Field label="Full Address (use \\n for line breaks)" value={contact.workshopOfficeAddress} field="workshopOfficeAddress" type="textarea" rows={4} />
        </div>
      </div>

      {/* Map Configuration */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Globe className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Google Maps Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-1.5">
            <span className="label">Map Search Query (e.g. "Shree+Nathji+Transport+Kharagpur")</span>
            <input value={contact.mapQ || ''} onChange={e => set('mapQ', e.target.value)} className="input-field" />
          </div>
          <div className="space-y-1.5">
            <span className="label">Latitude</span>
            <input value={contact.mapLat || ''} onChange={e => set('mapLat', e.target.value)} className="input-field" placeholder="22.3420058" />
          </div>
          <div className="space-y-1.5">
            <span className="label">Longitude</span>
            <input value={contact.mapLng || ''} onChange={e => set('mapLng', e.target.value)} className="input-field" placeholder="87.2633395" />
          </div>
        </div>

        {/* Live Map Preview */}
        <div className="mt-4 space-y-2">
          <span className="label">Live Map Preview</span>
          <div className="rounded-xl overflow-hidden border border-white/8 h-52">
            <iframe
              key={contact.mapQ}
              src={mapEmbedSrc}
              width="100%" height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen loading="lazy"
              title="Map preview"
            />
          </div>
          <p className="text-[11px] text-slate-600">Map updates after saving. Coordinates:&nbsp;
            <span className="text-slate-500 font-mono">{contact.mapLat}, {contact.mapLng}</span>
          </p>
        </div>
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} dirty={dirty} />
    </div>
  );
}
