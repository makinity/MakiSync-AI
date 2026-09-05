'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/AppLayout';
import FormModal from '@/components/FormModal';
import ConfirmModal from '@/components/ConfirmModal';
import { Project, ProjectCategory } from '@/types/database';
import { getAllProjects, saveProject, deleteProject } from '@/lib/supabase';

const CATEGORIES: (ProjectCategory | 'All')[] = ['All', 'Tech', 'Beverage', 'Fashion', 'Automotive', 'Social Ad'];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);

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
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.client_spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleCreateNew() {
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');

    setEditingProject({
      id: newId,
      title: '',
      slug: '',
      client_spec: '',
      category: 'Tech',
      description: '',
      thumbnail_url: '',
      hero_video_url: '',
      final_video_url: '',
      duration: '0:30',
      format: '16:9',
      role: 'AI Creative Director & Technologist',
      brief: '',
      advertising_objective: '',
      creative_direction: '',
      story_narrative: '',
      production_process: '',
      shot_breakdown: [],
      tools_used: ['Google Flow', 'Midjourney v6', 'Premiere Pro'],
      gallery_urls: [],
      is_featured: true,
      status: 'published',
      display_order: projects.length + 1,
    });
    setModalOpen(true);
  }

  function handleEdit(project: Project) {
    setEditingProject({ ...project });
    setModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteProject(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await loadProjects();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;
    setSaving(true);

    const generatedId = editingProject.id || (typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0'));

    const projectToSave: Project = {
      id: generatedId,
      title: editingProject.title || 'Untitled Project',
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_spec: editingProject.client_spec || 'Client Spec',
      category: editingProject.category || 'Tech',
      description: editingProject.description || '',
      thumbnail_url: editingProject.thumbnail_url || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
      hero_video_url: editingProject.hero_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      final_video_url: editingProject.final_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: editingProject.duration || '0:30',
      format: editingProject.format || '16:9',
      role: editingProject.role || 'AI Creative Director',
      brief: editingProject.brief || '',
      advertising_objective: editingProject.advertising_objective || '',
      creative_direction: editingProject.creative_direction || '',
      story_narrative: editingProject.story_narrative || '',
      production_process: editingProject.production_process || '',
      shot_breakdown: editingProject.shot_breakdown || [],
      tools_used: editingProject.tools_used || ['Google Flow', 'Premiere Pro'],
      gallery_urls: editingProject.gallery_urls || [],
      is_featured: editingProject.is_featured ?? true,
      status: editingProject.status || 'published',
      display_order: editingProject.display_order || 1,
      created_at: editingProject.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveProject(projectToSave);
    setSaving(false);
    setModalOpen(false);
    await loadProjects();
  }

  const inpStyle = {
    width: '100%',
    padding: '0.65rem 0.9rem',
    borderRadius: '10px',
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border)',
    color: 'var(--admin-text-primary)',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const lblStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--admin-text-secondary)',
    marginBottom: '0.35rem',
  };

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

        {/* Category Filters Row */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 10,
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
                background: activeCategory === cat ? 'var(--admin-accent)' : 'var(--admin-card)',
                color: activeCategory === cat ? '#ffffff' : 'var(--admin-text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'var(--admin-accent)' : 'var(--admin-border)'}`
              }}
            >
              {cat}
            </button>
          ))}
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
                    <th style={{ padding: '1rem 1rem' }}>Category</th>
                    <th style={{ padding: '1rem 1rem' }}>Format</th>
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

                      {/* Client & Role */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--admin-text-primary)' }}>{p.client_spec}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>{p.role}</div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 6,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: 'rgba(59,130,246,0.12)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59,130,246,0.25)'
                        }}>
                          {p.category}
                        </span>
                      </td>

                      {/* Format */}
                      <td style={{ padding: '1rem 1rem', color: 'var(--admin-text-secondary)' }}>
                        {p.format} ({p.duration})
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

      {/* Edit / Create FormModal */}
      {modalOpen && editingProject && (
        <FormModal
          title={editingProject.title ? `Edit ${editingProject.title}` : 'New Commercial Project'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSave}
          loading={saving}
          submitLabel={editingProject.title ? 'Update Project' : 'Create Project'}
          maxWidth={680}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lblStyle}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  style={inpStyle}
                />
              </div>

              <div>
                <label style={lblStyle}>URL Slug *</label>
                <input
                  type="text"
                  required
                  value={editingProject.slug || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  style={inpStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lblStyle}>Client Spec *</label>
                <input
                  type="text"
                  required
                  value={editingProject.client_spec || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, client_spec: e.target.value })}
                  style={inpStyle}
                />
              </div>

              <div>
                <label style={lblStyle}>Category</label>
                <select
                  value={editingProject.category || 'Tech'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                  style={inpStyle}
                >
                  <option value="Tech">Tech</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Social Ad">Social Ad</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={lblStyle}>Format</label>
                <input
                  type="text"
                  value={editingProject.format || '16:9'}
                  onChange={(e) => setEditingProject({ ...editingProject, format: e.target.value })}
                  style={inpStyle}
                />
              </div>

              <div>
                <label style={lblStyle}>Duration</label>
                <input
                  type="text"
                  value={editingProject.duration || '0:30'}
                  onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                  style={inpStyle}
                />
              </div>

              <div>
                <label style={lblStyle}>Status</label>
                <select
                  value={editingProject.status || 'published'}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                  style={inpStyle}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label style={lblStyle}>Thumbnail Cover Image URL</label>
              <input
                type="text"
                value={editingProject.thumbnail_url || ''}
                onChange={(e) => setEditingProject({ ...editingProject, thumbnail_url: e.target.value })}
                style={inpStyle}
              />
            </div>

            <div>
              <label style={lblStyle}>Hero Video URL</label>
              <input
                type="text"
                value={editingProject.hero_video_url || ''}
                onChange={(e) => setEditingProject({ ...editingProject, hero_video_url: e.target.value })}
                style={inpStyle}
              />
            </div>

            <div>
              <label style={lblStyle}>Client Brief</label>
              <textarea
                rows={3}
                value={editingProject.brief || ''}
                onChange={(e) => setEditingProject({ ...editingProject, brief: e.target.value })}
                style={{ ...inpStyle, resize: 'vertical' }}
              />
            </div>

          </div>
        </FormModal>
      )}

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
