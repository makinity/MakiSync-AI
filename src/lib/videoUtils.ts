/**
 * Video & Media URL Helper Utility
 * Handles Google Drive, YouTube, Vimeo, and direct video formats seamlessly.
 */

export interface VideoSourceInfo {
  type: 'gdrive' | 'youtube' | 'vimeo' | 'direct';
  isIframe: boolean;
  embedUrl: string;
  directUrl?: string;
  thumbnailUrl?: string;
}

/**
 * Extract Google Drive file ID from any URL format
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;

  // Format 1: /file/d/FILE_ID
  const matchFile = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) return matchFile[1];

  // Format 2: ?id=FILE_ID or &id=FILE_ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // Format 3: googleusercontent.com/d/FILE_ID
  const matchGuc = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (matchGuc && matchGuc[1]) return matchGuc[1];

  return null;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match && match[1] ? match[1] : null;
}

/**
 * Extract Vimeo video ID
 */
export function extractVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Parses any video URL and determines how to render it (iframe embed or native <video>)
 */
export function getVideoSource(url: string): VideoSourceInfo {
  if (!url) {
    return { type: 'direct', isIframe: false, embedUrl: '' };
  }

  const trimmed = url.trim();

  // 1. Google Drive
  const gdriveId = extractGoogleDriveId(trimmed);
  if (gdriveId) {
    return {
      type: 'gdrive',
      isIframe: false,
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
      directUrl: `https://drive.usercontent.google.com/download?id=${gdriveId}&export=download`,
      thumbnailUrl: `https://lh3.googleusercontent.com/d/${gdriveId}`,
    };
  }

  // 2. YouTube
  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    return {
      type: 'youtube',
      isIframe: true,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  // 3. Vimeo
  const vimeoId = extractVimeoId(trimmed);
  if (vimeoId) {
    return {
      type: 'vimeo',
      isIframe: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
    };
  }

  // 4. Direct video link (e.g. Supabase Storage, CDN, S3, .mp4, .webm)
  return {
    type: 'direct',
    isIframe: false,
    embedUrl: trimmed,
    directUrl: trimmed,
  };
}

/**
 * Converts Google Drive URL for images vs videos
 */
export function formatMediaUrlForStorage(url: string, mediaType: 'image' | 'video' | 'any' = 'any'): string {
  if (!url) return '';
  const gdriveId = extractGoogleDriveId(url);
  if (gdriveId) {
    if (mediaType === 'image') {
      return `https://lh3.googleusercontent.com/d/${gdriveId}`;
    }
    return `https://drive.google.com/file/d/${gdriveId}/preview`;
  }
  return url;
}

/**
 * Checks if a given URL is a direct video file (.mp4, .mov, .webm, etc.)
 */
export function isVideoFileUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].split('#')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogv') ||
    clean.includes('/video/') ||
    clean.endsWith('.m3u8')
  );
}

/**
 * Captures a representative frame from a video File (or URL) as an image File.
 * Runs in the browser using HTML5 Canvas.
 */
export async function captureVideoThumbnail(
  source: File | string,
  timeInSeconds: number = 1.0
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Canvas capture is only supported in browser environment'));
    }

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    let objectUrl = '';
    if (typeof source === 'string') {
      video.src = source;
    } else {
      objectUrl = URL.createObjectURL(source);
      video.src = objectUrl;
    }

    let cleaned = false;
    const cleanUp = () => {
      if (cleaned) return;
      cleaned = true;
      if (objectUrl) {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch (_) {}
      }
      video.removeAttribute('src');
      video.load();
    };

    const timeout = setTimeout(() => {
      cleanUp();
      reject(new Error('Video thumbnail capture timed out after 12 seconds'));
    }, 12000);

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      try {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanUp();
          clearTimeout(timeout);
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            cleanUp();
            clearTimeout(timeout);
            if (blob) {
              const file = new File([blob], `thumb_${Date.now()}.jpg`, {
                type: 'image/jpeg',
              });
              resolve(file);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/jpeg',
          0.88
        );
      } catch (err) {
        cleanUp();
        clearTimeout(timeout);
        reject(err);
      }
    };

    video.addEventListener('loadedmetadata', () => {
      const dur = video.duration || 1;
      const target = dur > timeInSeconds ? timeInSeconds : dur / 2;
      video.currentTime = target > 0 ? target : 0.1;
    });

    video.addEventListener('seeked', onSeeked);

    video.addEventListener('error', () => {
      cleanUp();
      clearTimeout(timeout);
      reject(new Error('Video element failed to load for frame capture'));
    });
  });
}

/**
 * Captures the current visible frame from a mounted <video> element.
 */
export async function captureFrameFromVideoElement(video: HTMLVideoElement): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const width = video.videoWidth || video.clientWidth || 1280;
      const height = video.videoHeight || video.clientHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to get 2D canvas context'));
      }

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `thumb_${Date.now()}.jpg`, {
              type: 'image/jpeg',
            });
            resolve(file);
          } else {
            reject(new Error('Canvas toBlob conversion failed'));
          }
        },
        'image/jpeg',
        0.88
      );
    } catch (err) {
      reject(err);
    }
  });
}
