'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Video, 
  LayoutDashboard, 
  Film, 
  Sliders, 
  FolderOpen, 
  Mail, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projects Slate', href: '/admin/projects', icon: Film },
    { label: 'Site CMS Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Media Assets', href: '/admin/assets', icon: FolderOpen },
    { label: 'Lead Inquiries', href: '/admin/inquiries', icon: Mail },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#07090D] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1683DF] to-[#93CCE9] p-[1px] shrink-0">
              <div className="w-full h-full bg-[#0A0D12] rounded-[11px] flex items-center justify-center">
                <Video className="w-4 h-4 text-[#93CCE9]" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                  Maki<span className="text-[#1683DF]">Sync</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Admin Portal</span>
              </div>
            )}
          </Link>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1.5">
          {!collapsed && (
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Management
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1683DF] text-white shadow-md shadow-[#1683DF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Badge & Live Site Action */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#93CCE9] bg-[#1683DF]/10 border border-[#1683DF]/20 hover:bg-[#1683DF]/20 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Live Portfolio</span>}
        </Link>

        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 ${
          collapsed ? 'justify-center' : ''
        }`}>
          <div className="w-7 h-7 rounded-lg bg-[#1683DF] text-white font-bold text-xs flex items-center justify-center shrink-0">
            MJ
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Mark Juntilla</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}