import { createClient } from '@supabase/supabase-js';
import { Video, Category, Project, SiteSettings, LeadInquiry, MediaAsset } from '@/types/database';
import { INITIAL_PROJECTS, INITIAL_SITE_SETTINGS } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-new-project-id'))
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const STORAGE_KEY_PROJECTS = 'makisync_portfolio_projects';
const STORAGE_KEY_SETTINGS = 'makisync_portfolio_settings';
const STORAGE_KEY_INQUIRIES = 'makisync_portfolio_inquiries';
const STORAGE_KEY_ASSETS = 'makisync_portfolio_assets';

// Helper to check if string is valid UUID
function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// ==========================================
// 1. CATEGORIES & VIDEOS CRUD
// ==========================================

export async function getCategories() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.error('Fetch categories error:', e);
    }
  }
  return [
    { id: 'c1', name: 'UGC', slug: 'ugc', description: 'User Generated Content & Social Ads' },
    { id: 'c2', name: 'VSL', slug: 'vsl', description: 'Video Sales Letters & Commercial Presentations' },
  ];
}

export async function getPublishedVideos(): Promise<Video[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, category:categories(*)')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
        
      if (!error && data) {
        return data.map(v => ({
          ...v,
          hero_video_url: v.video_url,
          final_video_url: v.video_url,
        })) as Video[];
      }
    } catch (e) {
      console.error('Supabase fetch published videos failed, fallback to projects:', e);
    }

    // Fallback if videos table query fails
    try {
      const { data: legacyData, error: legacyErr } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      if (!legacyErr && legacyData) {
        return legacyData.map(p => ({
          ...p,
          video_url: p.hero_video_url || p.final_video_url,
        })) as Video[];
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) {
      try {
        const parsed: Video[] = JSON.parse(stored);
        return parsed.filter(p => p.status === 'published').sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      } catch (e) {}
    }
  }
  return [];
}

export async function getAllVideos(): Promise<Video[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*, category:categories(*)')
        .order('display_order', { ascending: true });
        
      if (!error && data) {
        return data.map(v => ({
          ...v,
          hero_video_url: v.video_url,
          final_video_url: v.video_url,
        })) as Video[];
      }
    } catch (e) {
      console.error('Supabase fetch all videos failed:', e);
    }

    try {
      const { data: legacyData } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (legacyData) {
        return legacyData.map(p => ({ ...p, video_url: p.hero_video_url || p.final_video_url })) as Video[];
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return [];
}

// Aliases for seamless backward compatibility
export const getPublishedProjects = getPublishedVideos;
export const getAllProjects = getAllVideos;

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const videos = await getAllVideos();
  return videos.find(p => p.slug === slug || p.id === slug) || null;
}
export const getProjectBySlug = getVideoBySlug;

export async function deleteStorageFileFromUrl(url: string, bucketName = 'portfolio-media'): Promise<boolean> {
  if (!url || !supabase) return false;
  try {
    if (url.includes(`/storage/v1/object/public/${bucketName}/`)) {
      const parts = url.split(`/storage/v1/object/public/${bucketName}/`);
      if (parts.length > 1) {
        const filePath = parts[1];
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (!error) {
          console.log(`Successfully deleted storage file: ${filePath}`);
          return true;
        } else {
          console.warn(`Failed to delete storage file ${filePath}:`, error.message);
        }
      }
    }
  } catch (err: any) {
    console.warn('Storage file removal exception:', err);
  }
  return false;
}

export async function saveVideo(video: Partial<Video>): Promise<void> {
  const validId = isUUID(video.id || '') ? video.id : undefined;
  const validCategoryId = isUUID(video.category_id || '') ? video.category_id : undefined;

  const videoPayload: Record<string, any> = {
    title: video.title || 'Untitled Video',
    slug: video.slug || (video.title ? video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'video'),
    description: video.description || '',
    video_url: video.video_url || video.hero_video_url || '',
    thumbnail_url: video.thumbnail_url || '',
    format: video.format || '9:16',
    duration: video.duration || '0:30',
    display_order: video.display_order ?? 0,
    status: video.status || 'published',
    updated_at: new Date().toISOString(),
  };

  if (validId) videoPayload.id = validId;
  if (validCategoryId) videoPayload.category_id = validCategoryId;

  if (typeof window !== 'undefined') {
    const list = await getAllVideos();
    const targetId = validId || video.id;
    const index = list.findIndex(p => p.id === targetId);
    if (index >= 0) {
      list[index] = { ...list[index], ...videoPayload } as Video;
    } else {
      list.push({ ...videoPayload, id: targetId || ('v_' + Date.now()), created_at: new Date().toISOString() } as Video);
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
  }

  if (supabase) {
    try {
      // 1. If updating an existing video with valid UUID, remove orphaned storage file if video URL changed
      if (validId) {
        const { data: existing } = await supabase
          .from('videos')
          .select('video_url, thumbnail_url')
          .eq('id', validId)
          .maybeSingle();

        if (existing) {
          if (existing.video_url && videoPayload.video_url && existing.video_url !== videoPayload.video_url) {
            await deleteStorageFileFromUrl(existing.video_url);
          }
          if (existing.thumbnail_url && videoPayload.thumbnail_url && existing.thumbnail_url !== videoPayload.thumbnail_url) {
            await deleteStorageFileFromUrl(existing.thumbnail_url);
          }
        }
      }

      // 2. Save video record to database
      const { error } = await supabase.from('videos').upsert(videoPayload);
      if (error) {
        console.error('Supabase videos upsert error:', error.message);
        throw new Error(`Database save error: ${error.message}`);
      }
    } catch (e: any) {
      console.error('saveVideo exception:', e);
      throw e;
    }
  }
}
export const saveProject = saveVideo;

export async function deleteVideo(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const list = await getAllVideos();
    const updated = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
  }

  if (supabase) {
    try {
      if (isUUID(id)) {
        // 1. Fetch video record to get attached storage files
        const { data: existing } = await supabase
          .from('videos')
          .select('video_url, thumbnail_url')
          .eq('id', id)
          .maybeSingle();

        if (existing) {
          if (existing.video_url) await deleteStorageFileFromUrl(existing.video_url);
          if (existing.thumbnail_url) await deleteStorageFileFromUrl(existing.thumbnail_url);
        }

        // 2. Delete database rows
        await supabase.from('videos').delete().eq('id', id);
        await supabase.from('projects').delete().eq('id', id);
      } else {
        await supabase.from('videos').delete().eq('slug', id);
        await supabase.from('projects').delete().eq('slug', id);
      }
    } catch (e) {
      console.error('deleteVideo exception:', e);
    }
  }
}
export const deleteProject = deleteVideo;

