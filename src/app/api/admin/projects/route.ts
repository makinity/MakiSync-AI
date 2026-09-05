import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Helper to check if string is valid UUID
function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// POST /api/admin/projects — create or update a project
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const project = await req.json();

    if (!project || !project.title) {
      return NextResponse.json({ error: 'Invalid project payload' }, { status: 400 });
    }

    const payload = { ...project };

    // If the ID is not a valid UUID (e.g., generated locally), let Supabase auto-assign one
    if (payload.id && !isUUID(payload.id)) {
      delete payload.id;
    }

    const { error } = await supabaseAdmin.from('projects').upsert(payload);

    if (error) {
      console.error('Admin upsert project error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin projects POST exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
