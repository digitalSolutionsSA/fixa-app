import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, Send, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { Avt } from './Shared';
import type { DbJob } from '../lib/jobs';
import {
  getMessages, sendMessage, subscribeToMessages, canSendMessages, chatDeletionDate, type DbMessage,
} from '../lib/messages';

function initials(name: string) {
  return name.trim().split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Full-screen chat between a job's customer and provider. */
export const JobChat: React.FC<{
  job: DbJob;
  currentUserId: string;
  otherName: string;
  onClose: () => void;
}> = ({ job, currentUserId, otherName, onClose }) => {
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const open = canSendMessages(job);
  const deletesAt = chatDeletionDate(job);

  const addMessage = (m: DbMessage) =>
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));

  useEffect(() => {
    let cancelled = false;
    getMessages(job.id).then((m) => {
      if (cancelled) return;
      setMessages(m);
      setLoading(false);
    });
    const unsubscribe = subscribeToMessages(job.id, addMessage);
    return () => { cancelled = true; unsubscribe(); };
  }, [job.id]);

  // Keep the newest message in view
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, loading]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError('');
    const { data, error: err } = await sendMessage(job.id, currentUserId, body);
    setSending(false);
    if (err || !data) {
      setError(err?.includes('row-level security') ? 'This chat is closed — the job is no longer active.' : (err || 'Message not sent.'));
      return;
    }
    setDraft('');
    addMessage(data);
  };

  const firstName = otherName.split(' ')[0];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 950, background: 'var(--bg, #f5f7fa)', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.15s ease both' }}>
      {/* Header */}
      <div style={{ background: 'var(--teal)', paddingTop: 'env(safe-area-inset-top)', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
          <button className="back-btn" onClick={onClose} aria-label="Back">
            <ChevronLeft size={20} color="white" />
          </button>
          <Avt initials={initials(otherName)} size={38} bg="rgba(255,255,255,0.25)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherName}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 4, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ alignSelf: 'center', display: 'flex', gap: 6, alignItems: 'flex-start', maxWidth: 320, background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: 12, padding: '8px 12px', fontSize: 12, lineHeight: 1.4, marginBottom: 8 }}>
          <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Only you and {firstName} can see this chat. Pay through FIXA only — never share banking details.</span>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 24 }}>
            {open ? `No messages yet. Say hi to ${firstName} 👋` : 'No messages were sent for this job.'}
          </div>
        )}

        {messages.map((m, i) => {
          const mine = m.sender_id === currentUserId;
          const prev = messages[i - 1];
          const newDay = !prev || new Date(prev.created_at).toDateString() !== new Date(m.created_at).toDateString();
          const grouped = !!prev && !newDay && prev.sender_id === m.sender_id;
          return (
            <React.Fragment key={m.id}>
              {newDay && (
                <div style={{ alignSelf: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', margin: '10px 0 6px', fontFamily: 'var(--font-head)' }}>
                  {dayLabel(m.created_at)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', marginTop: grouped ? 0 : 6 }}>
                <div style={{
                  maxWidth: '78%', padding: '8px 12px 6px', fontSize: 15, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  background: mine ? 'var(--teal)' : 'var(--card, white)', color: mine ? 'white' : 'var(--text-primary)',
                  borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: mine ? 'none' : '0 1px 2px rgba(0,0,0,0.08)',
                }}>
                  {m.body}
                  <div style={{ fontSize: 10, textAlign: 'right', marginTop: 2, color: mine ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>{timeLabel(m.created_at)}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Composer / closed notice */}
      <div style={{ flexShrink: 0, background: 'var(--card, white)', borderTop: '1px solid var(--border)', padding: '10px 12px calc(env(safe-area-inset-bottom) + 10px)' }}>
        {error && <div style={{ fontSize: 12, color: '#B91C1C', marginBottom: 8 }}>{error}</div>}
        {open ? (
          <form onSubmit={send} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${firstName}…`}
              maxLength={2000}
              enterKeyHint="send"
              style={{ flex: 1, minWidth: 0, padding: '12px 16px', borderRadius: 24, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 16, outline: 'none', background: 'var(--bg, #f5f7fa)' }}
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              aria-label="Send"
              style={{ width: 46, height: 46, flexShrink: 0, borderRadius: '50%', border: 'none', background: draft.trim() ? 'var(--teal)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: draft.trim() ? 'pointer' : 'default', transition: 'background 0.15s' }}
            >
              {sending ? <Loader2 size={18} color="white" style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={18} color="white" />}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            <Lock size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              This job is {job.status === 'cancelled' ? 'cancelled' : 'completed'}, so the chat is closed.
              {deletesAt && <> The conversation is kept until <strong>{deletesAt.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}</strong>, then deleted.</>}
            </span>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
