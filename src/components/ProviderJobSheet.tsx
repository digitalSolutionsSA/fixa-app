import React, { useEffect, useState } from 'react';
import { MapPin, X, Phone, Star, Loader2, CheckCircle, AlertTriangle, Clock, User, MessageCircle } from 'lucide-react';
import { Avt } from './Shared';
import { JobPhotos } from './JobPhotos';
import { JobChat } from './JobChat';
import { isChatAvailable } from '../lib/messages';
import { updateJobStatus, type DbJob } from '../lib/jobs';
import {
  getCustomerSummary, getMyCustomerReview, submitCustomerReview,
  LOW_CUSTOMER_RATING, type CustomerSummary,
} from '../lib/customerReviews';

function initials(name: string) {
  return name.trim().split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

const STATUS: Record<DbJob['status'], { label: string; bg: string; fg: string }> = {
  pending:   { label: 'New request', bg: 'var(--teal-light)',  fg: 'var(--teal)' },
  active:    { label: 'Accepted',    bg: 'var(--green-light)', fg: 'var(--green)' },
  completed: { label: 'Completed',   bg: 'var(--green-light)', fg: 'var(--green)' },
  declined:  { label: 'Declined',    bg: '#F3F4F6',            fg: '#6B7280' },
  cancelled: { label: 'Cancelled',   bg: '#F3F4F6',            fg: '#6B7280' },
};

const Stars: React.FC<{ value: number; onChange?: (v: number) => void; size?: number }> = ({ value, onChange, size = 30 }) => (
  <div style={{ display: 'flex', gap: onChange ? 8 : 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
        style={{ padding: 0, border: 'none', background: 'none', cursor: onChange ? 'pointer' : 'default' }}
      >
        <Star size={size} fill={n <= value ? 'var(--yellow)' : 'none'} color={n <= value ? 'var(--yellow)' : 'var(--border)'} />
      </button>
    ))}
  </div>
);

/**
 * Provider's view of one job: job details, the customer, and the next action
 * (accept/decline, mark complete, or rate the customer).
 */
