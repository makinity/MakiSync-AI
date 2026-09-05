'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * LoginLoadingScreen — rendered directly on the login page after a successful
 * auth response. It immediately fires router.push, stays on top while the next
 * page hydrates, then fades out and unmounts.
 *
 * For the reusable version that can be triggered from anywhere, use
 * LoadingOverlayProvider + useLoginLoader() instead.
 */
export default function LoginLoadingScreen() {
  const [fading,  setFading]  = useState(false);
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Navigate immediately — overlay stays on top while the page loads beneath
    router.push('/admin/dashboard');

    const fadeTimer = setTimeout(() => setFading(true),  1400);
    const doneTimer = setTimeout(() => setVisible(false), 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes plsPop {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes plsSlide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(200%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Full-screen backdrop */}
      <div style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        background:     'var(--admin-bg-primary)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        opacity:        fading ? 0 : 1,
        transition:     'opacity 0.5s ease',
        pointerEvents:  fading ? 'none' : 'all',
      }}>

        {/* Card */}
        <div style={{
          background:    'var(--admin-card)',
          border:        '1px solid var(--admin-border)',
          borderRadius:  20,
          padding:       '2rem 2.5rem',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '0.6rem',
          boxShadow:     'var(--admin-shadow)',
          animation:     'plsPop 0.3s ease',
          minWidth:      240,
          textAlign:     'center',
        }}>

          {/* Gear icon badge */}
          <div style={{
            width:          54,
            height:         54,
            borderRadius:   '50%',
            background:     'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      '0 0 20px rgba(59,130,246,0.45)',
            marginBottom:   '0.1rem',
          }}>
            <i className="bi bi-gear-fill" style={{ fontSize: '1.4rem', color: '#fff' }} />
          </div>

          {/* Brand name */}
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--admin-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Maki<span style={{ color: 'var(--admin-accent)' }}>Sync</span>
          </div>

          {/* Sub-label */}
          <div style={{
            fontSize:      '0.68rem',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'var(--admin-accent)',
            marginTop:     '-0.15rem',
          }}>
            AI Creative
          </div>

          {/* Status text */}
          <div style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', fontWeight: 500, marginTop: '0.25rem' }}>
            Loading your portal...
          </div>

          {/* Progress bar */}
          <div style={{
            width:        180,
            height:       4,
            borderRadius: 99,
            background:   'var(--admin-border)',
            overflow:     'hidden',
            marginTop:    '0.35rem',
          }}>
            <div style={{
              width:        '45%',
              height:       '100%',
              borderRadius: 99,
              background:   'linear-gradient(90deg, #3b82f6, #6366f1)',
              animation:    'plsSlide 1.2s infinite ease-in-out',
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
