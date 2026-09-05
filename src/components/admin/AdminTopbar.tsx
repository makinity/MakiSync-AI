'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Bell, Search, ExternalLink } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  onLogout: () => void;
}

export default function AdminTopbar({ title, onLogout }: AdminTopbarProps) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0A0D12]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1683DF]/20 text-[#93CCE9] border border-[#1683DF]/30 font-semibold">
          MakiSync V2
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-all"
        >
          View Public Site <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}