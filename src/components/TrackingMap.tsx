import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronLeft, Clock, MapPin, Car, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getJob, type DbJob } from '../lib/jobs';
import { distanceKm, formatDistanceKm } from '../lib/location';
import {
  getProviderLocation, subscribeToProviderLocation, estimateEtaMinutes, type ProviderLocation,
} from '../lib/tracking';

const providerIcon = (initials: string) => L.divIcon({
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  html: `<div style="width:44px;height:44px;border-radius:50%;background:var(--teal,#1a8a8f);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:white;font:800 14px var(--font-head,sans-serif)">${initials}</div>`,
});

const homeIcon = L.divIcon({
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg></div>`,
});

function initials(name: string) {
  return name.trim().split(' ').map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
}

function agoLabel(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 30) return 'just now';
  if (s < 90) return '1 min ago';
  return `${Math.round(s / 60)} min ago`;
}

/** Customer's full-screen live map of the provider on the way. */
export const TrackingMap: React.FC<{ job: DbJob; onClose: () => void; onJobUpdated?: (j: DbJob) => void }> = ({ job: initialJob, onClose, onJobUpdated }) => {
  const [job, setJob] = useState(initialJob);
  const [loc, setLoc] = useState<ProviderLocation | null>(null);
  const [home, setHome] = useState<{ lat: number; lng: number } | null>(null);
  const [, tick] = useState(0);

  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const providerMarker = useRef<L.Marker | null>(null);
  const homeMarker = useRef<L.Marker | null>(null);
  const line = useRef<L.Polyline | null>(null);
  const fitted = useRef(false);

  // Map
  useEffect(() => {
    if (!mapEl.current || map.current) return;
    map.current = L.map(mapEl.current, { zoomControl: false, attributionControl: true }).setView([-26.2, 28.0], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map.current);
    setTimeout(() => map.current?.invalidateSize(), 50);
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  // Customer's saved location = where the provider is heading
  useEffect(() => {
    supabase.from('profiles').select('latitude, longitude').eq('id', job.consumer_id).maybeSingle()
      .then(({ data }) => {
        if (data?.latitude != null && data?.longitude != null) setHome({ lat: data.latitude, lng: data.longitude });
      });
  }, [job.consumer_id]);

  // Provider's live position
  useEffect(() => {
    getProviderLocation(job.id).then(setLoc);
    return subscribeToProviderLocation(job.id, setLoc);
  }, [job.id]);

  // Job status (on the way / arrived) + refresh "x min ago"
  useEffect(() => {
    const t = setInterval(async () => {
      tick((n) => n + 1);
      const fresh = await getJob(job.id);
      if (fresh) { setJob(fresh); onJobUpdated?.(fresh); }
    }, 15000);
    return () => clearInterval(t);
  }, [job.id, onJobUpdated]);

  // Draw markers / line
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (home) {
      if (!homeMarker.current) homeMarker.current = L.marker([home.lat, home.lng], { icon: homeIcon }).addTo(m);
      else homeMarker.current.setLatLng([home.lat, home.lng]);
    }
    if (loc) {
      const p: L.LatLngExpression = [loc.latitude, loc.longitude];
      if (!providerMarker.current) providerMarker.current = L.marker(p, { icon: providerIcon(initials(job.provider_name)), zIndexOffset: 1000 }).addTo(m);
      else providerMarker.current.setLatLng(p);
    } else if (providerMarker.current) {
      providerMarker.current.remove();
      providerMarker.current = null;
    }
    if (loc && home) {
      const pts: L.LatLngExpression[] = [[loc.latitude, loc.longitude], [home.lat, home.lng]];
      if (!line.current) line.current = L.polyline(pts, { color: '#1a8a8f', weight: 4, dashArray: '8 8', opacity: 0.8 }).addTo(m);
      else line.current.setLatLngs(pts);
    } else if (line.current) {
      line.current.remove();
      line.current = null;
    }
    // Frame both points once, then let the customer pan freely
    if (!fitted.current && (loc || home)) {
      if (loc && home) m.fitBounds(L.latLngBounds([[loc.latitude, loc.longitude], [home.lat, home.lng]]), { padding: [70, 70], maxZoom: 16 });
      else if (loc) m.setView([loc.latitude, loc.longitude], 15);
      else if (home) m.setView([home.lat, home.lng], 14);
      if (loc && home) fitted.current = true;
    }
  }, [loc, home, job.provider_name]);

  const first = job.provider_name.split(' ')[0];
  const km = loc && home ? distanceKm({ latitude: loc.latitude, longitude: loc.longitude }, { latitude: home.lat, longitude: home.lng }) : null;
  const eta = km != null ? estimateEtaMinutes(km) : null;
  const stale = loc ? Date.now() - new Date(loc.updated_at).getTime() > 2 * 60 * 1000 : false;

  let status: React.ReactNode;
  if (job.arrived_at) {
    status = <><CheckCircle size={20} color="var(--green)" /><div><strong>{first} has arrived</strong><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>at {new Date(job.arrived_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</div></div></>;
  } else if (!job.en_route_at) {
    status = <><Clock size={20} color="var(--text-muted)" /><div><strong>{first} hasn't set off yet</strong><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>You'll be notified when they're on the way.</div></div></>;
  } else if (!loc) {
    status = <><Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} /><div><strong>{first} is on the way</strong><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Waiting for their location…</div></div></>;
  } else {
    status = (
      <>
        <Car size={22} color="var(--teal)" />
        <div style={{ flex: 1 }}>
          <strong>{first} is on the way</strong>
          <div style={{ fontSize: 12, color: stale ? '#B45309' : 'var(--text-muted)' }}>
            {stale ? `Location last updated ${agoLabel(loc.updated_at)}` : `Updated ${agoLabel(loc.updated_at)}`}
          </div>
        </div>
        {eta != null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'var(--green)' }}>~{eta} min</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDistanceKm(km!)} away</div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
      <div ref={mapEl} style={{ position: 'absolute', inset: 0 }} />

      <button onClick={onClose} aria-label="Back"
        style={{ position: 'absolute', zIndex: 1000, top: 'calc(env(safe-area-inset-top) + 12px)', left: 14, width: 44, height: 44, borderRadius: 14, border: 'none', background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <ChevronLeft size={22} color="var(--text-primary)" />
      </button>

      <div style={{ position: 'absolute', zIndex: 1000, left: 12, right: 12, bottom: 'calc(env(safe-area-inset-bottom) + 14px)', background: 'white', borderRadius: 18, padding: 16, boxShadow: '0 8px 28px rgba(0,0,0,0.22)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 15, color: 'var(--text-primary)' }}>{status}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
          <MapPin size={13} color="#16a34a" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title} · {job.location}</span>
        </div>
        {eta != null && !job.arrived_at && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>ETA is an estimate based on distance, not live traffic.</div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .leaflet-control-attribution { font-size: 9px; }`}</style>
    </div>
  );
};
