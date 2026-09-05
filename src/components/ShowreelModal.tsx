'use client';

import { X, Film, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function ShowreelModal({ isOpen, onClose, videoUrl, title }: ShowreelModalProps) {
  const [muted, setMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-card rounded-2xl overflow-hidden border-[var(--admin-border-strong)] shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)] bg-[#0a0f1a]">
          <div className="flex items-center gap-2.5 text-slate-200 font-bold text-sm">
            <Film className="w-4 h-4 text-[#3b82f6]" />
            <span>{title}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/30">
              4K Master Cut
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative flex-1 aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            src={videoUrl}
            controls
            autoPlay
            muted={muted}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#0a0f1a] text-xs text-[#a5b4cf] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[var(--admin-border)]">
          <span className="font-semibold text-white">AI Creative Direction: Mark Vencent Juntilla</span>
          <span className="text-[11px] text-[#6f83a6]">Google Flow Video Generation + Premiere Pro Post Production</span>
        </div>
      </div>
    </div>
  );
}
