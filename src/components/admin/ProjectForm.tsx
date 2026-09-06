'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/AppLayout';
import MediaDropzone from '@/components/admin/MediaDropzone';
import { Project } from '@/types/database';
import { saveProject } from '@/lib/supabase';
import { getVideoSource } from '@/lib/videoUtils';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  isNew?: boolean;
}

const POPULAR_TOOLS = [
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
  'Kling AI',
  'Haiper AI',
  'Topaz Video AI',
];

export default function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [customTool, setCustomTool] = useState('');

  const [form, setForm] = useState<Partial<Project>>({
    id: initialData?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'p_' + Date.now()),
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    hero_video_url: initialData?.hero_video_url || '',
    final_video_url: initialData?.final_video_url || initialData?.hero_video_url || '',
    duration: initialData?.duration || '0:30',
    format: initialData?.format || '16:9',
    tools_used: initialData?.tools_used || ['Google Flow', 'Premiere Pro'],
    is_featured: initialData?.is_featured ?? true,
    status: initialData?.status || 'published',
    display_order: initialData?.display_order || 1,
    client_spec: initialData?.client_spec || '',
    role: initialData?.role || '',
    brief: initialData?.brief || '',
    advertising_objective: initialData?.advertising_objective || '',
    creative_direction: initialData?.creative_direction || '',
    story_narrative: initialData?.story_narrative || '',
    production_process: initialData?.production_process || '',
    shot_breakdown: initialData?.shot_breakdown || [],
  });

  const handleTitleChange = (val: string) => {
    const updated: Partial<Project> = { ...form, title: val };
    if (isNew || !form.slug) {
      updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    setForm(updated);
  };

  const handleVideoUrlChange = (url: string) => {
    const source = getVideoSource(url);
    const updated: Partial<Project> = {
      ...form,
      hero_video_url: url,
      final_video_url: url,
    };

    // Auto-derive thumbnail from GDrive or YouTube if no thumbnail is set or if previous was also auto
    if (source.thumbnailUrl && (!form.thumbnail_url || form.thumbnail_url.includes('googleusercontent.com') || form.thumbnail_url.includes('youtube.com'))) {
      updated.thumbnail_url = source.thumbnailUrl;
    }

    setForm(updated);
  };

  const handleExtractThumbnailFromVideo = () => {
    if (!form.hero_video_url) return;
    const source = getVideoSource(form.hero_video_url);
    if (source.thumbnailUrl) {
      setForm({ ...form, thumbnail_url: source.thumbnailUrl });
    }
  };

  const toggleTool = (tool: string) => {
    const current = form.tools_used || [];
    if (current.includes(tool)) {
      setForm({ ...form, tools_used: current.filter(t => t !== tool) });
    } else {
      setForm({ ...form, tools_used: [...current, tool] });
    }
  };

  const handleAddCustomTool = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customTool.trim();
    if (!trimmed) return;
    const current = form.tools_used || [];
    if (!current.includes(trimmed)) {
      setForm({ ...form, tools_used: [...current, trimmed] });
    }
    setCustomTool('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);

    const videoUrl = form.hero_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const videoSource = getVideoSource(videoUrl);
    const autoThumb = videoSource.thumbnailUrl || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80';

    const projectToSave: Project = {
      id: form.id || 'p_' + Date.now(),
      title: form.title || 'Untitled Project',
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client_spec: form.client_spec || 'Commercial Spec',
      description: form.description || '',
      thumbnail_url: form.thumbnail_url || autoThumb,
      hero_video_url: videoUrl,
      final_video_url: form.final_video_url || videoUrl,
      duration: form.duration || '0:30',
      format: form.format || '16:9',
      role: form.role || 'AI Video Creator',
      brief: form.brief || '',
      advertising_objective: form.advertising_objective || '',
      creative_direction: form.creative_direction || '',
      story_narrative: form.story_narrative || '',
      production_process: form.production_process || '',
      shot_breakdown: form.shot_breakdown || [],
      tools_used: form.tools_used && form.tools_used.length > 0 ? form.tools_used : ['Google Flow', 'Premiere Pro'],
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

  const inpStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border)',
    color: 'var(--admin-text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const lblStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--admin-text-secondary)',
    marginBottom: '0.45rem',
  };

  const videoSourceInfo = getVideoSource(form.hero_video_url || '');

  return (
    <AppLayout title={isNew ? 'New Commercial Video' : `Edit — ${form.title || 'Video Project'}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Top Sticky Header */}
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
              <i className="bi bi-arrow-left" /> Back
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--admin-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {isNew ? 'Add Commercial Video' : form.title || 'Untitled Video'}
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
                /{form.slug || 'video-slug'}
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
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle-fill" />
                  {isNew ? 'Publish Video' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual-Column Minimal Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* LEFT MAIN COLUMN: Essential Video Fields Only */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* 1. Title & URL Slug */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <i className="bi bi-type-h1" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Project Title & Name
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Commercial video name and web route
                  </span>
                </div>
              </div>

              <div>
                <label style={lblStyle}>
                  <span>Project Title *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aether Vision Pro — Spatial AI Commercial"
                  value={form.title || ''}
                  onChange={e => handleTitleChange(e.target.value)}
                  style={inpStyle}
                />
              </div>

              <div>
                <label style={lblStyle}>
                  <span>URL Slug</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Auto-generated</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. aether-vision-pro-spatial-ai-commercial"
                  value={form.slug || ''}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  style={{ ...inpStyle, fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}
                />
              </div>
            </div>

            {/* 2. Commercial Video & GDrive Link */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                    <i className="bi bi-play-circle-fill" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                      Commercial Video (Google Drive / Direct MP4)
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                      Paste Google Drive share link, YouTube, or drop an MP4 video file
                    </span>
                  </div>
                </div>
              </div>

              <MediaDropzone
                label="Commercial Video Source"
                acceptType="video"
                value={form.hero_video_url || ''}
                onChange={handleVideoUrlChange}
                placeholder="Paste Google Drive share link, YouTube URL, or MP4 link..."
              />
            </div>

            {/* 3. Thumbnail (Auto from Video with Override) */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                    <i className="bi bi-image" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                      Thumbnail Cover Image
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                      Auto-extracted from your video (Google Drive / YouTube) or upload a custom cover
                    </span>
                  </div>
                </div>

                {videoSourceInfo.thumbnailUrl && (
                  <button
                    type="button"
                    onClick={handleExtractThumbnailFromVideo}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      background: 'rgba(139,92,246,0.15)',
                      border: '1px solid rgba(139,92,246,0.3)',
                      color: '#c084fc',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    ⚡ Re-fetch Auto Thumbnail
                  </button>
                )}
              </div>

              <MediaDropzone
                label="Thumbnail Cover"
                acceptType="image"
                value={form.thumbnail_url || ''}
                onChange={url => setForm({ ...form, thumbnail_url: url })}
                placeholder="Auto-derived from video URL, or paste custom image link..."
              />
            </div>

            {/* 4. Description */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                  <i className="bi bi-card-text" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Description
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Commercial summary and creative highlights
                  </span>
                </div>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Cinematic AI commercial featuring seamless lighting, macro lens choreography, dynamic sound design, and generative visual pacing..."
                  value={form.description || ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...inpStyle, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>
            </div>

            {/* 5. AI Tool Stack & Software */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--admin-border)', paddingBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                  <i className="bi bi-cpu-fill" />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    AI Tools &amp; Software Used
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>
                    Click to select generative AI models, edit software, or type your own
                  </span>
                </div>
              </div>

              {/* Popular Tool Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {POPULAR_TOOLS.map(tool => {
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

              {/* Custom Tool Input */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input
                  type="text"
                  placeholder="Add another tool (e.g. Magnific AI, Udio, Kling)..."
                  value={customTool}
                  onChange={e => setCustomTool(e.target.value)}
                  onKeyDown={handleAddCustomTool}
                  style={{ ...inpStyle, padding: '0.55rem 0.85rem', fontSize: '0.8rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTool}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: 12,
                    background: 'var(--admin-accent)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Add Tool
                </button>
              </div>

              {/* Display all currently selected tools */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 6 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', alignSelf: 'center', marginRight: 4 }}>
                  Selected Tools ({form.tools_used?.length || 0}):
                </span>
                {(form.tools_used || []).map(t => (
                  <span
                    key={t}
                    onClick={() => toggleTool(t)}
                    title="Click to remove"
                    style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: 'rgba(59,130,246,0.15)',
                      color: '#93c5fd',
                      border: '1px solid rgba(59,130,246,0.3)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {t} <i className="bi bi-x" style={{ fontSize: 13 }} />
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN: Publishing Settings & Real-time Live Card Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '6rem' }}>
            
            {/* Publishing Settings */}
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

              {/* Format & Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={lblStyle}>Format</label>
                  <select
                    value={form.format || '16:9'}
                    onChange={e => setForm({ ...form, format: e.target.value })}
                    style={inpStyle}
                  >
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Portrait)</option>
                  </select>
                </div>

                <div>
                  <label style={lblStyle}>Duration</label>
                  <input
                    type="text"
                    placeholder="0:30"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--admin-border)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>Featured Video</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)' }}>Pin in homepage gallery</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_featured ?? true}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#3b82f6', cursor: 'pointer', marginLeft: 'auto' }}
                />
              </div>
            </div>

            {/* Real-time Live Portfolio Card Preview */}
            <div style={{ background: 'var(--admin-card)', border: '1px solid var(--admin-border)', borderRadius: 20, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} /> Live Card Preview
              </div>

              <div style={{ borderRadius: 14, border: '1px solid var(--admin-border-strong)', overflow: 'hidden', background: 'var(--admin-bg-secondary)' }}>
                <div style={{ height: 160, position: 'relative', overflow: 'hidden', background: '#000' }}>
                  {form.thumbnail_url ? (
                    <img src={form.thumbnail_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                      No Thumbnail Image
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: 'rgba(0,0,0,0.75)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                    {form.format || '16:9'}
                  </span>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--admin-text-primary)', lineHeight: 1.3 }}>
                    {form.title || 'Untitled Commercial Video'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                    {form.duration || '0:30'} • {form.format || '16:9'}
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
