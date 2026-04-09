import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, StarRating, VerificationBadge, SectionTitle, Divider } from '../components/UI';
import { mockProviders } from '../utils/mockData';

export function ProfilePage() {
  const { currentUser, activeRole, logout } = useApp();
  const navigate = useNavigate();
  const provider = activeRole === 'provider' ? mockProviders[0] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Profile card */}
      <Card glow>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--fixa-teal-dark), var(--fixa-teal))',
            border: '3px solid rgba(27,184,200,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 22, color: '#fff',
          }}>
            {currentUser?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fixa-gray)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser?.email}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Badge variant="teal">
                {activeRole === 'admin' ? '⚙️ Admin' : activeRole === 'provider' ? '🔧 Provider' : '👤 Consumer'}
              </Badge>
              {provider && <VerificationBadge level={provider.verificationLevel} />}
            </div>
          </div>
        </div>
      </Card>

      {/* Contact info */}
      <Card>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 12 }}>
          Contact Information
        </div>
        {[
          { icon: '📧', label: 'Email', value: currentUser?.email },
          { icon: '📱', label: 'Phone', value: currentUser?.phone },
          { icon: '📅', label: 'Member since', value: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' }) : '' },
        ].map((item, i) => (
          <div key={item.label} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderBottom: i < 2 ? '1px solid rgba(27,184,200,0.08)' : 'none',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: 'var(--fixa-gray)', marginBottom: 1, fontWeight: 700 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{item.value || '—'}</div>
            </div>
          </div>
        ))}
        <button style={{
          marginTop: 12, width: '100%', padding: '12px', borderRadius: 'var(--radius-full)',
          background: 'rgba(27,184,200,0.1)', border: '1px solid rgba(27,184,200,0.25)',
          color: 'var(--fixa-teal-light)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
        }}>
          ✏️ Edit Profile
        </button>
      </Card>

      {/* Safety settings */}
      <Card>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 10 }}>
          🛡️ Safety Settings
        </div>
        <div style={{ padding: '12px', background: 'rgba(27,184,200,0.06)', borderRadius: 'var(--radius-md)', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--fixa-gray)', marginBottom: 2, fontWeight: 700 }}>TRUSTED CONTACT</div>
          <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>Not configured</div>
        </div>
        <button style={{
          width: '100%', padding: '12px', borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--fixa-teal), var(--fixa-teal-dark))',
          border: 'none', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
          boxShadow: 'var(--shadow-teal)',
        }}>
          + Add Trusted Contact
        </button>
      </Card>

      {/* Legal links */}
      <Card>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>Legal & Data</div>
        {['Privacy Policy (POPIA)', 'Terms of Service', 'Platform Disclaimer'].map((item, i) => (
          <div key={item} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 0', borderBottom: i < 2 ? '1px solid rgba(27,184,200,0.08)' : 'none',
          }}>
            <span style={{ fontSize: 14, color: 'var(--fixa-gray)', fontWeight: 600 }}>{item}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--fixa-gray)"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </div>
        ))}
      </Card>

      {/* Sign out */}
      <button
        onClick={() => { logout(); navigate('/'); }}
        style={{
          width: '100%', padding: '15px', borderRadius: 'var(--radius-full)',
          background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.3)',
          color: 'var(--fixa-danger)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 15,
          marginBottom: 8,
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();
  const iconMap: Record<string, string> = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '🚨' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionTitle sub={`${notifications.filter(n => !n.read).length} unread`}>Notifications</SectionTitle>
      {notifications.length === 0 ? (
        <Card><div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fixa-gray)', fontSize: 14 }}>You're all caught up! 🎉</div></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => (
            <Card
              key={n.id}
              hoverable
              onClick={() => markNotificationRead(n.id)}
              style={{
                opacity: n.read ? 0.55 : 1,
                borderColor: n.type === 'danger' && !n.read ? 'rgba(239,68,68,0.3)' : undefined,
              }}
            >
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{iconMap[n.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff' }}>{n.title}</span>
                    {!n.read && <Badge variant="teal">New</Badge>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fixa-gray)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'rgba(143,163,177,0.6)', marginTop: 6 }}>
                    {new Date(n.timestamp).toLocaleString('en-ZA')}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function EarningsPage() {
  const provider = mockProviders[0];
  const monthly = [
    { month: 'Oct', amount: 4200 },
    { month: 'Nov', amount: 5800 },
    { month: 'Dec', amount: 3900 },
    { month: 'Jan', amount: 6200 },
    { month: 'Feb', amount: 5400 },
    { month: 'Mar', amount: 2950 },
  ];
  const max = Math.max(...monthly.map(d => d.amount));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionTitle sub="In-app payments only">My Earnings</SectionTitle>

      <Card glow style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ fontSize: 11, color: 'var(--fixa-gray)', fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>TOTAL EARNINGS</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 38, color: 'var(--fixa-yellow)', marginBottom: 6 }}>
          R{provider.earnings.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: 'var(--fixa-gray)' }}>After {provider.jobsCompleted} jobs · 3.5% platform fee deducted</div>
      </Card>

      <Card>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 14 }}>Monthly Trend</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100 }}>
          {monthly.map(d => (
            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 9, color: 'var(--fixa-teal)', fontWeight: 700 }}>R{(d.amount/1000).toFixed(1)}k</div>
              <div style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(180deg, var(--fixa-teal) 0%, var(--fixa-teal-dark) 100%)',
                height: `${(d.amount / max) * 72}px`,
              }} />
              <div style={{ fontSize: 9, color: 'var(--fixa-gray)' }}>{d.month}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ borderColor: 'rgba(245,200,0,0.2)', background: 'rgba(245,200,0,0.03)' }}>
        <p style={{ fontSize: 12, color: 'var(--fixa-gray)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--fixa-yellow)' }}>⚠️</strong> Only in-app payments qualify for dispute support, reviews, and ranking. Off-app payments receive zero platform benefits.
        </p>
      </Card>
    </div>
  );
}
