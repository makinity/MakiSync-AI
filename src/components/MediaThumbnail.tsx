'use client';

import { useState } from 'react';
import { isVideoFileUrl } from '@/lib/videoUtils';

interface MediaThumbnailProps {
  src?: string | null;
  videoFallbackUrl?: string | null;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
}

export default function MediaThumbnail({
  src,
  videoFallbackUrl,
  alt,
  className,
  style,
  draggable = false,
}: MediaThumbnailProps) {
  const [loadError, setLoadError] = useState(false);

  // If the src itself is a video file, or if the image failed to load, fall back to video frame
  const isVideo = isVideoFileUrl(src) || loadError;
  const videoSrc = isVideo ? (isVideoFileUrl(src) ? src : videoFallbackUrl || src) : null;

  if (isVideo && videoSrc) {
    return (
      <video
        src={`${videoSrc}#t=0.5`}
        preload="metadata"
        muted
        playsInline
        className={className}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          ...style,
        }}
      />
    );
  }

  if (!src) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--admin-text-muted)',
          fontSize: '0.8rem',
          ...style,
        }}
      >
        <i className="bi bi-film" style={{ fontSize: '1.4rem', opacity: 0.5 }} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={draggable}
      className={className}
      onError={() => setLoadError(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }}
    />
  );
}

