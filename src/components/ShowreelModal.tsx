'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideoSource } from '@/lib/videoUtils';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  format?: string;
}

export default function ShowreelModal({ isOpen, onClose, videoUrl, title, format }: ShowreelModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('0:00');
  const [durationStr, setDurationStr] = useState('0:00');

  const videoSource = getVideoSource(videoUrl);
  const isVertical = format === '9:16';

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTimeStr(formatTime(cur));
    setDurationStr(formatTime(dur));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const [iframeFallback, setIframeFallback] = useState(false);
  const isIframe = videoSource.isIframe || iframeFallback;

  // Reset fallback state when videoUrl changes
  useEffect(() => {
    setIframeFallback(false);
  }, [videoUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.5rem, 3vw, 1.5rem)',
            overflowY: 'auto',
          }}
        >
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--hero-overlay, rgba(10, 15, 26, 0.88))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          />

          {/* Cinema Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: isVertical ? 'min(360px, 86vw)' : 'min(960px, 96vw)',
              maxWidth: '100%',
              maxHeight: '94vh',
              background: 'var(--admin-card)',
              border: '1px solid var(--admin-border-strong)',
              borderRadius: 'clamp(12px, 3vw, 24px)',
              boxShadow: 'var(--admin-shadow), 0 0 40px rgba(59,130,246,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10,
              margin: 'auto',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--admin-bg-secondary)',
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid var(--admin-border-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--admin-accent)',
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-film" style={{ fontSize: '0.9rem' }} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 'clamp(0.8rem, 2.4vw, 0.95rem)',
                        fontWeight: 800,
                        color: 'var(--admin-text-primary)',
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                      }}
                    >
                      {title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 99,
                        background: 'rgba(59,130,246,0.15)',
                        color: 'var(--admin-accent)',
                        border: '1px solid var(--admin-border-strong)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {format ? `${format} Master Cut` : '4K Master Cut'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--admin-bg-primary)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--admin-bg-primary)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-muted)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-border)';
                }}
                title="Close (Esc)"
              >
                <i className="bi bi-x-lg" style={{ fontSize: '0.85rem' }} />
              </button>
            </div>

            {/* Video Player Container */}
            <div
              className="group"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: isVertical ? '9 / 16' : '16 / 9',
                maxHeight: isVertical ? '72vh' : '65vh',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {isIframe ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <iframe
                    src={videoSource.embedUrl}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    title="Director Cut Showreel"
                  />
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={videoSource.directUrl || videoUrl}
                    autoPlay
                    preload="metadata"
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    onError={() => setIframeFallback(true)}
                    onClick={togglePlay}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      cursor: 'pointer',
                    }}
                  />

                  {/* Large Center Play/Pause Overlay Button */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.45)',
                        backdropFilter: 'blur(4px)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 0 30px rgba(59,130,246,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <i className="bi bi-play-fill" style={{ fontSize: '1.8rem', marginLeft: 3 }} />
                      </div>
                    </button>
                  )}

                  {/* Custom Bottom Control Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '10px 14px 8px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      opacity: 1,
                      transition: 'opacity 0.2s ease',
                    }}
                  >
                    {/* Timeline Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress || 0}
                      onChange={handleSeek}
                      style={{
                        width: '100%',
                        height: 4,
                        accentColor: '#3b82f6',
                        cursor: 'pointer',
                      }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f8fafc', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          onClick={togglePlay}
                          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                        >
                          <i className={`bi bi-${isPlaying ? 'pause-fill' : 'play-fill'}`} style={{ fontSize: '1.1rem' }} />
                        </button>

                        <button
                          onClick={toggleMute}
                          style={{ background: 'none', border: 'none', color: isMuted ? '#ef4444' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                        >
                          <i className={`bi bi-${isMuted ? 'volume-mute-fill' : 'volume-up-fill'}`} style={{ fontSize: '1rem' }} />
                        </button>

                        <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#94a3b8' }}>
                          {currentTimeStr} / {durationStr}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button
                          onClick={toggleFullscreen}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                          title="Fullscreen"
                        >
                          <i className="bi bi-arrows-fullscreen" style={{ fontSize: '0.85rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--admin-bg-secondary)',
                borderTop: '1px solid var(--admin-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                flexWrap: 'wrap',
                fontSize: '0.72rem',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--admin-text-primary)', fontWeight: 600, minWidth: 0, flexWrap: 'wrap' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>AI Creative Direction: Mark Vencent Juntilla</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ padding: '2px 7px', borderRadius: 6, background: 'var(--admin-card)', color: 'var(--admin-accent)', fontSize: '0.65rem', fontWeight: 700, border: '1px solid var(--admin-border)', whiteSpace: 'nowrap' }}>
                  Google Flow AI
                </span>
                <span style={{ padding: '2px 7px', borderRadius: 6, background: 'var(--admin-card)', color: 'var(--admin-text-muted)', fontSize: '0.65rem', fontWeight: 600, border: '1px solid var(--admin-border)', whiteSpace: 'nowrap' }}>
                  Premiere Pro
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
