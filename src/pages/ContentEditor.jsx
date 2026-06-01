import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { getWebsiteData, updateSection } from '../utils/storage';
import ImageUploader from '../components/ImageUploader';
import SaveBar from '../components/SaveBar';

const tabs = [
  { id: 'meta', label: 'Company Info' },
  { id: 'hero', label: 'Hero Section' },
  { id: 'about', label: 'About Section' },
  { id: 'footer', label: 'Footer' },
];

export default function ContentEditor() {
  const data = getWebsiteData();
  const [activeTab, setActiveTab] = useState('meta');
  const [meta, setMeta] = useState(data.meta);
  const [hero, setHero] = useState(data.hero);
  const [about, setAbout] = useState(data.about);
  const [footer, setFooter] = useState(data.footer);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const markDirty = () => { setDirty(true); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSection('meta', meta);
    updateSection('hero', hero);
    updateSection('about', about);
    updateSection('footer', footer);
    setSaving(false);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, value, onChange, type = 'input', rows = 3 }) => (
    <div className="space-y-1.5">
      <span className="label">{label}</span>
      {type === 'textarea' ? (
        <textarea rows={rows} value={value} onChange={e => { onChange(e.target.value); markDirty(); }}
          className="input-field" />
      ) : (
        <input type={type} value={value} onChange={e => { onChange(e.target.value); markDirty(); }}
          className="input-field" />
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="section-title">Content Editor</h1>
          <p className="section-subtitle">Edit hero, about, footer, and company information</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === t.id
                ? 'bg-orange-500/15 border border-orange-500/30 text-orange-300'
                : 'bg-white/3 border border-white/6 text-slate-400 hover:text-white'
            }`}
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            {t.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 space-y-5">

        {/* ── COMPANY INFO ── */}
        {activeTab === 'meta' && (
          <>
            <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Company Name" value={meta.companyName} onChange={v => setMeta(p => ({ ...p, companyName: v }))} />
              <Field label="Tagline" value={meta.tagline} onChange={v => setMeta(p => ({ ...p, tagline: v }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ImageUploader label="Company Logo" value={meta.logoUrl} hint="Shown in navbar and footer"
                onChange={v => { setMeta(p => ({ ...p, logoUrl: v })); markDirty(); }} />
              <ImageUploader label="Favicon" value={meta.faviconUrl} hint="Browser tab icon (square, 32×32)"
                onChange={v => { setMeta(p => ({ ...p, faviconUrl: v })); markDirty(); }} />
            </div>
          </>
        )}

        {/* ── HERO ── */}
        {activeTab === 'hero' && (
          <>
            <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Hero Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Badge Text" value={hero.badgeText} onChange={v => setHero(p => ({ ...p, badgeText: v }))} />
              <Field label="CTA Button Text" value={hero.ctaText} onChange={v => setHero(p => ({ ...p, ctaText: v }))} />
              <Field label="Heading Line 1" value={hero.titleLine1} onChange={v => setHero(p => ({ ...p, titleLine1: v }))} />
              <Field label="Heading Line 2 (Highlighted)" value={hero.titleLine2} onChange={v => setHero(p => ({ ...p, titleLine2: v }))} />
            </div>
            <Field label="Hero Description" value={hero.description} onChange={v => setHero(p => ({ ...p, description: v }))} type="textarea" rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Feature Bullet 1" value={hero.point1} onChange={v => setHero(p => ({ ...p, point1: v }))} />
              <Field label="Feature Bullet 2" value={hero.point2} onChange={v => setHero(p => ({ ...p, point2: v }))} />
            </div>
            <ImageUploader label="Hero Background Image" value={hero.bgImage} hint="Full-width background (1920×1080 recommended)"
              onChange={v => { setHero(p => ({ ...p, bgImage: v })); markDirty(); }} />
          </>
        )}

        {/* ── ABOUT ── */}
        {activeTab === 'about' && (
          <>
            <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>About Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Section Subtitle Badge" value={about.subtitle} onChange={v => setAbout(p => ({ ...p, subtitle: v }))} />
              <Field label="Title (use \\n for line break)" value={about.title} onChange={v => setAbout(p => ({ ...p, title: v }))} />
            </div>
            <Field label="Mission Paragraph 1" value={about.description1} onChange={v => setAbout(p => ({ ...p, description1: v }))} type="textarea" rows={4} />
            <Field label="Mission Paragraph 2" value={about.description2} onChange={v => setAbout(p => ({ ...p, description2: v }))} type="textarea" rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {['bullet1','bullet2','bullet3','bullet4'].map((k,i) => (
                <Field key={k} label={`Check Bullet ${i+1}`} value={about[k]} onChange={v => setAbout(p => ({ ...p, [k]: v }))} />
              ))}
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 pt-4 border-t border-white/5" style={{ fontFamily: 'Outfit, sans-serif' }}>Statistics Counters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="space-y-2">
                  <Field label={`Stat ${n} Value`} value={about[`stat${n}_val`]} onChange={v => setAbout(p => ({ ...p, [`stat${n}_val`]: v }))} />
                  <Field label={`Stat ${n} Label`} value={about[`stat${n}_desc`]} onChange={v => setAbout(p => ({ ...p, [`stat${n}_desc`]: v }))} />
                </div>
              ))}
            </div>
            <ImageUploader label="About Section Image" value={about.image} hint="Right-side photo in about section"
              onChange={v => { setAbout(p => ({ ...p, image: v })); markDirty(); }} />
          </>
        )}

        {/* ── FOOTER ── */}
        {activeTab === 'footer' && (
          <>
            <h2 className="text-sm font-bold text-white border-b border-white/5 pb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Footer Content</h2>
            <Field label="Footer Brand Title" value={footer.aboutTitle} onChange={v => setFooter(p => ({ ...p, aboutTitle: v }))} />
            <Field label="Footer Description" value={footer.aboutDesc} onChange={v => setFooter(p => ({ ...p, aboutDesc: v }))} type="textarea" rows={3} />
            <Field label="Copyright Text" value={footer.copyrightText} onChange={v => setFooter(p => ({ ...p, copyrightText: v }))} />
          </>
        )}
      </motion.div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} dirty={dirty} />
    </div>
  );
}
