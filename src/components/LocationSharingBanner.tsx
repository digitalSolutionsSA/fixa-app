import React, { useCallback, useEffect, useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import {
  TRACKING_CHANGED_EVENT, startSharingLocation, stopSharingLocation, markArrived,
} from '../lib/tracking';

type EnRouteJob = { id: string; consumer_name: string; title: string };

/**
 * App-wide for providers: while a job is "on the way", keeps sharing the phone's
 * location (on any screen) and shows a pill so the provider always knows.
 */
export const LocationSharingBanner: React.FC = () => {
  const { currentUser, mode, isDemo } = useApp();
  const [job, setJob] = useState<EnRouteJob | null>(null);
  const [error, setError] = useState('');
  const [arriving, setArriving] = useState(false);
  const providerId = mode === 'provider' && !isDemo ? currentUser?.id : undefined;

  const refresh = useCallback(async () => {
    if (!providerId) { setJob(null); stopSharingLocation(); return; }
    const { data } = await supabase
      .from('jobs')
      .select('id, consumer_name, title')
      .eq('provider_id', providerId)
      .eq('status', 'active')
      .not('en_route_at', 'is', null)
      .is('arrived_at', null)
      .order('en_route_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const next = (data as EnRouteJob) ?? null;
    setJob(next);
    if (next) {
      const { error: err } = await startSharingLocation(next.id, providerId);
      setError(err || '');
    } else {
      setError('');
      stopSharingLocation();
    }
  }, [providerId]);

  useEffect(() => {
    refresh();
    window.addEventListener(TRACKING_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(TRACKING_CHANGED_EVENT, refresh);
  }, [refresh]);

  useEffect(() => () => { stopSharingLocation(); }, []);

  if (!job) return null;

  const arrived = async () => {
    setArriving(true);
    const { error: err } = await markArrived(job.id);
    setArriving(false);
    if (err) setError(err);
  };

  return (
    <div style={{ position: 'fixed', left: 12, right: 12, top: 'calc(env(safe-area-inset-top) + 66px)', zIndex: 800, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{ pointerEvents: 'auto', maxWidth: 480, width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 8px 14px', borderRadius: 16, background: error ? '#B45309' : 'var(--navy, #0f2a3a)', color: 'white', boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}>
        <span style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#34D399', animation: 'sharePulse 1.6s ease-out infinite' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#34D399' }} />
        </span>
        <div style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: 1.3 }}>
          {error ? error : (
            <>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 13 }}>Sharing live location</div>
              <div style={{ opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.consumer_name} can follow you · {job.title}</div>
            </>
          )}
        </div>
        <button onClick={arrived} disabled={arriving}
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 12, border: 'none', background: 'white', color: 'var(--teal)', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
          {arriving ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Navigation size={14} />}
          I've arrived
        </button>
      </div>
      <style>{`@keyframes sharePulse { 0% { transform: scale(1); opacity: .8 } 100% { transform: scale(2.6); opacity: 0 } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
