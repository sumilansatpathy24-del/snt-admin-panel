import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Filter, Trash2, CheckCircle2, XCircle, 
  Download, Calendar, Phone, Mail, FileText, AlertCircle, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { 
  getCareerApplications, deleteCareerApplication, 
  updateCareerApplicationStatus 
} from '../../utils/storage';

export default function CareerApplications() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/careers');
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      console.log('Career applications:', data);
      
      if (Array.isArray(data)) {
        setApplications(data);
        localStorage.setItem('careerApplications', JSON.stringify(data));
        
        // Auto-select first application if available
        if (data.length > 0 && !selectedApp) {
          setSelectedApp(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      const fallback = JSON.parse(localStorage.getItem('careerApplications')) || [];
      console.log('Career applications:', fallback);
      setApplications(fallback);
      
      // Auto-select first application if available
      if (fallback.length > 0 && !selectedApp) {
        setSelectedApp(fallback[0]);
      }
    }
  };

  const handleSelectApp = (app) => {
    setSelectedApp(app);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
      const res = await fetch(`/api/careers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status on server');
      await loadApplications();
    } catch (err) {
      console.warn('Server status update failed, falling back to localStorage:', err);
      updateCareerApplicationStatus(id, newStatus);
      const fallback = JSON.parse(localStorage.getItem('careerApplications')) || [];
      const updated = fallback.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('careerApplications', JSON.stringify(updated));
      setApplications(updated);
    }
    
    // Update selected view
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this career application?')) {
      try {
        const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
        const res = await fetch(`/api/careers/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to delete on server');
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(null);
        }
        await loadApplications();
      } catch (err) {
        console.warn('Server delete failed, falling back to localStorage:', err);
        deleteCareerApplication(id);
        const fallback = JSON.parse(localStorage.getItem('careerApplications')) || [];
        const filtered = fallback.filter(item => item.id !== id);
        localStorage.setItem('careerApplications', JSON.stringify(filtered));
        setApplications(filtered);
        
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(null);
        }
      }
    }
  };

  // Helper to extract unique positions for filtering dropdown
  const uniquePositions = Array.from(new Set([
    'All',
    ...applications.map(app => app.position)
  ]));

  // Statistics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const shortlistedCount = applications.filter(a => a.status === 'shortlisted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  // Search & Filter Operations
  const filteredApps = applications.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.experience.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.phone.includes(searchTerm);
    
    const matchPosition = positionFilter === 'All' || app.position === positionFilter;
    const matchStatus = statusFilter === 'All' || app.status === statusFilter.toLowerCase();
    
    return matchSearch && matchPosition && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col justify-between">
      {/* Page Header */}
      <div>
        <h2 className="font-outfit font-black text-2xl md:text-3xl text-white">
          Career <span className="text-orange-500">Applications</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Review applicant profiles, read cover letters, download resumes, and coordinate logistics hiring pipelines.</p>
      </div>

      {/* Stats counter widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Total Applied</p>
            <h4 className="font-outfit font-black text-white text-2xl mt-1">{totalCount}</h4>
          </div>
          <div className="p-2.5 bg-slate-900 border border-white/5 text-slate-400 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Pending Review</p>
            <h4 className="font-outfit font-black text-orange-400 text-2xl mt-1">{pendingCount}</h4>
          </div>
          <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl shadow-glow-orange">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Shortlisted</p>
            <h4 className="font-outfit font-black text-emerald-400 text-2xl mt-1">{shortlistedCount}</h4>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Rejected</p>
            <h4 className="font-outfit font-black text-red-400 text-2xl mt-1">{rejectedCount}</h4>
          </div>
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Master Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
        
        {/* Left Side: Applicants List (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-white/5 shadow-xl flex flex-col overflow-hidden max-h-[600px] h-[500px] lg:h-auto">
          {/* List Toolbar */}
          <div className="p-4 border-b border-white/5 flex flex-col gap-3 flex-shrink-0 bg-[#050c1a]/55">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search candidates..."
                className="input-field !pl-9 !py-2"
              />
            </div>
            
            {/* Filtering select */}
            <div className="flex gap-2">
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="input-field select !py-1.5 text-[11px] font-bold flex-grow"
              >
                {uniquePositions.map(pos => (
                  <option key={pos} value={pos}>{pos === 'All' ? 'All Roles' : pos}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field select !py-1.5 text-[11px] font-bold !w-28"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Candidates Scroll List */}
          <div className="flex-grow overflow-y-auto divide-y divide-white/5">
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleSelectApp(app)}
                  className={`p-4 flex flex-col gap-1.5 cursor-pointer transition-colors duration-150 relative ${
                    selectedApp?.id === app.id
                      ? 'bg-orange-500/5'
                      : 'hover:bg-white/2'
                  }`}
                >
                  {/* Selection Indicator Border */}
                  {selectedApp?.id === app.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-outfit font-black text-xs text-white max-w-[70%] truncate">
                      {app.name}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold font-mono">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-orange-400 font-bold font-outfit uppercase tracking-wider truncate max-w-[80%]">
                      {app.position}
                    </span>
                    
                    {/* Status badge pill */}
                    <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                      app.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400' :
                      app.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-[9px] text-slate-500 font-mono">
                    Experience: <span className="text-slate-300 font-bold">{app.experience}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                <Briefcase className="w-8 h-8 text-slate-600" />
                <div>
                  <p className="font-outfit font-bold text-white text-xs">No applications found</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Hiring list is empty.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Candidate Profile Detail Panel (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-white/5 shadow-xl flex flex-col overflow-hidden min-h-[450px]">
          {selectedApp ? (
            <div className="flex flex-col h-full bg-[#050c1a]/20">
              
              {/* Detail Header */}
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#050c1a]/40 flex-shrink-0">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-outfit font-black text-white text-lg leading-snug">
                      {selectedApp.name}
                    </h3>
                    {/* Status Badge */}
                    <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      selectedApp.status === 'shortlisted' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                      selectedApp.status === 'rejected' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                      'bg-orange-500/15 text-orange-400 border border-orange-500/20 shadow-glow-orange'
                    }`}>
                      {selectedApp.status}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-orange-400 font-outfit font-bold uppercase tracking-wider mt-0.5">
                    Applying for: {selectedApp.position} · Exp: {selectedApp.experience}
                  </p>
                </div>

                {/* Shortlist / Reject / Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'shortlisted')}
                    className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 hover:text-white hover:bg-emerald-500 transition shadow-sm"
                    aria-label="Shortlist Candidate"
                    title="Shortlist applicant"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                    className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition shadow-sm"
                    aria-label="Reject Candidate"
                    title="Reject applicant"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <div className="h-6 w-[1px] bg-white/10 mx-1" />

                  <button
                    onClick={() => handleDelete(selectedApp.id)}
                    className="p-2 rounded-lg bg-white/3 border border-white/5 text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-600 transition shadow-sm"
                    aria-label="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-6 flex-grow space-y-6 overflow-y-auto">
                {/* Info Contacts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href={`tel:${selectedApp.phone}`}
                    className="glass-card rounded-xl p-3.5 border border-white/5 hover:border-orange-500/20 hover:bg-white/1 transition-all duration-200 flex items-center gap-3.5 group"
                  >
                    <div className="p-2 bg-slate-900 border border-white/5 text-orange-400 rounded-lg group-hover:bg-orange-500/10 shadow-sm flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mobile Phone</span>
                      <span className="block font-outfit font-black text-slate-200 text-sm mt-0.5 truncate">{selectedApp.phone}</span>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${selectedApp.email}`}
                    className="glass-card rounded-xl p-3.5 border border-white/5 hover:border-orange-500/20 hover:bg-white/1 transition-all duration-200 flex items-center gap-3.5 group"
                  >
                    <div className="p-2 bg-slate-900 border border-white/5 text-orange-400 rounded-lg group-hover:bg-orange-500/10 shadow-sm flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Email Address</span>
                      <span className="block font-outfit font-black text-slate-200 text-sm mt-0.5 truncate">{selectedApp.email}</span>
                    </div>
                  </a>
                </div>

                {/* Resume Download Action Box */}
                <div className="space-y-2">
                  <span className="label">Documents Folder</span>
                  <div className="glass-card rounded-xl p-4 border border-white/5 bg-[#020617]/50 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white leading-tight truncate">
                          {selectedApp.resumeName || 'Resume.pdf'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          Format: {selectedApp.resumeType?.includes('pdf') ? 'PDF Document' : 'Word Document'}
                        </p>
                      </div>
                    </div>

                    {/* Native Clickable File Download Link */}
                    <a
                      href={selectedApp.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={selectedApp.resumeName || 'Resume.pdf'}
                      className="btn-secondary !py-2 !px-3.5 !text-[10px] flex items-center gap-1.5 hover:shadow-glow-orange-lg hover:border-orange-500/30"
                    >
                      <Download className="w-3.5 h-3.5 text-orange-400" />
                      <span>Download File</span>
                    </a>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div className="space-y-2">
                    <span className="label">Cover Letter / Personal Statement</span>
                    <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#020617]/50 text-slate-300 font-inter text-xs leading-relaxed whitespace-pre-wrap">
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dispatch Action Panel */}
              <div className="p-4 border-t border-white/5 bg-[#050c1a]/30 flex gap-3 justify-between items-center flex-shrink-0">
                <span className="text-[9px] text-slate-500 font-mono">
                  Applied on: {new Date(selectedApp.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <a
                  href={`mailto:${selectedApp.email}?subject=Career Application at Shree Nathji Transport`}
                  className="btn-primary !py-2.5 !px-5 !text-[10px]"
                >
                  <span>Dispatch Feedback</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ) : (
            /* Empty details state */
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-slate-500 text-center space-y-4">
              <div className="p-4 bg-slate-900 border border-white/5 text-slate-600 rounded-full">
                <Briefcase className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <p className="font-outfit font-bold text-white text-sm">No application selected</p>
                <p className="text-xs text-slate-500 mt-1">Select a candidate card from the left lists to view resume details and logs.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
