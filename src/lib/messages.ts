import { supabase } from './supabase';
import type { DbJob } from './jobs';

export type DbMessage = {
  id: string;
  job_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

// Closed chats are kept this long, then deleted by the nightly purge (see supabase-job-chat.sql).
export const CHAT_RETENTION_DAYS = 30;

/** Messages can only be sent while the job is accepted. */
export function canSendMessages(job: Pick<DbJob, 'status'>): boolean {
  return job.status === 'active';
}

/** When a closed job's chat will be deleted (null while the job is still open). */
export function chatDeletionDate(job: Pick<DbJob, 'status' | 'closed_at' | 'updated_at'>): Date | null {
  if (job.status === 'active' || job.status === 'pending') return null;
  const closed = new Date(job.closed_at || job.updated_at);
  return new Date(closed.getTime() + CHAT_RETENTION_DAYS * 86400000);
}

/** Whether the chat can be opened at all: while active, or read-only for 30 days after it closed. */
export function isChatAvailable(job: Pick<DbJob, 'status' | 'closed_at' | 'updated_at'>): boolean {
  if (job.status === 'active') return true;
  if (job.status !== 'completed' && job.status !== 'cancelled') return false;
  const deletesAt = chatDeletionDate(job);
  return !!deletesAt && deletesAt.getTime() > Date.now();
}

export async function getMessages(jobId: string): Promise<DbMessage[]> {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: true });
  return (data as DbMessage[]) || [];
}

export async function sendMessage(jobId: string, senderId: string, body: string): Promise<{ data: DbMessage | null; error: string | null }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ job_id: jobId, sender_id: senderId, body: body.trim() })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as DbMessage, error: null };
}

/** Live new messages for one job. Returns an unsubscribe function. */
export function subscribeToMessages(jobId: string, onMessage: (m: DbMessage) => void): () => void {
  const channel = supabase
    .channel(`chat-${jobId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `job_id=eq.${jobId}` },
      (payload) => onMessage(payload.new as DbMessage)
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
