import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Card, Button, Badge, StarRating, VerificationBadge, Avatar, SectionTitle } from '../components/UI';

const CATS = ['all', 'plumbing', 'electrical', 'mechanical'];
const CAT_ICONS: Record<string, string> = { all: '🔧', plumbing: '💧', electrical: '⚡', mechanical: '🔩' };

export function BrowsePage() {
  const { providers } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [query, setQuery] = useState('');

  const filtered = providers
    .filter(p => (category === 'all' || p.trade === category) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.trade.includes(query.toLowerCase())))
    .sort((a, b) => b.rankScore - a.rankScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionTitle sub="Ranked by performance, verified identity">Find a Provider</SectionTitle>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or trade..."
          style={{
            width: '100%', padding: '13px 14px 13px 44px',
            background: 'rgba(255,255,255,0.05)',
            border: '1.5px solid rgba(27,184,200,0.2)',
            borderRadius: 'var(--radius-full)', color: '#fff',
          }}
        />
      </div>

      {/* Category pills – horizontally scrollable */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {CATS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              flexShrink: 0,
              padding: '9px 16px', borderRadius: 999,
              background: category === cat ? 'var(--fixa-teal)' : 'rgba(255,255,255,0.05)',
              border: category === cat ? 'none' : '1px solid rgba(27,184,200,0.18)',
              color: category === cat ? '#fff' : 'var(--fixa-gray)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              textTransform: 'capitalize', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
              minHeight: 'unset',
            }}
          >
            {CAT_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--fixa-gray)' }}>{filtered.length} provider{filtered.length !== 1 ? 's' : ''} found</div>

      {/* Provider cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((provider, idx) => (
          <Card key={provider.id} hoverable onClick={() => {}}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              {/* Rank badge */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                background: idx === 0 ? 'linear-gradient(135deg,#F5C800,#D4A800)' : idx === 1 ? 'linear-gradient(135deg,#aaa,#777)' : idx === 2 ? 'linear-gradient(135deg,#CD7F32,#A0622A)' : 'rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 11,
                color: idx < 3 ? '#fff' : 'var(--fixa-gray)',
              }}>#{idx + 1}</div>

              <Avatar name={provider.name} size={46} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {provider.name}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                  <Badge variant={provider.trade === 'electrical' ? 'yellow' : provider.trade === 'mechanical' ? 'gray' : 'teal'}>
                    {provider.trade}
                  </Badge>
                  <VerificationBadge level={provider.verificationLevel} />
                </div>
                <StarRating rating={provider.rating} />
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--fixa-gray)' }}>⏱ <span style={{ color: 'var(--fixa-teal-light)', fontWeight: 700 }}>{provider.responseTime}</span></span>
                  <span style={{ fontSize: 12, color: 'var(--fixa-gray)' }}>✅ <span style={{ fontWeight: 700, color: '#fff' }}>{provider.jobsCompleted}</span> jobs</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/request?provider=${provider.id}`); }}
                style={{
                  flex: 1, padding: '13px', borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--fixa-teal), var(--fixa-teal-dark))',
                  border: 'none', color: '#fff',
                  fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
                  boxShadow: 'var(--shadow-teal)',
                }}
              >
                Book Now
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  padding: '13px 18px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(27,184,200,0.1)', border: '1px solid rgba(27,184,200,0.25)',
                  color: 'var(--fixa-teal-light)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
                }}
              >
                Profile
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ borderColor: 'rgba(245,200,0,0.2)', background: 'rgba(245,200,0,0.03)' }}>
        <p style={{ fontSize: 12, color: 'var(--fixa-gray)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--fixa-yellow)' }}>⚠️ Disclaimer:</strong> Verification is automated screening only — not professional certification. Providers are independent contractors. FIXA is not liable for workmanship quality.
        </p>
      </Card>
    </div>
  );
}
