import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { getProviderJobs, updateJobStatus, type DbJob } from '../../lib/jobs';

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diff < 60)  return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export const ProviderJobRequestScreen: React.FC = () => {
  const { navigate, currentUser, isDemo } = useApp();
  const [jobs, setJobs] = useState<DbJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState<string | null>(null);
  const [declining, setDeclining] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isDemo || !currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    const all = await getProviderJobs(currentUser.id);
    setJobs(all.filter((j) => j.status === 'pending'));
    setLoading(false);
  }, [currentUser?.id, isDemo]);

  useEffect(() => { load(); }, [load]);

  const handleAccept = async (job: DbJob) => {
    if (isDemo) {
      setAccepted(job.id);
      setTimeout(() => navigate('provider-jobs'), 1600);
      return;
    }
    const { error } = await updateJobStatus(job.id, 'active');
    if (error) { alert('Failed to accept job: ' + error); return; }
    setAccepted(job.id);
    setTimeout(() => navigate('provider-jobs'), 1600);
  };

  const handleDecline = async (job: DbJob) => {
    if (isDemo) { setJobs((j) => j.filter((x) => x.id !== job.id)); return; }
    setDeclining(job.id);
    const { error } = await updateJobStatus(job.id, 'declined');
    setDeclining(null);
    if (error) { alert('Failed to decline job: ' + error); return; }
    setJobs((j) => j.filter((x) => x.id !== job.id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="New Job Requests" back="provider-home" />
      <div className="screen">
        <div className="screen-content">

          {loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading requests…</span>
            </div>
          )}

          {accepted ? (
            <div className="empty-state scale-pop" style={{ minHeight: 300 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={50} color="var(--green)" />
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22 }}>Job Accepted!</div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Navigating to your jobs…</div>
            </div>
          ) : !loading && jobs.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No job requests yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
                New requests from customers in your area will appear here.
              </div>
            </div>
          ) : (
            <>
              {jobs.map((job, i) => (
                <div key={job.id} className="card animate-in" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>{job.title}</div>
                      {job.description && (
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{job.description}</div>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 8, marginTop: 4 }}>
                      {formatDate(job.created_at)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      {job.consumer_name} – {job.location}
                    </span>
                  </div>

                  <div className="divider" />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 32 }}>R{job.price}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        <strong>Call-out rate</strong> (In-App Payment Only)
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>After 3.5% platform fee:</div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16, color: 'var(--green)' }}>
                        R{(job.price * 0.965).toFixed(0)} earned
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      className="btn btn-secondary"
                      disabled={declining === job.id}
                      onClick={() => handleDecline(job)}
                    >
                      {declining === job.id ? 'Declining…' : 'Decline'}
                    </button>
                    <button className="btn btn-accent" onClick={() => handleAccept(job)}>
                      Accept Job
                    </button>
                  </div>
                </div>
              ))}

              <button className="btn btn-primary btn-full" onClick={() => navigate('provider-jobs')}>
                View All Jobs
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ProviderNav />
    </div>
  );
};
