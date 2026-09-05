'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: '6rem 1.5rem',
        position: 'relative',
        background: 'transparent',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3.5rem' }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 12,
          }}>
            About the Creator
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
              color: 'var(--admin-text-primary)', letterSpacing: '-0.03em',
              margin: '0 0 12px', lineHeight: 1.15,
            }}
          >
            The Triple Threat:{' '}
            <span style={{
              background: 'var(--heading-gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'block',
            }}>
              AI Video + Web Dev + Social Ads
            </span>
          </motion.h2>
        </div>

        {/* Main content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }} className="about-grid">

          {/* Left: Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: 20, padding: '1.75rem',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                padding: 2, overflow: 'hidden',
              }}>
                <img
                  src="/assets/maki.png"
                  alt="Mark Vencent Juntilla"
                  style={{
                    width: '100%', height: '100%', borderRadius: 14,
                    objectFit: 'cover', display: 'block',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--admin-text-primary)', marginBottom: 3 }}>
                  Mark Vencent Juntilla
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Creative Director &amp; Technologist
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>MakiSync Portfolio</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Primary AI Tools', value: 'Google Flow Pro, Midjourney v6' },
                { label: 'Web Stack', value: 'Next.js, TypeScript, Supabase' },
                { label: 'SMM / Ad Strategy', value: 'Social Media Manager' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', flexShrink: 0 }}>{item.label}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-primary)', textAlign: 'right' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="#contact"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 20px', borderRadius: 99,
                background: 'var(--admin-accent)', color: '#fff',
                fontSize: '0.82rem', fontWeight: 700,
                textDecoration: 'none', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Get In Touch <i className="bi bi-arrow-right" />
            </a>
          </motion.div>

          {/* Right: Bio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{ fontSize: '1rem', color: 'var(--admin-text-secondary)', lineHeight: 1.8, margin: 0 }}
            >
              My background integrates three distinct disciplines:{' '}
              <strong style={{ color: 'var(--admin-text-primary)' }}>Social Media Management</strong> (understanding human
              attention &amp; commercial conversion hooks),{' '}
              <strong style={{ color: 'var(--admin-text-primary)' }}>Web Engineering</strong> (building seamless digital products), and{' '}
              <strong style={{ color: 'var(--admin-text-primary)' }}>Director-Led AI Video Production</strong> (conceptualizing and
              executing visual ad campaigns).
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}
              style={{ fontSize: '1rem', color: 'var(--admin-text-secondary)', lineHeight: 1.8, margin: 0 }}
            >
              Subscribing to Google AI Pro and mastering tools like Google Flow has unlocked a new paradigm: generating
              commercial-grade visual ads with director-level shot precision, visual continuity, and rapid iteration cycles.
            </motion.p>

            {/* Philosophy cards */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
              className="about-phil-grid"
            >
              {[
                { icon: 'bi-camera-reels-fill', title: 'Director Mindset', desc: 'Focusing on story, shot design & continuity, not random prompts.' },
                { icon: 'bi-code-slash', title: 'Technical Rigor', desc: 'Full stack Next.js & Supabase engineering standards.' },
                { icon: 'bi-graph-up-arrow', title: 'Commercial Focus', desc: 'Every frame is built for conversion and brand recall.' },
                { icon: 'bi-stars', title: 'AI-Native Craft', desc: 'Google Flow, Midjourney v6, and SOTA model mastery.' },
              ].map(item => (
                <div
                  key={item.title}
                  style={{
                    background: 'var(--admin-card)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 14, padding: '1.1rem',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border-strong)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-accent)' }}>
                    <i className={`bi ${item.icon}`} style={{ color: 'var(--admin-accent)' }} />
                    {item.title}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-phil-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-phil-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
