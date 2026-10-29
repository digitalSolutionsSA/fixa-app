import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Briefcase, Star, X, Search, ImageOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { workPhotoUrl } from '../lib/workPhotos';
import { RatingStars, Avt } from './Shared';
import type { Provider } from '../types';

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
  work_photos: string[] | null;
};

type ReviewRow = { id: string; rating: number; comment: string | null; created_at: string };

/**
 * Bottom-sheet pop-up with a provider's previous work, details and reviews.
 * Pass onBook to show "Book" / "Keep looking"; without it the sheet only has a close action.
 */
export const ProviderDetailsSheet: React.FC<{
  provider: Provider;
  onClose: () => void;
  onBook?: () => void;
}> = ({ provider: p, onClose, onBook }) => {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Fetch separately so a missing work_photos column can't hide the rest of the profile.
    Promise.all([
      supabase
        .from('profiles')
        .select('full_name, trade, trade_other, bio, area, price_from, rating, job_count, available, avatar_url')
        .eq('id', p.id)
        .maybeSingle(),
      supabase.from('profiles').select('work_photos').eq('id', p.id).maybeSingle(),
      supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('provider_id', p.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ]).then(([profRes, workRes, revRes]) => {
      if (cancelled) return;
      const prof = profRes.data as ProfileRow | null;
      setProfile(prof ? { ...prof, work_photos: (workRes.data?.work_photos as string[]) || [] } : null);
      setReviews((revRes.data as ReviewRow[]) ?? []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [p.id]);

  // Close on Escape (keyboard / desktop preview)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') (viewing ? setViewing(null) : onClose()); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, viewing]);

  const name      = profile?.full_name || p.name;
  const trade     = profile?.trade === 'Other' && profile?.trade_other ? profile.trade_other : (profile?.trade || p.trade);
  const rating    = Number(profile?.rating ?? p.rating ?? 0);
  const jobCount  = profile?.job_count ?? p.jobCount ?? 0;
  const priceFrom = Number(profile?.price_from ?? p.priceFrom ?? 0);
  const available = profile?.available ?? p.available;
  const photos    = (profile?.work_photos || []).map(workPhotoUrl);
  const firstName = name.split(' ')[0];

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'fadeIn 0.2s ease both' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${name} profile`}
        style={{ width: '100%', maxWidth: 520, maxHeight: '88vh', background: 'var(--bg, #f5f7fa)', borderRadius: '22px 22px 0 0', display: 'flex', flexDirection: 'column', animation: 'sheetUp 0.28s cubic-bezier(.2,.8,.2,1) both', boxShadow: '0 -8px 30px rgba(0,0,0,0.2)' }}
      >
        {/* Grab handle + close */}
        <div style={{ position: 'relative', padding: '10px 16px 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--border)', margin: '0 auto' }} />
          <button onClick={onClose} aria-label="Close"
            style={{ position: 'absolute', top: 8, right: 12, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--card, white)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={17} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '6px 16px 12px', display: 'flex', flexDirection: 'column', gap: 12, WebkitOverflowScrolling: 'touch' }}>
          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              : <Avt initials={p.initials} size={64} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 20, color: 'var(--text-primary)' }}>{name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                <span className="badge badge-gray" style={{ fontSize: 11 }}>{trade}</span>
                {available
                  ? <span className="badge badge-teal" style={{ fontSize: 11 }}>● Available</span>
                  : <span className="badge badge-gray" style={{ fontSize: 11 }}>Unavailable</span>}
              </div>
              {(profile?.area || p.distance !== '—') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>
                  <MapPin size={12} color="var(--teal)" style={{ flexShrink: 0 }} />
                  <span>{[profile?.area, p.distance !== '—' ? `${p.distance} away` : ''].filter(Boolean).join(' · ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', padding: '12px 8px', margin: 0 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {rating > 0 ? <RatingStars rating={rating} size={15} /> : <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800 }}>New</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Rating</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{jobCount}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Jobs done</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{priceFrom > 0 ? `R${priceFrom}` : '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>Call-out from</div>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24, margin: 0 }}>
              <Loader2 size={18} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading profile…</span>
            </div>
          ) : (
            <>
              {/* Previous work */}
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Previous work</div>
                {photos.length ? (
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4, margin: '0 -16px', padding: '0 16px 4px' }}>
                    {photos.map((u) => (
                      <button key={u} onClick={() => setViewing(u)}
                        style={{ flex: photos.length === 1 ? '1 0 100%' : '0 0 78%', aspectRatio: '4 / 3', padding: 0, border: 'none', borderRadius: 14, overflow: 'hidden', scrollSnapAlign: 'start', cursor: 'pointer', background: 'var(--border)' }}>
                        <img src={u} alt="Previous work" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, padding: 14, color: 'var(--text-muted)', fontSize: 13 }}>
                    <ImageOff size={18} /> No photos of previous work yet.
                  </div>
                )}
              </div>

              {/* About */}
              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>About {firstName}</div>
                <div style={{ fontSize: 13, color: profile?.bio ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {profile?.bio || 'This provider hasn\'t added a description yet.'}
                </div>
              </div>

              {/* Reviews */}
              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>Reviews</div>
                {reviews.length === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No reviews yet.</div>
                ) : reviews.map((r, i) => (
                  <div key={r.id} style={{ padding: '7px 0', borderTop: i ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} fill="var(--yellow)" color="var(--yellow)" />
                      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12 }}>{Number(r.rating).toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{new Date(r.created_at).toLocaleDateString('en-ZA')}</span>
                    </div>
                    {r.comment && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{r.comment}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ flexShrink: 0, padding: '10px 16px calc(env(safe-area-inset-bottom) + 14px)', borderTop: '1px solid var(--border)', background: 'var(--card, white)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {onBook ? (
            <>
              <button className="btn btn-primary btn-full btn-lg" disabled={!available} onClick={onBook} style={{ gap: 8 }}>
                <Briefcase size={18} /> {available ? `Book ${firstName}` : 'Currently unavailable'}
              </button>
              <button className="btn btn-secondary btn-full" onClick={onClose} style={{ gap: 8 }}>
                <Search size={16} /> Keep looking
              </button>
            </>
          ) : (
            <button className="btn btn-secondary btn-full" onClick={onClose}>Close</button>
          )}
        </div>
      </div>

      {/* Full-screen photo */}
      {viewing && (
        <div onClick={(e) => { e.stopPropagation(); setViewing(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <img src={viewing} alt="Previous work" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={() => setViewing(null)} aria-label="Close photo"
            style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 12px)', right: 16, width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={22} color="white" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
