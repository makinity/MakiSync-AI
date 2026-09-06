import { createClient } from '@supabase/supabase-js';
import { Project, SiteSettings, LeadInquiry, MediaAsset } from '@/types/database';
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
// 1. PROJECTS CRUD
// ==========================================

export async function getPublishedProjects(): Promise<Project[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
        
      if (!error && data && data.length > 0) return data as Project[];
    } catch (e) {
      console.error('Supabase fetch published projects failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) {
      try {
        const parsed: Project[] = JSON.parse(stored);
        return parsed.filter(p => p.status === 'published').sort((a, b) => a.display_order - b.display_order);
      } catch (e) {}
    }
  }
  return INITIAL_PROJECTS.filter(p => p.status === 'published');
}

export async function getAllProjects(): Promise<Project[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (!error && data && data.length > 0) return data as Project[];
    } catch (e) {
      console.error('Supabase fetch all projects failed:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return INITIAL_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find(p => p.slug === slug) || null;
}

export async function saveProject(project: Project): Promise<void> {
  // Always update local storage for instant UI responsiveness
  if (typeof window !== 'undefined') {
    const projects = await getAllProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = { ...project, updated_at: new Date().toISOString() };
    } else {
      projects.push({ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }

  if (supabase) {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('saveProject API error:', data.error || res.statusText);
      }
    } catch (e) {
      console.error('saveProject API exception:', e);
    }
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    const projects = await getAllProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(updated));
  }

  if (supabase) {
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('deleteProject API error:', data.error || res.statusText);
      }
    } catch (e) {
      console.error('deleteProject API exception:', e);
    }
  }
}

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

export async function uploadMediaFile(file: File, bucketName = 'portfolio-media'): Promise<{ url: string; error?: string }> {
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl };
        }
      } else if (error) {
        console.warn('Supabase Storage upload warning:', error.message);
      }
    } catch (err: any) {
      console.warn('Supabase Storage upload exception:', err.message);
    }
  }

  // Fallback to local Object URL for instant browser playback/preview
  if (typeof window !== 'undefined') {
    const objectUrl = URL.createObjectURL(file);
    return { url: objectUrl };
  }

  return { url: '', error: 'Failed to process media file' };
}

