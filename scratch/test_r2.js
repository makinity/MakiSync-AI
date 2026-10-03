const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envText = fs.readFileSync(envPath, 'utf8');
const env = {};
envText.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

console.log('Testing R2 credentials:');
console.log('Account ID:', env['R2_ACCOUNT_ID']);
console.log('Bucket Name:', env['R2_BUCKET_NAME']);
console.log('Public URL:', env['NEXT_PUBLIC_R2_PUBLIC_URL']);

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env['R2_ACCESS_KEY_ID'],
    secretAccessKey: env['R2_SECRET_ACCESS_KEY'],
  },
});

async function runTest() {
  try {
    // 1. List objects
    console.log('\nListing objects in R2 bucket...');
    const listRes = await r2.send(new ListObjectsV2Command({ Bucket: env['R2_BUCKET_NAME'] }));
    console.log('Found objects:', listRes.Contents ? listRes.Contents.length : 0);
    if (listRes.Contents) {
      listRes.Contents.forEach(obj => {
        console.log(` - Key: ${obj.Key} (Size: ${obj.Size} bytes)`);
      });
    }

    // 2. Upload test file
    console.log('\nUploading test file to R2...');
    const testKey = `uploads/test_${Date.now()}.txt`;
    await r2.send(new PutObjectCommand({
      Bucket: env['R2_BUCKET_NAME'],
      Key: testKey,
      Body: Buffer.from('Hello Cloudflare R2! Test upload succeeded.'),
      ContentType: 'text/plain',
    }));

    const testUrl = `${env['NEXT_PUBLIC_R2_PUBLIC_URL'].replace(/\/$/, '')}/${testKey}`;
    console.log('✓ TEST UPLOAD SUCCESSFUL!');
    console.log('Public URL:', testUrl);
  } catch (err) {
    console.error('❌ R2 TEST ERROR:', err);
  }
}

runTest();
