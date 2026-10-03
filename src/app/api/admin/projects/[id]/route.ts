import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { deleteFromR2 } from '@/lib/r2';

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
      // 1. Fetch record to remove storage file from R2 or Supabase
      const { data: existing } = await supabaseAdmin
        .from('videos')
        .select('video_url, thumbnail_url')
        .eq('id', id)
        .single();

      if (existing) {
        if (existing.video_url) {
          if (existing.video_url.includes('.r2.dev') || existing.video_url.includes('/uploads/')) {
            await deleteFromR2(existing.video_url);
          } else if (existing.video_url.includes('/storage/v1/object/public/portfolio-media/')) {
            const filePath = existing.video_url.split('/storage/v1/object/public/portfolio-media/')[1];
            if (filePath) await supabaseAdmin.storage.from('portfolio-media').remove([filePath]);
          }
        }

        if (existing.thumbnail_url) {
          if (existing.thumbnail_url.includes('.r2.dev') || existing.thumbnail_url.includes('/uploads/')) {
            await deleteFromR2(existing.thumbnail_url);
          } else if (existing.thumbnail_url.includes('/storage/v1/object/public/portfolio-media/')) {
            const filePath = existing.thumbnail_url.split('/storage/v1/object/public/portfolio-media/')[1];
            if (filePath) await supabaseAdmin.storage.from('portfolio-media').remove([filePath]);
          }
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
