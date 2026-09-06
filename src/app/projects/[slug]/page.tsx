'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@/lib/supabase';
import { Project } from '@/types/database';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import DotCanvas from '@/components/DotCanvas';

export default function ProjectCaseStudyPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      const data = await getProjectBySlug(slug);
      setProject(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--admin-bg-primary)' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--admin-accent)', letterSpacing: '0.05em' }}>
          Loading Commercial Video…
        </span>
      </div>
    );
  }

  if (!project) return notFound();

  const card: React.CSSProperties = {
    background: 'var(--admin-card)',
    border: '1px solid var(--admin-border)',
    borderRadius: 20,
    boxShadow: 'var(--admin-shadow)',
  };

  return (
    <>
      <DotCanvas />
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />

        <main style={{ padding: '120px 2rem 5rem', maxWidth: 1060, margin: '0 auto', width: '100%', flex: 1 }}>

          {/* Back link */}
          <Link
            href="/#selected-work"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--admin-text-muted)',
              textDecoration: 'none',
              marginBottom: '2rem',
              padding: '6px 14px',
              borderRadius: 10,
              background: 'var(--admin-bg-secondary)',
              border: '1px solid var(--admin-border)',
              transition: 'all 0.2s ease',
              width: 'fit-content',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#ffffff';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-accent)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-muted)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)';
            }}
          >
            <i className="bi bi-arrow-left" /> Back to Selected Work
          </Link>

          {/* Project header */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px',
                borderRadius: 99,
                fontSize: '0.68rem',
                fontWeight: 800,
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: 'var(--admin-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {project.format || '16:9'} Format
              </span>
              <span style={{
                padding: '4px 12px',
                borderRadius: 99,
                fontSize: '0.68rem',
                fontWeight: 700,
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-muted)',
                fontFamily: 'monospace',
              }}>
                ⏱ {project.duration || '0:30'}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
              fontWeight: 900,
              color: 'var(--admin-text-primary)',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              margin: 0,
            }}>
              {project.title}
            </h1>

            {project.description && (
              <p style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                color: 'var(--admin-text-secondary)',
                lineHeight: 1.7,
                maxWidth: 780,
                margin: 0,
              }}>
                {project.description}
              </p>
            )}
          </div>

          {/* Video player container */}
          <div style={{
            marginBottom: '2.5rem',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 60px -15px rgba(0,0,0,0.7), 0 0 40px rgba(59,130,246,0.1)',
            border: '1px solid var(--admin-border-strong)',
            background: '#000',
          }}>
            <VideoPlayer
              src={project.final_video_url || project.hero_video_url}
              poster={project.thumbnail_url}
            />
          </div>

          {/* AI Tools & Production Software Stack */}
          {project.tools_used && project.tools_used.length > 0 && (
            <div style={{
              ...card,
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-accent)',
                  fontSize: '1.1rem',
                }}>
                  <i className="bi bi-cpu-fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    AI Tool Stack &amp; Software
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                    Generative models &amp; post-production editing tools used
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {project.tools_used.map((tool, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 10,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'var(--admin-bg-secondary)',
                      border: '1px solid var(--admin-border)',
                      color: 'var(--admin-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span style={{ color: 'var(--admin-accent)', fontSize: '0.65rem' }}>●</span> {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project CTA Banner */}
          <div style={{
            ...card,
            padding: '2.5rem 2rem',
            textAlign: 'center',
            background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.1) 0%, var(--admin-card) 70%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--admin-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              Looking for a custom AI video commercial?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', maxWidth: 520, margin: 0, lineHeight: 1.6 }}>
              Let&apos;s collaborate to concept, prompt, and deliver high-converting video campaigns for your brand.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              <Link
                href="/#inquiries"
                style={{
                  padding: '0.75rem 1.6rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                }}
              >
                <i className="bi bi-envelope-fill" /> Start Commercial Project
              </Link>
              <Link
                href="/#selected-work"
                style={{
                  padding: '0.75rem 1.4rem',
                  borderRadius: 12,
                  background: 'var(--admin-bg-secondary)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Browse More Work
              </Link>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}
