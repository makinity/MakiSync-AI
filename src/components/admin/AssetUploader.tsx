'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Check } from 'lucide-react';

interface AssetUploaderProps {
  label: string;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
}

export default function AssetUploader({ label, accept = 'image/*,video/*', value, onChange }: AssetUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    onChange(previewUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-slate-300 text-xs font-medium">{label}</label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          dragging ? 'border-[#1683DF] bg-[#1683DF]/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <UploadCloud className="w-6 h-6 text-[#93CCE9]" />
        
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-white">Click to upload</span> or drag and drop media file
        </div>

        {value && (
          <div className="mt-2 px-3 py-1 rounded bg-slate-800 text-[10px] font-mono text-[#93CCE9] truncate max-w-full flex items-center gap-1.5">
            <Check className="w-3 h-3 text-emerald-400" />
            <span className="truncate">{value}</span>
          </div>
        )}
      </div>
    </div>
  );
}