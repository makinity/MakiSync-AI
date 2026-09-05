'use client';

const STEPS = [
  {
    step: '01',
    title: 'Business Strategy',
    icon: 'bi-bullseye',
    phase: 'Phase 1 - Objective',
    description: 'Deconstruct brand goals, target audience, and commercial placement (16:9 cinematic vs. 9:16 social ad hooks).'
  },
  {
    step: '02',
    title: 'Concept & Storyboard',
    icon: 'bi-lightbulb',
    phase: 'Phase 2 - Narrative',
    description: 'Develop narrative arcs, visual themes, script copy, and shot-by-shot storyboards tuned for emotional impact.'
  },
  {
    step: '03',
    title: 'Shot Architecture',
    icon: 'bi-camera-video',
    phase: 'Phase 3 - Framing',
    description: 'Define camera lenses, framing, motion paths, lighting contrast, and seed parameters for precise execution.'
  },
  {
    step: '04',
    title: 'AI Production',
    icon: 'bi-cpu',
    phase: 'Phase 4 - Generation',
    description: 'Execute high-fidelity AI video generation via Google Flow & SOTA models with visual character & product asset continuity.'
  },
  {
    step: '05',
    title: 'Post-Production',
    icon: 'bi-sliders',
    phase: 'Phase 5 - Polish',
    description: 'Color grade, speed ramp, synthesize voiceover, layer ambient sound, and master for pristine 4K delivery.'
  }
];

export default function CreativeApproach() {
  return (
    <section id="approach" style={{ padding: '6rem 2rem', background: 'var(--admin-bg-secondary)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3.5rem' }}>
        <div style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 12,
        }}>
          Director-Led Pipeline
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
          color: 'var(--admin-text-primary)', letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}>
          How I Approach{' '}
          <span style={{
            background: 'var(--heading-gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            AI Video Production
          </span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
          AI is the production engine; creative direction remains the craft. Every commercial video project follows a disciplined pipeline from strategy to final render.
        </p>
      </div>

      {/* 5 Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }} className="approach-grid">
        {STEPS.map((step, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: 16,
              padding: '1.5rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              gap: 16,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)'; }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '1.4rem', fontWeight: 900,
                  color: 'var(--admin-accent)', fontFamily: 'monospace', lineHeight: 1,
                }}>
                  {step.step}
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--admin-accent)',
                }}>
                  <i className={`bi ${step.icon}`} style={{ fontSize: 15 }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-primary)', margin: '0 0 8px', lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </div>
            <div style={{
              paddingTop: 12, borderTop: '1px solid var(--admin-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: '0.62rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--admin-text-muted)',
            }}>
              <span>{step.phase}</span>
              <i className="bi bi-chevron-right" style={{ color: 'var(--admin-accent)', fontSize: 11 }} />
            </div>
          </div>
        ))}
      </div>

      </div>
      <style>{`
        @media (max-width: 900px) { .approach-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 600px) { .approach-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </section>
  );
}
