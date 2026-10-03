import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// DELETE /api/admin/projects/[id] — delete a project from videos and projects tables
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Missing project id' }, { status: 400 });
    }

    if (isUUID(id)) {
      // 1. Fetch record to remove storage file if hosted on Supabase
      const { data: existing } = await supabaseAdmin
        .from('videos')
        .select('video_url, thumbnail_url')
        .eq('id', id)
        .single();

      if (existing) {
        const bucketName = 'portfolio-media';
        if (existing.video_url?.includes(`/storage/v1/object/public/${bucketName}/`)) {
          const filePath = existing.video_url.split(`/storage/v1/object/public/${bucketName}/`)[1];
          if (filePath) await supabaseAdmin.storage.from(bucketName).remove([filePath]);
        }
        if (existing.thumbnail_url?.includes(`/storage/v1/object/public/${bucketName}/`)) {
          const filePath = existing.thumbnail_url.split(`/storage/v1/object/public/${bucketName}/`)[1];
          if (filePath) await supabaseAdmin.storage.from(bucketName).remove([filePath]);
        }
      }

      // 2. Delete database rows
      await supabaseAdmin.from('videos').delete().eq('id', id);
      await supabaseAdmin.from('projects').delete().eq('id', id);
    } else {
      await supabaseAdmin.from('videos').delete().eq('slug', id);
      await supabaseAdmin.from('projects').delete().eq('slug', id);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin projects DELETE exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
