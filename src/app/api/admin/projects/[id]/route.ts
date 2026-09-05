import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// DELETE /api/admin/projects/[id] — delete a project by id or slug
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

    let query = supabaseAdmin.from('projects').delete();
    if (isUUID(id)) {
      query = query.eq('id', id);
    } else {
      query = query.eq('slug', id);
    }

    const { error } = await query;

    if (error) {
      console.error('Admin delete project error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin projects DELETE exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
