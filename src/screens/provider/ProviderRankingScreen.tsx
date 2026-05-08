import React from 'react';
import { Check } from 'lucide-react';
import { AppHeader, ProviderNav } from '../../components/Shared';

export const ProviderRankingScreen: React.FC = () => {
  const factors = [
    { icon: '📋', label: 'Job Completion Rate', weight: '25%', done: false },
    { icon: '⭐', label: 'Review Score (90-day weighted)', weight: '25%', done: false },
    { icon: '⏱️', label: 'Response Time', weight: '20%', done: false },
    { icon: '💳', label: 'In-App Payment Compliance', weight: '15%', done: false },
    { icon: '🪪', label: 'Verification Level', weight: '10%', done: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Provider Performance" back="provider-home" />
      <div className="screen">
        <div className="screen-content">
          <div className="card animate-in" style={{ textAlign: 'center', padding: 28 }}>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Your Provider Score
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 40 }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>0</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>100</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 900,
                  fontSize: 40,
                  color: 'var(--teal)',
                }}
              >
                0
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <span className="badge badge-green">Getting started</span>
            </div>
          </div>

          <div className="card d1 animate-in">
            <div className="section-title">Ranking Algorithm</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
              Your ranking is recalculated after every job based on these weighted factors:
            </p>

            {factors.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  marginBottom: i < factors.length - 1 ? 8 : 0,
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {f.label}
                </span>
                <span className="badge badge-teal" style={{ fontSize: 11 }}>
                  {f.weight}
                </span>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: f.done ? 'var(--green)' : 'var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {f.done && <Check size={13} color="white" />}
                </div>
              </div>
            ))}

            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
              Qualifications boost trust but do not guarantee higher placement. Only in-app paid
              jobs count toward ranking.
            </p>
          </div>

          <div className="card d5 animate-in">
            <div className="section-title">Verification Level</div>

            {[
              {
                l: 'Level 1 – Identity Confirmed',
                d: 'Upload your government ID and complete selfie matching.',
                done: false,
              },
              {
                l: 'Level 2 – Documents Screened',
                d: 'Upload certificates and supporting documents for review.',
                done: false,
              },
              {
                l: 'Level 3 – Partner Verified',
                d: 'Advanced human or partner review may be added later.',
                done: false,
              },
            ].map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  paddingBottom: i < 2 ? 14 : 0,
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                  marginBottom: i < 2 ? 14 : 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: v.done ? 'var(--green)' : 'var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {v.done ? (
                    <Check size={14} color="white" />
                  ) : (
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-head)',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 3 }}>
                    {v.l}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {v.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};