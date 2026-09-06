'use client';

import { useState, useRef } from 'react';
import { uploadMediaFile } from '@/lib/supabase';

interface MediaDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  acceptType?: 'video' | 'image' | 'any';
  placeholder?: string;
}

// Convert Google Drive share link to direct video stream URL
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';
  
  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFile[1]}`;
  }

  // Pattern 2: https://drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return url;
}

export default function MediaDropzone({
  label,
  value,
  onChange,
  acceptType = 'any',
  placeholder = 'Drag & drop a video/image file here or paste a URL...',
}: MediaDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = convertGoogleDriveUrl(value);
  const isVideo = acceptType === 'video' || (displayUrl && (displayUrl.endsWith('.mp4') || displayUrl.endsWith('.webm') || displayUrl.includes('googleusercontent.com/d/')));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    try {
      const res = await uploadMediaFile(file, 'portfolio-media');
      if (res.url) {
        onChange(res.url);
      }
    } catch (err) {
      console.error('File upload error:', err);
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

  const handleUrlChange = (newUrl: string) => {
    const converted = convertGoogleDriveUrl(newUrl);
    onChange(converted);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Label and Mode Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-text-secondary)' }}>
          {label}
        </label>
        
        <div style={{ display: 'flex', gap: 4, background: 'var(--admin-bg-secondary)', padding: '2px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: '0.68rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'upload' ? 'var(--admin-accent)' : 'transparent',
              color: activeTab === 'upload' ? '#ffffff' : 'var(--admin-text-muted)',
            }}
          >
            📁 File Drop
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              fontSize: '0.68rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'url' ? 'var(--admin-accent)' : 'transparent',
              color: activeTab === 'url' ? '#ffffff' : 'var(--admin-text-muted)',
            }}
          >
            🔗 Paste URL / Drive
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'relative',
            minHeight: 110,
            borderRadius: 12,
            border: `2px dashed ${isDragging ? '#3b82f6' : 'var(--admin-border-strong)'}`,
            background: isDragging ? 'rgba(59,130,246,0.1)' : 'var(--admin-bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--admin-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
              <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '1.2rem', animation: 'spin 1.5s linear infinite' }} />
              Uploading file to Supabase Storage...
            </div>
          ) : value ? (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {/* Media Preview */}
              <div style={{ width: '100%', maxHeight: 120, borderRadius: 8, overflow: 'hidden', background: '#000', display: 'flex', justifyContent: 'center' }}>
                {isVideo ? (
                  <video src={displayUrl} controls style={{ maxHeight: 120, width: '100%', objectFit: 'contain' }} />
                ) : (
                  <img src={displayUrl} alt="Preview" style={{ maxHeight: 120, width: '100%', objectFit: 'cover' }} />
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="bi bi-check-circle-fill" /> File Attached
                </span>
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
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Clear / Replace
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                <i className={`bi bi-${acceptType === 'video' ? 'film' : 'cloud-arrow-up-fill'}`} style={{ fontSize: '1.1rem' }} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                Drag & Drop {acceptType === 'video' ? 'Video' : 'Media'} File Here
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: 2 }}>
                or click to browse from your computer (.mp4, .webm, .mov, .png, .jpg)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <input
            type="text"
            value={value}
            onChange={e => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              background: 'var(--admin-bg-secondary)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text-primary)',
              fontSize: '0.82rem',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ fontSize: '0.68rem', color: 'var(--admin-text-muted)' }}>
            💡 Supports direct MP4/WebM URLs and Google Drive share links (auto-converted to stream format).
          </div>
        </div>
      )}
    </div>
  );
}