// ==========================================
// 2. SITE SETTINGS & SHOWREEL CMS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('key', 'showreel')
        .single();

      if (!error && data && data.content) {
        return {
          ...INITIAL_SITE_SETTINGS,
          showreel: data.content,
        };
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return INITIAL_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  if (supabase) {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('saveSiteSettings API error:', data.error || res.statusText);
      }
    } catch (e) {
      console.error('saveSiteSettings API exception:', e);
    }
  }
}

// ==========================================
// 3. INQUIRIES & LEAD BRIEFS
// ==========================================

export async function getInquiries(): Promise<LeadInquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data as LeadInquiry[];
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return [];
}

export async function saveInquiry(inquiry: Partial<LeadInquiry>): Promise<void> {
  const newInquiry: LeadInquiry = {
    id: isUUID(inquiry.id || '') ? inquiry.id! : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-0000-0000-000000000001'),
    name: inquiry.name || 'Anonymous Client',
    email: inquiry.email || 'client@example.com',
    project_type: inquiry.project_type || 'AI Commercial Ad',
    budget_range: inquiry.budget_range || '$5,000 - $10,000',
    timeline: inquiry.timeline || 'Q3/Q4 2026',
    message: inquiry.message || '',
    status: inquiry.status || 'unread',
    created_at: inquiry.created_at || new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const list = await getInquiries();
    list.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  }

  if (supabase) {
    try {
      await supabase.from('inquiries').insert(newInquiry);
    } catch (e) {}
  }
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'archived'): Promise<void> {
  if (typeof window !== 'undefined') {
    const list = await getInquiries();
    const item = list.find(i => i.id === id);
    if (item) item.status = status;
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  }

  if (supabase && isUUID(id)) {
    try {
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('updateInquiryStatus API error:', data.error || res.statusText);
      }
    } catch (e) {
      console.error('updateInquiryStatus API exception:', e);
    }
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const list = await getInquiries();
    const updated = list.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  }

  if (supabase && isUUID(id)) {
    try {
      const res = await fetch(`/api/admin/inquiries/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('deleteInquiry API error:', data.error || res.statusText);
      }
    } catch (e) {
      console.error('deleteInquiry API exception:', e);
    }
  }
}

// ==========================================
// 4. MEDIA ASSETS
// ==========================================

export async function getAssets(): Promise<MediaAsset[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_ASSETS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return [
    {
      id: 'a1',
      name: 'Google Flow Shot Architecture Render #1',
      file_url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
      file_type: 'image/jpeg',
      file_size: '2.4 MB',
      category: 'Thumbnails',
      tags: ['Google Flow', 'Spatial AI', 'Glasses'],
      created_at: new Date().toISOString(),
    },
    {
      id: 'a2',
      name: 'Elixir Noir 4K Master Commercial Cut',
      file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      file_type: 'video/mp4',
      file_size: '48.2 MB',
      category: 'Videos',
      tags: ['Beverage', 'Macro Splash', '4K Master'],
      created_at: new Date().toISOString(),
    }
  ];
}

export async function saveAsset(asset: MediaAsset): Promise<void> {
  if (typeof window !== 'undefined') {
    const list = await getAssets();
    list.unshift(asset);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(list));
  }
}

export async function deleteAsset(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const list = await getAssets();
    const updated = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(updated));
  }
}

// ==========================================
// 5. SUPABASE STORAGE FILE UPLOAD
// ==========================================

export async function uploadMediaFile(
  file: File, 
  bucketName = 'portfolio-media',
  onProgress?: (percent: number) => void
): Promise<{ url: string; error?: string }> {
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-new-project-id')) {
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
            resolve({ url: publicUrl });
          } else if (xhr.status === 413) {
            resolve({ 
              url: '', 
              error: `File size limit (80MB+) exceeded. Please set "Max File Size" limit to 100MB+ under Storage -> Buckets -> ${bucketName} in your Supabase Dashboard.` 
            });
          } else {
            let errText = 'Upload failed';
            try {
              const res = JSON.parse(xhr.responseText);
              errText = res.message || res.error || errText;
            } catch (e) {}
            resolve({ url: '', error: errText });
          }
        };

        xhr.onerror = () => {
          resolve({ url: '', error: 'Network error during media upload' });
        };

        xhr.open('POST', uploadUrl, true);
        xhr.setRequestHeader('Authorization', `Bearer ${supabaseAnonKey}`);
        xhr.setRequestHeader('apikey', supabaseAnonKey);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.send(file);
      });
    } catch (err: any) {
      console.warn('Supabase Storage upload exception:', err.message);
    }
  }

  // Fallback to local Object URL for instant browser preview
  if (typeof window !== 'undefined') {
    if (onProgress) onProgress(100);
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl };
  }

  return { url: '', error: 'Failed to process media file' };
}

