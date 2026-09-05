'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  title?: string;
  description?: string;
  darkMode: boolean;
  onToggleDark: () => void;
  onHamburger: () => void;
}

export default function Topbar({ title = 'Dashboard', darkMode, onToggleDark, onHamburger }: TopbarProps) {
  const [dropOpen, setDropOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <>
      {signingOut && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'var(--admin-bg-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: 20, padding: '2rem 2.5rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
            boxShadow: 'var(--admin-shadow)', minWidth: 220,
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>MakiSync</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>Signing out...</div>
          </div>
        </div>
      )}

      <header className="tb-root">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onHamburger} className="tb-hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-secondary)', fontSize: '1.2rem' }}>
            <i className="bi bi-list" />
          </button>

          <nav className="tb-breadcrumb">
            <Link href="/admin/dashboard" className="tb-bc-item tb-bc-link">
              <i className="bi bi-house-door" style={{ fontSize: '0.75rem' }} />
              <span>Home</span>
            </Link>
            <span className="tb-bc-item">
              <i className="bi bi-chevron-right tb-bc-sep" />
              <span className="tb-bc-current">{title}</span>
            </span>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.3rem 0.7rem 0.3rem 0.3rem',
                borderRadius: 50, cursor: 'pointer',
                background: 'var(--admin-card)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(59,130,246,0.12)',
                border: '2px solid rgba(59,130,246,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src="/assets/maki.png" alt="Mark Juntilla" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'left' }} className="tb-user-text">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--admin-text-primary)' }}>Mark Juntilla</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', lineHeight: 1 }}>Administrator</div>
              </div>
              <i className="bi bi-chevron-down" style={{ fontSize: '0.6rem', color: 'var(--admin-text-muted)' }} />
            </button>

            {dropOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                background: 'var(--admin-card)',
                border: '1px solid var(--admin-border-strong)',
                borderRadius: 12, minWidth: 180, zIndex: 1000,
                boxShadow: 'var(--admin-shadow)',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.9rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', fontWeight: 500 }}>
                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <button
                    onClick={onToggleDark}
                    style={{
                      width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: darkMode ? 'var(--admin-accent)' : '#cbd5e1',
                      position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: 2, left: darkMode ? 18 : 2,
                      width: 16, height: 16, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
                <div style={{ height: 1, background: 'var(--admin-border)', margin: '0 0.9rem' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', textAlign: 'left', padding: '0.65rem 0.9rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: 500, color: '#f87171',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <i className="bi bi-box-arrow-right" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
