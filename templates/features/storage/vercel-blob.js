import { put } from '@vercel/blob';

export async function uploadFile(filename, body, contentType) {
  const blob = await put(filename, body, {
    access: 'public',
    contentType,
  });
  return blob.url;
}
