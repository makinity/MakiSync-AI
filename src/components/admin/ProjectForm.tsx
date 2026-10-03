'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/AppLayout';
import MediaDropzone from '@/components/admin/MediaDropzone';
import { Video, Category } from '@/types/database';
import { saveVideo, getCategories } from '@/lib/supabase';
import { getVideoSource } from '@/lib/videoUtils';

interface ProjectFormProps {
  initialData?: Partial<Video>;
  isNew?: boolean;
}

export default function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<Partial<Video>>({
    id: initialData?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'v_' + Date.now()),
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category_id: initialData?.category_id || '',
    description: initialData?.description || '',
    thumbnail_url: initialData?.thumbnail_url || '',
    video_url: initialData?.video_url || initialData?.hero_video_url || '',
    duration: initialData?.duration || '0:30',
    format: initialData?.format || '9:16',
    status: initialData?.status || 'published',
    display_order: initialData?.display_order || 1,
  });

  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        if (!form.category_id) {
          setForm(f => ({ ...f, category_id: cats[0].id }));
        }
      }
    }
    loadCats();
  }, [form.category_id]);

  const handleTitleChange = (val: string) => {
    const updated: Partial<Video> = { ...form, title: val };
    if (isNew || !form.slug) {
      updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    setForm(updated);
  };

  const handleVideoUrlChange = (url: string) => {
    const source = getVideoSource(url);
    const updated: Partial<Video> = {
      ...form,
      video_url: url,
      hero_video_url: url,
      thumbnail_url: form.thumbnail_url || source.thumbnailUrl || url,
    };
    setForm(updated);
  };

  const handleFormatChange = (fmt: string) => {
    setForm(f => ({ ...f, format: fmt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || (!form.video_url && !form.hero_video_url)) {
      alert('Please fill in the project title and video file URL.');
      return;
    }

    setSaving(true);
    try {
      await saveVideo(form);
      router.push('/admin/projects');
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Failed to save video project.');
    } finally {
      setSaving(false);
    }
  };

  const activeVideoUrl = form.video_url || form.hero_video_url || '';
  const videoSource = getVideoSource(activeVideoUrl);
  const selectedCategory = categories.find(c => c.id === form.category_id);

  const lblStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--admin-text-muted)',
    marginBottom: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 12,
    background: 'var(--admin-bg-secondary)',
    border: '1px solid var(--admin-border)',
    color: 'var(--admin-text-primary)',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
  };

  return (
    <AppLayout title={isNew ? 'New Video Project' : `Edit: ${form.title}`}>
      <div style={{ maxWidth: 1140, margin: '0 auto', paddingBottom: '4rem' }}>
        
        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="bi bi-collection-play-fill" style={{ color: 'var(--admin-accent)' }} />
              <span>Projects Slate</span>
              <i className="bi bi-chevron-right" style={{ fontSize: '0.65rem' }} />
              <span>{isNew ? 'New Video' : 'Edit Project'}</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--admin-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              {isNew ? 'Add New Portfolio Video' : 'Edit Video Project'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '0.65rem 1.3rem',
                borderRadius: 12,
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                color: 'var(--admin-text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 800,
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className={`bi bi-${saving ? 'arrow-repeat spin' : 'check-lg'}`} />
              {saving ? 'Saving Project...' : 'Save Video Project'}
            </button>
          </div>
        </div>

        {/* UNIFIED 2-COLUMN CONTAINER */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border)',
              borderRadius: 20,
              padding: '2rem',
              boxShadow: 'var(--admin-shadow)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
              
              {/* LEFT COLUMN: Form Inputs & File Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Section Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-pencil-square" style={{ fontSize: '1rem' }} />
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Project Configuration
                  </h2>
                </div>

                {/* Title & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={lblStyle}>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CERAVE — THREE-PRODUCT BRAND B-ROLL"
                      value={form.title || ''}
                      onChange={e => handleTitleChange(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={lblStyle}>Category *</label>
                    <select
                      value={form.category_id || ''}
                      onChange={e => setForm({ ...form, category_id: e.target.value })}
                      style={inputStyle}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} — {cat.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={lblStyle}>Description / Creative Concept</label>
                  <textarea
                    rows={3}
                    placeholder="High-converting AI video ad concept engineered for performance..."
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Direct File Upload */}
                <div>
                  <MediaDropzone
                    label="Video File (Direct Supabase Upload) *"
                    value={activeVideoUrl}
                    onChange={handleVideoUrlChange}
                    acceptType="video"
                  />
                </div>

                {/* Aspect Ratio Cards */}
                <div>
                  <label style={lblStyle}>Aspect Ratio Format *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    
                    {/* 9:16 Card */}
                    <div
                      onClick={() => handleFormatChange('9:16')}
                      style={{
                        padding: '0.85rem 1.1rem',
                        borderRadius: 14,
                        background: form.format === '9:16' ? 'rgba(59,130,246,0.12)' : 'var(--admin-bg-secondary)',
                        border: `2px solid ${form.format === '9:16' ? '#3b82f6' : 'var(--admin-border)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ width: 24, height: 36, borderRadius: 5, border: '2px dashed #60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#60a5fa' }}>
                        9:16
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
                          9:16 (Vertical)
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                          Mobile vertical
                        </div>
                      </div>
                    </div>

                    {/* 16:9 Card */}
                    <div
                      onClick={() => handleFormatChange('16:9')}
                      style={{
                        padding: '0.85rem 1.1rem',
                        borderRadius: 14,
                        background: form.format === '16:9' ? 'rgba(168,85,247,0.12)' : 'var(--admin-bg-secondary)',
                        border: `2px solid ${form.format === '16:9' ? '#c084fc' : 'var(--admin-border)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ width: 36, height: 24, borderRadius: 5, border: '2px dashed #c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#c084fc' }}>
                        16:9
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
                          16:9 (Widescreen)
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                          Landscape video
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Display Order, Duration, Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={lblStyle}>Display Order</label>
                    <input
                      type="number"
                      min="0"
                      value={form.display_order ?? 0}
                      onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={lblStyle}>Duration</label>
                    <input
                      type="text"
                      placeholder="0:30"
                      value={form.duration || '0:30'}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={lblStyle}>Status</label>
                    <select
                      value={form.status || 'published'}
                      onChange={e => setForm({ ...form, status: e.target.value as any })}
                      style={inputStyle}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Live Video Studio Preview */}
              <div
                style={{
                  position: 'sticky',
                  top: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  background: 'var(--admin-bg-secondary)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 18,
                  padding: '1.5rem',
                }}
              >
                {/* Studio Preview Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: 'var(--admin-text-primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Live Preview Studio
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: form.format === '9:16' ? 'rgba(59,130,246,0.15)' : 'rgba(168,85,247,0.15)', color: form.format === '9:16' ? '#60a5fa' : '#c084fc', border: `1px solid ${form.format === '9:16' ? 'rgba(59,130,246,0.3)' : 'rgba(168,85,247,0.3)'}` }}>
                    {form.format === '9:16' ? '9:16 Vertical' : '16:9 Widescreen'}
                  </span>
                </div>

                {/* Video Player Display Container */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: 340, padding: '12px 0' }}>
                  {activeVideoUrl ? (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: form.format === '9:16' ? 270 : '100%',
                        aspectRatio: form.format === '9:16' ? '9/16' : '16/9',
                        borderRadius: form.format === '9:16' ? 24 : 14,
                        overflow: 'hidden',
                        background: '#000',
                        boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                        border: form.format === '9:16' ? '5px solid #1f2937' : '1px solid var(--admin-border)',
                        position: 'relative',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {videoSource.isIframe ? (
                        <iframe
                          src={videoSource.embedUrl}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          title="Live Studio Video Preview"
                        />
                      ) : (
                        <video
                          src={videoSource.directUrl || activeVideoUrl}
                          controls
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: form.format === '9:16' ? 'cover' : 'contain' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: form.format === '9:16' ? 240 : '100%',
                        aspectRatio: form.format === '9:16' ? '9/16' : '16/9',
                        borderRadius: form.format === '9:16' ? 24 : 14,
                        border: '2px dashed var(--admin-border)',
                        background: 'rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                        textAlign: 'center',
                        gap: 12,
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bi bi-camera-reels-fill" style={{ fontSize: '1.4rem' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
                          No Video Attached
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>
                          Upload a video file on the left to test live player preview.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info Card Summary */}
                <div style={{ background: 'var(--admin-card)', borderRadius: 12, padding: '1rem', border: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--admin-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {form.title || 'Untitled Video Project'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
                      <i className="bi bi-folder-fill" style={{ marginRight: 4 }} />
                      {selectedCategory?.name || 'Unassigned'}
                    </span>

                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: 'var(--admin-bg-secondary)', color: 'var(--admin-text-secondary)', border: '1px solid var(--admin-border)' }}>
                      <i className="bi bi-clock-fill" style={{ marginRight: 4 }} />
                      {form.duration || '0:30'}
                    </span>

                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: form.status === 'published' ? 'rgba(52,211,153,0.12)' : 'rgba(251,146,60,0.12)', color: form.status === 'published' ? '#34d399' : '#fb923c' }}>
                      <i className={`bi bi-${form.status === 'published' ? 'check-circle-fill' : 'pencil-fill'}`} style={{ marginRight: 4 }} />
                      {form.status ? form.status.toUpperCase() : 'PUBLISHED'}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
