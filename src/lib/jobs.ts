import { supabase } from './supabase';

export type DbJob = {
  id: string;
  consumer_id: string;
  provider_id: string;
  consumer_name: string;
  provider_name: string;
  provider_trade: string;
  title: string;
  description: string;
  location: string;
  price: number;
  status: 'pending' | 'active' | 'completed' | 'declined' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export async function createJob(data: {
  consumer_id: string;
  provider_id: string;
  consumer_name: string;
  provider_name: string;
  provider_trade: string;
  title: string;
  description: string;
  location: string;
  price: number;
}): Promise<{ data: DbJob | null; error: string | null }> {
  const { data: job, error } = await supabase
    .from('jobs')
    .insert(data)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: job as DbJob, error: null };
}

export async function getConsumerJobs(consumerId: string): Promise<DbJob[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as DbJob[];
}

export async function getProviderJobs(providerId: string): Promise<DbJob[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as DbJob[];
}

export async function updateJobStatus(
  jobId: string,
  status: DbJob['status']
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('jobs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', jobId);

  return { error: error?.message ?? null };
}

export async function submitReview(data: {
  job_id: string;
  consumer_id: string;
  provider_id: string;
  rating: number;
  comment: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('reviews').insert(data);
  return { error: error?.message ?? null };
}

export async function hasReview(jobId: string): Promise<boolean> {
  const { data } = await supabase
    .from('reviews')
    .select('id')
    .eq('job_id', jobId)
    .maybeSingle();
  return !!data;
}

export async function getProviderStats(providerId: string): Promise<{
  newJobs: number;
  weeklyEarnings: number;
  rating: number;
}> {
  const weekStart = getWeekStart();

  const [pendingRes, earningsRes, profileRes] = await Promise.all([
    supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .eq('status', 'pending'),
    supabase
      .from('jobs')
      .select('price')
      .eq('provider_id', providerId)
      .eq('status', 'completed')
      .gte('updated_at', weekStart),
    supabase
      .from('profiles')
      .select('rating')
      .eq('id', providerId)
      .maybeSingle(),
  ]);

  const weeklyEarnings = ((earningsRes.data as any[]) || []).reduce(
    (sum: number, j: any) => sum + Number(j.price) * 0.965,
    0
  );

  return {
    newJobs: pendingRes.count ?? 0,
    weeklyEarnings,
    rating: profileRes.data?.rating ?? 0,
  };
}

function getWeekStart(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
