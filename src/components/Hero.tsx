'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onOpenShowreel: () => void;
}

export default function Hero({ onOpenShowreel }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  // Parallax: photo slides up slower than scroll
  const photoY  = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  // Marquee text moves slightly in opposite direction for depth
  const marqueeY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position:   'relative',
        width:      '100%',
        minHeight:  '100vh',
        overflow:   'hidden',
        contain:    'paint',
        display:    'flex',
        alignItems: 'stretch',
      }}
    >
      {/* ── Ambient dot background (inherits from DotCanvas, but add a light tint) ── */}
      <div style={{
        position:   'absolute',
        inset:       0,
        zIndex:      0,
        background: 'var(--hero-overlay, transparent)',
        pointerEvents: 'none',
      }} />

      {/* ── Giant outline name marquee — behind photo ───────────────────────── */}
      <motion.div
        style={{
          position:  'absolute',
          inset:      0,
          zIndex:     1,
          display:   'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow:  'hidden',
          pointerEvents: 'none',
          y: marqueeY,
        }}
      >
        <div style={{
          fontSize:      'clamp(5rem, 16vw, 14rem)',
          fontWeight:    900,
          letterSpacing: '0.06em',
          whiteSpace:    'nowrap',
          lineHeight:     1,
          color:         'transparent',
          WebkitTextStroke: '2px var(--marquee-stroke)',
          userSelect:    'none',
          animation:     'marqueeSlide 22s linear infinite',
        }}>
          JUNTILLA&nbsp;•&nbsp;MARK&nbsp;VENCENT&nbsp;•&nbsp;JUNTILLA&nbsp;•&nbsp;MARK&nbsp;VENCENT&nbsp;•
        </div>
      </motion.div>

      {/* ── Full-height photo ─────────────────────────────────────────────────── */}
      <motion.div
        style={{
          position:   'absolute',
          bottom:      0,
          left:        0,
          right:       0,
          zIndex:      2,
          display:    'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          y:          photoY,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/maki.png"
          alt="Mark Vencent Juntilla — AI Video Creator"
          style={{
            height:     'min(880px, 86vh)',
            width:      'auto',
            maxWidth:   '92vw',
            display:    'block',
            objectFit:  'contain',
            objectPosition: 'bottom center',
            mixBlendMode: 'multiply',
          }}
          draggable={false}
        />
      </motion.div>

      {/* ── Bottom-left (Desktop) / Top-Center (Mobile): AVAILABLE FOR WORK ─ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="hero-avail-info"
        style={{
          position: 'absolute',
          bottom:   '2.5rem',
          left:     '2.5rem',
          zIndex:    5,
        }}
      >
        <div
          className="hero-avail-badge"
          style={{
            fontSize:      '0.62rem',
            fontWeight:    800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'var(--admin-accent)',
            marginBottom:  '0.35rem',
            display:       'inline-flex',
            alignItems:    'center',
            gap:           6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
          Available for Work
        </div>
        <div
          className="hero-avail-title"
          style={{
            fontSize:   '0.88rem',
            fontWeight: 600,
            color:      'var(--admin-text-primary)',
            lineHeight:  1.45,
          }}
        >
          AI ADS UGC Creator&nbsp;·<br className="hero-avail-br" />
          Commercial Video Director
        </div>
      </motion.div>

      {/* ── Watch Showreel / Video Intro button — Centered at bottom ───────────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        onClick={onOpenShowreel}
        className="hero-watch-btn"
        style={{
          position:   'absolute',
          bottom:     '2.2rem',
          left:       '50%',
          transform:  'translateX(-50%)',
          zIndex:      5,
          padding:    '10px 24px',
          borderRadius: 99,
          background: 'var(--admin-card)',
          border:     '1px solid var(--admin-border-strong)',
          color:      'var(--admin-text-primary)',
          fontSize:   '0.78rem',
          fontWeight:  700,
          fontFamily: 'inherit',
          cursor:     'pointer',
          display:    'inline-flex',
          alignItems: 'center',
          gap:         8,
          backdropFilter: 'blur(16px)',
          boxShadow:  '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.1)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--admin-accent)';
          el.style.boxShadow   = '0 8px 30px rgba(59,130,246,0.25)';
          el.style.transform   = 'translateX(-50%) translateY(-3px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--admin-border-strong)';
          el.style.boxShadow   = '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.1)';
          el.style.transform   = 'translateX(-50%) translateY(0)';
        }}
      >
        <i className="bi bi-play-circle-fill" style={{ color: 'var(--admin-accent)', fontSize: '1.05rem', flexShrink: 0 }} />
        <span className="hero-watch-label-desktop">Watch 2026 Director Cut</span>
        <span className="hero-watch-label-mobile">Watch Showreel</span>
      </motion.button>

      {/* ── Keyframes ─────────────────────────────────────────────────────────── */}
      <style>{`
        .hero-watch-label-mobile {
          display: none;
        }

        @keyframes marqueeSlide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* Light-mode: marquee strokes are dark-tinted */
        :root[data-theme="light"] {
          --marquee-stroke: rgba(15,23,42,0.32);
          --hero-overlay:   transparent;
        }
        /* Dark-mode: marquee strokes are light-tinted */
        :root[data-theme="dark"], :root {
          --marquee-stroke: rgba(255,255,255,0.28);
          --hero-overlay:   transparent;
        }

        /* On light mode, remove multiply blend so image looks natural */
        :root[data-theme="light"] #hero img {
          mix-blend-mode: normal;
        }

        @media (max-width: 768px) {
          .hero-watch-label-desktop {
            display: none !important;
          }
          .hero-watch-label-mobile {
            display: inline !important;
          }
          .hero-avail-info {
            top: 76px !important;
            bottom: auto !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            text-align: center !important;
            width: max-content !important;
            max-width: 90vw !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 5px 14px !important;
            border-radius: 999px !important;
            background: var(--nav-bg) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1px solid var(--stroke-color) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
          }
          .hero-avail-br {
            display: none !important;
          }
          .hero-avail-badge {
            margin-bottom: 2px !important;
            font-size: 0.58rem !important;
          }
          .hero-avail-title {
            font-size: 0.72rem !important;
            font-weight: 700 !important;
            white-space: nowrap !important;
          }
          .hero-watch-btn {
            bottom: 1.35rem !important;
            padding: 8px 16px !important;
            font-size: 0.74rem !important;
          }
        }
      `}</style>
    </section>
  );
}
