import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'portfolio-media';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

export const r2Client = (accountId && accessKeyId && secretAccessKey)
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

/**
 * Generates a direct Presigned PUT URL for Cloudflare R2.
 * Allows the browser to upload 50MB+ video files directly to Cloudflare R2,
 * bypassing Vercel's 4.5MB serverless body payload limit!
 */
export async function getPresignedUploadUrlR2(
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string; error?: string }> {
  if (!r2Client) {
    return { uploadUrl: '', publicUrl: '', error: 'Cloudflare R2 credentials not configured in environment' };
  }

  try {
    const key = `uploads/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${R2_BUCKET_NAME}.${accountId}.r2.cloudflarestorage.com/${key}`;

    return { uploadUrl, publicUrl };
  } catch (err: any) {
    console.error('getPresignedUploadUrlR2 Error:', err);
    return { uploadUrl: '', publicUrl: '', error: err.message || 'Failed to generate presigned upload URL' };
  }
}

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; error?: string }> {
  if (!r2Client) {
    return { url: '', error: 'Cloudflare R2 credentials not configured in environment' };
  }

  try {
    const key = `uploads/${fileName}`;
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${R2_BUCKET_NAME}.${accountId}.r2.cloudflarestorage.com/${key}`;

    return { url: publicUrl };
  } catch (err: any) {
    console.error('Cloudflare R2 Upload Error:', err);
    return { url: '', error: err.message || 'R2 Upload Failed' };
  }
}

export async function deleteFromR2(fileUrl: string): Promise<boolean> {
  if (!r2Client || !fileUrl) return false;
  try {
    const parts = fileUrl.split('/uploads/');
    if (parts.length > 1) {
      const key = `uploads/${parts[1]}`;
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        })
      );
      return true;
    }
  } catch (err) {
    console.warn('R2 file deletion notice:', err);
  }
  return false;
}
