import { supabase } from './supabase';
import { compressImage } from './jobPhotos';

// Providers' "previous work" portfolio, shown to customers on the provider pop-up.
export const MAX_WORK_PHOTOS = 5;
const BUCKET = 'provider-work';

export function workPhotoUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Uploads one photo and appends it to the provider's work_photos. Returns the new list. */
export async function addWorkPhoto(providerId: string, current: string[], file: File): Promise<string[]> {
  const blob = await compressImage(file);
  const path = `${providerId}/${crypto.randomUUID()}.jpg`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
  if (upErr) throw new Error(upErr.message);

  const next = [...current, path];
  const { error } = await supabase.from('profiles').update({ work_photos: next }).eq('id', providerId);
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error.message);
  }
  return next;
}

export async function removeWorkPhoto(providerId: string, current: string[], path: string): Promise<string[]> {
  const next = current.filter((p) => p !== path);
  const { error } = await supabase.from('profiles').update({ work_photos: next }).eq('id', providerId);
  if (error) throw new Error(error.message);
  await supabase.storage.from(BUCKET).remove([path]);
  return next;
}
