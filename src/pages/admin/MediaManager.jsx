import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Search, Filter, Calendar, Trash2, Edit2, 
  Plus, Check, X, Image as ImageIcon, FileText, AlertCircle
} from 'lucide-react';
import { 
  getMediaUploads, saveMediaUpload, deleteMediaUpload, 
  updateMediaUpload, uploadImage 
} from '../../utils/storage';
import { API_BASE_URL } from '../../config/api';

const DEFAULT_CATEGORIES = [
  'Homepage Banner',
  'Gallery',
  'Fleet',
  'Drivers',
  'Office',
  'Documents',
  'Blog',
  'Testimonials',
  'Other'
];

export default function MediaManager() {
  // Media State
  const [mediaList, setMediaList] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  
  // Form State
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Gallery');
  const [description, setDescription] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCatInput, setShowCustomCatInput] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // UX State
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDesc, setEditDesc] = useState('');
  
  const fileInputRef = useRef(null);

  // Load uploads on mount
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      if (!response.ok) {
        throw new Error('API failed');
      }
      const data = await response.json();
      console.log('Fetched gallery data:', data);
      
      if (Array.isArray(data)) {
        setMediaList(data);
        localStorage.setItem('galleryImages', JSON.stringify(data));
        
        // Extract any custom categories from loaded media
        const uniqueCats = Array.from(new Set([
          ...DEFAULT_CATEGORIES,
          ...data.map(m => m.category)
        ]));
        setCategories(uniqueCats);
      }
    } catch (err) {
      console.error(err);
      const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
      console.log('Fetched gallery data:', fallback);
      setMediaList(fallback);
      
      const uniqueCats = Array.from(new Set([
        ...DEFAULT_CATEGORIES,
        ...fallback.map(m => m.category)
      ]));
      setCategories(uniqueCats);
    }
  };

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  // Handle File Input
  const handleFileSelect = (selectedFile) => {
    setError('');
    
    // Size check (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }
    
    // Type check
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(selectedFile.type)) {
      setError('Only JPG, PNG, WEBP, and GIF files are allowed');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // Add Custom Category
  const handleAddCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories(prev => [...prev, trimmed]);
      setCategory(trimmed);
    }
    setCustomCategory('');
    setShowCustomCatInput(false);
  };

  // Form Submit / Image Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select or drop an image file');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for the media file');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('image', file);

      const res = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Server upload failed');
      }

      const uploadResult = await res.json();
      setSuccess('Media file uploaded successfully!');
      
      // Clear Form
      setFile(null);
      setPreview('');
      setTitle('');
      setDescription('');
      
      // Reload list
      await loadMedia();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.warn('Backend upload failed, falling back to localStorage offline mode:', err);
      try {
        const base64Url = await uploadImage(file);
        const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
        const newMedia = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          title: title.trim(),
          category,
          description: description.trim(),
          imageUrl: base64Url,
          createdAt: new Date().toISOString()
        };
        fallback.unshift(newMedia);
        localStorage.setItem('galleryImages', JSON.stringify(fallback));
        
        setFile(null);
        setPreview('');
        setTitle('');
        setDescription('');
        setSuccess('Media file saved locally (Offline mode)!');
        await loadMedia();
        setTimeout(() => setSuccess(''), 3000);
      } catch (localErr) {
        setError(localErr.message || 'Failed to upload media file');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Media
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this media file?')) {
      try {
        const token = localStorage.getItem('adminToken') || 'admin-session-token-2026';
        const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to delete on server');
        }
        await loadMedia();
      } catch (err) {
        console.warn('Server delete failed, falling back to localStorage offline mode:', err);
        const fallback = JSON.parse(localStorage.getItem('galleryImages')) || [];
        const filtered = fallback.filter(m => m.id !== id);
        localStorage.setItem('galleryImages', JSON.stringify(filtered));
        await loadMedia();
      }
    }
  };

  // Start Edit Mode
  const startEdit = (media) => {
    setEditingId(media.id);
    setEditTitle(media.title);
    setEditCategory(media.category);
    setEditDesc(media.description);
  };

  // Save Edit
  const saveEdit = (id) => {
    updateMediaUpload(id, {
      title: editTitle,
      category: editCategory,
      description: editDesc
    });
    setEditingId(null);
    loadMedia();
  };

  // Search, Filter and Sort operations
  const filteredMedia = mediaList
    .filter(media => {
      const matchSearch = media.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          media.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedFilter === 'All' || media.category === selectedFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h2 className="font-outfit font-black text-2xl md:text-3xl text-white">
          Media <span className="text-orange-500">Manager</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Upload, categorize, and organize dynamic content assets for the Shree Nathji website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Upload Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/5 shadow-xl relative">
          <h3 className="font-outfit font-bold text-white text-base mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-orange-400" />
            Upload New File
          </h3>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Drag & Drop Box */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
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
                <p className="text-xs font-bold text-slate-200">
                  {file ? file.name : 'Drag & Drop your image here'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  or click to browse local files (JPG, PNG, WEBP, GIF up to 5MB)
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
            <div>
              <span className="label">Title</span>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter media asset title..."
                className="input-field"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="label !mb-0">Category</span>
                <button 
                  type="button" 
                  onClick={() => setShowCustomCatInput(!showCustomCatInput)}
                  className="text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider inline-flex items-center gap-1.5 focus:outline-none"
                >
                  {showCustomCatInput ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  {showCustomCatInput ? 'Cancel' : 'Custom'}
                </button>
              </div>

              {showCustomCatInput ? (
                <div className="flex gap-2 animate-fadeIn">
                  <input 
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name..."
                    className="input-field !py-2 flex-grow"
                  />
                  <button 
                    type="button"
                    onClick={handleAddCategory}
                    className="p-2 bg-orange-500 rounded-lg text-white hover:bg-orange-400 transition-colors shadow-md"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field select"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div>
              <span className="label">Description (Optional)</span>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or descriptions for this asset..."
                className="input-field !py-2.5 h-20"
              />
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
              disabled={isUploading}
              className="btn-primary w-full justify-center !py-3.5 mt-2"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Save Asset</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Hand: Interactive Media Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Controls Bar */}
          <div className="glass-card rounded-2xl p-5 border border-white/5 flex flex-col md:flex-row items-center gap-4 shadow-xl">
            {/* Search */}
            <div className="relative w-full md:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search media..."
                className="input-field !pl-9 !py-2"
              />
            </div>

            {/* Filter Category */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input-field select !py-2 !w-36 flex-grow md:flex-initial"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field select !py-2 !w-32 flex-grow md:flex-initial"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredMedia.length > 0 ? (
                filteredMedia.map((media) => (
                  <motion.div 
                    key={media.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/20 group transition-all duration-300 shadow-lg flex flex-col justify-between"
                  >
                    {/* Preview Image */}
                    <div className="h-44 w-full bg-slate-900 overflow-hidden relative">
                      <img 
                        src={media.imageUrl ? (media.imageUrl.startsWith('http') ? media.imageUrl : `${API_BASE_URL}${media.imageUrl}`) : ''} 
                        alt={media.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      
                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 bg-[#020617]/85 border border-white/10 text-orange-400 px-2.5 py-0.8 rounded-md font-outfit text-[10px] font-bold uppercase tracking-wider shadow-md">
                        {media.category}
                      </span>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5 flex-grow flex flex-col justify-between bg-gradient-to-b from-white/1 to-transparent">
                      {editingId === media.id ? (
                        /* Edit Fields */
                        <div className="space-y-3 animate-fadeIn">
                          <input 
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="input-field !py-2"
                            placeholder="Edit title..."
                          />
                          <select 
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="input-field select !py-2"
                          >
                            {categories.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="input-field !py-1.5 h-14"
                            placeholder="Edit description..."
                          />
                          <div className="flex gap-2 pt-1.5 justify-end">
                            <button 
                              onClick={() => saveEdit(media.id)}
                              className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition shadow-md"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Regular Details */
                        <div className="space-y-2">
                          <h4 className="font-outfit font-black text-white text-base leading-snug line-clamp-1 group-hover:text-orange-400 transition-colors">
                            {media.title}
                          </h4>
                          
                          {media.description && (
                            <p className="text-xs text-slate-400 font-inter leading-relaxed line-clamp-2">
                              {media.description}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 pt-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                            <Calendar className="w-3 h-3 text-orange-500/70" />
                            <span>{new Date(media.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {editingId !== media.id && (
                        <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-white/5">
                          <button 
                            onClick={() => startEdit(media)}
                            className="p-2 rounded-lg bg-white/3 border border-white/5 text-slate-400 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/5 transition shadow-sm"
                            aria-label="Edit details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(media.id)}
                            className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition shadow-sm"
                            aria-label="Delete asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Empty State */
                <div className="col-span-2 py-20 text-center glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center p-6 space-y-3.5">
                  <div className="p-4 bg-[#050c1a] border border-white/5 rounded-full text-slate-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-outfit font-bold text-white text-base">No media files found</p>
                    <p className="text-xs text-slate-500 mt-1">Try tweaking your search keywords or filter category selection.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
