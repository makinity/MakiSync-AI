import { Project, SiteSettings } from '@/types/database';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hero: {
    headline: "AI-Powered Video Advertising. Director-Led Creative Execution.",
    subheadline: "Bridging commercial strategy, cinematic AI production, and creative technology to conceptualize and deliver high-converting video ads.",
    primary_cta_text: "Explore Selected Work",
    primary_cta_link: "#selected-work",
    secondary_cta_text: "Watch Showreel",
    secondary_cta_link: "#showreel"
  },
  showreel: {
    title: "2026 AI Creative Showreel",
    duration: "0:30",
    video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
  }
};

export const INITIAL_PROJECTS: Project[] = [];