export type VideoStatus = 'draft' | 'published' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export interface Video {
  id: string;
  category_id?: string;
  category?: Category;
  title: string;
  slug: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  format: string; // '9:16' or '16:9'
  duration?: string;
  display_order?: number;
  status: VideoStatus;
  created_at?: string;
  updated_at?: string;

  // Legacy compatibility fields
  hero_video_url?: string;
  final_video_url?: string;
  client_spec?: string;
  tools_used?: string[];
  is_featured?: boolean;
  role?: string;
}

// Alias for backward compatibility
export type Project = Video;
export type ProjectStatus = VideoStatus;

export interface HeroSettings {
  headline: string;
  subheadline: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

export interface ShowreelSettings {
  title: string;
  video_url: string;
  duration?: string;
  poster_url?: string;
  description?: string;
}

export interface SiteSettings {
  hero: HeroSettings;
  showreel: ShowreelSettings;
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: string;
  category: string;
  tags?: string[];
  created_at?: string;
}
