import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, Badge, JobStatusBadge, Avatar, SectionTitle, VerificationBadge } from '../components/UI';

export function AdminDashboard() {
  const { jobs, providers, panicAlerts, dismissPanic } = useApp();
  const activeJobs = jobs.filter(j => j.status === 'in-progress' || j.status === 'accepted').length;
  const activePanics = panicAlerts.filter(p => p.status === 'active').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Admin header */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--fixa-teal)', fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>ADMIN CONSOLE</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 24, color: '#fff', lineHeight: 1.1 }}>Platform Overview</h1>
        <div style={{ fontSize: 12, color: 'var(--fixa-gray)', marginTop: 2 }}>Johannesburg Metro · {new Date().toLocaleDateString('en-ZA')}</div>
      </div>

      {/* PANIC alert banner */}
      {activePanics > 0 && (
        <div style={{
          padding: '16px', borderRadius: 'var(--radius-lg)',
          background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.45)',
          animation: 'pulse-ring 1.5s ease-in-out infinite',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🚨</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 15, color: '#EF4444' }}>
              {activePanics} ACTIVE PANIC ALERT{activePanics > 1 ? 'S' : ''}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(239,68,68,0.7)' }}>Immediate attention required</div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Total Jobs',  value: jobs.length,      icon: '📋', color: 'var(--fixa-teal)' },
          { label: 'Active',      value: activeJobs,        icon: '⚡', color: 'var(--fixa-yellow)' },
          { label: 'Completed',   value: jobs.filter(j=>j.status==='completed').length, icon: '✅', color: 'var(--fixa-success)' },
          { label: 'Providers',   value: providers.length,  icon: '👷', color: 'var(--fixa-teal-light)' },
        ].map(s => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px' }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 22, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--fixa-gray)', fontWeight: 600 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Panic alerts */}
      {panicAlerts.length > 0 && <>
        <SectionTitle sub="Requires immediate attention">🚨 Panic Alerts</SectionTitle>
        {panicAlerts.map(alert => (
          <Card key={alert.id} style={{
            borderColor: alert.status === 'active' ? 'rgba(239,68,68,0.45)' : 'rgba(27,184,200,0.12)',
            background: alert.status === 'active' ? 'rgba(239,68,68,0.05)' : undefined,
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
              <Badge variant={alert.status === 'active' ? 'danger' : 'success'}>
                {alert.status === 'active' ? '🚨 ACTIVE' : '✅ RESOLVED'}
              </Badge>
              <span style={{ fontSize: 11, color: 'var(--fixa-gray)' }}>{new Date(alert.timestamp).toLocaleTimeString('en-ZA')}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>{alert.userName}</div>
            <div style={{ fontSize: 12, color: 'var(--fixa-gray)', marginBottom: alert.status === 'active' ? 12 : 0 }}>📍 {alert.location}</div>
            {alert.status === 'active' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={dismissPanic} style={{ flex: 1, padding: '12px', borderRadius: 999, background: 'linear-gradient(135deg,#EF4444,#DC2626)', border: 'none', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13 }}>
                  ✓ Mark Resolved
                </button>
                <button style={{ padding: '12px 16px', borderRadius: 999, background: 'rgba(27,184,200,0.1)', border: '1px solid rgba(27,184,200,0.25)', color: 'var(--fixa-teal-light)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13 }}>
                  📞 Security
                </button>
              </div>
            )}
          </Card>
        ))}
      </>}

      {/* Jobs monitor */}
      <SectionTitle sub="All platform activity">Jobs Monitor</SectionTitle>
      {jobs.map(job => (
        <Card key={job.id}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <JobStatusBadge status={job.status} />
            <Badge variant={job.category === 'electrical' ? 'yellow' : job.category === 'mechanical' ? 'gray' : 'teal'}>{job.category}</Badge>
            {job.isEmergency && <Badge variant="danger">Emergency</Badge>}
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>{job.title}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--fixa-gray)', flex: 1, minWidth: 0 }}>
              {job.consumerName} → {job.providerName || 'Unassigned'}
            </div>
            {job.price && <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, color: 'var(--fixa-yellow)', flexShrink: 0 }}>R{job.price.toLocaleString()}</span>}
          </div>
        </Card>
      ))}

      {/* Verification queue */}
      <SectionTitle sub="Awaiting review">Verification Queue</SectionTitle>
      {providers.filter(p => p.verificationLevel < 3).map(p => (
        <Card key={p.id}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <Avatar name={p.name} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge variant="teal">{p.trade}</Badge>
                <VerificationBadge level={p.verificationLevel} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '11px', borderRadius: 999, background: 'linear-gradient(135deg, var(--fixa-teal), var(--fixa-teal-dark))', border: 'none', color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13, boxShadow: 'var(--shadow-teal)' }}>✓ Approve</button>
            <button style={{ flex: 1, padding: '11px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--fixa-danger)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13 }}>✕ Flag</button>
          </div>
        </Card>
      ))}
    </div>
  );
}
