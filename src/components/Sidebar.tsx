'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const MENU_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: 'bi-grid-1x2' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Projects Slate', href: '/admin/projects', icon: 'bi-film' },
      { label: 'Site CMS Settings', href: '/admin/settings', icon: 'bi-sliders' },
      { label: 'Media Storage', href: '/admin/assets', icon: 'bi-folder2-open' },
      { label: 'Lead Inquiries', href: '/admin/inquiries', icon: 'bi-envelope' },
    ],
  },
];

export default function Sidebar({ collapsed, mobileOpen, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'sb-collapsed' : ''} ${mobileOpen ? 'sb-mobile-open' : ''}`}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', minWidth: 0 }}>
          <img src="/logo.png" alt="MakiSync" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Maki<span style={{ color: 'var(--admin-accent)' }}>Sync</span>
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>AI Creative Admin</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {!collapsed && (
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--admin-text-muted)', letterSpacing: '0.08em', padding: '0 0.5rem 0.25rem' }}>
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-link ${isActive ? 'sb-link-active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <i className={`bi ${item.icon}`} style={{ fontSize: '1rem', flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.65rem', borderRadius: 10,
          background: 'var(--admin-card)', border: '1px solid var(--admin-border)',
          color: 'var(--admin-text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
          fontWeight: 600, transition: 'all 0.15s',
        }}
      >
        <i className={`bi bi-chevron-${collapsed ? 'right' : 'left'}`} />
        {!collapsed && <span>Collapse Sidebar</span>}
      </button>
    </aside>
  );
}
