'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Link as LinkIcon, Loader2, Copy } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectHint?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Hình ảnh',
  aspectHint = 'Định dạng JPG, PNG, WEBP tối đa 10MB',
  placeholder = 'https://... hoặc tải ảnh từ máy tính',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Tải ảnh lên thất bại');
      }

      if (data.url) {
        onChange(data.url);
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Lỗi khi tải ảnh lên Supabase');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer transition"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualInput ? 'Chế độ tải ảnh' : 'Nhập URL trực tiếp'}</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
          {error}
        </p>
      )}

      {value ? (
        // Preview Box
        <div className="relative group border border-slate-200 rounded-2xl overflow-hidden bg-slate-900/5 shadow-xs">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback
                (e.target as HTMLImageElement).src = '/avt.png';
              }}
            />
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500 font-mono truncate max-w-[280px] sm:max-w-md">
              {value}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                title="Sao chép liên kết ảnh"
                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer"
              >
                Thay ảnh
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                title="Xóa ảnh"
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : showManualInput ? (
        // Manual URL Input
        <div className="space-y-1.5">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
          <p className="text-[11px] text-slate-500">{aspectHint}</p>
        </div>
      ) : (
        // Drag & Drop Upload Zone
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {uploading
                ? 'Đang tải ảnh lên Supabase Storage...'
                : 'Bấm để chọn tệp hoặc kéo thả ảnh vào đây'}
            </p>
            <p className="text-[11px] text-slate-400">{aspectHint}</p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            Tải lên Supabase
          </span>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
