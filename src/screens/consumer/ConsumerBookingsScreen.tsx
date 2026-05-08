import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppHeader, ConsumerNav, Avt } from '../../components/Shared';

export const ConsumerBookingsScreen: React.FC = () => {
  const { navigate, isDemo } = useApp();
  const [tab, setTab] = useState<'active' | 'past'>('active');

  const active = [
    { name: "Jason's Plumbing", service: 'Blocked Sink', date: 'Today, 10:00', price: 450, status: 'On Route', initials: 'JP' },
  ];
  const past = [
    { name: 'Sipho the Electrician', service: 'Plug Repair', date: 'Last Monday', price: 350, status: 'Completed', initials: 'SE' },
    { name: 'Mike the Handyman', service: 'Door Fix', date: '2 weeks ago', price: 200, status: 'Completed', initials: 'MH' },
    { name: "Sarah's Repairs", service: 'Geyser Blanket', date: 'Last month', price: 550, status: 'Completed', initials: 'SR' },
  ];

  const items = isDemo ? (tab === 'active' ? active : past) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="My Bookings" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              Active ({isDemo ? active.length : 0})
            </button>
            <button className={`tab-btn ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>
              Past ({isDemo ? past.length : 0})
            </button>
          </div>

          {items.map((b, i) => (
            <div
              key={i}
              className="card card-clickable animate-in"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(tab === 'active' ? 'job-in-progress' : 'consumer-home')}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avt initials={b.initials} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{b.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{b.service}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{b.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 17 }}>R{b.price}</div>
                  <span className={`badge ${b.status === 'Completed' ? 'badge-green' : 'badge-teal'}`} style={{ marginTop: 4, display: 'block', textAlign: 'center' }}>
                    {b.status}
                  </span>
                </div>
              </div>

              {tab === 'active' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('provider-arrived'); }}>
                    View Details
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate('job-in-progress'); }}>
                    Track Job
                  </button>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No bookings yet</div>
              <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
            </div>
          )}
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};