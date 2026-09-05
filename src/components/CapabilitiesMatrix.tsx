'use client';

const PILLARS = [
  {
    title: 'AI Video Advertising',
    icon: 'bi-film',
    badge: 'Commercial Focus',
    skills: [
      'Commercial ad concept development',
      'Short-form social ad hooks (9:16)',
      'Product launch campaign videos',
      'A/B ad variant generation',
      'Direct response CTA optimization'
    ]
  },
  {
    title: 'Creative Direction',
    icon: 'bi-compass',
    badge: 'Narrative Craft',
    skills: [
      'Scriptwriting & narrative design',
      'Director shot breakdown & storyboards',
      'Lighting & atmospheric staging',
      'Visual character & garment continuity',
      'Brand aesthetic alignment'
    ]
  },
  {
    title: 'AI Video Production',
    icon: 'bi-stars',
    badge: 'Google Flow & SOTA',
    skills: [
      'Google Flow video generation',
      'Camera track & motion choreography',
      'Liquid & macro material simulation',
      'Synthetic voiceover & sound design',
      'Video upscaling & frame interpolation'
    ]
  },
  {
    title: 'Creative Technology & Web',
    icon: 'bi-code-slash',
    badge: 'Web Synergy',
    skills: [
      'Custom Web Video Experience integration',
      'Interactive Next.js project showcases',
      'SMM strategy + Web engineering synergy',
      'Supabase CMS video content pipeline',
      'Performance-optimized media streaming'
    ]
  }
];

export default function CapabilitiesMatrix() {
  return (
    <section id="capabilities" style={{ padding: '6rem 2rem', background: 'var(--admin-bg-primary)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3.5rem' }}>
        <div style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 12,
        }}>
          Capabilities &amp; Core Stack
        </div>
        <h2 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
          color: 'var(--admin-text-primary)', letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}>
          End-to-End{' '}
          <span style={{
            background: 'var(--heading-gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Commercial Pillars
          </span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
          Combining visual storytelling, AI video generation mastery, and modern web tech.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="cap-matrix-grid">
        {PILLARS.map((pillar, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: 16,
              padding: '1.5rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              gap: 20,
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)'; }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--admin-accent)',
                }}>
                  <i className={`bi ${pillar.icon}`} style={{ fontSize: 17 }} />
                </div>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  padding: '3px 8px', borderRadius: 6,
                  background: 'var(--admin-bg-secondary)',
                  color: 'var(--admin-accent)',
                  border: '1px solid var(--admin-border)',
                }}>
                  {pillar.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.3 }}>
                {pillar.title}
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pillar.skills.map((skill, sIdx) => (
                  <li key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.75rem', color: 'var(--admin-text-secondary)', lineHeight: 1.4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--admin-accent)', flexShrink: 0, marginTop: 5 }} />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              paddingTop: 14, borderTop: '1px solid var(--admin-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: '0.62rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--admin-text-muted)',
            }}>
              <span>Pillar 0{idx + 1}</span>
              <i className="bi bi-check-circle-fill" style={{ color: 'var(--admin-accent)', fontSize: 13 }} />
            </div>
          </div>
        ))}
      </div>

      </div>
      <style>{`
        @media (max-width: 900px) { .cap-matrix-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 540px) { .cap-matrix-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
