import React, { useEffect, useState } from 'react';
import { MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import { PROVIDERS } from './providers';
import type { Provider } from '../../types';

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

interface ProviderRow extends Provider {
  _rawTrade: string;
}

export const FindProviderScreen: React.FC = () => {
  const { navigate, selectProvider, currentUser, isDemo } = useApp();

  // Read category INSIDE useEffect so it always picks up the latest value
  // even when the component was already mounted from a previous navigation
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortFilter, setSortFilter] = useState<'near' | 'top' | 'available'>('near');
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [consumerArea, setConsumerArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noLocationSet, setNoLocationSet] = useState(false);

  // This runs every time the screen is navigated to, even if already mounted
  useEffect(() => {
    const cat = sessionStorage.getItem('providerCategoryFilter') ?? '';
    sessionStorage.removeItem('providerCategoryFilter');
    setCategoryFilter(cat);
    setSortFilter('near');
    setSearchQuery('');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: we use a key prop on the parent router to force remount on nav,
  // but if not available, we use a screen-visibility trick via the screen state

  // Re-read category whenever the app screen changes to this screen
  const { screen } = useApp() as any;
  useEffect(() => {
    if (screen === 'find-provider') {
      const cat = sessionStorage.getItem('providerCategoryFilter') ?? '';
      sessionStorage.removeItem('providerCategoryFilter');
      setCategoryFilter(cat);
      setSortFilter('near');
      setSearchQuery('');
    }
  }, [screen]);

  useEffect(() => {
    if (isDemo) {
      setProviders(PROVIDERS.map((p) => ({ ...p, _rawTrade: p.trade })));
      setConsumerArea('Sandton, Johannesburg');
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      let userId: string | null = currentUser?.id ?? null;
      if (!userId) {
        const { data: s } = await supabase.auth.getSession();
        userId = s?.session?.user?.id ?? null;
      }

      let area = '';
      if (userId) {
        const { data: p } = await supabase.from('profiles').select('area').eq('id', userId).maybeSingle();
        area = p?.area || '';
      }

      setConsumerArea(area);
      if (!area) { setNoLocationSet(true); setIsLoading(false); return; }
      setNoLocationSet(false);

      const { data: rows, error } = await supabase
        .from('profiles')
        .select('id, full_name, trade, area, score, price_from')
        .eq('role', 'provider');

      if (error) { console.error('Error loading providers:', error); setIsLoading(false); return; }

      const matched: ProviderRow[] = (rows || [])
        .filter((row) => locationMatches(area, row.area || ''))
        .map((row) => ({
          id: row.id,
          name: row.full_name || 'Provider',
          trade: row.trade || 'General',
          _rawTrade: row.trade || '',
          rating: 0, jobCount: 0, distance: '—', priceFrom: row.price_from || 0,
          verified: false, qualVerified: false, available: true,
          initials: getInitials(row.full_name), score: row.score || 0,
        }));

      setProviders(matched);
      setIsLoading(false);
    };

    load();
  }, [currentUser?.id, isDemo]);

  const pageTitle = categoryFilter ? `${categoryFilter}s Near You` : 'Find a Provider';

  const displayed = providers
    .filter((p) => !categoryFilter || p._rawTrade === categoryFilter)
    .filter((p) => sortFilter === 'available' ? p.available : true)
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.trade.toLowerCase().includes(q);
    })
    .sort((a, b) => sortFilter === 'top' ? (b.score ?? 0) - (a.score ?? 0) : 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title={pageTitle}
        back="consumer-home"
        sub={
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
            <input
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.15)', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Search by name or trade…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="screen">
        <div className="screen-content">

          {consumerArea && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <MapPin size={15} color="var(--teal)" />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Near <strong>{consumerArea}</strong>
                {categoryFilter && <> · <strong>{categoryFilter}s only</strong></>}
              </span>
            </div>
          )}

          {noLocationSet && !isDemo && (
            <div className="card" style={{ border: '1px solid #F5B800', background: '#FFF8E1', color: '#7A6000' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>📍 No location set</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>Set your area in <strong>Profile → Personal Information</strong> to see providers near you.</div>
              <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 13 }} onClick={() => navigate('consumer-profile' as any)}>Set My Location</button>
            </div>
          )}

          {isLoading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Finding providers near you…</span>
            </div>
          )}

          {isDemo && !isLoading && (
            <div className="map-bg" style={{ borderRadius: 'var(--radius-md)', height: 200, marginBottom: 4 }}>
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span className="badge badge-teal">📍 {consumerArea}</span>
              </div>
              {[[28,40],[55,65],[72,28],[42,78],[18,62]].map(([x,y],i) => (
                <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
                  <div style={{ width: i===0?34:26, height: i===0?34:26, borderRadius: '50%', background: i===0?'var(--teal)':'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)', border: i===0?'2px solid white':'none' }}>
                    <MapPin size={i===0?16:12} color="white" />
                  </div>
                  {i===0 && <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', background: 'var(--teal)', color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: 'var(--font-head)', fontWeight: 700, whiteSpace: 'nowrap' }}>You</div>}
                </div>
              ))}
            </div>
          )}

          {!isLoading && (providers.length > 0 || isDemo) && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {([['near','📍 Near Me'],['top','⭐ Top Rated'],['available','✅ Available']] as const).map(([val,label]) => (
                <button key={val} onClick={() => setSortFilter(val)}
                  style={{ padding: '7px 14px', borderRadius: 20, fontSize: 13, whiteSpace: 'nowrap', fontFamily: 'var(--font-head)', fontWeight: 700, cursor: 'pointer', border: sortFilter===val?'2px solid var(--teal)':'1.5px solid var(--border)', background: sortFilter===val?'var(--teal-light)':'var(--card)', color: sortFilter===val?'var(--teal)':'var(--text-secondary)' }}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {!isLoading && !isDemo && consumerArea && displayed.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
              <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
                No {categoryFilter ? categoryFilter.toLowerCase() + 's' : 'providers'} found near you
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
                No {categoryFilter ? categoryFilter.toLowerCase() : ''} providers have set <strong>{consumerArea}</strong> as their service area yet.
              </div>
            </div>
          )}

          {!isLoading && displayed.map((p) => (
            <button key={p.id} className="provider-row" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }} onClick={() => { selectProvider(p); navigate('job-in-progress'); }}>
              <Avt initials={p.initials} size={52} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{p.trade}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                  {p.rating > 0 && <RatingStars rating={p.rating} size={12} />}
                  {p.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Verified</span>}
                  {p.available
                    ? <span className="badge badge-teal" style={{ fontSize: 10, padding: '2px 7px' }}>● Available</span>
                    : <span className="badge" style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(148,163,184,0.12)', color: 'var(--text-muted)' }}>Busy</span>
                  }
                </div>
              </div>
              {p.priceFrom > 0 && <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>From R{p.priceFrom}</div>}
            </button>
          ))}

          {isDemo && (
            <button className="btn btn-primary btn-full btn-lg" onClick={() => { selectProvider(PROVIDERS[0]); navigate('job-in-progress'); }}>
              Book a Provider
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 8 }}>
            Identity and document checks are automated screenings and do not constitute professional certification or guarantees.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <ConsumerNav />
    </div>
  );
};