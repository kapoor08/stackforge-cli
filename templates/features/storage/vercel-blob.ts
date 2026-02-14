import { put } from '@vercel/blob';

export async function uploadFile(filename: string, body: Buffer | Blob, contentType: string) {
  const blob = await put(filename, body, {
    access: 'public',
    contentType,
  });
  return blob.url;
}
