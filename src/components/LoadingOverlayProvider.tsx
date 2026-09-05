'use client';

import { createContext, useContext, useState, useCallback, useRef } from 'react';

interface OverlayCtx {
  showLoginLoader: () => void;
}

const Ctx = createContext<OverlayCtx>({ showLoginLoader: () => {} });
export const useLoginLoader = () => useContext(Ctx);

export default function LoadingOverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible]   = useState(false);
  const [fading, setFading]     = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const showLoginLoader = useCallback(() => {
    // Cancel any in-flight timers from a previous call
    timers.current.forEach(clearTimeout);
    setVisible(true);
    setFading(false);

    // Start fade at 1 400 ms, fully unmount at 1 900 ms
    timers.current[0] = setTimeout(() => setFading(true), 1400);
    timers.current[1] = setTimeout(() => {
      setVisible(false);
      setFading(false);
    }, 1900);
  }, []);

  return (
    <Ctx.Provider value={{ showLoginLoader }}>
      {children}

      {visible && (
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
              background:     'var(--admin-card)',
              border:         '1px solid var(--admin-border)',
              borderRadius:   20,
              padding:        '2rem 2.5rem',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '0.6rem',
              boxShadow:      'var(--admin-shadow)',
              animation:      'plsPop 0.3s ease',
              minWidth:       240,
              textAlign:      'center',
            }}>

              {/* Gear icon badge — matches the navbar logo */}
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
                Loading AI Creative CMS...
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
                  width:      '45%',
                  height:     '100%',
                  borderRadius: 99,
                  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  animation:  'plsSlide 1.2s infinite ease-in-out',
                }} />
              </div>
            </div>
          </div>
        </>
      )}
    </Ctx.Provider>
  );
}
