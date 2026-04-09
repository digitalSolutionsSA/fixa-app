import React from 'react';
import {
  ChevronRight,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ProviderNav, NotifBell, RatingStars } from '../components/Shared';

function getFirstName(name?: string | null) {
  return name?.trim()?.split(' ')[0] || 'there';
}

function getInitials(name?: string | null) {
  if (!name) return 'P';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

type DashboardProvider = {
  id: string;
  name: string;
  trade: string;
  rating: number;
  rankScore: number;
  jobsCompleted: number;
  earnings: number;
  verificationLevel: number;
  subscriptionTier: string;
};

const demoProvider: DashboardProvider = {
  id: 'demo-provider-1',
  name: 'Demo Service Provider',
  trade: 'Plumber',
  rating: 4.8,
  rankScore: 92,
  jobsCompleted: 24,
  earnings: 4650,
  verificationLevel: 3,
  subscriptionTier: 'free',
};

export function ProviderDashboard() {
  const { navigate, currentUser, isDemo, logout } = useApp();

  const provider: DashboardProvider = isDemo
    ? demoProvider
    : {
        id: currentUser?.id || 'real-provider',
        name: currentUser?.name || 'Provider',
        trade: 'Service Provider',
        rating: 0,
        rankScore: 0,
        jobsCompleted: 0,
        earnings: 0,
        verificationLevel: 1,
        subscriptionTier: 'free',
      };

  const myJobsCount = 0;
  const pendingJobsCount = isDemo ? 2 : 0;

  const firstName = getFirstName(provider.name);
  const initials = getInitials(provider.name);

  const statCards = isDemo
    ? [
        { val: `${pendingJobsCount}`, l: 'New Requests', color: 'var(--red-panic)' },
        { val: `R${provider.earnings.toLocaleString()}`, l: 'Total Earned', color: 'var(--teal)' },
        { val: `${provider.rating}`, l: 'Rating', color: 'var(--yellow-dark)' },
      ]
    : [
        { val: `${pendingJobsCount}`, l: 'New Requests', color: 'var(--red-panic)' },
        { val: 'R0', l: 'Total Earned', color: 'var(--teal)' },
        { val: '0', l: 'Rating', color: 'var(--yellow-dark)' },
      ];

  const rankingFactors = isDemo
    ? [
        'Complete jobs professionally',
        'Respond quickly to requests',
        'Get 5-star reviews',
        'Accept in-app payments only',
      ]
    : [
        'Complete your first job',
        'Respond quickly to leads',
        'Collect verified in-app reviews',
        'Keep payments in-app only',
      ];

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
          <NotifBell count={isDemo ? 1 : 0} />
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
            Welcome back, {firstName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isDemo ? '#4ADE80' : '#F5C800',
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              {isDemo
                ? "You're Live & Visible in Sandton."
                : 'Profile active. Live provider visibility is not connected yet.'}
            </span>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          <div className="card">
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--teal), var(--navy))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                {initials}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18 }}>
                  {provider.name}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {provider.trade}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-teal">
                    {isDemo ? 'Active Tier' : 'Real Account'}
                  </span>
                  <span className="badge badge-green">
                    ✓ {isDemo ? 'ID Verified' : 'Profile Linked'}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <RatingStars rating={provider.rating} size={12} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {statCards.map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  textAlign: 'center',
                  cursor: i === 0 ? 'pointer' : undefined,
                }}
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
              <span className={`badge ${isDemo ? 'badge-green' : 'badge-gray'}`}>
                {isDemo ? '● Live & Visible' : '● Basic Setup'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Response Time</span>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: isDemo ? 'var(--green)' : 'var(--text-muted)',
                }}
              >
                {isDemo ? 'Excellent' : 'No data yet'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Subscription</span>
              <span className={`badge ${isDemo ? 'badge-teal' : 'badge-gray'}`}>
                {isDemo ? 'Free Tier' : 'Not loaded yet'}
              </span>
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
                {isDemo ? `${provider.rankScore}/100` : '0/100'}
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
              {pendingJobsCount}
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
            <div className="section-title">Available Leads</div>
            {!isDemo ? (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Live provider leads are not connected yet. Real nearby requests will appear here once
                your provider-side data flow is wired up.
              </div>
            ) : pendingJobsCount === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                No new leads right now. Check back soon.
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You currently have {pendingJobsCount} new request{pendingJobsCount === 1 ? '' : 's'} available.
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-title">Tips to Rank Higher</div>
            {rankingFactors.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBottom: i < rankingFactors.length - 1 ? 10 : 0,
                }}
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

          <div className="card">
            <div className="section-title">My Jobs</div>
            {myJobsCount === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You don’t have any provider jobs yet.
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                You currently have {myJobsCount} assigned job{myJobsCount === 1 ? '' : 's'}.
              </div>
            )}
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

          <button
            className="btn btn-full"
            style={{
              background: 'var(--red-light)',
              color: 'var(--red-panic)',
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
              border: '2px solid var(--red-panic)',
              borderRadius: 'var(--radius-sm)',
              padding: '13px',
              fontSize: 14,
              cursor: 'pointer',
              marginTop: 8,
            }}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </div>

      <ProviderNav />
    </div>
  );
}