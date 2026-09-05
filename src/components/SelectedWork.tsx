'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  client_spec: string;
  format: string;
  duration: string;
  description: string;
  thumbnail_url: string;
  hero_video_url: string;
  tools_used: string[];
}

interface SelectedWorkProps {
  projects: Project[];
}

const CATEGORIES = ['All Works', 'Tech & Electronics', 'Beverage & FMCG', 'Fashion & Luxury', 'Automotive'];

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState('All Works');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const filteredProjects = activeCategory === 'All Works'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="selected-work" style={{ padding: '6rem 2rem', background: 'var(--admin-bg-primary)', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* Header with Proper Spacing */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--admin-text-muted)', marginBottom: 12,
          }}>
            Commercial Slate
          </div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900,
            color: 'var(--admin-text-primary)', letterSpacing: '-0.03em', margin: 0,
          }}>
            Selected Work &amp;{' '}
            <span style={{
              background: 'var(--heading-gradient)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Case Studies
            </span>
          </h2>
        </div>
        <p style={{ maxWidth: 380, fontSize: '0.875rem', color: 'var(--admin-text-muted)', lineHeight: 1.7, margin: 0 }}>
          Commercial AI video ad concepts engineered to demonstrate brand strategy, visual continuity, and short-form performance.
        </p>
      </div>

      {/* Category Filter Tabs with Proper Margin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 40 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 18px', borderRadius: 99,
              border: `1px solid ${activeCategory === cat ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
              background: activeCategory === cat ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: activeCategory === cat ? 'var(--admin-accent)' : 'var(--admin-text-muted)',
              fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }} className="work-grid">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
            style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: 16, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
          >
            {/* Thumbnail Box */}
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#050810', overflow: 'hidden' }}>
              <img
                src={project.thumbnail_url}
                alt={project.title}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s, opacity 0.3s',
                  transform: hoveredProjectId === project.id ? 'scale(1.05)' : 'scale(1)',
                  opacity: hoveredProjectId === project.id ? 0.2 : 1,
                }}
              />

              {hoveredProjectId === project.id && (
                <video
                  src={project.hero_video_url}
                  autoPlay loop muted playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, zIndex: 2 }}>
                <span style={{
                  padding: '3px 8px', borderRadius: 5, fontSize: '0.65rem', fontWeight: 700,
                  background: 'rgba(0,0,0,0.8)', color: 'var(--admin-accent)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}>
                  {project.category}
                </span>
                <span style={{
                  padding: '3px 7px', borderRadius: 5, fontSize: '0.65rem', fontWeight: 500,
                  background: 'rgba(0,0,0,0.8)', color: 'rgba(255,255,255,0.6)',
                }}>
                  {project.format}
                </span>
              </div>

              <div style={{
                position: 'absolute', bottom: 10, right: 10, zIndex: 2,
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 5,
                background: 'rgba(0,0,0,0.8)',
                fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)',
              }}>
                <i className="bi bi-clock" style={{ color: 'var(--admin-accent)', fontSize: 10 }} />
                {project.duration}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--admin-accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {project.client_spec}
                </p>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.3 }}>
                  {project.title}
                </h3>
                <p style={{
                  fontSize: '0.78rem', color: 'var(--admin-text-secondary)', marginTop: 8, lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {project.description}
                </p>
              </div>

              <div style={{
                paddingTop: 14, borderTop: '1px solid var(--admin-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  {project.tools_used.slice(0, 2).map((t, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.65rem', padding: '2px 8px', borderRadius: 5,
                      background: 'var(--admin-bg-secondary)',
                      color: 'var(--admin-text-muted)',
                      border: '1px solid var(--admin-border)',
                      fontWeight: 500,
                    }}>
                      {t}
                    </span>
                  ))}
                  {project.tools_used.length > 2 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)' }}>
                      +{project.tools_used.length - 2}
                    </span>
                  )}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  style={{
                    fontSize: '0.78rem', fontWeight: 700,
                    color: 'var(--admin-accent)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
                >
                  Case Study <i className="bi bi-arrow-up-right" style={{ fontSize: '0.65rem' }} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      </div>
      <style>{`
        @media (max-width: 900px) { .work-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .work-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
