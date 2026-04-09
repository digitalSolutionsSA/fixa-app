import React from 'react';
import {
  Wrench,
  Zap,
  Car,
  MoreHorizontal,
  Shield,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { RatingStars, Avt, NotifBell, ConsumerNav } from '../components/Shared';
import type { Provider } from '../types';

const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: "Jason's Plumbing",
    trade: 'Plumber',
    rating: 4.8,
    jobCount: 128,
    distance: '2.1 km',
    priceFrom: 450,
    verified: true,
    qualVerified: true,
    available: true,
    initials: 'JP',
    score: 96,
  },
  {
    id: '2',
    name: 'Maya Electrical',
    trade: 'Electrician',
    rating: 4.8,
    jobCount: 93,
    distance: '3.4 km',
    priceFrom: 650,
    verified: true,
    qualVerified: true,
    available: true,
    initials: 'ME',
    score: 94,
  },
  {
    id: '3',
    name: 'Mike the Handyman',
    trade: 'Handyman',
    rating: 4.8,
    jobCount: 156,
    distance: '1.8 km',
    priceFrom: 200,
    verified: true,
    qualVerified: false,
    available: false,
    initials: 'MH',
    score: 91,
  },
];

function getFirstName(name?: string | null) {
  return name?.trim()?.split(' ')[0] || 'there';
}

export function ConsumerHome() {
  const { navigate, selectProvider, currentUser, isDemo } = useApp();

  const firstName = getFirstName(currentUser?.name);

  const cats = [
    {
      icon: <Wrench size={28} color="var(--teal)" />,
      label: 'Plumber',
      sub: 'Fast & reliable',
    },
    {
      icon: <Zap size={28} color="var(--yellow-dark)" />,
      label: 'Electrician',
      sub: 'Certified pros',
    },
    {
      icon: <Car size={28} color="var(--navy)" />,
      label: 'Mechanic',
      sub: 'Mobile & trusted',
    },
    {
      icon: <MoreHorizontal size={28} color="var(--text-secondary)" />,
      label: 'More Services',
      sub: 'View all',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ background: 'var(--teal)', padding: '16px 20px 22px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            maxWidth: 700,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div className="logo-wrap">
            <span className="logo-main">
              FI<span className="logo-x">X</span>A
            </span>
            <span className="logo-sub">by PUBLICON</span>
          </div>
          <NotifBell count={isDemo ? 1 : 0} />
        </div>

        <div style={{ maxWidth: 700, margin: '14px auto 0', width: '100%' }}>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 22,
              color: 'white',
            }}
          >
            Hi, {firstName} 👋
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 }}>
            What service do you need today?
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {/* Category grid */}
          <div
            className="grid-2"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            {cats.map((c) => (
              <button
                key={c.label}
                onClick={() => navigate('find-provider')}
                style={{
                  background: 'white',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ marginBottom: 10 }}>{c.icon}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 800,
                    fontSize: 15,
                    color: 'var(--text-primary)',
                  }}
                >
                  {c.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {c.sub}
                </div>
              </button>
            ))}
          </div>

          {/* Trust row */}
          <button
            onClick={() => navigate('find-provider')}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              cursor: 'pointer',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--teal-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Shield size={18} color="var(--teal)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>
                All providers are verified &amp; background checked
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                ID verification · Document screening · Review integrity
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          {/* Emergency */}
          <button
            onClick={() => navigate('consumer-safety')}
            style={{
              background: 'var(--red-panic)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(229,62,62,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <AlertTriangle size={22} color="white" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 800,
                  fontSize: 15,
                  color: 'white',
                }}
              >
                Emergency? Tap for help →
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                One tap sends alert to your trusted contact &amp; security partner
              </div>
            </div>
          </button>

          {/* Recently booked */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom: 0 }}>
                Recently Booked
              </div>
              {isDemo && (
                <button
                  onClick={() => navigate('consumer-bookings')}
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--teal)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  View all
                </button>
              )}
            </div>

            {isDemo ? (
              <button
                className="provider-row"
                onClick={() => {
                  selectProvider(PROVIDERS[0]);
                  navigate('provider-arrived');
                }}
              >
                <Avt initials="SE" size={50} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                    Sipho the Electrician
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Plug repair · Completed
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="badge badge-green">Completed</span>
                    <RatingStars rating={5} size={12} />
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                  No bookings yet
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Your real bookings will appear here after you request and complete jobs in the app.
                </div>
              </div>
            )}
          </div>

          {/* Top providers */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom: 0 }}>
                Top Providers Near You
              </div>
              {isDemo && (
                <button
                  onClick={() => navigate('top-providers')}
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--teal)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  View all
                </button>
              )}
            </div>

            {isDemo ? (
              PROVIDERS.slice(0, 2).map((p, i) => (
                <button
                  key={p.id}
                  className="provider-row"
                  style={{ marginBottom: i === 0 ? 10 : 0 }}
                  onClick={() => {
                    selectProvider(p);
                    navigate('find-provider');
                  }}
                >
                  <Avt initials={p.initials} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 3 }}>
                      <RatingStars rating={p.rating} size={12} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        ({p.jobCount} jobs)
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        · {p.distance}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      {p.verified && (
                        <span className="badge badge-green" style={{ fontSize: 10 }}>
                          ✓ ID Verified
                        </span>
                      )}
                      {p.available && (
                        <span className="badge badge-teal" style={{ fontSize: 10 }}>
                          ● Available
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14 }}>
                    From R{p.priceFrom}
                  </div>
                </button>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>
                  Provider list not loaded yet
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Once your live provider data is connected, nearby providers will appear here.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConsumerNav />
    </div>
  );
}