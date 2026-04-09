import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, JobStatusBadge, Badge, StarRating, SectionTitle, Divider, EmptyState } from '../components/UI';

const STATUS_TABS = ['all', 'pending', 'in-progress', 'completed', 'disputed'];

export function MyJobsPage() {
  const { jobs, currentUser, triggerPanic, panicActive } = useApp();
  const [tab, setTab] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const myJobs = jobs.filter(j => j.consumerId === currentUser?.id);
  const filtered = tab === 'all' ? myJobs : myJobs.filter(j => j.status === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionTitle sub={`${myJobs.length} total jobs`}>My Jobs</SectionTitle>

      {/* Tabs – scrollable */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
        {STATUS_TABS.map(s => {
          const count = s === 'all' ? myJobs.length : myJobs.filter(j => j.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setTab(s)}
              style={{
                flexShrink: 0,
                padding: '8px 14px', borderRadius: 999,
                background: tab === s ? 'var(--fixa-teal)' : 'rgba(255,255,255,0.05)',
                border: tab === s ? 'none' : '1px solid rgba(27,184,200,0.15)',
                color: tab === s ? '#fff' : 'var(--fixa-gray)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                textTransform: 'capitalize', whiteSpace: 'nowrap',
                minHeight: 'unset',
              }}
            >
              {s.replace('-', ' ')} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {filtered.length === 0
        ? <EmptyState icon="📋" title="No jobs here" sub="Your service history will appear here" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(job => {
              const isExpanded = expanded === job.id;
              const isActive = job.status === 'in-progress' || job.status === 'accepted';
              return (
                <Card key={job.id} glow={isActive} onClick={() => setExpanded(isExpanded ? null : job.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <JobStatusBadge status={job.status} />
                        {job.isEmergency && <Badge variant="danger">🚨 Emergency</Badge>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--fixa-gray)' }}>
                        {job.providerName ? <><span style={{ color: 'var(--fixa-teal-light)' }}>{job.providerName}</span> · </> : <span style={{ color: 'var(--fixa-warning)' }}>Awaiting provider · </span>}
                        {new Date(job.createdAt).toLocaleDateString('en-ZA')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      {job.price && <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 16, color: 'var(--fixa-yellow)' }}>R{job.price.toLocaleString()}</span>}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--fixa-gray)" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Panic for active jobs */}
                  {isActive && (
                    <button
                      onClick={e => { e.stopPropagation(); triggerPanic(); }}
                      style={{
                        width: '100%', marginTop: 12, padding: '12px',
                        borderRadius: 'var(--radius-full)',
                        background: panicActive ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg,#EF4444,#DC2626)',
                        border: panicActive ? '2px solid #EF4444' : 'none',
                        color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14,
                        boxShadow: '0 3px 16px rgba(239,68,68,0.4)',
                        animation: panicActive ? 'pulse-ring 1.5s infinite' : 'none',
                      }}
                    >
                      🚨 {panicActive ? 'ALERT ACTIVE' : 'PANIC BUTTON'}
                    </button>
                  )}

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ marginTop: 12 }}>
                      <Divider />
                      <p style={{ fontSize: 13, color: 'var(--fixa-gray)', lineHeight: 1.6, marginBottom: 10 }}>{job.description}</p>
                      <div style={{ fontSize: 12, color: 'var(--fixa-gray)', marginBottom: 10 }}>📍 {job.location}</div>
                      {job.review && (
                        <div style={{ padding: '10px 12px', background: 'rgba(27,184,200,0.06)', border: '1px solid rgba(27,184,200,0.15)', borderRadius: 'var(--radius-md)', marginBottom: 10 }}>
                          {job.rating && <StarRating rating={job.rating} />}
                          <p style={{ fontSize: 13, color: 'var(--fixa-gray)', fontStyle: 'italic', marginTop: 4 }}>"{job.review}"</p>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {job.status === 'completed' && !job.review && (
                          <button onClick={e => e.stopPropagation()} style={{ padding: '10px 16px', borderRadius: 999, background: 'var(--fixa-yellow)', border: 'none', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 13, color: 'var(--fixa-dark)', minHeight: 'unset' }}>
                            ⭐ Leave Review
                          </button>
                        )}
                        <button onClick={e => e.stopPropagation()} style={{ padding: '10px 16px', borderRadius: 999, background: 'rgba(27,184,200,0.1)', border: '1px solid rgba(27,184,200,0.25)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--fixa-teal-light)', minHeight: 'unset' }}>
                          💬 Chat
                        </button>
                        {job.status === 'completed' && (
                          <button onClick={e => e.stopPropagation()} style={{ padding: '10px 16px', borderRadius: 999, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--fixa-danger)', minHeight: 'unset' }}>
                            🚩 Dispute
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
    </div>
  );
}
