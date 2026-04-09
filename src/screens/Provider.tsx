import React, { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  ChevronRight,
  Check,
  Star,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Briefcase,
  Pencil,
  FileText,
  CreditCard,
  Bell,
  Lock,
  Scale,
  HelpCircle,
  Mail,
  Phone,
  Camera,
  Save,
  Shield,
  Download,
  Upload,
  X,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AppHeader, ProviderNav, RatingStars, Avt, NotifBell } from '../components/Shared';

// ── Shared empty/default data ─────────────────────────────────────────────────
const EMPTY_NEW_JOBS: Array<{
  id: string;
  title: string;
  customer: string;
  location: string;
  distance: string;
  price: number;
  urgent: boolean;
  desc: string;
}> = [];

const EMPTY_ACTIVE_JOBS: Array<{
  t: string;
  c: string;
  l: string;
  km: string;
  p: number;
  urg: boolean;
}> = [];

const EMPTY_DONE_JOBS: Array<{
  t: string;
  c: string;
  l: string;
  km: string;
  p: number;
  urg: boolean;
}> = [];

const EMPTY_RECENT_JOBS: Array<{
  n: string;
  s: string;
  w: string;
  d: string;
  p: number;
  r: number;
}> = [];

const EMPTY_VERIFICATION_DOCS = [
  { name: 'South African ID', status: 'Not uploaded', note: 'Upload your ID to begin verification' },
  { name: 'Trade Certificate', status: 'Not uploaded', note: 'Upload your trade certificate if applicable' },
  { name: 'Proof of Address', status: 'Not uploaded', note: 'Upload a recent proof of address' },
];

const EMPTY_EARNINGS_BARS = [
  { l: 'Mon', h: 0 },
  { l: 'Tue', h: 0 },
  { l: 'Wed', h: 0 },
  { l: 'Thu', h: 0 },
  { l: 'Fri', h: 0 },
  { l: 'Sat', h: 0 },
  { l: 'Sun', h: 0 },
];

// ── Provider Home ─────────────────────────────────────────────────────────────
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

// ── Provider Job Request ───────────────────────────────────────────────────────
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

// ── Provider Jobs ─────────────────────────────────────────────────────────────
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

// ── Provider Earnings ─────────────────────────────────────────────────────────
export const ProviderEarningsScreen: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const bars = EMPTY_EARNINGS_BARS;

  const totals = { week: '0', month: '0', all: '0' };
  const jobNums = { week: '0', month: '0', all: '0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Earnings Dashboard" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>
              This Week
            </button>
            <button className={`tab-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>
              Month
            </button>
            <button className={`tab-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>
              All-Time
            </button>
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 900,
                fontSize: 40,
                color: 'var(--text-primary)',
              }}
            >
              R{totals[period]}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Total Earnings
            </div>

            <div className="earn-bars-row">
              {bars.map((b) => (
                <div key={b.l} className="earn-bar">
                  <div className={`earn-bar-fill ${b.h === 0 ? '' : ''}`} style={{ height: b.h }} />
                  <span className="earn-bar-label">{b.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { icon: <Briefcase size={18} color="var(--teal)" />, label: 'Jobs Done', val: jobNums[period] },
              { icon: <Star size={18} color="var(--yellow-dark)" />, label: 'Avg Rating', val: '0.0' },
              { icon: <DollarSign size={18} color="var(--green)" />, label: 'Platform Fee', val: '3.5%' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                <div className="stat-num" style={{ textAlign: 'center', fontSize: 22 }}>
                  {s.val}
                </div>
                <div className="stat-label" style={{ textAlign: 'center' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="section-title">Recent Jobs</div>

          {EMPTY_RECENT_JOBS.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <Briefcase size={34} color="var(--text-muted)" />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, marginTop: 10 }}>
                No earnings yet
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Completed in-app jobs will appear here once you start working.
              </div>
            </div>
          )}

          <div
            style={{
              background: 'var(--teal-light)',
              border: '1px solid var(--teal)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--teal)',
                marginBottom: 4,
              }}
            >
              💳 Platform Fee
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A 3.5% fee is auto-deducted from each completed in-app paid job. Off-app payments
              receive no platform benefits or dispute support.
            </p>
          </div>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Ranking ──────────────────────────────────────────────────────────
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

type ProfileSection =
  | 'menu'
  | 'edit-profile'
  | 'verification'
  | 'billing'
  | 'notifications'
  | 'privacy'
  | 'legal'
  | 'support';

type NotificationPrefs = {
  newRequests: boolean;
  jobUpdates: boolean;
  payoutAlerts: boolean;
  rankingUpdates: boolean;
  marketing: boolean;
};

type ProviderProfileForm = {
  fullName: string;
  trade: string;
  phone: string;
  email: string;
  bio: string;
  area: string;
};

const sectionTitleMap: Record<Exclude<ProfileSection, 'menu'>, string> = {
  'edit-profile': 'Edit Profile',
  verification: 'Verification Documents',
  billing: 'Subscription & Billing',
  notifications: 'Notifications',
  privacy: 'Privacy & Data (POPIA)',
  legal: 'Legal Disclaimers',
  support: 'Help & Support',
};

const menuButtonStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  cursor: 'pointer',
  border: 'none',
  textAlign: 'left',
  transition: 'box-shadow 0.2s',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 14px',
  fontSize: 14,
  color: 'var(--text-primary)',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-head)',
  fontWeight: 700,
  fontSize: 13,
  marginBottom: 8,
  color: 'var(--text-primary)',
};

const rowBetween: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
};

const statCardGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3,1fr)',
  gap: 10,
};

