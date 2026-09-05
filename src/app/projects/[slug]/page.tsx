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
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-accent)', letterSpacing: '0.05em' }}>
          Loading Case Study…
        </span>
      </div>
    );
  }

  if (!project) return notFound();

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleJumpToShot = (shotNumber: number) => {
    setSeekTime((shotNumber - 1) * 8);
  };

  const card: React.CSSProperties = {
    background: 'var(--admin-card)',
    border: '1px solid var(--admin-border)',
    borderRadius: 16,
  };

  return (
    <>
      <DotCanvas />
      <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar />

        <main style={{ padding: '120px 2rem 5rem', maxWidth: 1100, margin: '0 auto' }}>

          {/* Back link */}
          <Link
            href="/#selected-work"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.78rem', fontWeight: 600,
              color: 'var(--admin-text-muted)', textDecoration: 'none',
              marginBottom: '2rem', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-muted)'; }}
          >
            <i className="bi bi-arrow-left" /> Back to Selected Work
          </Link>

          {/* Project header */}
          <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 12px', borderRadius: 6,
                fontSize: '0.68rem', fontWeight: 700,
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                color: 'var(--admin-accent)', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {project.category}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                {project.format} Aspect Ratio · {project.duration}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
              color: 'var(--admin-text-primary)', letterSpacing: '-0.03em',
              lineHeight: 1.1, margin: 0,
            }}>
              {project.title}
            </h1>

            <p style={{
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              color: 'var(--admin-text-secondary)',
              lineHeight: 1.7, maxWidth: 680, margin: 0,
            }}>
              {project.description}
            </p>
          </div>

          {/* Video player */}
          <div style={{ marginBottom: '2rem' }}>
            <VideoPlayer
              src={project.final_video_url}
              poster={project.thumbnail_url}
              seekTime={seekTime}
            />
          </div>

          {/* Meta strip */}
          <div style={{
            ...card,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0, marginBottom: '3rem', overflow: 'hidden',
          }} className="meta-strip">
            {[
              { label: 'Client / Spec', value: project.client_spec },
              { label: 'Role', value: project.role },
              { label: 'Format', value: project.format, accent: true },
              { label: 'Production Engine', value: 'Google Flow AI + Premiere' },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRight: i < 3 ? '1px solid var(--admin-border)' : 'none',
                }}
              >
                <span style={{
                  display: 'block', fontSize: '0.62rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--admin-text-muted)', marginBottom: 5,
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 700,
                  color: item.accent ? 'var(--admin-accent)' : 'var(--admin-text-primary)',
                }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Case study content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Brief + Objective */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="brief-grid">
              <div style={{ ...card, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-accent)', margin: 0 }}>
                  <i className="bi bi-film" style={{ color: 'var(--admin-accent)' }} /> 01. The Commercial Brief
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {project.brief}
                </p>
              </div>

              <div style={{ ...card, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-accent)', margin: 0 }}>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--admin-accent)' }} /> 02. Advertising Objective
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  {project.advertising_objective}
                </p>
              </div>
            </div>

            {/* Creative Direction */}
            <div style={{ ...card, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                <i className="bi bi-stars" style={{ color: 'var(--admin-accent)' }} /> Creative Direction & Narrative Arc
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: 'var(--admin-text-primary)' }}>Visual Aesthetics:</strong> {project.creative_direction}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: 'var(--admin-text-primary)' }}>Story Narrative:</strong> {project.story_narrative}
                </p>
              </div>
            </div>

            {/* Shot breakdown */}
            <div style={{ ...card, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: '0 0 4px' }}>
                  <i className="bi bi-camera-video-fill" style={{ color: 'var(--admin-accent)' }} /> Shot-by-Shot Architecture
                </h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                  Click &quot;Jump&quot; to seek the video player to that timestamp.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      {['Shot #', 'Framing & Action', 'Prompt Strategy', 'Continuity Lock', ''].map(h => (
                        <th
                          key={h}
                          style={{
                            paddingBottom: 10, paddingRight: 16,
                            textAlign: h === '' ? 'right' : 'left',
                            fontSize: '0.62rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--admin-text-muted)', whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {project.shot_breakdown.map((shot, idx) => (
                      <tr
                        key={shot.shot_number}
                        style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.03)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '14px 16px 14px 0', fontFamily: 'monospace', fontWeight: 700, color: 'var(--admin-accent)', whiteSpace: 'nowrap' }}>
                          #{shot.shot_number}
                        </td>
                        <td style={{ padding: '14px 16px 14px 0', maxWidth: 200 }}>
                          <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)', marginBottom: 3 }}>{shot.framing}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', lineHeight: 1.4 }}>{shot.description}</div>
                        </td>
                        <td style={{ padding: '14px 16px 14px 0', maxWidth: 240 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>
                            {shot.prompt_strategy}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px 14px 0', fontSize: '0.72rem', color: 'var(--admin-text-muted)', maxWidth: 180 }}>
                          {shot.continuity_note || 'Standard visual lock'}
                        </td>
                        <td style={{ padding: '14px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => handleJumpToShot(shot.shot_number)}
                            style={{
                              padding: '4px 10px', borderRadius: 6, marginRight: 6,
                              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                              color: 'var(--admin-accent)', fontSize: '0.68rem', fontWeight: 700,
                              cursor: 'pointer', fontFamily: 'inherit',
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-accent)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)'; (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
                          >
                            <i className="bi bi-play-fill" style={{ fontSize: 10 }} /> Jump
                          </button>
                          <button
                            onClick={() => handleCopyPrompt(shot.prompt_strategy, idx)}
                            title="Copy Prompt Strategy"
                            style={{
                              width: 28, height: 28, borderRadius: 6,
                              background: 'none', border: '1px solid var(--admin-border)',
                              color: copiedIndex === idx ? '#34d399' : 'var(--admin-text-muted)',
                              cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'border-color 0.15s, color 0.15s',
                            }}
                          >
                            <i className={`bi bi-${copiedIndex === idx ? 'check-lg' : 'copy'}`} style={{ fontSize: 12 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tools */}
            <div style={{
              ...card, padding: '1.5rem 1.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 20, flexWrap: 'wrap',
            }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700, color: 'var(--admin-text-primary)', margin: '0 0 4px' }}>
                  <i className="bi bi-tools" style={{ color: 'var(--admin-accent)' }} /> Software &amp; Production Stack
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                  Tools used for camera choreography, synthesis, and edit mastering.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {project.tools_used.map((tool, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px', borderRadius: 8,
                      fontSize: '0.72rem', fontWeight: 600,
                      background: 'var(--admin-bg-secondary)',
                      border: '1px solid var(--admin-border)',
                      color: 'var(--admin-text-secondary)',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .meta-strip { grid-template-columns: 1fr 1fr !important; }
          .meta-strip > div { border-right: none !important; border-bottom: 1px solid var(--admin-border); }
          .brief-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .meta-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
