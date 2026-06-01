import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Image, Settings, LogOut, ChevronRight, X,
  Images, Inbox, Briefcase
} from 'lucide-react';
import { logout, getAdminUser } from '../utils/storage';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/media', label: 'Media Manager', icon: Images },
  { to: '/contact-submissions', label: 'Contact Messages', icon: Inbox },
  { to: '/careers', label: 'Job Applications', icon: Briefcase },
  { to: '/gallery', label: 'Gallery Upload', icon: Image },
  { to: '/settings', label: 'Website Settings', icon: Settings },
];

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const user = getAdminUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#050c1a] border-r border-white/5 flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center font-black text-white text-xs shadow-lg">
            SN
          </div>
          <div>
            <p className="font-black text-white text-xs leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              SHREE NATHJI
            </p>
            <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest leading-none mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Admin Panel
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Admin Profile Card */}
      <div className="p-4 border-b border-white/5">
        <div className="glass-card rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-300 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-bold truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user?.username || 'Administrator'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Management
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 group relative ${
                  isActive
                    ? 'text-white bg-orange-500/10 border border-orange-500/20'
                    : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/3'
                }`
              }
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-orange-500 rounded-r"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`w-3 h-3 transition-opacity ${isActive ? 'text-orange-400 opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/5 transition-all"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <LogOut className="w-4 h-4" />
          Logout Session
        </button>
      </div>
    </aside>
  );
}
