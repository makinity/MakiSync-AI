import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// POST /api/admin/projects — create or update a project in videos table
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const project = await req.json();

    if (!project || !project.title) {
      return NextResponse.json({ error: 'Invalid project payload' }, { status: 400 });
    }

    const videoPayload: Record<string, any> = {
      title: project.title,
      slug: project.slug || project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: project.description || '',
      video_url: project.video_url || project.hero_video_url || '',
      thumbnail_url: project.thumbnail_url || '',
      format: project.format || '9:16',
      duration: project.duration || '0:30',
      display_order: project.display_order ?? 0,
      status: project.status || 'published',
      updated_at: new Date().toISOString(),
    };

    if (project.id && isUUID(project.id)) {
      videoPayload.id = project.id;
    }
    if (project.category_id && isUUID(project.category_id)) {
      videoPayload.category_id = project.category_id;
    }

    const { error } = await supabaseAdmin.from('videos').upsert(videoPayload);

    if (error) {
      console.error('Admin upsert video error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Secondary sync to legacy projects table for backward compatibility
    try {
      await supabaseAdmin.from('projects').upsert({
        ...videoPayload,
        hero_video_url: videoPayload.video_url,
        final_video_url: videoPayload.video_url,
        client_spec: 'Client Brand',
        brief: videoPayload.description,
        advertising_objective: 'Conversion',
        creative_direction: 'UGC',
        story_narrative: videoPayload.description,
        production_process: 'AI Production',
      });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin projects POST exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
