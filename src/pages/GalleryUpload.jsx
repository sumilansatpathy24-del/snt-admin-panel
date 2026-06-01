import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, Tag, Loader2, AlertCircle, Upload, Check, Eye } from 'lucide-react';
import { generateId, uploadImage } from '../utils/storage';

const CATEGORIES = [
  'Awards & Recognition',
  'Events',
  'Business Promotion',
  'Team Activities',
  'Industrial Operations',
  'Fleet Showcase'
];

export default function GalleryUpload() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[4]); // Defaults to 'Industrial Operations'
  
  const fileInputRef = useRef(null);

  // Load from API on mount
  const loadGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      console.log('Fetched gallery data:', data);
      
      if (Array.isArray(data)) {
        setItems(data);
        localStorage.setItem('galleryImages', JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
      console.log('Fetched gallery data:', fallback);
      setItems(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileSelect = (selectedFile) => {
    setError('');
    
    // Size check (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }
    
    // Type check
    if (!selectedFile.type.startsWith('image/')) {
      setError('Only image files (JPG, PNG, WEBP, GIF) are allowed');
      return;
    }

    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a photo title.');
      return;
    }

    setUploading(true);
    
    try {
      const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
      
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', selectedCategory);
      formData.append('image', file);

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server upload failed');
      }

      const uploadResult = await res.json();
      setSuccess('Photo published successfully and added to gallery!');
      
      // Clear Form
      setFile(null);
      setPreview('');
      setTitle('');
      
      await loadGallery();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.warn('Server upload failed, falling back to localStorage:', err);
      try {
        const base64Url = await uploadImage(file);
        const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
        const newMedia = {
          id: generateId(),
          title: title.trim(),
          category: selectedCategory,
          imageUrl: base64Url,
          createdAt: new Date().toISOString()
        };
        fallback.unshift(newMedia);
        localStorage.setItem('galleryImages', JSON.stringify(fallback));
        
        setFile(null);
        setPreview('');
        setTitle('');
        setSuccess('Photo published locally (Offline mode)!');
        await loadGallery();
        setTimeout(() => setSuccess(''), 3000);
      } catch (localErr) {
        setError(localErr.message || 'Failed to upload photo locally');
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this photo?')) return;
    
    try {
      const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Server delete failed');
      await loadGallery();
    } catch (err) {
      console.warn('Server delete failed, falling back to localStorage:', err);
      const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
      const filtered = fallback.filter(item => item.id !== id);
      localStorage.setItem('galleryImages', JSON.stringify(filtered));
      await loadGallery();
    }
  };

  const allCategories = ['All', ...CATEGORIES];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="font-outfit font-black text-2xl md:text-3xl text-white">
          Gallery <span className="text-orange-500">Upload</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Publish operations photos and events milestones directly to the website gallery feed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Category Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
          <h3 className="font-outfit font-bold text-white text-base mb-2 flex items-center gap-2 border-b border-white/5 pb-3">
            <Upload className="w-4 h-4 text-orange-400" />
            Publish New Photo
          </h3>

          <form onSubmit={handlePublishSubmit} className="space-y-4">
            {/* Drag & Drop File input */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${file ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10 hover:border-orange-500/30 bg-white/1'} rounded-xl p-6 text-center cursor-pointer transition-all duration-200 relative group overflow-hidden h-44 flex flex-col items-center justify-center`}
            >
              {preview ? (
                <img 
                  src={preview} 
                  alt="Upload preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="p-3.5 bg-[#050c1a] border border-white/5 rounded-lg text-slate-400 group-hover:text-orange-400 transition-colors shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              
              <div className="relative z-10 mt-3.5">
                <p className="text-xs font-bold text-slate-200 max-w-[200px] truncate mx-auto">
                  {file ? file.name : 'Select operations picture'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  JPG, PNG, WEBP, GIF up to 10MB
                </p>
              </div>

              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) handleFileSelect(f);
                }}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <span className="label">Photo Title</span>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tata Signa Slag Transport Dispatch"
                className="input-field"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <span className="label">Operations Category</span>
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field select !py-2.5"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/25 p-3 rounded-lg text-red-400 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2"
                >
                  <Check className="w-4 h-4 flex-shrink-0 animate-bounce" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={uploading}
              className="btn-primary w-full justify-center !py-3 mt-2"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{uploading ? 'Publishing...' : 'Publish to Gallery'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Published Media Library (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <span className="font-outfit font-bold text-white text-base">Published Media Library</span>
            
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Filter:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field select !py-1.5 !w-44"
              >
                {allCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-slate-400 font-inter text-xs">Loading operational gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1 select-none scrollbar-none">
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/20 flex flex-col justify-between shadow-md relative group transition-all duration-300"
                    >
                      <div className="relative h-28 overflow-hidden bg-brand-navy">
                        <img
                          src={item.imageUrl || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          loading="lazy"
                        />
                        
                        {/* Hover delete trash trigger */}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg transition-colors shadow backdrop-blur-sm border border-red-500/10 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100"
                          title="Permanently Delete Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Category overlay */}
                        <div className="absolute inset-0 bg-[#020617]/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                      </div>
                      <div className="p-3 space-y-1 bg-gradient-to-b from-white/1 to-transparent">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-orange-400 block font-outfit leading-none">
                          {item.category}
                        </span>
                        <h4 className="font-outfit font-bold text-white text-xs line-clamp-1 leading-tight">
                          {item.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 py-16 text-center border border-dashed border-white/10 rounded-xl p-8 space-y-3.5 flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                    <div>
                      <h4 className="font-outfit font-bold text-white text-sm">Media Library Empty</h4>
                      <p className="text-[10px] text-slate-500 font-inter mt-1 leading-relaxed max-w-[200px] mx-auto">
                        No photos match this category filter. Upload one using the form on the left!
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
