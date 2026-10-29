import { supabase } from './supabase';

export const MAX_JOB_PHOTOS = 3;
const BUCKET = 'job-photos';
const MAX_EDGE = 1600;

// Phone photos are often 5–10 MB; shrink to a JPEG that loads quickly for the provider.
async function compressImage(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read that image.'));
      el.src = url;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process that image.'))), 'image/jpeg', 0.82)
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Uploads one photo into the customer's folder and returns its storage path. */
export async function uploadJobPhoto(consumerId: string, file: File): Promise<string> {
  const blob = await compressImage(file);
  const path = `${consumerId}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw new Error(error.message);
  return path;
}

export async function deleteJobPhotos(paths: string[]): Promise<void> {
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
}

/** Short-lived URLs for displaying a job's photos (the bucket is private). */
export async function getJobPhotoUrls(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
  return (data || []).map((d) => d.signedUrl).filter(Boolean) as string[];
}
