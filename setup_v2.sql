-- ========================================================
-- Supabase Migration V2: All-in-One Database & Storage Setup
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Categories (UGC & VSL)
INSERT INTO categories (name, slug, description) VALUES
  ('UGC', 'ugc', 'User Generated Content & High-Converting AI Social Ads (9:16 Format)'),
  ('VSL', 'vsl', 'Video Sales Letters & High-Impact Commercial Presentations (16:9 Format)')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  format VARCHAR(20) DEFAULT '9:16',
  duration VARCHAR(50) DEFAULT '0:30',
  display_order INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add duration column if table already existed without it
ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration VARCHAR(50) DEFAULT '0:30';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 3. Create Users Table for Admin Access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Admin User (Default Username: MakiSync or admin)
INSERT INTO users (username, email, password_hash, role)
VALUES (
  'MakiSync',
  'markjuntillava@gmail.com',
  '$2b$12$mAL8GV/9HDrhIMmosFksce5/ngNvG5H0P53yXOho7/V53DKHKl/ai',
  'admin'
)
ON CONFLICT (username) DO NOTHING;

-- 4. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Showreel Settings
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

-- 5. Create Inquiries Table
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

-- 6. Enable Row Level Security (RLS) & Set Permissive Admin Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Manage Categories" ON categories;
CREATE POLICY "Public Manage Categories" ON categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Videos" ON videos;
CREATE POLICY "Public Manage Videos" ON videos FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Users" ON users;
CREATE POLICY "Public Manage Users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Site Settings" ON site_settings;
CREATE POLICY "Public Manage Site Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Manage Inquiries" ON inquiries;
CREATE POLICY "Public Manage Inquiries" ON inquiries FOR ALL USING (true) WITH CHECK (true);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_display_order ON videos(display_order);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);

-- 8. Safe Data Migration from Legacy Projects Table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
    INSERT INTO videos (id, title, slug, description, video_url, thumbnail_url, format, duration, display_order, status, created_at)
    SELECT 
      id,
      title, 
      slug,
      description, 
      hero_video_url, 
      thumbnail_url, 
      COALESCE(format, '9:16'),
      COALESCE(duration, '0:30'),
      COALESCE(display_order, 0), 
      COALESCE(status::text, 'published'), 
      created_at
    FROM projects
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- 9. Map Videos to UGC (9:16) vs VSL (16:9) Categories
UPDATE videos 
SET category_id = (SELECT id FROM categories WHERE slug = 'ugc') 
WHERE format = '9:16' OR format IS NULL;

UPDATE videos 
SET category_id = (SELECT id FROM categories WHERE slug = 'vsl') 
WHERE format = '16:9';

-- 10. Supabase Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-media', 'portfolio-media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Upload, Update & Delete RLS Policies
DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
CREATE POLICY "Public Storage Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public Storage Delete" ON storage.objects;
CREATE POLICY "Public Storage Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-media');
