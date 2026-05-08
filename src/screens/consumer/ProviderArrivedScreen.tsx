import React from 'react';
import { Navigation, CheckCircle, Briefcase } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import { getSafeSelectedProvider } from './providers';

export const ProviderArrivedScreen: React.FC = () => {
  const { navigate, selectedProvider, isDemo } = useApp();
  const p = getSafeSelectedProvider(selectedProvider, isDemo);

  if (!p) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="FIXA" showLogo back="consumer-home" />
        <div className="screen">
          <div className="screen-content">
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No provider selected</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 320 }}>
                This screen will only show once a real provider has been selected for a booking.
              </div>
              <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
            </div>
          </div>
        </div>
        <ConsumerNav />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title="FIXA"
        showLogo
        back="consumer-home"
        right={<button className="back-btn"><Navigation size={16} color="white" /></button>}
      />

      <div className="screen">
        <div className="screen-content">
          <div className="animate-in" style={{ background: 'var(--green-light)', border: '2px solid var(--green)', borderRadius: 'var(--radius-md)', padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <CheckCircle size={26} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 17 }}>Your FIXA provider has arrived.</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 3 }}>You can verify their profile before starting the job.</div>
            </div>
          </div>

          <div className="card d1 animate-in">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <Avt initials={p.initials} size={64} />
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                  <RatingStars rating={p.rating} size={14} />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  {p.verified && <span className="badge badge-green">✓ ID Verified</span>}
                  <span className="badge badge-gray">{p.trade}</span>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Identity Verified', done: p.verified },
                { label: 'Qualification Screened', done: p.qualVerified },
                { label: 'Reviews from Paid Jobs Only', done: true },
                { label: `${p.jobCount} Jobs Completed`, done: true, icon: '🧰' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: row.done ? 'var(--green)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {row.icon ? <span style={{ fontSize: 13 }}>{row.icon}</span> : <CheckCircle size={14} color="white" />}
                  </div>
                  <span style={{ fontFamily: 'var(--font-head)', fontWeight: row.done ? 700 : 500, fontSize: 14, color: row.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#FFF8E1', border: '1px solid #F5B800', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <p style={{ fontSize: 12, color: '#7A6000', lineHeight: 1.6 }}>
              ⚠️ FIXA verifications are automated screenings and do not constitute professional certification or guarantees. Providers are independent contractors.
            </p>
          </div>

          <button className="btn btn-primary btn-full btn-lg d2 animate-in" onClick={() => navigate('job-in-progress')}>
            Verify &amp; Start Job
          </button>
          <button className="btn btn-secondary btn-full d3 animate-in" onClick={() => navigate('consumer-safety')}>
            Report Issue
          </button>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};