'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/AppLayout';
import MediaDropzone from '@/components/admin/MediaDropzone';
import { Project, ProjectCategory } from '@/types/database';
import { saveProject } from '@/lib/supabase';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  isNew?: boolean;
}

const CATEGORIES: ProjectCategory[] = ['Tech', 'Beverage', 'Fashion', 'Automotive', 'Social Ad'];
const AVAILABLE_TOOLS = [
  'Google Flow',
  'Runway Gen-3',
  'Midjourney v6',
  'Sora',
  'ComfyUI',
  'ElevenLabs',
  'Premiere Pro',
  'After Effects',
  'Luma Dream Machine',
  'CapCut Pro',
];

export default function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<Partial<Project>>({
    id: initialData?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'p_' + Date.now()),
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    client_spec: initialData?.client_spec || '',
    category: initialData?.category || 'Tech',
    description: initialData?.description || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    hero_video_url: initialData?.hero_video_url || '',
    final_video_url: initialData?.final_video_url || '',
    duration: initialData?.duration || '0:30',
    format: initialData?.format || '16:9',
    role: initialData?.role || 'AI Creative Director & Technologist',
    brief: initialData?.brief || '',
    advertising_objective: initialData?.advertising_objective || '',
    creative_direction: initialData?.creative_direction || '',
    story_narrative: initialData?.story_narrative || '',
    production_process: initialData?.production_process || '',
    shot_breakdown: initialData?.shot_breakdown || [],
    tools_used: initialData?.tools_used || ['Google Flow', 'Midjourney v6', 'Premiere Pro'],
    gallery_urls: initialData?.gallery_urls || [],
    is_featured: initialData?.is_featured ?? true,
    status: initialData?.status || 'published',
    display_order: initialData?.display_order || 1,
  });

  const handleTitleChange = (val: string) => {
    const updated: Partial<Project> = { ...form, title: val };
    if (isNew || !form.slug) {
      updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    setForm(updated);
  };

  const toggleTool = (tool: string) => {
    const current = form.tools_used || [];
    if (current.includes(tool)) {
      setForm({ ...form, tools_used: current.filter(t => t !== tool) });
    } else {
      setForm({ ...form, tools_used: [...current, tool] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);

    const projectToSave: Project = {
      id: form.id || 'p_' + Date.now(),
      title: form.title || 'Untitled Project',
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_spec: form.client_spec || 'Client Spec',
      category: form.category || 'Tech',
      description: form.description || form.brief || '',
      thumbnail_url: form.thumbnail_url || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
      hero_video_url: form.hero_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      final_video_url: form.final_video_url || form.hero_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: form.duration || '0:30',
      format: form.format || '16:9',
      role: form.role || 'AI Creative Director',
      brief: form.brief || '',
      advertising_objective: form.advertising_objective || '',
      creative_direction: form.creative_direction || '',
      story_narrative: form.story_narrative || '',
      production_process: form.production_process || '',
      shot_breakdown: form.shot_breakdown || [],
      tools_used: form.tools_used || ['Google Flow', 'Premiere Pro'],
      gallery_urls: form.gallery_urls || [],
      is_featured: form.is_featured ?? true,
      status: form.status || 'published',
      display_order: form.display_order || 1,
      created_at: form.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await saveProject(projectToSave);
    setSaving(false);
    router.push('/admin/projects');
  };

  const inpStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border)',
    color: 'var(--admin-text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const lblStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--admin-text-secondary)',
    marginBottom: '0.4rem',
  };

  return (
    <AppLayout title={isNew ? 'Create Commercial Project' : `Studio Editor — ${form.title || 'Project'}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1280, margin: '0 auto' }}>
        
        {/* Sticky Executive Control Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderRadius: 20,
          background: 'var(--admin-card)',
          border: '1px solid var(--admin-border-strong)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: '1rem',
          zIndex: 40,
          boxShadow: 'var(--admin-shadow), 0 0 40px rgba(59,130,246,0.08)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: 12,
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="bi bi-arrow-left" /> Back to Slate
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--admin-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {isNew ? 'New Commercial Project' : form.title || 'Untitled Project'}
                </h2>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 99,
                  background: form.status === 'published' ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)',
                  color: form.status === 'published' ? '#34d399' : '#fbbf24',
                  border: `1px solid ${form.status === 'published' ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  textTransform: 'uppercase',
                }}>
                  ● {form.status || 'Published'}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                /{form.slug || 'project-slug'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                background: 'transparent',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-muted)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !form.title}
              style={{
                padding: '0.7rem 1.6rem',
                borderRadius: 12,
                background: saving ? 'var(--admin-border)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: saving ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              {saving ? (
                <>
                  <i className="bi bi-arrow-repeat" style={{ animation: 'spin 1.5s linear infinite' }} />
                  Saving Project...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill" />
                  {isNew ? 'Publish Commercial Project' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual-Column Studio Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT MAIN COLUMN: Rich Editor Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Card 1: Project Identity */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <i className="bi bi-tag-fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Project Identity & Overview
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Core branding, client specification, and role description
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={lblStyle}>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aether Vision Pro — Next-Gen Spatial AI Glasses"
                    value={form.title || ''}
                    onChange={e => handleTitleChange(e.target.value)}
                    style={inpStyle}
                  />
                </div>

                <div>
                  <label style={lblStyle}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. aether-vision-pro-spatial-ai-glasses"
                    value={form.slug || ''}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    style={inpStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={lblStyle}>Client Spec *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aether Tech Labs"
                    value={form.client_spec || ''}
                    onChange={e => setForm({ ...form, client_spec: e.target.value })}
                    style={inpStyle}
                  />
                </div>

                <div>
                  <label style={lblStyle}>My Creative Role</label>
                  <input
                    type="text"
                    placeholder="e.g. AI Creative Director & Technologist"
                    value={form.role || ''}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={inpStyle}
                  />
                </div>
              </div>

              <div>
                <label style={lblStyle}>Project Short Summary / Description</label>
                <textarea
                  rows={2}
                  placeholder="High-level teaser summary displayed on portfolio grid cards..."
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...inpStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Card 2: Commercial Media Hub & Dropzones */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                  <i className="bi bi-film" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Commercial Media Renders & Dropzone
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Drag & drop 4K MP4 videos or cover images directly (Supabase Storage connected)
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <MediaDropzone
                  label="Thumbnail Cover Image"
                  acceptType="image"
                  value={form.thumbnail_url || ''}
                  onChange={url => setForm({ ...form, thumbnail_url: url })}
                  placeholder="Drag cover image file or paste URL / Google Drive link..."
                />

                <MediaDropzone
                  label="Hero Commercial Video (.mp4)"
                  acceptType="video"
                  value={form.hero_video_url || ''}
                  onChange={url => setForm({ ...form, hero_video_url: url, final_video_url: url })}
                  placeholder="Drag video file (.mp4, .mov) or paste URL / Google Drive link..."
                />
              </div>
            </div>

            {/* Card 3: Creative Brief & Production Strategy */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <i className="bi bi-compass-fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Creative Direction & Strategy Brief
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Commercial goals, lighting aesthetics, story narrative, and prompting process
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={lblStyle}>Client Brief</label>
                  <textarea
                    rows={3}
                    placeholder="Summarize client goals and target audience..."
                    value={form.brief || ''}
                    onChange={e => setForm({ ...form, brief: e.target.value })}
                    style={{ ...inpStyle, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={lblStyle}>Advertising Objective</label>
                  <textarea
                    rows={3}
                    placeholder="Key campaign performance metrics and brand positioning..."
                    value={form.advertising_objective || ''}
                    onChange={e => setForm({ ...form, advertising_objective: e.target.value })}
                    style={{ ...inpStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              <div>
                <label style={lblStyle}>Creative Direction & Aesthetic</label>
                <textarea
                  rows={3}
                  placeholder="Atmospheric lighting, camera track, color contrast, particle effects..."
                  value={form.creative_direction || ''}
                  onChange={e => setForm({ ...form, creative_direction: e.target.value })}
                  style={{ ...inpStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={lblStyle}>Story Narrative</label>
                  <textarea
                    rows={4}
                    placeholder="Shot-by-shot story progression..."
                    value={form.story_narrative || ''}
                    onChange={e => setForm({ ...form, story_narrative: e.target.value })}
                    style={{ ...inpStyle, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={lblStyle}>Production Process</label>
                  <textarea
                    rows={4}
                    placeholder="Google Flow prompt choreography, voiceover synthesis, Premiere Pro edit..."
                    value={form.production_process || ''}
                    onChange={e => setForm({ ...form, production_process: e.target.value })}
                    style={{ ...inpStyle, resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Card 4: AI Software & Stack */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <i className="bi bi-cpu-fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    AI Tool Stack & Software Used
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Select all generative tools and editing software used in production
                  </span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AVAILABLE_TOOLS.map(tool => {
                    const isSelected = (form.tools_used || []).includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        style={{
                          padding: '0.45rem 0.95rem',
                          borderRadius: 12,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          background: isSelected ? 'rgba(59,130,246,0.18)' : 'var(--admin-bg-secondary)',
                          color: isSelected ? '#60a5fa' : 'var(--admin-text-secondary)',
                          border: `1px solid ${isSelected ? 'rgba(59,130,246,0.35)' : 'var(--admin-border)'}`,
                          boxShadow: isSelected ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '} {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN: Control Deck & Live Portfolio Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '6rem' }}>
            
            {/* Control Card 1: Publication Settings */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Publishing Control
              </h4>

              <div>
                <label style={lblStyle}>Status</label>
                <select
                  value={form.status || 'published'}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                  style={inpStyle}
                >
                  <option value="published">🟢 Published (Live on Site)</option>
                  <option value="draft">🟡 Draft (Hidden)</option>
                  <option value="archived">🔴 Archived</option>
                </select>
              </div>

              <div>
                <label style={lblStyle}>Category</label>
                <select
                  value={form.category || 'Tech'}
                  onChange={e => setForm({ ...form, category: e.target.value as ProjectCategory })}
                  style={inpStyle}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={lblStyle}>Format</label>
                  <input
                    type="text"
                    value={form.format || '16:9'}
                    onChange={e => setForm({ ...form, format: e.target.value })}
                    style={inpStyle}
                  />
                </div>

                <div>
                  <label style={lblStyle}>Duration</label>
                  <input
                    type="text"
                    value={form.duration || '0:30'}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    style={inpStyle}
                  />
                </div>
              </div>

              <div>
                <label style={lblStyle}>Display Order Index</label>
                <input
                  type="number"
                  value={form.display_order || 1}
                  onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })}
                  style={inpStyle}
                />
              </div>

              {/* Featured Switch */}
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', paddingTop: 8, borderTop: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Featured Project</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Show in top homepage gallery</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_featured ?? true}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#3b82f6', cursor: 'pointer', marginLeft: 'auto' }}
                />
              </div>
            </div>

            {/* Control Card 2: Real-time Live Portfolio Card Preview */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} /> Live Card Preview
              </div>

              <div style={{ borderRadius: 14, border: '1px solid var(--admin-border-strong)', overflow: 'hidden', background: 'var(--admin-bg-secondary)' }}>
                <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: '#000' }}>
                  {form.thumbnail_url ? (
                    <img src={form.thumbnail_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                      No Thumbnail Image
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.75)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                    {form.category || 'Tech'}
                  </span>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--admin-text-primary)', lineHeight: 1.3 }}>
                    {form.title || 'Untitled Commercial Project'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                    {form.client_spec || 'Client Spec'} • {form.duration || '0:30'} ({form.format || '16:9'})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {(form.tools_used || []).slice(0, 3).map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: 4, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </form>
    </AppLayout>
  );
}
