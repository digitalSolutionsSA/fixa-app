import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import { supabase } from '../../lib/supabase';
import { createJob } from '../../lib/jobs';
import { inputStyle, labelStyle } from '../provider/constants';

const JOB_TYPES = [
  'Burst pipe / leak',
  'Blocked drain',
  'Geyser problem',
  'Electrical fault',
  'No power / tripped breaker',
  'Light installation',
  'Car service / maintenance',
  'Tyre change',
  'General repairs',
  'Other',
];

export const BookJobScreen: React.FC = () => {
  const { navigate, selectedProvider, currentUser, isDemo } = useApp();

  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const p = selectedProvider;

  // Pre-fill location from profile
  useEffect(() => {
    if (currentUser?.id && !isDemo) {
      supabase
        .from('profiles')
        .select('area')
        .eq('id', currentUser.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.area) setLocation(data.area);
        });
    }
  }, [currentUser?.id, isDemo]);

  const handleSubmit = async () => {
    setError('');

    if (!jobTitle) { setError('Please select a job type.'); return; }
    if (!location.trim()) { setError('Please enter your location.'); return; }
    if (!p) { setError('No provider selected.'); return; }
    if (!currentUser) { setError('You must be logged in.'); return; }

    if (isDemo) {
      setDone(true);
      setTimeout(() => navigate('consumer-bookings'), 1800);
      return;
    }

    setSubmitting(true);
    const { error: jobError } = await createJob({
      consumer_id:    currentUser.id,
      provider_id:    p.id,
      consumer_name:  currentUser.name,
      provider_name:  p.name,
      provider_trade: p.trade,
      title:          jobTitle,
      description:    description.trim(),
      location:       location.trim(),
      price:          p.priceFrom,
    });
    setSubmitting(false);

    if (jobError) { setError(jobError); return; }

    setDone(true);
    setTimeout(() => navigate('consumer-bookings'), 1800);
  };

  if (!p) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Request a Job" back="find-provider" />
        <div className="screen"><div className="screen-content">
          <div className="empty-state">
            <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>No provider selected.</div>
            <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
          </div>
        </div></div>
        <ConsumerNav />
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Request a Job" back="find-provider" />
        <div className="screen"><div className="screen-content">
          <div className="empty-state scale-pop" style={{ minHeight: 340 }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={50} color="var(--green)" />
            </div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22 }}>Request Sent!</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 280 }}>
              {p.name} will review your request and accept or decline shortly.
            </div>
          </div>
        </div></div>
        <ConsumerNav />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Request a Job" back="find-provider" />

      <div className="screen">
        <div className="screen-content">

          {/* Provider summary */}
          <div className="card animate-in" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avt initials={p.initials} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{p.trade}</div>
              {p.rating > 0 && <RatingStars rating={p.rating} size={12} />}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>R{p.priceFrom}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>call-out rate</div>
            </div>
          </div>

          {/* Job type */}
          <div className="card d1 animate-in">
            <label style={labelStyle}>What do you need? *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setJobTitle(type)}
                  style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: 13,
                    fontFamily: 'var(--font-head)', fontWeight: 600, cursor: 'pointer',
                    border: jobTitle === type ? '2px solid var(--teal)' : '1.5px solid var(--border)',
                    background: jobTitle === type ? 'var(--teal-light)' : 'var(--card)',
                    color: jobTitle === type ? 'var(--teal)' : 'var(--text-secondary)',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card d2 animate-in">
            <label style={labelStyle}>Describe the problem (optional)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              placeholder="E.g. Bathroom sink has been dripping for 3 days…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="card d3 animate-in">
            <label style={labelStyle}>Your location *</label>
            <input
              style={inputStyle}
              placeholder="e.g. 12 Oak Street, Vanderbijlpark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Price note */}
          <div className="card d4 animate-in" style={{ background: 'var(--teal-light)', border: '1px solid rgba(0,168,150,0.2)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--teal)', marginBottom: 4 }}>
              In-App Payment Only
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The R{p.priceFrom} call-out rate is the minimum. Final price is agreed between you and the provider. Payment is processed through FIXA — never pay cash.
            </div>
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13, color: '#B91C1C' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ gap: 10 }}
          >
            {submitting
              ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending…</>
              : 'Send Job Request'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            The provider will accept or decline within their response window. You won't be charged until the job is completed.
          </p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};
