import React from 'react';
import { ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NotifBell, ProviderNav } from '../../components/Shared';

export const ProviderHomeScreen: React.FC = () => {
  const { navigate, user } = useApp() as any;

  const resolvedName =
    user?.name || user?.fullName || user?.full_name || user?.user_metadata?.full_name || 'Provider';

  const newRequestCount = 0;
  const weeklyEarnings = 0;
  const rating = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ background: 'var(--teal)', padding: '16px 20px 22px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            maxWidth: 700,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div className="logo-wrap">
            <span className="logo-main">
              FI<span className="logo-x">X</span>A
            </span>
            <span className="logo-sub">by PUBLICON</span>
          </div>
          <NotifBell count={0} />
        </div>

        <div style={{ maxWidth: 700, margin: '14px auto 0', width: '100%' }}>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 22,
              color: 'white',
            }}
          >
            Welcome, {resolvedName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              Your profile is live. New activity will appear here once you receive requests.
            </span>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { val: String(newRequestCount), l: 'New Requests', color: 'var(--red-panic)' },
              { val: `R${weeklyEarnings.toLocaleString()}`, l: 'This Week', color: 'var(--teal)' },
              { val: rating.toFixed(1), l: 'Rating', color: 'var(--yellow-dark)' },
            ].map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{ textAlign: 'center', cursor: i === 0 ? 'pointer' : undefined }}
                onClick={i === 0 ? () => navigate('provider-job-request') : undefined}
              >
                <div className="stat-num" style={{ color: s.color, textAlign: 'center' }}>
                  {s.val}
                </div>
                <div className="stat-label" style={{ textAlign: 'center' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15 }}>
                Account Status
              </div>
              <span className="badge badge-green">● Live &amp; Visible</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Response Time</span>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--text-muted)',
                }}
              >
                No data yet
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Subscription</span>
              <span className="badge badge-teal">Free Tier</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Provider Score</span>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 800,
                  fontSize: 14,
                  color: 'var(--teal)',
                }}
              >
                0/100
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ position: 'relative', fontSize: 16 }}
            onClick={() => navigate('provider-job-request')}
          >
            New Job Requests
            <span
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 20,
                padding: '2px 8px',
                fontFamily: 'var(--font-head)',
                fontWeight: 900,
                fontSize: 13,
              }}
            >
              0
            </span>
          </button>

          <button
            className="btn btn-secondary btn-full"
            style={{ fontSize: 15 }}
            onClick={() => navigate('provider-jobs')}
          >
            Current Jobs <ChevronRight size={16} />
          </button>

          <div className="card">
            <div className="section-title">Tips to Get Started</div>
            {[
              'Complete your profile details',
              'Upload your verification documents',
              'Respond quickly when requests arrive',
              'Collect great reviews from completed jobs',
            ].map((tip, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: i < 3 ? 10 : 0 }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={13} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>

          <button
            style={{
              background: 'linear-gradient(135deg, #c0392b, var(--red-panic))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(229,62,62,0.3)',
            }}
            onClick={() => navigate('provider-profile')}
          >
            <AlertTriangle size={22} color="white" />
            <span
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 800,
                fontSize: 15,
                color: 'white',
              }}
            >
              Emergency? Tap for help →
            </span>
          </button>
        </div>
      </div>

      <ProviderNav />
    </div>
  );
};