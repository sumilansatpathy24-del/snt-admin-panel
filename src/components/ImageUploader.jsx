import { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../utils/storage';

export default function ImageUploader({ value, onChange, label = 'Upload Image', hint = '' }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    setError('');
    setLoading(true);
    try {
      const base64 = await uploadImage(file);
      onChange(base64);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <span className="label">{label}</span>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1e]" style={{ maxHeight: 180 }}>
          <img src={value} alt="Uploaded" className="w-full h-44 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <Upload className="w-3 h-3" /> Change
            </button>
            <button
              onClick={() => onChange('')}
              className="btn-danger text-xs py-1.5 px-3"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-orange-500/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors bg-[#0a0f1e] hover:bg-orange-500/3"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
          ) : (
            <ImageIcon className="w-8 h-8 text-slate-600" />
          )}
          <div className="text-center">
            <p className="text-slate-400 text-xs font-medium">
              {loading ? 'Processing image...' : 'Click or drag image here'}
            </p>
            {hint && <p className="text-slate-600 text-[11px] mt-1">{hint}</p>}
            <p className="text-slate-600 text-[11px] mt-0.5">JPG, PNG, WEBP · Max 5MB</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-[11px] flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
