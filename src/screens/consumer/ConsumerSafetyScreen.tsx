import React, { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, PanicBanner } from '../../components/Shared';
import { logPanicEvent } from '../../lib/panic';
import { supabase } from '../../lib/supabase';

export const ConsumerSafetyScreen: React.FC = () => {
  const { triggerPanic, currentUser, isDemo } = useApp();
  const [panicking, setPanicking] = useState(false);
  const [panicSent, setPanicSent] = useState(false);

  const handlePanic = async () => {
    triggerPanic();
    if (isDemo || !currentUser?.id) return;

    setPanicking(true);
    // Fetch trusted contact from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('area, trusted_contact_name, trusted_contact_phone')
      .eq('id', currentUser.id)
      .maybeSingle();

    await logPanicEvent({
      user_id:               currentUser.id,
      user_name:             currentUser.name,
      location_area:         profile?.area ?? '',
      trusted_contact_name:  profile?.trusted_contact_name ?? '',
      trusted_contact_phone: profile?.trusted_contact_phone ?? '',
    });
    setPanicking(false);
    setPanicSent(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Safety Centre" />
      <PanicBanner />
      <div className="screen">
        <div className="screen-content">

          {/* Panic button */}
          <div style={{ background: 'var(--red-light)', border: '2px solid var(--red-panic)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18, color: 'var(--red-panic)', marginBottom: 8 }}>
              ⚠️ Emergency Panic Button
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 22 }}>
              One tap logs your location, alerts your trusted contact and notifies FIXA admin immediately.
            </div>

            {panicSent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={48} color="var(--red-panic)" />
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, color: 'var(--red-panic)' }}>Alert sent — help is on the way</div>
              </div>
            ) : (
              <button
                onClick={handlePanic}
                disabled={panicking}
                className="btn btn-danger panic-pulse btn-lg"
                style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18, padding: '20px 56px', gap: 10 }}
              >
                {panicking ? <><Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending…</> : '🚨 PANIC'}
              </button>
            )}

            <p style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              No guaranteed response times. FIXA does not guarantee outcomes. Security escalation handled via licensed partner protocols.
            </p>
          </div>

          {/* Safety features */}
          <div className="section-title">Safety Features</div>
          {[
            { icon: '📍', title: 'Live Job Tracking',        desc: "Track your provider's real-time location throughout your booking." },
            { icon: '✅', title: 'Provider Verification',    desc: 'All providers submit government ID and documents for automated screening.' },
            { icon: '👥', title: 'Trusted Contact Alerts',   desc: 'Add a trusted person who is notified instantly when panic is activated.' },
            { icon: '🔒', title: 'In-App Payments Only',     desc: 'All jobs paid through the app. Dispute support available for in-app transactions.' },
            { icon: '🛡️', title: 'Security Partner Network', desc: 'Panic alerts can be routed to a licensed private security partner in your area.' },
            { icon: '📋', title: 'Incident Logging',         desc: 'All safety events are GPS and timestamp logged in the admin system.' },
          ].map((f, i) => (
            <div key={i} className="card animate-in" style={{ animationDelay: `${i * 0.04}s`, display: 'flex', gap: 14 }}>
              <div style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}

          <div className="card" style={{ background: 'var(--teal-light)', border: '1px solid rgba(0,168,150,0.2)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: 'var(--teal)', marginBottom: 6 }}>
              Set your trusted contact
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Go to <strong>Profile → Trusted Contact</strong> to add someone who gets alerted when you tap panic.
            </div>
          </div>

        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};
