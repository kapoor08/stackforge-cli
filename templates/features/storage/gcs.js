import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export async function uploadFile(filename, content) {
  const bucket = storage.bucket(process.env.GCS_BUCKET);
  const file = bucket.file(filename);

  await file.save(content, {
    metadata: { contentType: 'auto' },
  });

  return `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${filename}`;
}
