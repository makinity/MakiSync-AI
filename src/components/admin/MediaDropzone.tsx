'use client';

import { useState, useRef } from 'react';
import { uploadMediaFile } from '@/lib/supabase';
import { getVideoSource } from '@/lib/videoUtils';

interface MediaDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  acceptType?: 'video' | 'image' | 'any';
  placeholder?: string;
}

export default function MediaDropzone({
  label,
  value,
  onChange,
  acceptType = 'any',
}: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoSource = getVideoSource(value);
  const isVideo = acceptType === 'video' || videoSource.isIframe || (value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('video')));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setUploadProgress(0);
    setUploadError('');
    try {
      const res = await uploadMediaFile(file, 'portfolio-media', (percent) => {
        setUploadProgress(percent);
      });
      if (res.url) {
        onChange(res.url);
      } else if (res.error) {
        setUploadError(res.error);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setUploadError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Label */}
      <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-text-muted)' }}>
        {label}
      </label>

      {/* Direct Supabase File Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          position: 'relative',
          minHeight: 120,
          borderRadius: 14,
          border: `2px dashed ${isDragging ? '#3b82f6' : 'var(--admin-border)'}`,
          background: isDragging ? 'rgba(59,130,246,0.1)' : 'var(--admin-bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          overflow: 'hidden',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptType === 'video' ? 'video/*' : acceptType === 'image' ? 'image/*' : '*'}
          onChange={e => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ width: '100%', maxWidth: 420, padding: '0 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', color: 'var(--admin-accent)', fontSize: '0.82rem', fontWeight: 800 }}>
              <span><i className="bi bi-cloud-arrow-up-fill" style={{ marginRight: 8 }} /> Uploading to Supabase Storage...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div style={{ width: '100%', height: 8, borderRadius: 99, background: 'rgba(59,130,246,0.15)', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)', transition: 'width 0.2s ease', borderRadius: 99 }} />
            </div>
          </div>
        ) : uploadError ? (
          <div style={{ width: '100%', padding: '10px 14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#f87171', fontSize: '0.78rem', textAlign: 'center' }}>
            <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: 6 }} />
            {uploadError}
          </div>
        ) : value ? (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.25)',
              borderRadius: 12,
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                <i className={`bi bi-${isVideo ? 'file-earmark-play-fill' : 'file-earmark-image-fill'}`} style={{ fontSize: '1.25rem' }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isVideo ? 'Video File Attached' : 'Image File Attached'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <i className="bi bi-check-circle-fill" /> Storage File Active & Ready
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              style={{
                background: 'rgba(239,68,68,0.12)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.3)',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <i className="bi bi-trash3-fill" /> Clear / Replace
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <i className={`bi bi-${acceptType === 'video' ? 'film' : 'cloud-arrow-up-fill'}`} style={{ fontSize: '1.25rem' }} />
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--admin-text-primary)' }}>
              Drag & Drop {acceptType === 'video' ? '80MB+ Video' : 'Image'} File Here
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>
              or click to choose file from your computer (.mp4, .webm, .mov, .jpg, .png)
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <i className="bi bi-shield-check" style={{ color: 'var(--admin-accent)' }} />
        Direct Supabase Storage upload with automatic HTTP 206 video range streaming.
      </div>
    </div>
  );
}
