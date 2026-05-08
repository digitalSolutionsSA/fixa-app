import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, PanicBanner } from '../../components/Shared';

export const ConsumerSafetyScreen: React.FC = () => {
  const { triggerPanic, isDemo } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Safety Centre" />
      <PanicBanner />
      <div className="screen">
        <div className="screen-content">
          <div style={{ background: 'var(--red-light)', border: '2px solid var(--red-panic)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18, color: 'var(--red-panic)', marginBottom: 8 }}>
              ⚠️ Emergency Panic Button
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 22, maxWidth: 360, margin: '0 auto 22px' }}>
              One tap sends your GPS location and alerts your trusted contact &amp; private security partner. Visible only during an active job.
            </div>
            <button onClick={triggerPanic} className="btn btn-danger panic-pulse btn-lg" style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18, padding: '20px 56px' }}>
              🚨 PANIC
            </button>
            <p style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              No guaranteed response times. FIXA does not guarantee outcomes. Security escalation handled via licensed partner protocols.
            </p>
          </div>

          <div className="section-title">Safety Features</div>
          {[
            { icon: '📍', title: 'Live Job Tracking', desc: "Track your provider's real-time location throughout your booking." },
            { icon: '✅', title: 'Provider Verification', desc: 'All providers submit government ID and documents for automated screening.' },
            { icon: '👥', title: 'Trusted Contact Alerts', desc: 'Add a trusted person who is notified instantly when panic is activated.' },
            { icon: '🔒', title: 'In-App Payments Only', desc: 'All jobs paid through the app. Dispute support available for in-app transactions.' },
            { icon: '🛡️', title: 'Security Partner Network', desc: 'Panic alerts can be routed to a licensed private security partner in your area.' },
            { icon: '📋', title: 'Incident Logging', desc: 'All safety events are GPS and timestamp logged in the admin system.' },
          ].map((f, i) => (
            <div key={i} className="card animate-in" style={{ animationDelay: `${i * 0.04}s`, display: 'flex', gap: 14 }}>
              <div style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}

          <div className="card">
            <div className="section-title">Trusted Contact</div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Name</label>
              <input className="input" placeholder="e.g. Nomsa Dlamini" defaultValue={isDemo ? 'Nomsa Dlamini' : ''} />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Phone Number</label>
              <input className="input" placeholder="+27 82 000 0000" defaultValue={isDemo ? '+27 82 555 0123' : ''} />
            </div>
            <button className="btn btn-primary btn-full">Save Trusted Contact</button>
          </div>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};