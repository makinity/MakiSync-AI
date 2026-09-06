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
      isIframe: true,
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
      directUrl: `https://drive.google.com/uc?export=download&id=${gdriveId}`,
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
