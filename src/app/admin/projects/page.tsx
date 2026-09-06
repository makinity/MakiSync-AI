'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/AppLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { Project } from '@/types/database';
import { getAllProjects, deleteProject } from '@/lib/supabase';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    return p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (p.client_spec || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
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
    <AppLayout title="Projects Slate CMS" description="Manage commercial AI video ad projects slate">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Top Header Card */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 16,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: 300, maxWidth: '100%' }}>
            <i className="bi bi-search" style={{
              position: 'absolute',
              left: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--admin-text-muted)',
              fontSize: '0.85rem'
            }} />
            <input
              type="text"
              placeholder="Search projects by title or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem 0.65rem 2.4rem',
                borderRadius: 12,
                background: 'var(--admin-bg-primary)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* New Project Button */}
          <button
            onClick={handleCreateNew}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: 12,
              background: 'var(--admin-accent)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(59,130,246,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="bi bi-plus-lg" style={{ fontSize: '0.9rem' }} />
            <span>New Commercial Project</span>
          </button>
        </div>

        {/* Projects Table Card */}
        <div style={{
          borderRadius: 16,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Loading project slate...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              No projects found matching current criteria.
            </div>
          ) : (
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
                    <th style={{ padding: '1rem 1.25rem' }}>Project</th>
                    <th style={{ padding: '1rem 1rem' }}>Client & Role</th>
                    <th style={{ padding: '1rem 1rem' }}>Format & Duration</th>
                    <th style={{ padding: '1rem 1rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.82rem' }}>
                  {filteredProjects.map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--admin-border)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      {/* Project title + thumbnail */}
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

                      {/* Client / Tools */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                          {p.client_spec || (p.tools_used && p.tools_used[0]) || 'AI Video'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>
                          {p.role || (p.tools_used && p.tools_used.slice(0, 2).join(', ')) || 'AI Video'}
                        </div>
                      </td>

                      {/* Format */}
                      <td style={{ padding: '1rem 1rem', color: 'var(--admin-text-secondary)' }}>
                        <span style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: 6,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: 'rgba(59,130,246,0.1)',
                          color: 'var(--admin-accent)',
                          border: '1px solid rgba(59,130,246,0.25)',
                          marginRight: 6
                        }}>
                          {p.format}
                        </span>
                        {p.duration}
                      </td>

                      {/* Status */}
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

                      {/* Actions */}
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
                              fontFamily: 'inherit'
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
                              fontFamily: 'inherit'
                            }}
                          >
                            <i className="bi bi-trash3-fill" style={{ fontSize: '0.7rem' }} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to delete "${deleteTarget.title}"? This commercial project will be removed from your public slate.`}
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
