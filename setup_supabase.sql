-- Supabase SQL Schema & Initial Seed Data for AI Video Creator Portfolio (MakiSync)

-- 1. Create Enum Types (if not already existing)
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  client_spec VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  hero_video_url TEXT NOT NULL,
  final_video_url TEXT NOT NULL,
  duration VARCHAR(50) NOT NULL DEFAULT '0:30',
  format VARCHAR(50) NOT NULL DEFAULT '16:9',
  role VARCHAR(255) NOT NULL DEFAULT 'AI Creative Director & Producer',
  brief TEXT NOT NULL,
  advertising_objective TEXT NOT NULL,
  creative_direction TEXT NOT NULL,
  story_narrative TEXT NOT NULL,
  production_process TEXT NOT NULL,
  shot_breakdown JSONB DEFAULT '[]'::jsonb,
  tools_used JSONB DEFAULT '["Google Flow", "Midjourney", "Premiere Pro", "ElevenLabs"]'::jsonb,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  status project_status DEFAULT 'published',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Site Settings Table (For Hero, Showreel, About, & Section CMS Configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(255),
  budget_range VARCHAR(255),
  timeline VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Users Table for Admin & Client Authentication (MakiSync Standard)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 7. Public Read & Management RLS Policies
DROP POLICY IF EXISTS "Public Read Published Projects" ON projects;
DROP POLICY IF EXISTS "Public Manage Projects" ON projects;
CREATE POLICY "Public Manage Projects" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Site Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Manage Site Settings" ON site_settings;
CREATE POLICY "Public Manage Site Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Create Inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public Manage Inquiries" ON inquiries;
CREATE POLICY "Public Manage Inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Users" ON users;
CREATE POLICY "Public Manage Users" ON users FOR ALL USING (true) WITH CHECK (true);

-- 8. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

-- 9. Seed Admin User (Username: MakiSync or admin, Default Password Hash)
INSERT INTO users (username, email, password_hash, role)
VALUES (
  'MakiSync',
  'markjuntillava@gmail.com',
  '$2b$12$mAL8GV/9HDrhIMmosFksce5/ngNvG5H0P53yXOho7/V53DKHKl/ai',
  'admin'
)
ON CONFLICT (username) DO NOTHING;

-- 10. Seed Initial Commercial Projects Slate
INSERT INTO projects (
  title, slug, client_spec, description, thumbnail_url, hero_video_url, final_video_url,
  duration, format, role, brief, advertising_objective, creative_direction, story_narrative,
  production_process, shot_breakdown, tools_used, gallery_urls, is_featured, status, display_order
) VALUES
(
  'Aether Vision Pro — Next-Gen Spatial AI Glasses',
  'aether-vision-pro-spatial-ai-glasses',
  'Aether Tech Labs',
  'Cinematic product launch reveal combining macro lens choreography, liquid metal simulation, volumetric neon raytracing, and high-energy electronic sound design.',
  'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '0:30', '16:9', 'AI Creative Director & Technologist',
  'Establish Aether Vision Pro as the premier spatial computing eyewear brand targeting creative professionals and tech enthusiasts.',
  'Evoke raw awe and premium technological sophistication by showcasing sleek titanium frame curves, liquid optic glass reflections, and seamless hand gesture tracking.',
  'Cyber-minimalist aesthetic, deep navy slate gradient backgrounds with glowing electric cyan optics and anamorphic lens flares.',
  'A dark void ignites as fluid titanium flows and crystallizes into a floating smart glass frame. Holographic UI overlays expand as a user steps into a futuristic studio workspace.',
  'Storyboarding → Prompt choreography in Google Flow for shot continuity → Frame interpolation in Topaz Video AI → Synthesized audio sound design in Adobe Premiere Pro.',
  '[
    {"shot_number": 1, "framing": "Macro Extreme Close-Up", "description": "Liquid titanium forming the sleek titanium hinge with glowing micro-lasers", "prompt_strategy": "Macro 85mm shot, liquid titanium crystallizing into futuristic glasses hinge, anamorphic cyan lens flare, 4k 60fps", "continuity_note": "Lock metallic sheen texture and cyan laser color hex"},
    {"shot_number": 2, "framing": "Orbiting Camera Sweep", "description": "Full 360-degree floating frame reveal in dark minimalist volumetric studio", "prompt_strategy": "Cinematic camera orbit around floating smart glasses, dark slate background, volumetric cyan light beams", "continuity_note": "Ensure frame shape remains consistent"},
    {"shot_number": 3, "framing": "First Person POV", "description": "User gesturing to expand floating spatial desktop windows in air", "prompt_strategy": "First person POV spatial computing interface, glowing translucent windows, sleek UI design", "continuity_note": "Match UI color palette with product accent glow"}
  ]'::jsonb,
  '["Google Flow", "Midjourney v6", "Premiere Pro", "CapCut Pro"]'::jsonb,
  '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 'published', 1
),
(
  'Elixir Noir — Botanical Tonic Commercial',
  'elixir-noir-botanical-tonic',
  'Elixir Beverage Co.',
  'High-speed liquid macro photography, ice crystal splash choreography, glowing botanical ember accents, and ambient acoustic soundscapes.',
  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  '0:30', '16:9', 'AI Commercial Director',
  'Position Elixir Noir as a luxury non-alcoholic botanical tonic for sophisticated evening dining.',
  'Highlight rare botanical ingredients dropping into sparkling amber liquid in ultra-slow motion with dramatic side lighting.',
  'Moody luxury cocktail lounge mood, warm ember lighting, deep onyx backdrop with sparkling gold light refractions.',
  'Botanical leaves & berries drop into crystal clear water, triggering a vortex of glowing amber essence that fills a matte black glass bottle.',
  'High-speed prompt generation for liquid physics in SOTA models, seed locking for bottle branding continuity, and custom color grading.',
  '[
    {"shot_number": 1, "framing": "Phantom High-Speed Macro", "description": "Botanical berry dropping into sparkling amber liquid creating dynamic crown splash", "prompt_strategy": "Phantom 1000fps macro shot, botanical berry splash into amber liquid, golden lighting splash crown", "continuity_note": "Berry texture & liquid transparency match"},
    {"shot_number": 2, "framing": "Low Angle Bottle Hero", "description": "Matte black bottle rising through mist with glowing gold label embossing", "prompt_strategy": "Low angle dramatic shot, matte black bottle rising from low fog, gold foil logo catching rim light", "continuity_note": "Lock logo typography & bottle silhouette"},
    {"shot_number": 3, "framing": "Pouring Close-Up", "description": "Chilled tonic pouring into heavy crystal glass with floating ice and rosemary garnish", "prompt_strategy": "Pouring sparkling beverage into crystal glass, effervescent bubbles, rosemary garnish, soft evening lighting", "continuity_note": "Glassware crystal texture consistency"}
  ]'::jsonb,
  '["Google Flow", "Runway Gen-3", "Premiere Pro", "Audition"]'::jsonb,
  '["https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 'published', 2
),
(
  'Aura Atelier — Cyber-Silk Fashion Runway',
  'aura-atelier-cyber-silk-runway',
  'Aura Atelier Paris',
  'High-fashion editorial runway, iridescent fabric physics, brutalist architectural lighting, and avant-garde ambient music.',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  '0:30', '16:9', 'AI Fashion Director & Stylist',
  'Position Aura Atelier as an avant-garde digital luxury house combining high fashion with tech-infused smart textiles.',
  'Demonstrate consistency of garment texture, model identity, and editorial rhythm across cinematic runway and outdoor architectural environments.',
  'High-fashion editorial lighting, minimal brutalist architectural backdrops, shimmering iridescent textiles with dark cyan accents.',
  'A narrative walk through a minimalist concrete sanctuary as iridescent garments react to movement and ambient light in slow motion.',
  'Character reference embedding and garment seed locking in AI generation pipelines, paired with ambient fashion soundtrack and precise edit cuts.',
  '[
    {"shot_number": 1, "framing": "Full Length Runway Walk", "description": "Model gliding through brutalist concrete hallway wearing flowing cyber-silk cape", "prompt_strategy": "Editorial runway camera tracking, flowing iridescent fabric physics, 4k 60fps", "continuity_note": "Lock model facial structure & outfit texture"},
    {"shot_number": 2, "framing": "Medium Portrait Turn", "description": "Model turns to camera as sunlight catches fiber-optic embroidery", "prompt_strategy": "Vogue editorial portrait, fiber-optic light pulse, rim lighting", "continuity_note": "Match facial features from Shot 1"},
    {"shot_number": 3, "framing": "Close-Up Fabric Macro", "description": "Fingertips trailing across iridescent textile weave", "prompt_strategy": "Macro textile close-up, iridescent light refraction, slow movement", "continuity_note": "Weave texture continuity"}
  ]'::jsonb,
  '["Google Flow", "Midjourney v6", "Premiere Pro", "CapCut Pro"]'::jsonb,
  '["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 'published', 3
),
(
  'Veloce Horizon — Electric Supercar Concept',
  'veloce-horizon-electric-supercar',
  'Veloce Motors',
  'Dynamic vehicle tracking, high-speed camera choreography, atmospheric weather transitions, and cinematic storytelling.',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  '0:45', '16:9', 'AI Director & Camera Choreographer',
  'Create launch enthusiasm for an upcoming next-gen electric supercar, emphasizing sleek aerodynamics and instantaneous acceleration.',
  'Convey raw speed and precise handling using dynamic low tracking shots, anamorphic lens flares, coastal highway environments, and roaring synthetic motor sound design.',
  'Cinematic anamorphic widescreen aesthetic, twilight golden hour lighting shifting into neon-lit coastal highway night scenes.',
  'The vehicle emerges from a mountain tunnel at sunrise, carving along coastal curves as daylight transitions to neon twilight, finishing with a silhouette headlights reveal.',
  'Multi-environment prompt mapping with vehicle asset consistency, speed ramps, synthesized electric motor sound design, and custom color pass.',
  '[
    {"shot_number": 1, "framing": "Low Russian-Arm Tracking Shot", "description": "Supercar accelerating out of mountain tunnel into golden hour sunburst", "prompt_strategy": "Low angle car tracking shot, 35mm anamorphic lens flare, high speed road motion", "continuity_note": "Vehicle paint: Midnight Blue metallic"},
    {"shot_number": 2, "framing": "Aerial Drone Chase", "description": "Overhead tracking as supercar hugs coastal cliff turns", "prompt_strategy": "FPV drone cinematic chase shot, coastal cliff road, sunset reflections on car hood", "continuity_note": "Keep vehicle body proportions identical"},
    {"shot_number": 3, "framing": "Headlight Silhouette Lockup", "description": "Aggressive front LED light signature igniting in dark studio glow", "prompt_strategy": "Front grille close-up, sharp LED light strip ignition, dark background with cyan glow", "continuity_note": "Final badge reveal"}
  ]'::jsonb,
  '["Google Flow", "Runway Gen-3", "Adobe Premiere Pro", "Audition"]'::jsonb,
  '["https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 'published', 4
),
(
  'Lumina Skin — Radiance Serum (Direct Response)',
  'lumina-skin-radiance-serum',
  'Lumina Beauty',
  'Short-form vertical video ad optimized for TikTok & IG Reels with a 3-second visual hook, fast pacing, kinetic text overlays, and high-converting CTA.',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  '0:15', '9:16', 'AI Video Ad Strategist & Editor',
  'Drive direct e-commerce sales for a radiance face serum on TikTok and Instagram Reels targeting skincare conscious Gen-Z/Millennials.',
  'Capitalize on social media user attention spans through a compelling 3-second macro skin transformation visual hook, fast-cut social pacing, kinetic text callouts, and clear CTA.',
  'Clean aesthetic skincare glow, bright soft-box lighting, vertical 9:16 framing, mobile-first typography and high-energy voiceover.',
  'Hook (0-3s): Macro droplet landing on skin creating an instant radiant glow aura. Body (3-12s): 3 key benefits with text popups. CTA (12-15s): Special discount & Shop Now button callout.',
  'Targeted short-form prompt engineering, 9:16 aspect ratio optimization, animated text motion overlay integration, and high-energy voice synthesis.',
  '[
    {"shot_number": 1, "framing": "9:16 Macro Hook (0-3s)", "description": "Golden serum droplet contacting skin with radiating glow wave overlay", "prompt_strategy": "9:16 vertical macro shot, liquid drop touching flawless glowing skin, high speed soft lighting", "continuity_note": "Immediate visual hook engagement"},
    {"shot_number": 2, "framing": "Split Screen Benefit (3-9s)", "description": "Dull vs Radiant transformation with kinetic text 72H Hydration", "prompt_strategy": "Vertical split portrait glow comparison, soft beauty lighting", "continuity_note": "Text overlay placement top 30%"},
    {"shot_number": 3, "framing": "Product & CTA (9-15s)", "description": "Dropper bottle hero shot with pulsing Get 20% Off Today CTA badge", "prompt_strategy": "Beauty product hero display, pastel background, sleek lighting", "continuity_note": "Clear button overlay at bottom third"}
  ]'::jsonb,
  '["Google Flow", "CapCut Pro", "Midjourney v6", "ElevenLabs"]'::jsonb,
  '["https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=800&q=80"]'::jsonb,
  true, 'published', 5
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_spec = EXCLUDED.client_spec,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  hero_video_url = EXCLUDED.hero_video_url,
  final_video_url = EXCLUDED.final_video_url,
  duration = EXCLUDED.duration,
  format = EXCLUDED.format,
  role = EXCLUDED.role,
  brief = EXCLUDED.brief,
  advertising_objective = EXCLUDED.advertising_objective,
  creative_direction = EXCLUDED.creative_direction,
  story_narrative = EXCLUDED.story_narrative,
  production_process = EXCLUDED.production_process,
  shot_breakdown = EXCLUDED.shot_breakdown,
  tools_used = EXCLUDED.tools_used,
  gallery_urls = EXCLUDED.gallery_urls,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order;

-- 11. Seed Site Settings
INSERT INTO site_settings (key, content) VALUES
(
  'showreel',
  '{
    "title": "2026 Director Cut Showreel",
    "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "description": "Showcasing commercial AI video ads directed and rendered using Google Flow Pro and SOTA generative pipelines."
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();
