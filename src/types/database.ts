export type ProjectStatus = 'draft' | 'published' | 'archived';

export interface ShotBreakdownItem {
  shot_number: number;
  framing: string;
  description: string;
  prompt_strategy: string;
  continuity_note?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client_spec?: string;
  description: string;
  thumbnail_url: string;
  hero_video_url: string;
  final_video_url?: string;
  duration?: string;
  format?: string; // '16:9' or '9:16'
  role?: string;
  brief?: string;
  advertising_objective?: string;
  creative_direction?: string;
  story_narrative?: string;
  production_process?: string;
  shot_breakdown?: ShotBreakdownItem[];
  tools_used: string[];
  gallery_urls?: string[];
  is_featured?: boolean;
  status: ProjectStatus;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

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
