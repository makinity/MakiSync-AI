import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// POST /api/admin/settings — upsert site settings
export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin client not configured' }, { status: 500 });
  }

  try {
    const settings = await req.json();

    if (!settings || !settings.showreel) {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('site_settings').upsert({
      key: 'showreel',
      content: settings.showreel,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Admin save settings error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Admin settings POST exception:', e);
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
  }
}
