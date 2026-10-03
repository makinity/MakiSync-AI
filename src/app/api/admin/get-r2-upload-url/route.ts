import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUploadUrlR2 } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Missing fileName parameter' }, { status: 400 });
    }

    const fileExt = fileName.split('.').pop() || 'bin';
    const sanitizedFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const fileContentType = contentType || 'application/octet-stream';

    const result = await getPresignedUploadUrlR2(sanitizedFileName, fileContentType);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      uploadUrl: result.uploadUrl,
      publicUrl: result.publicUrl,
    });
  } catch (error: any) {
    console.error('API /api/admin/get-r2-upload-url error:', error);
    return NextResponse.json({ error: error.message || 'Failed to get upload URL' }, { status: 500 });
  }
}
