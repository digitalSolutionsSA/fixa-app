import React, { useState } from 'react';
import { MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { EMPTY_NEW_JOBS } from './constants';

export const ProviderJobRequestScreen: React.FC = () => {
  const { navigate } = useApp();
  const [accepted, setAccepted] = useState<string | null>(null);

  const jobs = EMPTY_NEW_JOBS;

  const handleAccept = (id: string) => {
    setAccepted(id);
    setTimeout(() => navigate('provider-jobs'), 1600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="New Job Requests" back="provider-home" />
      <div className="screen">
        <div className="screen-content">
          {accepted ? (
            <div className="empty-state scale-pop" style={{ minHeight: 300 }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'var(--green-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={50} color="var(--green)" />
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22 }}>
                Job Accepted!
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                Navigating to your jobs…
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 300 }}>
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>
                No job requests yet
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
                New requests in your area will appear here when customers start booking.
              </div>
            </div>
          ) : (
            <>
              {jobs.map((job, i) => (
                <div
                  key={job.id}
                  className="card animate-in"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-head)',
                            fontWeight: 900,
                            fontSize: 20,
                          }}
                        >
                          {job.title}
                        </div>
                        {job.urgent && <span className="badge badge-red">Urgent</span>}
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                        {job.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      {job.customer} – {job.location}, {job.distance}
                    </span>
                  </div>

                  <div className="divider" />

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-head)',
                          fontWeight: 900,
                          fontSize: 32,
                          color: 'var(--text-primary)',
                        }}
                      >
                        R{job.price}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        <strong>Confirmed Price</strong> (In-App Payment Only)
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        After 3.5% platform fee:
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-head)',
                          fontWeight: 700,
                          fontSize: 16,
                          color: 'var(--green)',
                        }}
                      >
                        R{(job.price * 0.965).toFixed(0)} earned
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => navigate('provider-home')}>
                      Decline
                    </button>
                    <button className="btn btn-accent" onClick={() => handleAccept(job.id)}>
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
      <ProviderNav />
    </div>
  );
};