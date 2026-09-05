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
            width:      'min(520px, 72vw)',
            height:     'auto',
            display:    'block',
            objectFit:  'contain',
            objectPosition: 'bottom center',
            mixBlendMode: 'multiply',
          }}
          draggable={false}
        />
      </motion.div>

      {/* ── Bottom-left: AVAILABLE FOR WORK ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom:   '2.5rem',
          left:     '2.5rem',
          zIndex:    5,
        }}
      >
        <div style={{
          fontSize:      '0.62rem',
          fontWeight:    800,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--admin-accent)',
          marginBottom:  '0.35rem',
        }}>
          Available for Work
        </div>
        <div style={{
          fontSize:   '0.88rem',
          fontWeight: 600,
          color:      'var(--admin-text-primary)',
          lineHeight:  1.45,
        }}>
          AI Video Creator&nbsp;·<br />
          Commercial Director&nbsp;·&nbsp;Google Flow
        </div>
      </motion.div>

      {/* ── Center: Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          position:       'absolute',
          bottom:         '2.5rem',
          left:           '50%',
          transform:      'translateX(-50%)',
          zIndex:          5,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:             6,
          color:          'var(--admin-text-muted)',
        }}
      >
        <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="1.5" />
            <motion.circle
              cx="9" cy="8" r="2.5" fill="currentColor"
              animate={{ cy: [8, 16, 8] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── Top-center: availability badge ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position:       'absolute',
          top:            '7rem',
          left:           '50%',
          transform:      'translateX(-50%)',
          zIndex:          5,
          display:        'inline-flex',
          alignItems:     'center',
          gap:             10,
          padding:        '7px 18px',
          borderRadius:   99,
          background:     'var(--admin-card)',
          border:         '1px solid var(--admin-border-strong)',
          fontSize:       '0.73rem',
          fontWeight:      600,
          color:          'var(--admin-text-secondary)',
          boxShadow:      '0 4px 24px rgba(59,130,246,0.08)',
          whiteSpace:     'nowrap',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', flexShrink: 0, boxShadow: '0 0 6px #34d399' }} />
        <span>Available for Q3/Q4 AI Video Campaigns</span>
        <span style={{ color: 'var(--admin-border)', margin: '0 2px' }}>|</span>
        <span style={{ color: 'var(--admin-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="bi bi-stars" style={{ fontSize: '0.8rem' }} /> Google Flow AI Pro
        </span>
      </motion.div>

      {/* ── Watch Showreel button — bottom center above scroll ───────────────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        onClick={onOpenShowreel}
        style={{
          position:   'absolute',
          bottom:     '5.5rem',
          left:       '50%',
          transform:  'translateX(-50%)',
          zIndex:      5,
          padding:    '9px 22px',
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
          backdropFilter: 'blur(12px)',
          boxShadow:  '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--admin-accent)';
          el.style.boxShadow   = '0 4px 24px rgba(59,130,246,0.18)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--admin-border-strong)';
          el.style.boxShadow   = '0 4px 20px rgba(0,0,0,0.08)';
        }}
      >
        <i className="bi bi-play-circle-fill" style={{ color: 'var(--admin-accent)', fontSize: '1rem' }} />
        Watch 2026 Director Cut
      </motion.button>

      {/* ── Keyframes ─────────────────────────────────────────────────────────── */}
      <style>{`
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

        @media (max-width: 640px) {
          #hero .hero-badge { font-size: 0.62rem !important; padding: 6px 12px !important; }
        }
      `}</style>
    </section>
  );
}
