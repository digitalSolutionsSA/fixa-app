import React, { useState } from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ProviderNav, RatingStars } from '../../components/Shared';
import { EMPTY_NEW_JOBS, EMPTY_ACTIVE_JOBS, EMPTY_DONE_JOBS } from './constants';

export const ProviderJobsScreen: React.FC = () => {
  const { navigate } = useApp();
  const [tab, setTab] = useState<'new' | 'active' | 'done'>('new');

  const allJobs = {
    new: EMPTY_NEW_JOBS.map((j) => ({
      t: j.title,
      c: j.customer,
      l: j.location,
      km: j.distance,
      p: j.price,
      urg: j.urgent,
    })),
    active: EMPTY_ACTIVE_JOBS,
    done: EMPTY_DONE_JOBS,
  };

  const currentJobs = allJobs[tab];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="My Jobs" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>
              New ({allJobs.new.length})
            </button>
            <button className={`tab-btn ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              Active
            </button>
            <button className={`tab-btn ${tab === 'done' ? 'active' : ''}`} onClick={() => setTab('done')}>
              Completed
            </button>
          </div>

          {currentJobs.map((j, i) => (
            <div
              key={i}
              className="card card-clickable animate-in"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => navigate('provider-job-request')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
                      {j.t}
                    </div>
                    {j.urg && (
                      <span className="badge badge-red" style={{ fontSize: 10 }}>
                        Urgent
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{j.c}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {j.l} · {j.km}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>
                    R{j.p}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>In-App Only</div>
                </div>
              </div>

              {tab === 'new' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={(e) => e.stopPropagation()}>
                    Details
                  </button>
                  <button
                    className="btn btn-accent btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('provider-home');
                    }}
                  >
                    Accept
                  </button>
                </div>
              )}

              {tab === 'done' && (
                <div style={{ marginTop: 8 }}>
                  <RatingStars rating={0} size={13} />
                </div>
              )}
            </div>
          ))}

          {currentJobs.length === 0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>
                {tab === 'new' && 'No new jobs'}
                {tab === 'active' && 'No active jobs'}
                {tab === 'done' && 'No completed jobs'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
                {tab === 'new' && 'Incoming requests will appear here.'}
                {tab === 'active' && 'Accepted jobs will appear here.'}
                {tab === 'done' && 'Completed jobs will appear here once you finish work.'}
              </div>
            </div>
          )}
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};