export const ProviderJobSheet: React.FC<{
  job: DbJob;
  providerId: string;
  onClose: () => void;
  onJobChanged: (job: DbJob) => void;
}> = ({ job, providerId, onClose, onJobChanged }) => {
  const [customer, setCustomer] = useState<CustomerSummary | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [busy, setBusy] = useState<'' | 'accept' | 'decline' | 'complete' | 'review'>('');
  const [error, setError] = useState('');

  const [myReview, setMyReview] = useState<{ rating: number; comment: string | null } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingCustomer(true);
    getCustomerSummary(job.consumer_id).then((c) => {
      if (cancelled) return;
      setCustomer(c);
      setLoadingCustomer(false);
    });
    return () => { cancelled = true; };
    // Re-fetch after accepting so the phone number appears.
  }, [job.consumer_id, job.status]);

  useEffect(() => {
    if (job.status !== 'completed') return;
    getMyCustomerReview(job.id).then(setMyReview);
  }, [job.id, job.status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const setStatus = async (status: DbJob['status'], kind: 'accept' | 'decline' | 'complete') => {
    setBusy(kind);
    setError('');
    const { error: err } = await updateJobStatus(job.id, status);
    setBusy('');
    if (err) { setError(err); return; }
    onJobChanged({ ...job, status, updated_at: new Date().toISOString() });
    if (status === 'declined') onClose();
  };

  const sendReview = async () => {
    if (!rating) { setError('Tap a star to rate this customer.'); return; }
    setBusy('review');
    setError('');
    const { error: err } = await submitCustomerReview({
      job_id: job.id, provider_id: providerId, consumer_id: job.consumer_id, rating, comment,
    });
    setBusy('');
    if (err) { setError(err); return; }
    setMyReview({ rating, comment: comment.trim() || null });
    setCustomer(await getCustomerSummary(job.consumer_id));
  };

  const name = customer?.full_name || job.consumer_name || 'Customer';
  const st = STATUS[job.status];
  const custRating = customer?.rating != null ? Number(customer.rating) : null;
  const lowRated = custRating != null && custRating < LOW_CUSTOMER_RATING;
  const earned = (Number(job.price) * 0.965).toFixed(0);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.2s ease both' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Job details"
        style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', background: 'var(--bg, #f5f7fa)', borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', animation: 'sheetUp 0.28s cubic-bezier(.2,.8,.2,1) both', boxShadow: '0 -8px 30px rgba(0,0,0,0.2)' }}
      >
        <div style={{ position: 'relative', padding: '10px 16px 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--border)', margin: '0 auto' }} />
          <button onClick={onClose} aria-label="Close"
            style={{ position: 'absolute', top: 8, right: 12, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--card, white)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={17} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ overflowY: 'auto', padding: '6px 16px 12px', display: 'flex', flexDirection: 'column', gap: 12, WebkitOverflowScrolling: 'touch' }}>
          {/* ── Job ── */}
          <div>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 800, background: st.bg, color: st.fg }}>
              {st.label}
            </span>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, marginTop: 6, color: 'var(--text-primary)', paddingRight: 36 }}>{job.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              <Clock size={12} /> Requested {fmtDate(job.created_at)}
            </div>
          </div>

          <div className="card" style={{ margin: 0 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>Job details</div>
            <div style={{ fontSize: 14, color: job.description ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {job.description || 'No description given.'}
            </div>
            <JobPhotos paths={job.photos} size={84} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 12 }}>
              <MapPin size={15} color="var(--teal)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{job.location}</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 24 }}>R{job.price}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Call-out rate · In-App only</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>After 3.5% fee</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, color: 'var(--green)' }}>R{earned}</div>
              </div>
            </div>
          </div>

          {/* ── Customer ── */}
          <div className="card" style={{ margin: 0, border: lowRated ? '1.5px solid #F59E0B' : undefined }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>Customer</div>

            {lowRated && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#FFFBEB', border: '1px solid #FCD34D', color: '#92400E', borderRadius: 10, padding: '8px 10px', marginBottom: 12, fontSize: 12, lineHeight: 1.4 }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span><strong>Low-rated customer.</strong> Other providers rated this customer {custRating!.toFixed(1)}★ on average. Read their reviews before accepting.</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {customer?.avatar_url
                ? <img src={customer.avatar_url} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }} />
                : <Avt initials={initials(name)} size={52} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                  {custRating != null ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: lowRated ? '#B45309' : 'var(--text-primary)' }}>
                      <Star size={13} fill="var(--yellow)" color="var(--yellow)" /> {custRating.toFixed(1)}
                      <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>({customer!.rating_count})</span>
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Not rated yet</span>
                  )}
                  {customer && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      · {customer.completed_jobs} job{customer.completed_jobs === 1 ? '' : 's'} completed
                    </span>
                  )}
                </div>
                {customer?.member_since && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    On FIXA since {new Date(customer.member_since).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            {loadingCustomer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Loading customer…
              </div>
            )}

            {/* Contact */}
            {customer?.phone ? (
              <a href={`tel:${customer.phone.replace(/\s/g, '')}`} className="btn btn-secondary btn-full" style={{ marginTop: 12, gap: 8, textDecoration: 'none' }}>
                <Phone size={16} /> Call {name.split(' ')[0]} · {customer.phone}
              </a>
            ) : job.status === 'pending' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                <User size={13} /> Contact details are shared once you accept the job.
              </div>
            ) : null}

            {/* What other providers said */}
            {!!customer?.recent_reviews?.length && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>What providers say</div>
                {customer.recent_reviews.map((r, i) => (
                  <div key={i} style={{ padding: '6px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Stars value={r.rating} size={11} />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{new Date(r.created_at).toLocaleDateString('en-ZA')}</span>
                    </div>
                    {r.comment && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{r.comment}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {job.status !== 'active' && isChatAvailable(job) && (
            <button className="btn btn-secondary btn-full" onClick={() => setChatOpen(true)} style={{ gap: 8 }}>
              <MessageCircle size={16} /> View chat history
            </button>
          )}

          {/* ── Rate the customer (completed jobs) ── */}
          {job.status === 'completed' && (
            <div className="card" style={{ margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                {myReview ? 'Your rating of this customer' : `How was ${name.split(' ')[0]} as a customer?`}
              </div>
              {myReview ? (
                <>
                  <div style={{ marginTop: 8 }}><Stars value={myReview.rating} size={22} /></div>
                  {myReview.comment && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{myReview.comment}</div>}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Your rating helps other providers. Think about payment, communication, safety and respect.
                  </div>
                  <div style={{ marginTop: 12 }}><Stars value={rating} onChange={setRating} /></div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Optional: anything other providers should know?"
                    maxLength={500}
                    style={{ width: '100%', boxSizing: 'border-box', marginTop: 12, minHeight: 70, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical' }}
                  />
                  <button className="btn btn-primary btn-full" style={{ marginTop: 10, gap: 8 }} disabled={busy === 'review'} onClick={sendReview}>
                    {busy === 'review' ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Submit rating'}
                  </button>
                </>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 13, color: '#B91C1C' }}>{error}</div>
          )}
        </div>

        {/* ── Actions ── */}
        {(job.status === 'pending' || job.status === 'active') && (
          <div style={{ flexShrink: 0, padding: '10px 16px calc(env(safe-area-inset-bottom) + 14px)', borderTop: '1px solid var(--border)', background: 'var(--card, white)' }}>
            {job.status === 'pending' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10 }}>
                <button className="btn btn-secondary" disabled={!!busy} onClick={() => setStatus('declined', 'decline')}>
                  {busy === 'decline' ? 'Declining…' : 'Decline'}
                </button>
                <button className="btn btn-accent" disabled={!!busy} onClick={() => setStatus('active', 'accept')} style={{ gap: 8 }}>
                  {busy === 'accept' ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Accepting…</> : 'Accept Job'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 10 }}>
                <button className="btn btn-secondary" disabled={!!busy} onClick={() => setChatOpen(true)} style={{ gap: 8 }}>
                  <MessageCircle size={16} /> Chat
                </button>
                <button className="btn btn-primary" disabled={!!busy} onClick={() => setStatus('completed', 'complete')} style={{ gap: 8 }}>
                  {busy === 'complete'
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Completing…</>
                    : <><CheckCircle size={16} /> Mark Complete</>}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {chatOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <JobChat job={job} currentUserId={providerId} otherName={name} onClose={() => setChatOpen(false)} />
        </div>
      )}

      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
