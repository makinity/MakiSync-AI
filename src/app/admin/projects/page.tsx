'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/layouts/AppLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { Project } from '@/types/database';
import { getAllProjects, deleteProject } from '@/lib/supabase';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'UGC' | 'VSL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Delete Confirm Modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    const data = await getAllProjects();
    setProjects(data);
    setLoading(false);
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const catName = (p.category?.name || (p.format === '16:9' ? 'VSL' : 'UGC')).toUpperCase();
    const matchesCategory = selectedCategory === 'ALL' || catName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function handleCreateNew() {
    router.push('/admin/projects/new');
  }

  function handleEdit(project: Project) {
    router.push(`/admin/projects/${project.id}/edit`);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteProject(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await loadProjects();
  }

  return (
    <AppLayout title="Projects Manager" description="Manage your AI commercial video portfolio slate">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        {/* Header Toolbar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 18,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Box */}
            <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
              <i className="bi bi-search" style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--admin-text-muted)',
                fontSize: '0.85rem'
              }} />
              <input
                type="text"
                placeholder="Search by title, description, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 1rem 0.7rem 2.5rem',
                  borderRadius: 12,
                  background: 'var(--admin-bg-secondary)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s ease',
                }}
              />
            </div>

            {/* Actions: View Mode Switcher + Add Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* View Switcher */}
              <div style={{
                display: 'flex',
                gap: 2,
                background: 'var(--admin-bg-secondary)',
                padding: 3,
                borderRadius: 10,
                border: '1px solid var(--admin-border)'
              }}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: viewMode === 'grid' ? 'var(--admin-accent)' : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : 'var(--admin-text-muted)',
                  }}
                >
                  <i className="bi bi-grid-fill" /> Box Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: viewMode === 'table' ? 'var(--admin-accent)' : 'transparent',
                    color: viewMode === 'table' ? '#ffffff' : 'var(--admin-text-muted)',
                  }}
                >
                  <i className="bi bi-list-task" /> Table List
                </button>
              </div>

              {/* New Project Button */}
              <button
                onClick={handleCreateNew}
                style={{
                  padding: '0.68rem 1.35rem',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <i className="bi bi-plus-circle-fill" style={{ fontSize: '0.95rem' }} />
                <span>New Portfolio Video</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: '0.5rem', borderTop: '1px solid var(--admin-border)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 4 }}>
              Category Filter:
            </span>
            {[
              { id: 'ALL', label: 'All Videos', icon: 'bi-grid' },
              { id: 'UGC', label: 'UGC Ads', icon: 'bi-phone' },
              { id: 'VSL', label: 'VSL Commercials', icon: 'bi-film' },
            ].map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  style={{
                    padding: '0.35rem 0.9rem',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: `1px solid ${active ? 'var(--admin-accent)' : 'var(--admin-border)'}`,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: active ? '#60a5fa' : 'var(--admin-text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <i className={`bi ${cat.icon}`} /> {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Container */}
        {loading ? (
          <div style={{
            padding: '4rem',
            textAlign: 'center',
            borderRadius: 18,
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text-muted)',
            fontSize: '0.88rem'
          }}>
            <i className="bi bi-arrow-repeat spin" style={{ fontSize: '1.6rem', color: 'var(--admin-accent)', display: 'block', marginBottom: 12 }} />
            Loading video slate...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 18,
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            color: 'var(--admin-text-muted)'
          }}>
            <i className="bi bi-film" style={{ fontSize: '2.5rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: 12, opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>No Video Projects Found</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)', marginTop: 6, marginBottom: 18 }}>
              No videos match your current search or category filter.
            </p>
            <button
              onClick={handleCreateNew}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: 10,
                background: 'var(--admin-accent)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Add New Video Project
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID BOX CARDS VIEW */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.25rem'
          }}>
            {filteredProjects.map((p) => {
              const catName = p.category?.name || (p.format === '16:9' ? 'VSL' : 'UGC');
              const isVsl = catName.toUpperCase() === 'VSL';

              return (
                <div
                  key={p.id}
                  style={{
                    borderRadius: 16,
                    background: 'var(--admin-card)',
                    border: '1px solid var(--admin-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--admin-shadow)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border-strong)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--admin-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Card Thumbnail Header */}
                  <div style={{ position: 'relative', aspectRatio: p.format === '16:9' ? '16/9' : '16/9', background: '#050810', overflow: 'hidden' }}>
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Top Left Badges */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap', zIndex: 2 }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        background: isVsl ? 'rgba(168,85,247,0.85)' : 'rgba(59,130,246,0.85)',
                        color: '#ffffff',
                        backdropFilter: 'blur(4px)',
                      }}>
                        {catName}
                      </span>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: 'rgba(0,0,0,0.75)',
                        color: 'rgba(255,255,255,0.85)',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}>
                        {p.format}
                      </span>
                    </div>

                    {/* Top Right Status Badge */}
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: p.status === 'published' ? 'rgba(52,211,153,0.9)' : 'rgba(245,158,11,0.9)',
                        color: '#000000',
                      }}>
                        {p.status}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(0,0,0,0.8)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <i className="bi bi-clock" style={{ fontSize: 10, color: 'var(--admin-accent)' }} />
                      {p.duration || '0:30'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'var(--admin-text-primary)',
                        margin: 0,
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {p.title}
                      </h3>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-muted)',
                        marginTop: 4,
                        marginBottom: 0,
                        fontFamily: 'monospace'
                      }}>
                        /{p.slug}
                      </p>
                      {p.description && (
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--admin-text-secondary)',
                          marginTop: 8,
                          margin: '8px 0 0 0',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {p.description}
                        </p>
                      )}
                    </div>

                    {/* Action Bar Footer */}
                    <div style={{
                      paddingTop: 10,
                      borderTop: '1px solid var(--admin-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}>
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--admin-accent)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.65rem' }} /> Preview
                      </Link>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(p)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: 8,
                            border: '1px solid var(--admin-border-strong)',
                            background: 'var(--admin-bg-secondary)',
                            color: 'var(--admin-text-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <i className="bi bi-pencil-fill" style={{ fontSize: '0.7rem' }} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: 8,
                            border: '1px solid rgba(239,68,68,0.3)',
                            background: 'rgba(239,68,68,0.1)',
                            color: '#f87171',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <i className="bi bi-trash3-fill" style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT TABLE VIEW */
          <div style={{
            borderRadius: 16,
            background: 'var(--admin-card)',
            border: '1px solid var(--admin-border)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--admin-border)',
                    background: 'rgba(0,0,0,0.2)',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: 'var(--admin-text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Project Title</th>
                    <th style={{ padding: '1rem 1rem' }}>Category</th>
                    <th style={{ padding: '1rem 1rem' }}>Format & Duration</th>
                    <th style={{ padding: '1rem 1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.82rem' }}>
                  {filteredProjects.map((p) => {
                    const catName = p.category?.name || (p.format === '16:9' ? 'VSL' : 'UGC');
                    const isVsl = catName.toUpperCase() === 'VSL';
                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid var(--admin-border)',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img
                              src={p.thumbnail_url}
                              alt={p.title}
                              style={{
                                width: 56,
                                height: 38,
                                borderRadius: 8,
                                objectFit: 'cover',
                                background: 'var(--admin-bg-secondary)',
                                border: '1px solid var(--admin-border)',
                                flexShrink: 0
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--admin-text-primary)', lineHeight: 1.3 }}>
                                {p.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                                /{p.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: 8,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            background: isVsl ? 'rgba(168,85,247,0.15)' : 'rgba(59,130,246,0.15)',
                            color: isVsl ? '#c084fc' : '#60a5fa',
                            border: `1px solid ${isVsl ? 'rgba(168,85,247,0.3)' : 'rgba(59,130,246,0.3)'}`
                          }}>
                            {catName}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1rem', color: 'var(--admin-text-secondary)' }}>
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: 6,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: 'rgba(255,255,255,0.06)',
                            color: 'var(--admin-text-secondary)',
                            border: '1px solid var(--admin-border)',
                            marginRight: 6
                          }}>
                            {p.format}
                          </span>
                          {p.duration || '0:30'}
                        </td>

                        <td style={{ padding: '1rem 1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: 6,
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: p.status === 'published' ? 'rgba(52,211,153,0.12)' : 'rgba(245,158,11,0.12)',
                            color: p.status === 'published' ? '#34d399' : '#fbbf24',
                            border: `1px solid ${p.status === 'published' ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}`
                          }}>
                            {p.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleEdit(p)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 8,
                                border: '1px solid var(--admin-border-strong)',
                                background: 'transparent',
                                color: 'var(--admin-text-secondary)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <i className="bi bi-pencil-fill" style={{ fontSize: '0.7rem' }} /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: 8,
                                border: '1px solid rgba(239,68,68,0.3)',
                                background: 'rgba(239,68,68,0.08)',
                                color: '#f87171',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <i className="bi bi-trash3-fill" style={{ fontSize: '0.7rem' }} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.title}"? This video project will be removed from your portfolio.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
          danger={true}
          confirmLabel="Delete Project"
        />
      )}
    </AppLayout>
  );
}
