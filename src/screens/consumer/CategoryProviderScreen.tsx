import React, { useEffect, useState } from 'react';
import { MapPin, Search, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
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

interface Props {
  trade: string;        // exact value stored in Supabase: "Plumber" | "Electrician" | "Mechanic"
  title: string;        // page title e.g. "Plumbers Near You"
  backScreen: string;   // where the back button goes
}

export const CategoryProviderScreen: React.FC<Props> = ({ trade, title, backScreen }) => {
  const { navigate, selectProvider, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [consumerArea, setConsumerArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noLocationSet, setNoLocationSet] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      let userId: string | null = currentUser?.id ?? null;
      if (!userId) {
        const { data: s } = await supabase.auth.getSession();
        userId = s?.session?.user?.id ?? null;
      }

      let area = '';
      if (userId) {
        const { data: p } = await supabase
          .from('profiles')
          .select('area')
          .eq('id', userId)
          .maybeSingle();
        area = p?.area || '';
      }

      setConsumerArea(area);

      if (!area) {
        setNoLocationSet(true);
        setIsLoading(false);
        return;
      }

      setNoLocationSet(false);

      // Fetch ONLY providers with this exact trade from Supabase
      const { data: rows, error } = await supabase
        .from('profiles')
        .select('id, full_name, trade, area, score, price_from')
        .eq('role', 'provider')
        .eq('trade', trade);  // ← exact match at DB level, no client filtering needed

      if (error) {
        console.error('Error loading providers:', error);
        setIsLoading(false);
        return;
      }

      const matched: Provider[] = (rows || [])
        .filter((row) => locationMatches(area, row.area || ''))
        .map((row) => ({
          id:           row.id,
          name:         row.full_name || 'Provider',
          trade:        row.trade || trade,
          rating:       0,
          jobCount:     0,
          distance:     '—',
          priceFrom:    row.price_from || 0,
          verified:     false,
          qualVerified: false,
          available:    true,
          initials:     getInitials(row.full_name),
          score:        row.score || 0,
        }));

      setProviders(matched);
      setIsLoading(false);
    };

    load();
  }, [currentUser?.id, trade]);

  const displayed = providers.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.trade.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title={title}
        back={backScreen as any}
        sub={
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
            <input
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1.5px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.15)', color: 'white', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder={`Search ${trade.toLowerCase()}s…`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="screen">
        <div className="screen-content">

          {/* Location badge */}
          {consumerArea && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <MapPin size={15} color="var(--teal)" />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Near <strong>{consumerArea}</strong> · <strong>{trade}s only</strong>
              </span>
            </div>
          )}

          {/* No location */}
          {noLocationSet && (
            <div className="card" style={{ border: '1px solid #F5B800', background: '#FFF8E1', color: '#7A6000' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>📍 No location set</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>Set your area in <strong>Profile → Personal Information</strong> to see providers near you.</div>
              <button className="btn btn-primary" style={{ marginTop: 12, fontSize: 13 }} onClick={() => navigate('consumer-profile' as any)}>Set My Location</button>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Finding {trade.toLowerCase()}s near you…</span>
            </div>
          )}

          {/* No matches */}
          {!isLoading && consumerArea && displayed.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
              <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
                No {trade.toLowerCase()}s found near you
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
                No {trade.toLowerCase()} providers have set <strong>{consumerArea}</strong> as their service area yet.
              </div>
            </div>
          )}

          {/* Provider list */}
          {!isLoading && displayed.map((p) => (
            <button
              key={p.id}
              className="provider-row"
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}
              onClick={() => { selectProvider(p); navigate('job-in-progress'); }}
            >
              <Avt initials={p.initials} size={52} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{p.trade}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                  {p.rating > 0 && <RatingStars rating={p.rating} size={12} />}
                  {p.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Verified</span>}
                  <span className="badge badge-teal" style={{ fontSize: 10, padding: '2px 7px' }}>● Available</span>
                </div>
              </div>
              {p.priceFrom > 0 && (
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  From R{p.priceFrom}
                </div>
              )}
            </button>
          ))}

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

// ── Three concrete screens, each with hardcoded trade ─────────────────────────

export const PlumberScreen: React.FC = () => (
  <CategoryProviderScreen trade="Plumber" title="Plumbers Near You" backScreen="consumer-home" />
);

export const ElectricianScreen: React.FC = () => (
  <CategoryProviderScreen trade="Electrician" title="Electricians Near You" backScreen="consumer-home" />
);

export const MechanicScreen: React.FC = () => (
  <CategoryProviderScreen trade="Mechanic" title="Mechanics Near You" backScreen="consumer-home" />
);