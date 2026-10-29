import { supabase } from './supabase';

export type CustomerSummary = {
  full_name: string | null;
  area: string | null;
  avatar_url: string | null;
  member_since: string | null;
  phone: string | null;          // only shared once the provider has accepted a job
  completed_jobs: number;
  rating: number | null;
  rating_count: number;
  recent_reviews: { rating: number; comment: string | null; created_at: string }[];
};

// Below this average a customer is flagged to providers.
export const LOW_CUSTOMER_RATING = 3;

/** Customer details for a provider who has a job with them (null if not allowed / not found). */
export async function getCustomerSummary(consumerId: string): Promise<CustomerSummary | null> {
  const { data, error } = await supabase.rpc('get_customer_summary', { p_consumer_id: consumerId });
  if (error || !data) return null;
  return data as CustomerSummary;
}

export async function getMyCustomerReview(jobId: string): Promise<{ rating: number; comment: string | null } | null> {
  const { data } = await supabase
    .from('customer_reviews')
    .select('rating, comment')
    .eq('job_id', jobId)
    .maybeSingle();
  return data ?? null;
}

export async function submitCustomerReview(data: {
  job_id: string;
  provider_id: string;
  consumer_id: string;
  rating: number;
  comment: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('customer_reviews').insert({
    ...data,
    comment: data.comment.trim() || null,
  });
  return { error: error?.message ?? null };
}
