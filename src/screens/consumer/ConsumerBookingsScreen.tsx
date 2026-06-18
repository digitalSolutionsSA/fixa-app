import React, { useCallback, useEffect, useState } from 'react';
import { Briefcase, Loader2, Star, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, Avt } from '../../components/Shared';
import { getConsumerJobs, submitReview, hasReview, type DbJob } from '../../lib/jobs';

// ── Demo data ──────────────────────────────────────────────────────────────────
const DEMO_ACTIVE: DbJob[] = [
  {
    id: 'demo-1', consumer_id: 'demo-customer-1', provider_id: '1',
    consumer_name: 'Demo Customer', provider_name: "Jason's Plumbing",
    provider_trade: 'Plumber', title: 'Blocked Sink', description: '',
    location: 'Sandton', price: 450, status: 'active',
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];
const DEMO_PAST: DbJob[] = [
  {
    id: 'demo-2', consumer_id: 'demo-customer-1', provider_id: '2',
    consumer_name: 'Demo Customer', provider_name: 'Sipho the Electrician',
    provider_trade: 'Electrician', title: 'Plug Repair', description: '',
    location: 'Sandton', price: 350, status: 'completed',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3', consumer_id: 'demo-customer-1', provider_id: '3',
    consumer_name: 'Demo Customer', provider_name: 'Mike the Handyman',
    provider_trade: 'Handyman', title: 'Door Fix', description: '',
    location: 'Sandton', price: 200, status: 'completed',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(), updated_at: new Date().toISOString(),
  },
];

// ── Status helpers ─────────────────────────────────────────────────────────────
function statusLabel(status: DbJob['status']) {
  const map: Record<DbJob['status'], string> = {
    pending:   'Awaiting Provider',
    active:    'In Progress',
    completed: 'Completed',
    declined:  'Declined',
    cancelled: 'Cancelled',
  };
  return map[status] ?? status;
}

function statusBadgeClass(status: DbJob['status']) {
  if (status === 'completed') return 'badge-green';
  if (status === 'active')    return 'badge-teal';
  if (status === 'declined' || status === 'cancelled') return 'badge-red';
  return 'badge-gray';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff} days ago`;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function getInitials(name: string) {
  return name.trim().split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
}

// ── Review modal ───────────────────────────────────────────────────────────────
const ReviewModal: React.FC<{
  job: DbJob;
  consumerId: string;
  onClose: () => void;
  onDone: () => void;
}> = ({ job, consumerId, onClose, onDone }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) { setErr('Please select a rating.'); return; }
    setSubmitting(true);
    const { error } = await submitReview({
      job_id:      job.id,
      consumer_id: consumerId,
      provider_id: job.provider_id,
      rating,
      comment:     comment.trim(),
    });
    setSubmitting(false);
    if (error) { setErr(error); return; }
    onDone();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18 }}>Rate {job.provider_name}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={20} color="var(--text-muted)" /></button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {[1,2,3,4,5].map((s) => (
            <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Star size={36} fill={(hovered || rating) >= s ? 'var(--yellow-dark)' : 'none'} color={(hovered || rating) >= s ? 'var(--yellow-dark)' : 'var(--border)'} />
            </button>
          ))}
        </div>

        <textarea
          style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 14, minHeight: 80, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'var(--font-body)', outline: 'none' }}
          placeholder="Share your experience (optional)…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {err && <div style={{ color: '#B91C1C', fontSize: 13, marginTop: 8 }}>{err}</div>}

        <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

// ── Main screen ────────────────────────────────────────────────────────────────
export const ConsumerBookingsScreen: React.FC = () => {
  const { navigate, isDemo, currentUser } = useApp();
  const [tab, setTab] = useState<'active' | 'past'>('active');
  const [jobs, setJobs] = useState<DbJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [reviewJob, setReviewJob] = useState<DbJob | null>(null);

  const loadJobs = useCallback(async () => {
    if (isDemo) { setLoading(false); return; }
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    const all = await getConsumerJobs(currentUser.id);
    setJobs(all);

    // Check which completed jobs already have reviews
    const completedIds = all.filter((j) => j.status === 'completed').map((j) => j.id);
    const reviewed = new Set<string>();
    await Promise.all(
      completedIds.map(async (id) => {
        if (await hasReview(id)) reviewed.add(id);
      })
    );
    setReviewedIds(reviewed);
    setLoading(false);
  }, [currentUser?.id, isDemo]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const allJobs = isDemo ? [...DEMO_ACTIVE, ...DEMO_PAST] : jobs;
  const activeJobs = allJobs.filter((j) => j.status === 'active' || j.status === 'pending');
  const pastJobs   = allJobs.filter((j) => j.status === 'completed' || j.status === 'declined' || j.status === 'cancelled');
  const shown = tab === 'active' ? activeJobs : pastJobs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="My Bookings" />

      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              Active ({activeJobs.length})
            </button>
            <button className={`tab-btn ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>
              Past ({pastJobs.length})
            </button>
          </div>

          {loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading bookings…</span>
            </div>
          )}

          {!loading && shown.map((job, i) => (
            <div key={job.id} className="card card-clickable animate-in" style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => job.status === 'active' ? navigate('job-in-progress') : undefined}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avt initials={getInitials(job.provider_name)} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{job.provider_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{job.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{formatDate(job.created_at)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 17 }}>R{job.price}</div>
                  <span className={`badge ${statusBadgeClass(job.status)}`} style={{ marginTop: 4, display: 'block', textAlign: 'center', fontSize: 11 }}>
                    {statusLabel(job.status)}
                  </span>
                </div>
              </div>

              {job.status === 'active' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('provider-arrived'); }}>
                    View Details
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('job-in-progress'); }}>
                    Track Job
                  </button>
                </div>
              )}

              {job.status === 'completed' && !isDemo && !reviewedIds.has(job.id) && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: 12, width: '100%' }}
                  onClick={(e) => { e.stopPropagation(); setReviewJob(job); }}
                >
                  ⭐ Leave a Review
                </button>
              )}

              {job.status === 'completed' && (isDemo || reviewedIds.has(job.id)) && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={13} fill="var(--yellow-dark)" color="var(--yellow-dark)" /> Review submitted
                </div>
              )}
            </div>
          ))}

          {!loading && shown.length === 0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>
                {tab === 'active' ? 'No active bookings' : 'No past bookings'}
              </div>
              {tab === 'active' && (
                <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
              )}
            </div>
          )}
        </div>
      </div>

      {reviewJob && currentUser && (
        <ReviewModal
          job={reviewJob}
          consumerId={currentUser.id}
          onClose={() => setReviewJob(null)}
          onDone={() => {
            setReviewedIds((s) => new Set([...s, reviewJob.id]));
            setReviewJob(null);
          }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};
