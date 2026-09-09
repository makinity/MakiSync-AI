'use client';

import { useEffect } from 'react';

export default function ContactSection() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="contact" style={{ padding: '6rem 2rem', background: 'var(--admin-bg-secondary)', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }} className="contact-grid">

          {/* Left info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 12,
              }}>
                Let&apos;s Work Together
              </div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900,
                color: 'var(--admin-text-primary)', letterSpacing: '-0.03em',
                margin: '0 0 16px', lineHeight: 1.1,
              }}>
                Book a Free{' '}
                <span style={{
                  background: 'var(--heading-gradient)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  30-Min Call
                </span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: '0 0 20px' }}>
                Got an AI video project in mind? Let&apos;s talk about your vision, timeline, and what we can build together. No pressure — just a quick discovery call.
              </p>

              {/* CTA bullet points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: 'bi-camera-video-fill', text: 'AI video ads, product launches & campaigns' },
                  { icon: 'bi-clock-fill', text: '30 minutes — free, no commitment' },
                  { icon: 'bi-lightning-charge-fill', text: 'Fast turnaround, cinematic quality' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--admin-accent)', fontSize: 12,
                    }}>
                      <i className={`bi ${item.icon}`} />
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'bi-envelope-fill', label: 'Direct Email', value: 'juntillakingmaki@gmail.com', href: 'mailto:juntillakingmaki@gmail.com' },
                { icon: 'bi-globe', label: 'Brand Hub', value: 'MakiSync Digital Solutions', href: 'https://maki-sync.vercel.app/' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--admin-accent)', fontSize: 16,
                  }}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', margin: '0 0 2px' }}>{item.label}</p>
                    <a
                      href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                      style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-primary)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)'; }}
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: 'bi-github', href: 'https://github.com/makinity', label: 'GitHub' },
                { icon: 'bi-linkedin', href: 'https://www.linkedin.com/in/mark-vencent-juntilla-366328358/', label: 'LinkedIn' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: '1px solid var(--admin-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--admin-text-secondary)', fontSize: 17, textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-secondary)'; }}
                >
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Calendly embed */}
          <div style={{
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: 20,
            overflow: 'hidden',
            minHeight: 660,
          }}>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/juntillakingmaki/30min?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{ minWidth: 320, height: 660 }}
            />
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
