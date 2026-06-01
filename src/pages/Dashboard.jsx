import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck, Settings,
  ArrowRight, BarChart3, CheckCircle2,
  Images, Inbox, Briefcase
} from 'lucide-react';
import { 
  getWebsiteData, getMediaUploads, 
  getContactSubmissions, getCareerApplications 
} from '../utils/storage';

const cards = [
  { to: '/media', label: 'Media Manager', desc: 'Upload banners, fleet & office photos', icon: Images, color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20' },
  { to: '/contact-submissions', label: 'Contact Messages', desc: 'Respond to general cargo quotes', icon: Inbox, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
  { to: '/careers', label: 'Job Applications', desc: 'Inspect driver and crew resumes', icon: Briefcase, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
  { to: '/settings', label: 'Website Settings', desc: 'Meta, colors, branding', icon: Settings, color: 'from-slate-500/20 to-slate-600/10', border: 'border-slate-500/20' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const data = getWebsiteData();
  const mediaCount = getMediaUploads().length;
  const submissions = getContactSubmissions();
  const unreadMessages = submissions.filter(s => s.status === 'unread').length;
  const careerCount = getCareerApplications().length;

  const stats = [
    { label: 'Unread Messages', value: unreadMessages, icon: Inbox, isAlert: unreadMessages > 0 },
    { label: 'Job Applications', value: careerCount, icon: Briefcase },
    { label: 'Media Assets', value: mediaCount, icon: Images },
    { label: 'Fleet Vehicles', value: data.fleet?.vehicles?.length || 0, icon: Truck },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="section-title text-2xl">Dashboard Overview</h1>
        <p className="section-subtitle mt-1">Welcome back — manage your website content from here.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5 flex items-start gap-4"
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
                stat.isAlert 
                  ? 'bg-orange-500/20 border-orange-500/40 animate-pulse shadow-glow-orange' 
                  : 'bg-orange-500/10 border-orange-500/15'
              }`}>
                <Icon className={`w-4 h-4 ${stat.isAlert ? 'text-orange-500 text-glow' : 'text-orange-400'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.label}</p>
                <p className={`font-black text-white mt-1 ${stat.isText ? 'text-sm' : 'text-2xl'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-emerald-400 text-xs font-medium">
          CMS is active — all changes save instantly to LocalStorage and sync to the main website.
        </p>
      </motion.div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                onClick={() => navigate(card.to)}
                className={`glass-card glass-card-hover rounded-2xl p-5 text-left group flex items-center justify-between transition-all`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border ${card.border} flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{card.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{card.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Company Info Summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Company Info Summary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            ['Company Name', data.meta?.companyName],
            ['Tagline', data.meta?.tagline],
            ['Hero Heading', `${data.hero?.titleLine1} ${data.hero?.titleLine2}`],
            ['Contact Email', data.contact?.email],
            ['Primary Phone', data.contact?.phone1],
            ['Services Count', `${data.services?.list?.length || 0} active services`],
          ].map(([key, val]) => (
            <div key={key} className="flex gap-3">
              <span className="text-slate-600 min-w-[120px] flex-shrink-0">{key}:</span>
              <span className="text-slate-300 truncate">{val || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
