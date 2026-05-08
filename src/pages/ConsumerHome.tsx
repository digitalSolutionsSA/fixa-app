import React, { useEffect, useState } from 'react';
import {
  Wrench, Zap, Car, Shield, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { RatingStars, Avt, NotifBell, ConsumerNav } from '../components/Shared';
import type { Provider } from '../types';

const DEMO_PROVIDERS: Provider[] = [
  { id: '1', name: "Jason's Plumbing",   trade: 'Plumber',     rating: 4.8, jobCount: 128, distance: '2.1 km', priceFrom: 450, verified: true,  qualVerified: true,  available: true,  initials: 'JP', score: 96 },
  { id: '2', name: 'Maya Electrical',    trade: 'Electrician', rating: 4.8, jobCount: 93,  distance: '3.4 km', priceFrom: 650, verified: true,  qualVerified: true,  available: true,  initials: 'ME', score: 94 },
  { id: '3', name: 'Mike the Handyman',  trade: 'Mechanic',    rating: 4.8, jobCount: 156, distance: '1.8 km', priceFrom: 200, verified: true,  qualVerified: false, available: false, initials: 'MH', score: 91 },
];

function getFirstName(name?: string | null) {
  return name?.trim()?.split(' ')[0] || 'there';
}

function getInitials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

function locationMatches(consumerArea: string, providerArea: string): boolean {
  if (!consumerArea || !providerArea) return false;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const consumerWords = normalize(consumerArea).split(/\s+/).filter((w) => w.length > 2);
  const providerNorm = normalize(providerArea);
  return consumerWords.some((word) => providerNorm.includes(word));
}

export function ConsumerHome() {
  const { navigate, selectProvider, currentUser, isDemo } = useApp();
  const firstName = getFirstName(currentUser?.name);

  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([]);
  const [consumerArea, setConsumerArea] = useState('');
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setNearbyProviders(DEMO_PROVIDERS.slice(0, 2));
      setLoadingProviders(false);
      return;
    }
    const load = async () => {
      setLoadingProviders(true);
      let userId: string | null = currentUser?.id ?? null;
      if (!userId) {
        const { data: s } = await supabase.auth.getSession();
        userId = s?.session?.user?.id ?? null;
      }
      if (!userId) { setLoadingProviders(false); return; }

      const { data: profile } = await supabase.from('profiles').select('area').eq('id', userId).maybeSingle();
      const area = profile?.area || '';
      setConsumerArea(area);
      if (!area) { setLoadingProviders(false); return; }

      const { data: rows, error } = await supabase
        .from('profiles')
        .select('id, full_name, trade, area, score, price_from')
        .eq('role', 'provider');

      if (error || !rows) { setLoadingProviders(false); return; }

      const matched: Provider[] = rows
        .filter((row) => locationMatches(area, row.area || ''))
        .map((row) => ({
          id: row.id, name: row.full_name || 'Provider', trade: row.trade || 'General',
          rating: 0, jobCount: 0, distance: '—', priceFrom: row.price_from || 0,
          verified: false, qualVerified: false, available: true,
          initials: getInitials(row.full_name), score: row.score || 0,
        }))
        .slice(0, 3);

      setNearbyProviders(matched);
      setLoadingProviders(false);
    };
    load();
  }, [currentUser?.id, isDemo]);

  // Each tile navigates to its OWN dedicated screen — no sessionStorage needed
  const cats = [
    { icon: <Wrench size={28} color="var(--teal)" />,     label: 'Plumber',     sub: 'Fast & reliable',  screen: 'plumber-screen' },
    { icon: <Zap size={28} color="var(--yellow-dark)" />, label: 'Electrician', sub: 'Certified pros',   screen: 'electrician-screen' },
    { icon: <Car size={28} color="var(--navy)" />,        label: 'Mechanic',    sub: 'Mobile & trusted', screen: 'mechanic-screen' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ background: 'var(--teal)', padding: '16px 20px 22px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <div className="logo-wrap">
            <span className="logo-main">FI<span className="logo-x">X</span>A</span>
            <span className="logo-sub">by PUBLICON</span>
          </div>
          <NotifBell count={isDemo ? 1 : 0} />
        </div>
        <div style={{ maxWidth: 700, margin: '14px auto 0', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'white' }}>Hi, {firstName} 👋</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 }}>What service do you need today?</div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">

          {/* 3-column category grid — each navigates to its own screen */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {cats.map((c) => (
              <button
                key={c.label}
                onClick={() => navigate(c.screen as any)}
                style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 12px', cursor: 'pointer', textAlign: 'left', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{c.sub}</div>
              </button>
            ))}
          </div>

          {/* Trust row */}
          <button onClick={() => navigate('find-provider')} className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer', border: 'none', textAlign: 'left' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={18} color="var(--teal)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>All providers are verified &amp; background checked</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>ID verification · Document screening · Review integrity</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          {/* Emergency */}
          <button onClick={() => navigate('consumer-safety')}
            style={{ background: 'var(--red-panic)', border: 'none', borderRadius: 'var(--radius-md)', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', cursor: 'pointer', boxShadow: '0 4px 16px rgba(229,62,62,0.3)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
            <AlertTriangle size={22} color="white" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, color: 'white' }}>Emergency? Tap for help →</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>One tap sends alert to your trusted contact &amp; security partner</div>
            </div>
          </button>

          {/* Recently Booked */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom: 0 }}>Recently Booked</div>
              {isDemo && <button onClick={() => navigate('consumer-bookings')} style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>}
            </div>
            {isDemo ? (
              <button className="provider-row" onClick={() => { selectProvider(DEMO_PROVIDERS[0]); navigate('provider-arrived'); }}>
                <Avt initials="SE" size={50} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>Sipho the Electrician</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Plug repair · Completed</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="badge badge-green">Completed</span>
                    <RatingStars rating={5} size={12} />
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>No bookings yet</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>Your real bookings will appear here after you request and complete jobs in the app.</div>
              </div>
            )}
          </div>

          {/* Top Providers Near You */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom: 0 }}>Top Providers Near You</div>
              {(isDemo || nearbyProviders.length > 0) && (
                <button onClick={() => navigate('find-provider')} style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 13, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer' }}>View all</button>
              )}
            </div>

            {isDemo && DEMO_PROVIDERS.slice(0, 2).map((p, i) => (
              <button key={p.id} className="provider-row" style={{ marginBottom: i === 0 ? 10 : 0 }} onClick={() => { selectProvider(p); navigate('find-provider'); }}>
                <Avt initials={p.initials} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
                    <RatingStars rating={p.rating} size={12} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {p.distance}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    {p.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ ID Verified</span>}
                    {p.available && <span className="badge badge-teal" style={{ fontSize: 10 }}>● Available</span>}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14 }}>From R{p.priceFrom}</div>
              </button>
            ))}

            {!isDemo && loadingProviders && (
              <div className="card" style={{ textAlign: 'center', padding: '18px 16px', color: 'var(--text-secondary)', fontSize: 13 }}>Finding providers near you…</div>
            )}
            {!isDemo && !loadingProviders && !consumerArea && (
              <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>📍 No location set</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>Set your area in <strong>Profile → Personal Information</strong> to see nearby providers.</div>
                <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 13 }} onClick={() => navigate('consumer-profile' as any)}>Set My Location</button>
              </div>
            )}
            {!isDemo && !loadingProviders && consumerArea && nearbyProviders.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>No providers near {consumerArea} yet</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>Check back soon as more providers join your area.</div>
              </div>
            )}
            {!isDemo && !loadingProviders && nearbyProviders.map((p, i) => (
              <button key={p.id} className="provider-row" style={{ marginBottom: i < nearbyProviders.length - 1 ? 10 : 0 }} onClick={() => { selectProvider(p); navigate('find-provider'); }}>
                <Avt initials={p.initials} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{p.trade}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span className="badge badge-teal" style={{ fontSize: 10 }}>● Available</span>
                  </div>
                </div>
                {p.priceFrom > 0 && <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>From R{p.priceFrom}</div>}
              </button>
            ))}
          </div>

        </div>
      </div>
      <ConsumerNav />
    </div>
  );
}