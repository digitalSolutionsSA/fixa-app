import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Briefcase, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import type { Screen } from '../../types';

// Category list each trade came from, so "back" returns to the right list.
const TRADE_SCREEN: Record<string, Screen> = {
  Plumber: 'plumber-screen',
  Electrician: 'electrician-screen',
  Mechanic: 'mechanic-screen',
  'Pool Services': 'pool-services-screen',
  Security: 'security-screen',
  Solar: 'solar-screen',
  Renovation: 'renovation-screen',
  Printing: 'printing-screen',
  Other: 'other-screen',
};

type ProfileRow = {
  full_name: string | null;
  trade: string | null;
  trade_other: string | null;
  bio: string | null;
  area: string | null;
  price_from: number | null;
  rating: number | null;
  job_count: number | null;
  available: boolean | null;
  avatar_url: string | null;
};

type ReviewRow = { id: string; rating: number; comment: string | null; created_at: string };

export const ProviderDetailsScreen: React.FC = () => {
  const { navigate, selectedProvider, isDemo } = useApp();
  const p = selectedProvider;

  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo || !p?.id) { setLoading(false); return; }
    Promise.all([
      supabase
        .from('profiles')
        .select('full_name, trade, trade_other, bio, area, price_from, rating, job_count, available, avatar_url')
        .eq('id', p.id)
        .maybeSingle(),
      supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('provider_id', p.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ]).then(([profRes, revRes]) => {
      setProfile((profRes.data as ProfileRow) ?? null);
      setReviews((revRes.data as ReviewRow[]) ?? []);
      setLoading(false);
    });
  }, [p?.id, isDemo]);

  const back: Screen = (p && TRADE_SCREEN[p.trade]) || 'find-provider';

  if (!p) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppHeader title="Provider" back="consumer-home" />
        <div className="screen"><div className="screen-content">
          <div className="empty-state">No provider selected.</div>
        </div></div>
        <ConsumerNav />
      </div>
    );
  }

  const name      = profile?.full_name || p.name;
  const trade     = profile?.trade === 'Other' && profile?.trade_other ? profile.trade_other : (profile?.trade || p.trade);
  const rating    = Number(profile?.rating ?? p.rating ?? 0);
  const jobCount  = profile?.job_count ?? p.jobCount ?? 0;
  const priceFrom = Number(profile?.price_from ?? p.priceFrom ?? 0);
  const available = profile?.available ?? p.available;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Provider Profile" back={back} />

      <div className="screen">
        <div className="screen-content">
          {/* Header card */}
          <div className="card animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover' }} />
              : <Avt initials={p.initials} size={76} />}
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20 }}>{name}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span className="badge badge-gray" style={{ fontSize: 11 }}>{trade}</span>
              {available
                ? <span className="badge badge-teal" style={{ fontSize: 11 }}>● Available</span>
                : <span className="badge badge-gray" style={{ fontSize: 11 }}>Unavailable</span>}
            </div>
            {(profile?.area || p.distance !== '—') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)' }}>
                <MapPin size={13} color="var(--teal)" />
                {profile?.area}{profile?.area && p.distance !== '—' && ' · '}{p.distance !== '—' && `${p.distance} away`}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="card d1 animate-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '14px 8px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {rating > 0 ? <RatingStars rating={rating} size={15} /> : <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800 }}>—</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Rating</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{jobCount}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Jobs done</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{priceFrom > 0 ? `R${priceFrom}` : '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>From</div>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 }}>
              <Loader2 size={18} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading profile…</span>
            </div>
          ) : (
            <>
              {profile?.bio && (
                <div className="card d2 animate-in">
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>About</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{profile.bio}</div>
                </div>
              )}

              <div className="card d2 animate-in">
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Reviews</div>
                {reviews.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No reviews yet.</div>
                ) : reviews.map((r) => (
                  <div key={r.id} style={{ padding: '6px 0', borderTop: '1px solid var(--border, #eee)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} fill="var(--yellow)" color="var(--yellow)" />
                      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12 }}>{Number(r.rating).toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    {r.comment && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{r.comment}</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          <button className="btn btn-primary btn-full btn-lg" disabled={!available} onClick={() => navigate('book-job')} style={{ gap: 8 }}>
            <Briefcase size={18} /> {available ? `Book ${name.split(' ')[0]}` : 'Currently unavailable'}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};
