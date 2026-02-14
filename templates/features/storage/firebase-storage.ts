import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const app = initializeApp({
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = getStorage(app);

export async function uploadFile(path: string, file: Buffer | Blob) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
