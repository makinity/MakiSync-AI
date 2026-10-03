const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function checkVideos() {
  console.log('Querying videos table in Supabase...\n');
  const { data: videos, error } = await supabase.from('videos').select('*').order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching videos:', error);
    return;
  }

  console.log(`Found ${videos.length} videos:\n`);
  videos.forEach((v, idx) => {
    console.log(`[${idx + 1}] Title: ${v.title}`);
    console.log(`     ID: ${v.id}`);
    console.log(`     Video URL: ${v.video_url}`);
    console.log(`     Updated At: ${v.updated_at}\n`);
  });
}

checkVideos();
