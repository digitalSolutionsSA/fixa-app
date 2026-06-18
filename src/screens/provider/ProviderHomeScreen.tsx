import React, { useEffect, useState } from 'react';
import { ChevronRight, Check, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NotifBell, ProviderNav } from '../../components/Shared';
import { getProviderStats } from '../../lib/jobs';

export const ProviderHomeScreen: React.FC = () => {
  const { navigate, currentUser, isDemo } = useApp();

  const [newJobs,        setNewJobs]        = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [rating,         setRating]         = useState(0);
  const [statsLoaded,    setStatsLoaded]    = useState(false);

  const resolvedName = currentUser?.name || 'Provider';

  useEffect(() => {
    if (isDemo || !currentUser?.id) { setStatsLoaded(true); return; }
    getProviderStats(currentUser.id).then((s) => {
      setNewJobs(s.newJobs);
      setWeeklyEarnings(s.weeklyEarnings);
      setRating(s.rating);
      setStatsLoaded(true);
    });
  }, [currentUser?.id, isDemo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--teal)', padding: '16px 20px 22px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <div className="logo-wrap">
            <span className="logo-main">FI<span className="logo-x">X</span>A</span>
            <span className="logo-sub">by PUBLICON</span>
          </div>
          <NotifBell count={newJobs} />
        </div>

        <div style={{ maxWidth: 700, margin: '14px auto 0', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'white' }}>
            Welcome, {resolvedName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              {statsLoaded && newJobs > 0
                ? `You have ${newJobs} new job request${newJobs > 1 ? 's' : ''} waiting.`
                : 'Your profile is live. New activity will appear here.'}
            </span>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { val: String(newJobs),              label: 'New Requests', color: 'var(--red-panic)',    onClick: () => navigate('provider-job-request') },
              { val: `R${weeklyEarnings.toFixed(0)}`, label: 'This Week',  color: 'var(--teal)',        onClick: () => navigate('provider-earnings') },
              { val: rating > 0 ? rating.toFixed(1) : '—', label: 'Rating', color: 'var(--yellow-dark)', onClick: undefined },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center', cursor: s.onClick ? 'pointer' : undefined }} onClick={s.onClick}>
                <div className="stat-num" style={{ color: s.color, textAlign: 'center' }}>{s.val}</div>
                <div className="stat-label" style={{ textAlign: 'center' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Account status */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15 }}>Account Status</div>
              <span className="badge badge-green">● Live &amp; Visible</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Response Time</span>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14, color: 'var(--text-muted)' }}>No data yet</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Subscription</span>
              <span className="badge badge-teal">Free Tier</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Provider Score</span>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, color: 'var(--teal)' }}>
                {rating > 0 ? `${(rating * 20).toFixed(0)}/100` : '0/100'}
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <button
            className="btn btn-primary btn-full btn-lg"
            style={{ position: 'relative', fontSize: 16 }}
            onClick={() => navigate('provider-job-request')}
          >
            New Job Requests
            {newJobs > 0 && (
              <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '2px 8px', fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 13 }}>
                {newJobs}
              </span>
            )}
          </button>

          <button className="btn btn-secondary btn-full" style={{ fontSize: 15 }} onClick={() => navigate('provider-jobs')}>
            Current Jobs <ChevronRight size={16} />
          </button>

          {/* Tips */}
          <div className="card">
            <div className="section-title">Tips to Get Started</div>
            {[
              'Complete your profile details',
              'Upload your verification documents',
              'Respond quickly when requests arrive',
              'Collect great reviews from completed jobs',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: i < 3 ? 10 : 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="white" />
                </div>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14 }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Emergency */}
          <button
            style={{ background: 'linear-gradient(135deg, #c0392b, var(--red-panic))', border: 'none', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer', boxShadow: '0 4px 16px rgba(229,62,62,0.3)' }}
            onClick={() => navigate('provider-profile')}
          >
            <AlertTriangle size={22} color="white" />
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, color: 'white' }}>
              Emergency? Tap for help →
            </span>
          </button>
        </div>
      </div>

      <ProviderNav />
    </div>
  );
};
