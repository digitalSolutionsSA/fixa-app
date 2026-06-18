import { supabase } from './supabase';

export async function logPanicEvent(data: {
  user_id: string;
  user_name: string;
  location_area: string;
  trusted_contact_name: string;
  trusted_contact_phone: string;
  job_id?: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('panic_events').insert(data);
  return { error: error?.message ?? null };
}
