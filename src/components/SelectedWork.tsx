'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getVideoSource } from '@/lib/videoUtils';
import ShowreelModal from './ShowreelModal';
import { Video } from '@/types/database';

interface SelectedWorkProps {
  projects: Video[];
}

export default function SelectedWork({ projects }: SelectedWorkProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'UGC' | 'VSL'>('ALL');
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Video | null>(null);

  const filteredProjects = projects.filter((p: any) => {
    if (selectedCategory === 'ALL') return true;
    const catName = p.category?.name || (p.format === '16:9' ? 'VSL' : 'UGC');
    return catName.toUpperCase() === selectedCategory;
  });

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects;

  // Drag / swipe state
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, displayProjects.length - 1)));
  }, [displayProjects.length]);

  const handlePrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const handleNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const handleCategoryChange = (cat: 'ALL' | 'UGC' | 'VSL') => {
    setSelectedCategory(cat);
    setActiveIndex(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalProject) return; // don't swipe while modal is open
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlePrev, handleNext, modalProject]);

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    isDragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragDelta.current = e.clientX - dragStartX.current;
    if (Math.abs(dragDelta.current) > 8) isDragging.current = true;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      if (dragDelta.current < -50) handleNext();
      else if (dragDelta.current > 50) handlePrev();
    }
    dragStartX.current = null;
    dragDelta.current = 0;
    // Reset after a tick so onClick handlers can still read the flag
    setTimeout(() => { isDragging.current = false; }, 10);
  };

  const handleCardClick = (project: Video, e: React.MouseEvent) => {
    if (isDragging.current) return;
    setModalProject(project);
  };

  return (
    <section
      id="selected-work"
      style={{ padding: '6rem 0', background: 'var(--admin-bg-primary)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Header & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--admin-accent)',
              marginBottom: 10, padding: '3px 10px', borderRadius: 99,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--admin-accent)' }} />
              AI ADS UGC Creator
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900,
              color: 'var(--admin-text-primary)', letterSpacing: '-0.03em', margin: 0,
            }}>
              Selected Work &amp;{' '}
              <span style={{
                background: 'var(--heading-gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Commercials
              </span>
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px',
            borderRadius: 14,
            background: 'var(--admin-card)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--admin-border)',
            boxShadow: 'var(--admin-shadow)',
          }}>
            {[
              { id: 'ALL', label: 'All Projects', icon: 'bi-grid-fill' },
              { id: 'UGC', label: 'UGC Social Ads', icon: 'bi-phone-fill' },
              { id: 'VSL', label: 'VSL Commercials', icon: 'bi-play-btn-fill' },
            ].map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id as any)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '0.55rem 1.15rem',
                    borderRadius: 10,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: active 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
                      : 'transparent',
                    color: active ? '#ffffff' : 'var(--admin-text-secondary)',
                    boxShadow: active 
                      ? '0 4px 16px rgba(59, 130, 246, 0.4)' 
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'var(--admin-bg-secondary)';
                      e.currentTarget.style.color = 'var(--admin-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--admin-text-secondary)';
                    }
                  }}
                >
                  <i className={`bi ${cat.icon}`} style={{ fontSize: '0.8rem', color: active ? '#ffffff' : 'var(--admin-accent)' }} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Carousel Stage */}
      <div
        className="carousel-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ position: 'relative', cursor: 'grab', userSelect: 'none' }}
      >
        <div className="carousel-track">
          {displayProjects.map((project, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const heroSource = getVideoSource(project.video_url || project.hero_video_url || '');
            const isHovered = hoveredId === project.id;

            const translateX = offset * 68;
            const scale = isActive ? 1 : Math.max(0.78, 1 - Math.abs(offset) * 0.1);
            const opacity = isActive ? 1 : Math.max(0.45, 1 - Math.abs(offset) * 0.3);
            const zIndex = 10 - Math.abs(offset);

            return (
              <div
                key={project.id}
                className="carousel-card"
                onClick={(e) => isActive && handleCardClick(project, e)}
                onMouseEnter={() => isActive && setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 'min(520px, 82vw)',
                  transform: `translateX(calc(-50% + ${translateX}%)) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'transform 0.45s cubic-bezier(0.35,0.9,0.4,1), opacity 0.45s ease',
                  cursor: isActive ? 'pointer' : 'default',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: 'var(--admin-card)',
                  border: `1px solid ${isActive ? 'rgba(59,130,246,0.35)' : 'var(--admin-border)'}`,
                  boxShadow: isActive ? '0 24px 60px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Video / Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#050810', overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    draggable={false}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.5s, opacity 0.3s',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      opacity: isHovered ? 0.15 : 1,
                    }}
                  />

                  {/* Inline preview on hover (silent loop) */}
                  {isHovered && isActive && (
                    heroSource.isIframe ? (
                      <>
                        <iframe
                          src={heroSource.embedUrl}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                          title={project.title}
                        />
                        <div style={{
                          position: 'absolute', top: 0, right: 0,
                          width: 80, height: 56,
                          background: 'rgba(0,0,0,0.75)',
                          zIndex: 10,
                          pointerEvents: 'all',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <img src="/logo.png" alt="Logo" style={{ height: 28, width: 'auto', objectFit: 'contain', opacity: 0.9 }} />
                        </div>
                      </>
                    ) : (
                      <video
                        src={heroSource.directUrl || project.hero_video_url}
                        autoPlay loop muted playsInline
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )
                  )}

                  {/* Format badge */}
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: 5, fontSize: '0.65rem', fontWeight: 600,
                      background: 'rgba(0,0,0,0.8)', color: 'var(--admin-accent)',
                      border: '1px solid rgba(59,130,246,0.3)',
                    }}>
                      {project.format}
                    </span>
                  </div>

                  {/* Duration badge */}
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

                  {/* Play button overlay — always visible on active card */}
                  {isActive && (
                    <div
                      onClick={(e) => { e.stopPropagation(); setModalProject(project); }}
                      style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 5, cursor: 'pointer',
                        opacity: isHovered ? 0 : 1,
                        transition: 'opacity 0.2s',
                      }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'rgba(59,130,246,0.88)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 24px rgba(59,130,246,0.55)',
                      }}>
                        <i className="bi bi-play-fill" style={{ color: '#fff', fontSize: 22, marginLeft: 3 }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    {project.client_spec && (
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--admin-accent)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {project.client_spec}
                      </p>
                    )}
                    <h3 style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 700, color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.35 }}>
                      {project.title}
                    </h3>
                    <p style={{
                      fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: 8, lineHeight: 1.65,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                    }}>
                      {project.description}
                    </p>
                  </div>

                  <div style={{
                    paddingTop: 12, borderTop: '1px solid var(--admin-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 8, flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {(project.tools_used || []).slice(0, 2).map((t, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.65rem', padding: '2px 8px', borderRadius: 5,
                          background: 'var(--admin-bg-secondary)',
                          color: 'var(--admin-text-muted)',
                          border: '1px solid var(--admin-border)',
                          fontWeight: 500, whiteSpace: 'nowrap',
                        }}>
                          {t}
                        </span>
                      ))}
                      {(project.tools_used || []).length > 2 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                          +{(project.tools_used || []).length - 2}
                        </span>
                      )}
                    </div>

                    {/* View Video — navigates to project page */}
                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontSize: '0.78rem', fontWeight: 700,
                        color: 'var(--admin-accent)', textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        transition: 'color 0.2s', whiteSpace: 'nowrap',
                        position: 'relative', zIndex: 20,
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-primary)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--admin-accent)'; }}
                    >
                      View Video <i className="bi bi-arrow-up-right" style={{ fontSize: '0.65rem' }} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spacer so section has height */}
        <div style={{ height: 'calc(min(520px, 82vw) * 9/16 + 210px)', pointerEvents: 'none' }} />
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: '2rem' }}>

          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: activeIndex === 0 ? 'var(--admin-bg-secondary)' : 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              color: activeIndex === 0 ? 'var(--admin-text-muted)' : 'var(--admin-text-primary)',
              cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', fontSize: 16,
            }}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {displayProjects.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8, borderRadius: 99,
                  background: i === activeIndex ? 'var(--admin-accent)' : 'var(--admin-border)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex === displayProjects.length - 1}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: activeIndex === displayProjects.length - 1 ? 'var(--admin-bg-secondary)' : 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              color: activeIndex === displayProjects.length - 1 ? 'var(--admin-text-muted)' : 'var(--admin-text-primary)',
              cursor: activeIndex === displayProjects.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', fontSize: 16,
            }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
          {activeIndex + 1} / {displayProjects.length}
        </p>
      </div>

      {/* Video Modal */}
      {modalProject && (
        <ShowreelModal
          isOpen={!!modalProject}
          onClose={() => setModalProject(null)}
          videoUrl={modalProject.video_url || modalProject.hero_video_url || ''}
          title={modalProject.title}
          format={modalProject.format}
        />
      )}

      <style>{`
        .carousel-stage { width: 100%; }
        .carousel-track { position: relative; width: 100%; }
        .carousel-stage:active { cursor: grabbing; }
      `}</style>
    </section>
  );
}
