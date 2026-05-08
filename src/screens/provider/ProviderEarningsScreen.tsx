import React, { useState } from 'react';
import { Briefcase, Star, DollarSign } from 'lucide-react';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { EMPTY_EARNINGS_BARS, EMPTY_RECENT_JOBS } from './constants';

export const ProviderEarningsScreen: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const bars = EMPTY_EARNINGS_BARS;
  const totals = { week: '0', month: '0', all: '0' };
  const jobNums = { week: '0', month: '0', all: '0' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Earnings Dashboard" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>
              This Week
            </button>
            <button className={`tab-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>
              Month
            </button>
            <button className={`tab-btn ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>
              All-Time
            </button>
          </div>

          <div className="card">
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 900,
                fontSize: 40,
                color: 'var(--text-primary)',
              }}
            >
              R{totals[period]}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Total Earnings
            </div>

            <div className="earn-bars-row">
              {bars.map((b) => (
                <div key={b.l} className="earn-bar">
                  <div className="earn-bar-fill" style={{ height: b.h }} />
                  <span className="earn-bar-label">{b.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { icon: <Briefcase size={18} color="var(--teal)" />, label: 'Jobs Done', val: jobNums[period] },
              { icon: <Star size={18} color="var(--yellow-dark)" />, label: 'Avg Rating', val: '0.0' },
              { icon: <DollarSign size={18} color="var(--green)" />, label: 'Platform Fee', val: '3.5%' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                <div className="stat-num" style={{ textAlign: 'center', fontSize: 22 }}>
                  {s.val}
                </div>
                <div className="stat-label" style={{ textAlign: 'center' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div className="section-title">Recent Jobs</div>

          {EMPTY_RECENT_JOBS.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <Briefcase size={34} color="var(--text-muted)" />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, marginTop: 10 }}>
                No earnings yet
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                Completed in-app jobs will appear here once you start working.
              </div>
            </div>
          )}

          <div
            style={{
              background: 'var(--teal-light)',
              border: '1px solid var(--teal)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--teal)',
                marginBottom: 4,
              }}
            >
              💳 Platform Fee
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A 3.5% fee is auto-deducted from each completed in-app paid job. Off-app payments
              receive no platform benefits or dispute support.
            </p>
          </div>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};