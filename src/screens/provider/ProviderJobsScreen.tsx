import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, Briefcase, Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { getProviderJobs, updateJobStatus, type DbJob } from '../../lib/jobs';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string) {
  return name.trim().split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase();
}

type Tab = 'new' | 'active' | 'done';

export const ProviderJobsScreen: React.FC = () => {
  const { navigate, currentUser, isDemo } = useApp();
  const [tab, setTab] = useState<Tab>('new');
  const [jobs, setJobs] = useState<DbJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (isDemo || !currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    const all = await getProviderJobs(currentUser.id);
    setJobs(all);
    setLoading(false);
  }, [currentUser?.id, isDemo]);

  useEffect(() => { load(); }, [load]);

  const newJobs    = jobs.filter((j) => j.status === 'pending');
  const activeJobs = jobs.filter((j) => j.status === 'active');
  const doneJobs   = jobs.filter((j) => j.status === 'completed');

  const shown: DbJob[] = tab === 'new' ? newJobs : tab === 'active' ? activeJobs : doneJobs;

  const handleComplete = async (job: DbJob) => {
    setCompleting(job.id);
    const { error } = await updateJobStatus(job.id, 'completed');
    setCompleting(null);
    if (error) { alert('Failed to mark complete: ' + error); return; }
    setJobs((prev) => prev.map((j) => j.id === job.id ? { ...j, status: 'completed' } : j));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="My Jobs" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>
              New ({isDemo ? 0 : newJobs.length})
            </button>
            <button className={`tab-btn ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              Active ({isDemo ? 0 : activeJobs.length})
            </button>
            <button className={`tab-btn ${tab === 'done' ? 'active' : ''}`} onClick={() => setTab('done')}>
              Completed ({isDemo ? 0 : doneJobs.length})
            </button>
          </div>

          {loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading jobs…</span>
            </div>
          )}

          {!loading && shown.map((job, i) => (
            <div key={job.id} className="card card-clickable animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{job.consumer_name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.location}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{formatDate(job.created_at)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>R{job.price}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>In-App Only</div>
                </div>
              </div>

              {job.description ? (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, padding: '8px 12px', background: 'var(--card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {job.description}
                </div>
              ) : null}

              {tab === 'new' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('provider-job-request')}>
                    Details
                  </button>
                  <button className="btn btn-accent btn-sm" onClick={() => navigate('provider-job-request')}>
                    Accept
                  </button>
                </div>
              )}

              {tab === 'active' && (
                <button
                  className="btn btn-primary btn-sm btn-full"
                  style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  disabled={completing === job.id}
                  onClick={() => handleComplete(job)}
                >
                  {completing === job.id
                    ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Marking complete…</>
                    : <><CheckCircle size={15} /> Mark as Complete</>}
                </button>
              )}

              {tab === 'done' && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={14} color="var(--green)" />
                  <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
                    Completed · R{(job.price * 0.965).toFixed(0)} earned
                  </span>
                </div>
              )}
            </div>
          ))}

          {!loading && shown.length === 0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>
                {tab === 'new'    && 'No new requests'}
                {tab === 'active' && 'No active jobs'}
                {tab === 'done'   && 'No completed jobs'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
                {tab === 'new'    && 'Incoming requests will appear here.'}
                {tab === 'active' && 'Accepted jobs will appear here.'}
                {tab === 'done'   && 'Completed jobs will appear here.'}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ProviderNav />
    </div>
  );
};