const plans = [
  {
    name: 'Free Tier',
    price: 'R0/mo',
    current: true,
    features: ['Basic profile access', 'Standard support'],
  },
  {
    name: 'Pro Tier',
    price: 'Coming soon',
    current: false,
    features: ['Ranking boost', 'Priority support', 'Featured placement'],
  },
];

function ProfileMenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="card"
      style={menuButtonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26 }}>
        {icon}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15 }}>
        {label}
      </span>
      <ChevronRight size={16} color="var(--text-muted)" />
    </button>
  );
}

function BackSectionHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="card" style={{ padding: '12px 14px' }}>
      <button
        onClick={onBack}
        style={{
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 0,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <ChevronRight
          size={18}
          color="var(--text-muted)"
          style={{ transform: 'rotate(180deg)' }}
        />
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
          {title}
        </span>
      </button>
    </div>
  );
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={rowBetween}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
            {desc}
          </div>
        </div>

        <button
          onClick={onChange}
          style={{
            width: 54,
            height: 30,
            borderRadius: 999,
            border: 'none',
            background: checked ? 'var(--teal)' : 'var(--border)',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: checked ? 27 : 3,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          />
        </button>
      </div>
    </div>
  );
}

const getInitials = (name?: string) =>
  (name || 'P')
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

const resolveUserName = (user: any) =>
  user?.name || user?.fullName || user?.full_name || user?.user_metadata?.full_name || '';

const resolveUserPhone = (user: any) =>
  user?.phone || user?.phoneNumber || user?.phone_number || user?.user_metadata?.phone || '';

const resolveUserEmail = (user: any) =>
  user?.email || user?.user_metadata?.email || '';

// ── Provider Profile ──────────────────────────────────────────────────────────
export const ProviderProfileScreen: React.FC = () => {
  const { navigate, setMode, user } = useApp() as any;

  const resolvedName = resolveUserName(user);
  const resolvedPhone = resolveUserPhone(user);
  const resolvedEmail = resolveUserEmail(user);

  const [section, setSection] = useState<ProfileSection>('menu');
  const [saveMessage, setSaveMessage] = useState('');

  const [profile, setProfile] = useState<ProviderProfileForm>({
    fullName: '',
    trade: '',
    phone: '',
    email: '',
    bio: '',
    area: '',
  });

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      fullName: resolvedName || prev.fullName || '',
      trade: prev.trade || '',
      phone: resolvedPhone || prev.phone || '',
      email: resolvedEmail || prev.email || '',
      bio: prev.bio || '',
      area: prev.area || '',
    }));
  }, [resolvedName, resolvedPhone, resolvedEmail]);

  const [verificationDocs, setVerificationDocs] = useState(EMPTY_VERIFICATION_DOCS);

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    newRequests: true,
    jobUpdates: true,
    payoutAlerts: true,
    rankingUpdates: true,
    marketing: false,
  });

  const [currentPlan, setCurrentPlan] = useState('Free Tier');

  const stats = useMemo(
    () => [
      { v: '0', l: 'Jobs' },
      { v: '0.0', l: 'Rating' },
      { v: '0', l: 'Score' },
    ],
    []
  );

  const showSaved = (message: string) => {
    setSaveMessage(message);
    window.setTimeout(() => setSaveMessage(''), 2200);
  };

  const updateProfileField = (key: keyof ProviderProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNotification = (key: keyof NotificationPrefs) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const simulateUpload = (docName: string) => {
    setVerificationDocs((prev) =>
      prev.map((doc) =>
        doc.name === docName ? { ...doc, status: 'Pending', note: 'Uploaded. Awaiting review' } : doc
      )
    );
    showSaved(`${docName} uploaded for review`);
  };

  const renderMenu = () => (
    <>
      <div style={statCardGridStyle}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
            <div
              className="stat-num"
              style={{ color: 'var(--teal)', textAlign: 'center', fontSize: 20 }}
            >
              {s.v}
            </div>
            <div className="stat-label" style={{ textAlign: 'center' }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <ProfileMenuButton
        icon={<Pencil size={20} color="#f59e0b" />}
        label="Edit Profile"
        onClick={() => setSection('edit-profile')}
      />
      <ProfileMenuButton
        icon={<FileText size={20} color="#64748b" />}
        label="Verification Documents"
        onClick={() => setSection('verification')}
      />
      <ProfileMenuButton
        icon={<CreditCard size={20} color="#eab308" />}
        label="Subscription & Billing"
        onClick={() => setSection('billing')}
      />
      <ProfileMenuButton
        icon={<Star size={20} color="#0f766e" />}
        label="Ranking & Performance"
        onClick={() => navigate('provider-ranking')}
      />
      <ProfileMenuButton
        icon={<DollarSign size={20} color="#16a34a" />}
        label="Earnings History"
        onClick={() => navigate('provider-earnings')}
      />
      <ProfileMenuButton
        icon={<Briefcase size={20} color="#6b7280" />}
        label="Job History"
        onClick={() => navigate('provider-jobs')}
      />
      <ProfileMenuButton
        icon={<Bell size={20} color="#f59e0b" />}
        label="Notifications"
        onClick={() => setSection('notifications')}
      />
      <ProfileMenuButton
        icon={<Lock size={20} color="#ca8a04" />}
        label="Privacy & Data (POPIA)"
        onClick={() => setSection('privacy')}
      />
      <ProfileMenuButton
        icon={<Scale size={20} color="#6b7280" />}
        label="Legal Disclaimers"
        onClick={() => setSection('legal')}
      />
      <ProfileMenuButton
        icon={<HelpCircle size={20} color="#0f766e" />}
        label="Help & Support"
        onClick={() => setSection('support')}
      />

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
        onClick={() => {
          setMode(null);
          navigate('mode-select');
        }}
      >
        Sign Out
      </button>
    </>
  );

  const renderEditProfile = () => (
    <>
      <BackSectionHeader title={sectionTitleMap['edit-profile']} onBack={() => setSection('menu')} />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avt initials={getInitials(profile.fullName || resolvedName)} size={68} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
              Profile Photo
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
              Update your public provider avatar and identity photo.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <button className="btn btn-secondary" type="button">
            <Camera size={16} /> Change Photo
          </button>
          <button className="btn btn-secondary" type="button">
            <X size={16} /> Remove
          </button>
        </div>
      </div>

      <div className="card">
        <label style={labelStyle}>Full Name</label>
        <input
          style={inputStyle}
          value={profile.fullName}
          onChange={(e) => updateProfileField('fullName', e.target.value)}
        />

        <div style={{ height: 14 }} />

        <label style={labelStyle}>Trade / Category</label>
        <input
          style={inputStyle}
          value={profile.trade}
          onChange={(e) => updateProfileField('trade', e.target.value)}
          placeholder="e.g. Plumber, Electrician, Handyman"
        />

        <div style={{ height: 14 }} />

        <label style={labelStyle}>Phone</label>
        <div style={{ position: 'relative' }}>
          <Phone
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            style={{ ...inputStyle, paddingLeft: 38 }}
            value={profile.phone}
            onChange={(e) => updateProfileField('phone', e.target.value)}
          />
        </div>

        <div style={{ height: 14 }} />

        <label style={labelStyle}>Email</label>
        <div style={{ position: 'relative' }}>
          <Mail
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            style={{ ...inputStyle, paddingLeft: 38 }}
            value={profile.email}
            onChange={(e) => updateProfileField('email', e.target.value)}
          />
        </div>

        <div style={{ height: 14 }} />

        <label style={labelStyle}>Primary Service Area</label>
        <input
          style={inputStyle}
          value={profile.area}
          onChange={(e) => updateProfileField('area', e.target.value)}
          placeholder="e.g. Pretoria East"
        />

        <div style={{ height: 14 }} />

        <label style={labelStyle}>Bio</label>
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }}
          value={profile.bio}
          onChange={(e) => updateProfileField('bio', e.target.value)}
          placeholder="Tell customers a bit about your services and experience"
        />

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 16 }}
          onClick={() => showSaved('Profile updated successfully')}
        >
          <Save size={16} /> Save Changes
        </button>
      </div>
    </>
  );

  const renderVerification = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.verification} onBack={() => setSection('menu')} />

      <div className="card">
        <div className="section-title" style={{ marginBottom: 10 }}>
          Verification Status
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>
            Not verified yet
          </span>
          <span className="badge" style={{ background: 'rgba(148,163,184,0.12)', color: 'var(--text-muted)' }}>
            New Provider
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
          Upload your documents to start verification and improve trust on your profile. Bureaucracy,
          humanity’s favorite hobby.
        </div>
      </div>

      {verificationDocs.map((doc) => {
        const approved = doc.status === 'Approved';
        const pending = doc.status === 'Pending';

        return (
          <div key={doc.name} className="card">
            <div style={rowBetween}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                  {doc.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {doc.note}
                </div>
              </div>

              <span
                className="badge"
                style={{
                  background: approved
                    ? 'rgba(34,197,94,0.12)'
                    : pending
                    ? 'rgba(245,158,11,0.12)'
                    : 'rgba(148,163,184,0.12)',
                  color: approved ? 'var(--green)' : pending ? '#b45309' : 'var(--text-muted)',
                  fontSize: 11,
                }}
              >
                {doc.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <button className="btn btn-secondary" onClick={() => showSaved(`${doc.name} preview opened`)}>
                <Download size={16} /> View
              </button>
              <button className="btn btn-primary" onClick={() => simulateUpload(doc.name)}>
                <Upload size={16} /> Upload
              </button>
            </div>
          </div>
        );
      })}
    </>
  );

  const renderBilling = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.billing} onBack={() => setSection('menu')} />

      <div className="card">
        <div style={rowBetween}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
              Current Plan
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {currentPlan}
            </div>
          </div>
          <span className="badge badge-teal">Active</span>
        </div>

        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'var(--bg)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Billing status</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginTop: 4 }}>
            No monthly subscription charge
          </div>
        </div>
      </div>

      {plans.map((plan) => (
        <div
          key={plan.name}
          className="card"
          style={{
            border: plan.name === currentPlan ? '2px solid var(--teal)' : '1px solid var(--border)',
          }}
        >
          <div style={rowBetween}>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 16 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: 20, fontFamily: 'var(--font-head)', fontWeight: 900, marginTop: 4 }}>
                {plan.price}
              </div>
            </div>
            {plan.current && <span className="badge badge-teal">Current</span>}
          </div>

          <div style={{ marginTop: 12 }}>
            {plan.features.map((feature) => (
              <div key={feature} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Check size={14} color="var(--green)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{feature}</span>
              </div>
            ))}
          </div>

          <button
            className={plan.current ? 'btn btn-secondary btn-full' : 'btn btn-primary btn-full'}
            style={{ marginTop: 8 }}
            onClick={() => {
              if (!plan.current && plan.name !== 'Pro Tier') {
                setCurrentPlan(plan.name);
                showSaved(`${plan.name} selected`);
              } else if (plan.name === 'Pro Tier') {
                showSaved('Pro Tier is not available yet');
              } else {
                showSaved('You are already on this plan');
              }
            }}
          >
            {plan.current ? 'Current Plan' : plan.name === 'Pro Tier' ? 'Notify Me' : 'Switch Plan'}
          </button>
        </div>
      ))}

      <div className="card">
        <div className="section-title" style={{ marginBottom: 10 }}>
          Billing Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => showSaved('Invoice downloaded')}>
            <Download size={16} /> Invoice
          </button>
          <button className="btn btn-secondary" onClick={() => showSaved('Billing settings opened')}>
            <CreditCard size={16} /> Billing Settings
          </button>
        </div>
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.notifications} onBack={() => setSection('menu')} />

      <ToggleRow
        title="New job requests"
        desc="Get notified the moment a lead appears in your area."
        checked={notificationPrefs.newRequests}
        onChange={() => toggleNotification('newRequests')}
      />
      <ToggleRow
        title="Job updates"
        desc="Arrival changes, cancellations, and client status updates."
        checked={notificationPrefs.jobUpdates}
        onChange={() => toggleNotification('jobUpdates')}
      />
      <ToggleRow
        title="Payout alerts"
        desc="Payment received and earnings summary alerts."
        checked={notificationPrefs.payoutAlerts}
        onChange={() => toggleNotification('payoutAlerts')}
      />
      <ToggleRow
        title="Ranking updates"
        desc="Get notified when your provider score changes."
        checked={notificationPrefs.rankingUpdates}
        onChange={() => toggleNotification('rankingUpdates')}
      />
      <ToggleRow
        title="Marketing updates"
        desc="Promotions, feature launches and occasional platform news."
        checked={notificationPrefs.marketing}
        onChange={() => toggleNotification('marketing')}
      />

      <button className="btn btn-primary btn-full" onClick={() => showSaved('Notification preferences saved')}>
        <Save size={16} /> Save Preferences
      </button>
    </>
  );

  const renderPrivacy = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.privacy} onBack={() => setSection('menu')} />

      <div className="card">
        <div className="section-title">POPIA Data Controls</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Your profile data is used to match you with customers, verify your identity, process
          platform payments and support dispute resolution.
        </div>

        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Data export requested')}>
            <Download size={16} /> Request My Data Export
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Privacy preferences updated')}>
            <Lock size={16} /> Manage Consent
          </button>
          <button
            className="btn btn-full"
            style={{
              background: 'var(--red-light)',
              color: 'var(--red-panic)',
              border: '2px solid var(--red-panic)',
              fontFamily: 'var(--font-head)',
              fontWeight: 800,
            }}
            onClick={() => showSaved('Account deletion request submitted')}
          >
            <X size={16} /> Request Account Deletion
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Stored Data</div>
        {[
          'Identity and verification documents',
          'Public provider profile information',
          'Job history and ratings',
          'Billing and subscription records',
          'In-app support and dispute records',
        ].map((item) => (
          <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <Check size={14} color="var(--green)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderLegal = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.legal} onBack={() => setSection('menu')} />

      <div className="card">
        <div className="section-title">Provider Legal Summary</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            {
              title: 'Independent Contractor',
              body: 'Providers operate independently and are responsible for their own tools, travel, tax and service delivery.',
            },
            {
              title: 'Platform Fees',
              body: 'A 3.5% fee is deducted from qualifying in-app paid jobs for payment handling and platform services.',
            },
            {
              title: 'Dispute Handling',
              body: 'Only jobs managed and paid through the platform qualify for platform-backed dispute support.',
            },
            {
              title: 'Verification',
              body: 'Identity and document verification increase trust but do not guarantee work, ranking or legality of off-platform conduct.',
            },
          ].map((item) => (
            <div key={item.title} style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSupport = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.support} onBack={() => setSection('menu')} />

      <div className="card">
        <div className="section-title">Need help?</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Use one of the options below to contact support about billing, verification, customer
          disputes or technical issues.
        </div>

        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          <button className="btn btn-primary btn-full" onClick={() => showSaved('Support chat opened')}>
            <HelpCircle size={16} /> Start Support Chat
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Support email composer opened')}>
            <Mail size={16} /> Email Support
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Call support action opened')}>
            <Phone size={16} /> Call Support
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Common Help Topics</div>
        {[
          'How verification reviews work',
          'How provider score is calculated',
          'How subscription billing works',
          'What happens during a dispute',
        ].map((topic) => (
          <div key={topic} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <CheckCircle size={14} color="var(--teal)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{topic}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderSection = () => {
    switch (section) {
      case 'menu':
        return renderMenu();
      case 'edit-profile':
        return renderEditProfile();
      case 'verification':
        return renderVerification();
      case 'billing':
        return renderBilling();
      case 'notifications':
        return renderNotifications();
      case 'privacy':
        return renderPrivacy();
      case 'legal':
        return renderLegal();
      case 'support':
        return renderSupport();
      default:
        return renderMenu();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ background: 'var(--teal)', padding: '24px 20px 32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', maxWidth: 700, margin: '0 auto' }}>
          <Avt initials={getInitials(profile.fullName || resolvedName)} size={68} />
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'white' }}>
              {profile.fullName || resolvedName || 'Provider'}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {profile.trade || 'New Provider'}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
              <span
                className="badge"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}
              >
                New Account
              </span>
              <span
                className="badge"
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}
              >
                ★ 0.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {saveMessage && (
            <div
              className="card"
              style={{
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
              }}
            >
              <CheckCircle size={18} color="var(--teal)" />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                {saveMessage}
              </span>
            </div>
          )}

          {renderSection()}
        </div>
      </div>

      <ProviderNav />
    </div>
  );
};