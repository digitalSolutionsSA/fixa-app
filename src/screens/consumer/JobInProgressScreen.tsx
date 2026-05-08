import React from 'react';
import { Navigation, Wrench, MapPin, AlertTriangle, MessageCircle, Phone, Briefcase } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt, PanicBanner } from '../../components/Shared';
import { getSafeSelectedProvider } from './providers';

export const JobInProgressScreen: React.FC = () => {
  const { navigate, triggerPanic, selectedProvider, isDemo } = useApp();
  const p = getSafeSelectedProvider(selectedProvider, isDemo);

  if (!p) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Job in Progress" back="consumer-home" />
        <div className="screen">
          <div className="screen-content">
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No active job</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 320 }}>
                Active jobs will appear here once a real booking has been created.
              </div>
              <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
            </div>
          </div>
        </div>
        <ConsumerNav />
      </div>
    );
  }

  const steps = [
    { label: 'Job Confirmed', time: '09:10', state: 'done' },
    { label: 'Provider On Route', time: '09:35', state: 'done' },
    { label: 'Arrived', time: null, state: 'active' },
    { label: 'Job Complete', time: null, state: 'idle' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title="Job in Progress"
        back="find-provider"
        right={<button className="back-btn"><Navigation size={16} color="white" /></button>}
      />
      <PanicBanner />

      <div className="screen">
        <div className="map-bg" style={{ height: 220, margin: '16px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <polyline points="60,180 110,130 170,90 220,60" stroke="var(--teal)" strokeWidth="3" strokeDasharray="7,5" fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', left: '18%', top: '72%', transform: 'translate(-50%,-50%)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: '2px solid white' }}>
              <Wrench size={16} color="white" />
            </div>
          </div>
          <div style={{ position: 'absolute', right: '18%', top: '22%', transform: 'translate(50%,-50%)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
              <MapPin size={15} color="white" />
            </div>
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12, width: 48, height: 48, borderRadius: '50%', background: 'var(--teal)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, color: 'white', fontSize: 14 }}>{p.initials}</span>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'white', borderRadius: 10, padding: '6px 12px', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              ETA: <span style={{ color: 'var(--green)' }}>12 min</span>
            </span>
          </div>
        </div>

        <div className="screen-content" style={{ paddingTop: 0 }}>
          <div className="card animate-in">
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18 }}>
              {p.name.split("'")[0].split(' ')[0]} is on the way
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 3 }}>
              Arriving in <strong style={{ color: 'var(--green)' }}>12 minutes</strong>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {steps.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div className="step-item">
                    <div className={`step-dot ${s.state}`} />
                    <span style={{ flex: 1, fontFamily: 'var(--font-head)', fontWeight: s.state !== 'idle' ? 700 : 500, fontSize: 14, color: s.state !== 'idle' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.time || '—'}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`step-line ${s.state === 'done' ? 'done' : 'idle'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="card d1 animate-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avt initials={p.initials} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
              <RatingStars rating={p.rating} />
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                {p.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ ID Verified</span>}
                <span className="badge badge-gray" style={{ fontSize: 10 }}>{p.trade}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18 }}>R{p.priceFrom}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>In-App</div>
            </div>
          </div>

          <button onClick={triggerPanic} className="btn btn-danger btn-full panic-pulse d2 animate-in" style={{ fontSize: 16, padding: '18px', gap: 10 }}>
            <AlertTriangle size={22} /> Panic / Emergency
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: -6 }}>
            Tap if you feel unsafe – help will be sent immediately. No guarantee of response times.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { icon: <MessageCircle size={22} />, label: 'Chat' },
              { icon: <Phone size={22} />, label: 'Call' },
              { icon: <Navigation size={22} />, label: 'Track' },
            ].map((a) => (
              <button key={a.label} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', padding: '16px 8px', transition: 'box-shadow 0.2s' }}>
                <div style={{ color: 'var(--teal)' }}>{a.icon}</div>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--text-secondary)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};