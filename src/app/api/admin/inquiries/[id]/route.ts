import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// PATCH /api/admin/inquiries/[id] — update inquiry status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Admin update inquiry status error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin inquiries PATCH exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}

// DELETE /api/admin/inquiries/[id] — delete an inquiry
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
      return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Admin delete inquiry error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin inquiries DELETE exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
