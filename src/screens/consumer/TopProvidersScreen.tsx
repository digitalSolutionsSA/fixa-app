import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt } from '../../components/Shared';
import { PROVIDERS } from './providers';

export const TopProvidersScreen: React.FC = () => {
  const { navigate, selectProvider, isDemo } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Top Providers in Your Area" back="consumer-home" />
      <div className="screen">
        <div className="screen-content">
          {!isDemo ? (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No live providers loaded yet</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 320 }}>
                This page still depends on placeholder provider data. Connect live providers next.
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} color="var(--green)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Sandton, 3.5 km away</span>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>✓ All Verified &amp; Rated</span>
              </div>

              {PROVIDERS.map((p, i) => (
                <button
                  key={p.id}
                  className="provider-row animate-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => { selectProvider(p); navigate('provider-arrived'); }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <Avt initials={p.initials} size={52} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>From R{p.priceFrom}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <RatingStars rating={p.rating} size={12} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {p.distance}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                      {p.verified && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ ID Verified</span>}
                      {p.qualVerified && <span className="badge badge-gray" style={{ fontSize: 10 }}>✓ Qual. Screened</span>}
                      <span className="badge badge-gray" style={{ fontSize: 10 }}>{p.trade}</span>
                      {i === 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ marginLeft: 'auto', fontSize: 12, padding: '6px 14px' }}
                          onClick={(e) => { e.stopPropagation(); selectProvider(p); navigate('provider-arrived'); }}
                        >
                          Request Job
                        </button>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                Ranked by Best Match · Response time · Reviews · Completion rate
              </p>
            </>
          )}
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};