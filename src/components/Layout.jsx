import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Clock } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useState(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617]">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden"
            >
              <Sidebar onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#020617]/80 backdrop-blur-sm flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg bg-white/4 border border-white/8 text-slate-400 hover:text-white"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="hidden md:block">
            <p className="text-white font-black text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Content Management System
            </p>
            <p className="text-[11px] text-slate-500">Shree Nathji Transport — Admin Console</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 ml-auto">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-mono">{time}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
