'use client';

import { useState, useRef, useEffect } from 'react';
import { getVideoSource } from '@/lib/videoUtils';
import ShowreelModal from './ShowreelModal';
import { Video, Category } from '@/types/database';
import { getCategories } from '@/lib/supabase';
import MediaThumbnail from '@/components/MediaThumbnail';

const CATEGORY_ICONS: Record<string, string> = {
  ALL: 'bi-grid-fill',
  UGC: 'bi-phone-fill',
  VSL: 'bi-play-btn-fill',
  CLAYMATION: 'bi-palette-fill',
  'IMAGE TO VIDEO': 'bi-stars',
  'PIXAR 3D': 'bi-box-fill',
  'REAL ESTATE': 'bi-buildings-fill',
  'SKELETON ANIMATION': 'bi-person-walking',
};

const CATEGORY_ORDER = [
  'UGC',
  'VSL',
  'CLAYMATION',
  'IMAGE TO VIDEO',
  'PIXAR 3D',
  'REAL ESTATE',
  'SKELETON ANIMATION',
];

interface SelectedWorkProps {
  projects: Video[];
  categories?: Category[];
}

export default function SelectedWork({ projects, categories: initialCategories }: SelectedWorkProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modalProject, setModalProject] = useState<Video | null>(null);
  const [isFloating, setIsFloating] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const staticBarRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    } else {
      getCategories().then((cats) => {
        if (cats && cats.length > 0) setCategories(cats);
      });
    }
  }, [initialCategories]);

  // Track scroll position: float the category bar strictly within #selected-work section
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !staticBarRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const staticBarRect = staticBarRef.current.getBoundingClientRect();

      // Floating category bar appears only when:
      // 1. Static category bar has scrolled under/past the top (replaces the main navbar)
      // 2. The visitor is still browsing within the #selected-work section
      const passedStatic = staticBarRect.bottom <= 50;
      const stillInSection = sectionRect.bottom >= 220;
      const shouldFloat = passedStatic && stillInSection;

      setIsFloating(shouldFloat);
      window.dispatchEvent(new CustomEvent('work-nav-active', { detail: shouldFloat }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.dispatchEvent(new CustomEvent('work-nav-active', { detail: false }));
    };
  }, []);

  // Sort categories according to preferred display order
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a.name.toUpperCase());
    const idxB = CATEGORY_ORDER.indexOf(b.name.toUpperCase());
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  // Always show all categories in the filter bar
  const filterTabs = [
    { id: 'ALL', label: 'All Projects', icon: CATEGORY_ICONS.ALL },
    ...sortedCategories.map((c) => ({
      id: c.name.toUpperCase(),
      label: c.name,
      icon: CATEGORY_ICONS[c.name.toUpperCase()] || 'bi-film',
    })),
  ];

  const filteredProjects = projects.filter((p: any) => {
    if (selectedCategory === 'ALL') return true;
    const catName = (p.category?.name || (p.format === '16:9' ? 'VSL' : 'UGC')).toUpperCase();
    const catSlug = (p.category?.slug || '').toUpperCase();
    const catId = p.category_id || p.category?.id || '';
    return (
      catName === selectedCategory ||
      catSlug === selectedCategory ||
      catId === selectedCategory
    );
  });

  const displayProjects = filteredProjects;

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);

    // If visitor has scrolled down into the grid, smoothly glide back to the top of the video grid
    if (gridTopRef.current) {
      const rect = gridTopRef.current.getBoundingClientRect();
      // Floating bar takes over the top at top: 14px, height ~46px => bottom is at ~60px.
      // 84px scroll clearance leaves comfortable breathing room above row 1.
      if (rect.top < 84 || isFloating) {
        const targetY = window.scrollY + rect.top - 84;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    }
  };

  const renderCategoryTabs = (isFloatingBar = false) => (
    <div
      className="category-pill-container no-scrollbar"
      style={{
        pointerEvents: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: isFloatingBar ? '5px 8px' : '6px 8px',
        borderRadius: 999,
        background: 'var(--nav-bg, rgba(10, 15, 26, 0.9))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--admin-border)',
        boxShadow: isFloatingBar
          ? '0 12px 36px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(59, 130, 246, 0.14)'
          : '0 4px 20px rgba(0, 0, 0, 0.06)',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {filterTabs.map((cat) => {
        const active = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: isFloatingBar ? '0.45rem 1rem' : '0.55rem 1.1rem',
              borderRadius: 999,
              fontSize: isFloatingBar ? '0.75rem' : '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
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
            <i
              className={`bi ${cat.icon}`}
              style={{ fontSize: '0.8rem', color: active ? '#ffffff' : 'var(--admin-accent)' }}
            />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      style={{
        padding: '5rem 0 6rem',
        background: 'var(--admin-bg-primary)',
        position: 'relative',
        overflowX: 'clip',
        overflowY: 'visible',
      }}
    >
      {/* Floating Category Filter Bar (Replaces Navbar strictly while inside #selected-work) */}
      <div
        className="floating-category-layer"
        style={{
          position: 'fixed',
          top: 14,
          left: '50%',
          transform: isFloating ? 'translate(-50%, 0)' : 'translate(-50%, -24px)',
          opacity: isFloating ? 1 : 0,
          pointerEvents: isFloating ? 'auto' : 'none',
          zIndex: 9999,
          transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          maxWidth: 'calc(100vw - 24px)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {renderCategoryTabs(true)}
      </div>

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 2rem' }}>

        {/* Section Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--admin-accent)',
            marginBottom: 10, padding: '4px 12px', borderRadius: 99,
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--admin-accent)' }} />
            AI Commercial Director &amp; Animator
          </div>
          <h2 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900,
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

        {/* Static Category Filter Bar under header */}
        <div
          id="selected-work-static-bar"
          ref={staticBarRef}
          style={{
            padding: '8px 0 20px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {renderCategoryTabs(false)}
        </div>

        {/* Scroll anchor target for smooth glide back to top of grid */}
        <div ref={gridTopRef} />

        {/* 3-COLUMN VIDEO GRID OR EMPTY STATE */}
        {displayProjects.length === 0 ? (
          <div style={{
            maxWidth: 480,
            margin: '2rem auto 4rem',
            padding: '3.5rem 2rem',
            borderRadius: 22,
            background: 'var(--admin-card)',
            border: '1px dashed var(--admin-border)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            boxShadow: 'var(--admin-shadow)',
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              <i className={`bi ${CATEGORY_ICONS[selectedCategory] || 'bi-film'}`} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                No {filterTabs.find(t => t.id === selectedCategory)?.label || selectedCategory} Videos Yet
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                Projects for this category haven't been uploaded yet. Check back soon or view all work!
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCategoryChange('ALL')}
              style={{
                marginTop: 4,
                padding: '0.55rem 1.25rem',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
              }}
            >
              <i className="bi bi-grid-fill" /> View All Projects
            </button>
          </div>
        ) : (
          <div className="three-column-grid">
            {displayProjects.map((project) => {
              const heroSource = getVideoSource(project.video_url || project.hero_video_url || '');
              const isHovered = hoveredId === project.id;
              const catName = project.category?.name || (project.format === '16:9' ? 'VSL' : 'UGC');
              const isNineSixteen = project.format !== '16:9';

              return (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => setModalProject(project)}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    background: 'var(--admin-card)',
                    border: '1px solid var(--admin-border)',
                    boxShadow: isHovered
                      ? '0 20px 40px rgba(59,130,246,0.18)'
                      : '0 8px 24px rgba(0,0,0,0.22)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.3s ease',
                    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                    borderColor: isHovered ? 'rgba(59,130,246,0.5)' : 'var(--admin-border)',
                  }}
                >
                  {/* 9:16 Video Container Holder */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: isNineSixteen ? '9/16' : '16/9',
                      background: '#050810',
                      overflow: 'hidden',
                    }}
                  >
                    <MediaThumbnail
                      src={project.thumbnail_url}
                      videoFallbackUrl={project.video_url || project.hero_video_url}
                      alt={project.title}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease, opacity 0.3s ease',
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        opacity: isHovered ? 0.2 : 1,
                      }}
                    />

                    {/* Inline silent video preview on hover */}
                    {isHovered && (
                      heroSource.isIframe ? (
                        <>
                          <iframe
                            src={heroSource.embedUrl}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                            title={project.title}
                          />
                          <div style={{
                            position: 'absolute', top: 0, right: 0,
                            width: 70, height: 48,
                            background: 'rgba(0,0,0,0.75)',
                            zIndex: 10,
                            pointerEvents: 'all',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <img src="/logo.png" alt="Logo" style={{ height: 22, width: 'auto', objectFit: 'contain', opacity: 0.9 }} />
                          </div>
                        </>
                      ) : (
                        <video
                          src={heroSource.directUrl || project.hero_video_url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )
                    )}

                    {/* Badges: Category & Format */}
                    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {catName && (
                        <span style={{
                          padding: '4px 9px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700,
                          background: 'linear-gradient(135deg, rgba(59,130,246,0.92) 0%, rgba(37,99,235,0.92) 100%)',
                          color: '#ffffff',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                        }}>
                          {catName}
                        </span>
                      )}
                      <span style={{
                        padding: '4px 9px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700,
                        background: 'rgba(0,0,0,0.75)', color: '#60a5fa',
                        border: '1px solid rgba(59,130,246,0.3)',
                        backdropFilter: 'blur(8px)',
                      }}>
                        {project.format || '9:16'}
                      </span>
                    </div>

                    {/* Duration badge */}
                    {project.duration && (
                      <div style={{
                        position: 'absolute', bottom: 12, right: 12, zIndex: 2,
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 6,
                        background: 'rgba(0,0,0,0.75)',
                        fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(6px)',
                      }}>
                        <i className="bi bi-clock" style={{ color: 'var(--admin-accent)', fontSize: 10 }} />
                        {project.duration}
                      </div>
                    )}

                    {/* Center Play Button Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                        pointerEvents: 'none',
                        opacity: isHovered ? 0 : 0.9,
                        transition: 'opacity 0.25s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          background: 'rgba(59,130,246,0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 24px rgba(59,130,246,0.5)',
                          border: '2px solid rgba(255,255,255,0.35)',
                        }}
                      >
                        <i className="bi bi-play-fill" style={{ color: '#fff', fontSize: 24, marginLeft: 3 }} />
                      </div>
                    </div>
                  </div>

                  {/* Card Content & Details */}
                  <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      {project.client_spec && (
                        <p style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--admin-accent)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {project.client_spec}
                        </p>
                      )}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0, lineHeight: 1.3 }}>
                        {project.title}
                      </h3>
                      {project.description && (
                        <p style={{
                          fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: 8, lineHeight: 1.55,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>
                          {project.description}
                        </p>
                      )}
                    </div>

                    {/* Tools tags if present */}
                    {(project.tools_used && project.tools_used.length > 0) && (
                      <div style={{
                        paddingTop: 10,
                        borderTop: '1px solid var(--admin-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}>
                        {project.tools_used.slice(0, 3).map((t, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.65rem', padding: '2px 8px', borderRadius: 6,
                            background: 'var(--admin-bg-secondary)',
                            color: 'var(--admin-text-muted)',
                            border: '1px solid var(--admin-border)',
                            fontWeight: 600, whiteSpace: 'nowrap',
                          }}>
                            {t}
                          </span>
                        ))}
                        {project.tools_used.length > 3 && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
                            +{project.tools_used.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {modalProject && (
        <ShowreelModal
          isOpen={!!modalProject}
          onClose={() => setModalProject(null)}
          videoUrl={modalProject.video_url || modalProject.hero_video_url || ''}
          title={modalProject.title}
          format={modalProject.format}
        />
      )}

      {/* Responsive 3-Column Grid CSS */}
      <style>{`
        .three-column-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
        }
        @media (max-width: 1080px) {
          .three-column-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }
          .floating-category-layer {
            top: 12px !important;
          }
        }
        @media (max-width: 640px) {
          .three-column-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .floating-category-layer {
            top: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
