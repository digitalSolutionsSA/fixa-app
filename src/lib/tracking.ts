import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { supabase } from './supabase';

// Live tracking of a provider on the way to a job (see supabase-live-tracking.sql).

export type ProviderLocation = {
  job_id: string;
  provider_id: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  accuracy: number | null;
  updated_at: string;
};

export const TRACKING_CHANGED_EVENT = 'fixa:tracking-changed';

/** Tell the app-wide location sharer to re-check which job (if any) to share for. */
export function notifyTrackingChanged() {
  window.dispatchEvent(new Event(TRACKING_CHANGED_EVENT));
}

export async function markOnTheWay(jobId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('jobs').update({ en_route_at: new Date().toISOString() }).eq('id', jobId);
  if (!error) notifyTrackingChanged();
  return { error: error?.message ?? null };
}

export async function markArrived(jobId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('jobs').update({ arrived_at: new Date().toISOString() }).eq('id', jobId);
  if (!error) notifyTrackingChanged();
  return { error: error?.message ?? null };
}

export async function getProviderLocation(jobId: string): Promise<ProviderLocation | null> {
  const { data } = await supabase.from('provider_locations').select('*').eq('job_id', jobId).maybeSingle();
  return (data as ProviderLocation) ?? null;
}

export function subscribeToProviderLocation(jobId: string, onChange: (loc: ProviderLocation | null) => void): () => void {
  const channel = supabase
    .channel(`track-${jobId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'provider_locations', filter: `job_id=eq.${jobId}` },
      (payload) => onChange(payload.eventType === 'DELETE' ? null : (payload.new as ProviderLocation))
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

/** Rough driving ETA from straight-line distance (roads ~35% longer, ~35 km/h average in town). */
export function estimateEtaMinutes(km: number): number {
  return Math.max(1, Math.round(((km * 1.35) / 35) * 60));
}

/** Opens turn-by-turn directions to an address in the phone's maps app. */
export function openDirections(address: string) {
  const q = encodeURIComponent(address);
  const url = Capacitor.getPlatform() === 'ios'
    ? `https://maps.apple.com/?daddr=${q}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
  window.open(url, '_system');
}

// ── Provider-side sharing (one job at a time) ────────────────────────────────

const MIN_INTERVAL_MS = 5000;   // push at most every 5s…
const MIN_MOVE_M = 20;          // …unless moved at least 20m since the last push

let watchId: string | null = null;
let sharingJobId: string | null = null;
let lastPush: { t: number; lat: number; lng: number } | null = null;

function metersBetween(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function currentlySharingJobId() {
  return sharingJobId;
}

export async function startSharingLocation(jobId: string, providerId: string): Promise<{ error: string | null }> {
  if (sharingJobId === jobId && watchId) return { error: null };
  await stopSharingLocation();

  const perm = await Geolocation.requestPermissions().catch(() => null);
  if (!perm || perm.location === 'denied') {
    return { error: 'Location permission is off. Turn it on in Settings so the customer can follow you.' };
  }

  sharingJobId = jobId;
  lastPush = null;
  watchId = await Geolocation.watchPosition(
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 3000 },
    async (pos) => {
      if (!pos || sharingJobId !== jobId) return;
      const { latitude, longitude, heading, accuracy } = pos.coords;
      const now = Date.now();
      if (lastPush) {
        const moved = metersBetween(lastPush.lat, lastPush.lng, latitude, longitude);
        if (now - lastPush.t < MIN_INTERVAL_MS && moved < MIN_MOVE_M) return;
      }
      lastPush = { t: now, lat: latitude, lng: longitude };
      const { error } = await supabase.from('provider_locations').upsert({
        job_id: jobId,
        provider_id: providerId,
        latitude,
        longitude,
        heading: heading ?? null,
        accuracy: accuracy ?? null,
        updated_at: new Date().toISOString(),
      });
      // RLS rejects once the job is no longer "on the way" → stop quietly.
      if (error) stopSharingLocation();
    }
  );
  return { error: null };
}

export async function stopSharingLocation() {
  if (watchId) {
    await Geolocation.clearWatch({ id: watchId }).catch(() => {});
  }
  watchId = null;
  sharingJobId = null;
  lastPush = null;
}
