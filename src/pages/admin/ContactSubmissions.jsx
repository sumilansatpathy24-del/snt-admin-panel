import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, Search, Filter, Trash2, MailOpen, Mail, 
  Download, Calendar, Phone, Mail as MailIcon, AlertCircle, MessageSquare
} from 'lucide-react';
import { 
  getContactSubmissions, deleteContactSubmission, 
  updateContactSubmissionStatus 
} from '../../utils/storage';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('API failed');
      const data = await response.json();
      console.log('Contact submissions:', data);
      
      if (Array.isArray(data)) {
        setSubmissions(data);
        localStorage.setItem('contactMessages', JSON.stringify(data));
        
        // Automatically select the first submission if available and nothing is selected
        if (data.length > 0 && !selectedSubmission) {
          setSelectedSubmission(data[0]);
          if (data[0].status === 'unread') {
            await handleMarkStatus(data[0].id, 'read');
          }
        }
      }
    } catch (err) {
      console.error(err);
      const fallback = JSON.parse(localStorage.getItem('contactMessages')) || [];
      console.log('Contact submissions:', fallback);
      setSubmissions(fallback);
      
      if (fallback.length > 0 && !selectedSubmission) {
        setSelectedSubmission(fallback[0]);
        if (fallback[0].status === 'unread') {
          handleMarkStatus(fallback[0].id, 'read');
        }
      }
    }
  };

  const handleSelectSubmission = async (sub) => {
    setSelectedSubmission(sub);
    if (sub.status === 'unread') {
      await handleMarkStatus(sub.id, 'read');
    }
  };

  const handleMarkStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
      const res = await fetch(`/api/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status on server');
      
      // Reload submissions from server
      await loadSubmissions();
    } catch (err) {
      console.warn('Server status update failed, falling back to localStorage:', err);
      updateContactSubmissionStatus(id, newStatus);
      const fallback = JSON.parse(localStorage.getItem('contactMessages')) || [];
      const updated = fallback.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('contactMessages', JSON.stringify(updated));
      setSubmissions(updated);
    }
    
    // Update selected view
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this customer inquiry?')) {
      try {
        const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
        const res = await fetch(`/api/contact/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to delete on server');
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(null);
        }
        await loadSubmissions();
      } catch (err) {
        console.warn('Server delete failed, falling back to localStorage:', err);
        deleteContactSubmission(id);
        const fallback = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const filtered = fallback.filter(item => item.id !== id);
        localStorage.setItem('contactMessages', JSON.stringify(filtered));
        setSubmissions(filtered);
        
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(null);
        }
      }
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Email Address', 'Phone Number', 'Message Details', 'Status', 'Submitted At'];
    
    const rows = submissions.map(sub => [
      sub.id,
      `"${sub.name.replace(/"/g, '""')}"`,
      sub.email,
      `"${sub.phone}"`,
      `"${sub.message.replace(/"/g, '""')}"`,
      sub.status.toUpperCase(),
      sub.createdAt
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Added BOM for Excel UTF-8 support
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SNT_Contact_Submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics
  const totalCount = submissions.length;
  const unreadCount = submissions.filter(s => s.status === 'unread').length;
  const readCount = totalCount - unreadCount;

  // Search & Filter Operations
  const filteredSubmissions = submissions.filter(sub => {
    const matchSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sub.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sub.phone.includes(searchTerm);
    
    const matchStatus = statusFilter === 'All' || sub.status === statusFilter.toLowerCase();
    
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fadeIn h-full flex flex-col justify-between">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit font-black text-2xl md:text-3xl text-white">
            Contact <span className="text-orange-500">Submissions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Receive, manage, and process general freight quote inquiries and messages in real-time.</p>
        </div>

        {/* CSV Export Button */}
        {totalCount > 0 && (
          <button
            onClick={handleExportCSV}
            className="btn-secondary !text-xs self-start sm:self-auto font-outfit"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export inquiries CSV</span>
          </button>
        )}
      </div>

      {/* Stats Counter Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Total Messages</p>
            <h4 className="font-outfit font-black text-white text-2xl mt-1.5">{totalCount}</h4>
          </div>
          <div className="p-3 bg-slate-900 border border-white/5 text-slate-400 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Unread Inbox</p>
            <h4 className="font-outfit font-black text-orange-400 text-2xl mt-1.5">{unreadCount}</h4>
          </div>
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl shadow-glow-orange">
            <Mail className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-outfit">Processed Inquiries</p>
            <h4 className="font-outfit font-black text-emerald-400 text-2xl mt-1.5">{readCount}</h4>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <MailOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Master Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
        
        {/* Left Side: Message List (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl border border-white/5 shadow-xl flex flex-col overflow-hidden max-h-[600px] h-[500px] lg:h-auto">
          {/* List Toolbar */}
          <div className="p-4 border-b border-white/5 flex gap-3 flex-shrink-0 bg-[#050c1a]/55">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inbox..."
                className="input-field !pl-9 !py-2"
              />
            </div>
            
            {/* Filter Tabs */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field select !py-2 !w-28 text-xs font-bold"
            >
              <option value="All">All Inboxes</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>

          {/* List Content */}
          <div className="flex-grow overflow-y-auto divide-y divide-white/5">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 flex flex-col gap-1.5 cursor-pointer transition-colors duration-150 relative ${
                    selectedSubmission?.id === sub.id
                      ? 'bg-orange-500/5'
                      : 'hover:bg-white/2'
                  }`}
                >
                  {/* Active Border */}
                  {selectedSubmission?.id === sub.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-outfit font-black text-xs text-white max-w-[70%] truncate">
                      {sub.name}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold font-mono">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-inter truncate max-w-[95%]">
                    {sub.message}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-slate-500 font-mono font-bold truncate max-w-[80%]">
                      {sub.email}
                    </span>
                    
                    {sub.status === 'unread' ? (
                      <span className="flex h-2 w-2 relative flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                    ) : (
                      <MailOpen className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
                <Inbox className="w-8 h-8 text-slate-600" />
                <div>
                  <p className="font-outfit font-bold text-white text-xs">No inquiries matching criteria</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Inbox is completely clear.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Message Detail Panel (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-white/5 shadow-xl flex flex-col overflow-hidden min-h-[450px]">
          {selectedSubmission ? (
            <div className="flex flex-col h-full bg-[#050c1a]/20">
              
              {/* Detail Header */}
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#050c1a]/40 flex-shrink-0">
                <div>
                  <h3 className="font-outfit font-black text-white text-lg leading-snug">
                    {selectedSubmission.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-inter mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-500/70" />
                    <span>Submitted on: {new Date(selectedSubmission.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </p>
                </div>

                {/* Mark as Unread / Delete */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleMarkStatus(
                      selectedSubmission.id, 
                      selectedSubmission.status === 'read' ? 'unread' : 'read'
                    )}
                    className="btn-secondary !py-2 !px-3.5 !text-[10px] flex items-center gap-2"
                  >
                    {selectedSubmission.status === 'read' ? (
                      <>
                        <Mail className="w-3.5 h-3.5 text-orange-500" />
                        <span>Keep Unread</span>
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mark Read</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition shadow-sm"
                    aria-label="Delete Submission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="p-6 flex-grow space-y-6 overflow-y-auto">
                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href={`tel:${selectedSubmission.phone}`}
                    className="glass-card rounded-xl p-3.5 border border-white/5 hover:border-orange-500/20 hover:bg-white/1 transition-all duration-200 flex items-center gap-3.5 group"
                  >
                    <div className="p-2 bg-slate-900 border border-white/5 text-orange-400 rounded-lg group-hover:bg-orange-500/10 shadow-sm flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mobile Contact</span>
                      <span className="block font-outfit font-black text-slate-200 text-sm mt-0.5 truncate">{selectedSubmission.phone}</span>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${selectedSubmission.email}`}
                    className="glass-card rounded-xl p-3.5 border border-white/5 hover:border-orange-500/20 hover:bg-white/1 transition-all duration-200 flex items-center gap-3.5 group"
                  >
                    <div className="p-2 bg-slate-900 border border-white/5 text-orange-400 rounded-lg group-hover:bg-orange-500/10 shadow-sm flex-shrink-0">
                      <MailIcon className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Email Coordinates</span>
                      <span className="block font-outfit font-black text-slate-200 text-sm mt-0.5 truncate">{selectedSubmission.email}</span>
                    </div>
                  </a>
                </div>

                {/* Message Body Box */}
                <div className="space-y-2">
                  <span className="label">Message Context</span>
                  <div className="glass-card rounded-xl p-5 border border-white/5 bg-[#020617]/50 text-slate-300 font-inter text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>
              </div>
              
              {/* Quick dispatch bar */}
              <div className="p-4 border-t border-white/5 bg-[#050c1a]/30 flex gap-3 justify-end flex-shrink-0">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=RE: Shree Nathji Transport Inquiry`}
                  className="btn-primary !py-2.5 !px-5 !text-[10px]"
                >
                  <MailIcon className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>

            </div>
          ) : (
            /* Panel Placeholder */
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-slate-500 text-center space-y-4">
              <div className="p-4 bg-slate-900 border border-white/5 text-slate-600 rounded-full">
                <Inbox className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <p className="font-outfit font-bold text-white text-sm">No inquiry selected</p>
                <p className="text-xs text-slate-500 mt-1">Select a message card from the left panel inbox to inspect details.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
