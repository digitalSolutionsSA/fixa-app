import React, { useEffect, useState } from 'react';
import { Briefcase, Star, DollarSign, Loader2 } from 'lucide-react';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import type { DbJob } from '../../lib/jobs';

type Period = 'week' | 'month' | 'all';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekStart() {
  const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d;
}
function getMonthStart() {
  const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d;
}

function buildWeekBars(jobs: DbJob[]) {
  const sums = [0,0,0,0,0,0,0];
  const weekStart = getWeekStart().getTime();
  jobs.forEach((j) => {
    const d = new Date(j.updated_at);
    if (d.getTime() >= weekStart) sums[d.getDay()] += j.price * 0.965;
  });
  const max = Math.max(...sums, 1);
  return DAY_LABELS.map((l, i) => ({ l, h: Math.round((sums[i] / max) * 120), val: sums[i] }));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export const ProviderEarningsScreen: React.FC = () => {
  const { currentUser, isDemo } = useApp();
  const [period, setPeriod] = useState<Period>('week');
  const [jobs, setJobs]     = useState<DbJob[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo || !currentUser?.id) { setLoading(false); return; }
    Promise.all([
      supabase.from('jobs').select('*').eq('provider_id', currentUser.id).eq('status', 'completed'),
      supabase.from('profiles').select('rating').eq('id', currentUser.id).maybeSingle(),
    ]).then(([jobsRes, profileRes]) => {
      setJobs((jobsRes.data ?? []) as DbJob[]);
      setRating(profileRes.data?.rating ?? 0);
      setLoading(false);
    });
  }, [currentUser?.id, isDemo]);

  const weekStart  = getWeekStart().getTime();
  const monthStart = getMonthStart().getTime();

  const filtered = jobs.filter((j) => {
    const t = new Date(j.updated_at).getTime();
    if (period === 'week')  return t >= weekStart;
    if (period === 'month') return t >= monthStart;
    return true;
  });

  const total    = filtered.reduce((s, j) => s + j.price * 0.965, 0);
  const jobCount = filtered.length;
  const bars     = buildWeekBars(jobs);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Earnings Dashboard" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            {(['week','month','all'] as Period[]).map((p) => (
              <button key={p} className={`tab-btn ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p === 'week' ? 'This Week' : p === 'month' ? 'Month' : 'All-Time'}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation:'spin 0.8s linear infinite' }} />
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>Loading earnings…</span>
            </div>
          ) : (
            <>
              <div className="card">
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:40, color:'var(--text-primary)' }}>
                  R{total.toFixed(0)}
                </div>
                <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:20 }}>
                  After platform fee {period === 'week' ? '· This Week' : period === 'month' ? '· This Month' : '· All Time'}
                </div>

                {/* Bar chart — always shows current week */}
                <div className="earn-bars-row">
                  {bars.map((b) => (
                    <div key={b.l} className="earn-bar">
                      <div className="earn-bar-fill" style={{ height: b.h, background: b.val > 0 ? 'var(--teal)' : 'var(--border)' }} />
                      <span className="earn-bar-label">{b.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                {[
                  { icon:<Briefcase size={18} color="var(--teal)" />,       label:'Jobs Done',    val:String(jobCount) },
                  { icon:<Star size={18} color="var(--yellow-dark)" />,     label:'Avg Rating',   val:rating > 0 ? rating.toFixed(1) : '—' },
                  { icon:<DollarSign size={18} color="var(--green)" />,     label:'Platform Fee', val:'3.5%' },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{ textAlign:'center' }}>
                    <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>{s.icon}</div>
                    <div className="stat-num" style={{ textAlign:'center', fontSize:22 }}>{s.val}</div>
                    <div className="stat-label" style={{ textAlign:'center' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="section-title">Recent Completed Jobs</div>

              {filtered.length === 0 ? (
                <div className="card" style={{ textAlign:'center', padding:24 }}>
                  <Briefcase size={34} color="var(--text-muted)" />
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16, marginTop:10 }}>No earnings yet</div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:6 }}>
                    Completed in-app jobs will appear here.
                  </div>
                </div>
              ) : (
                filtered.map((j, i) => (
                  <div key={j.id} className="card animate-in" style={{ animationDelay:`${i*0.04}s`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14 }}>{j.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{j.consumer_name} · {formatDate(j.updated_at)}</div>
                    </div>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:'var(--green)' }}>
                      +R{(j.price * 0.965).toFixed(0)}
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          <div style={{ background:'var(--teal-light)', border:'1px solid var(--teal)', borderRadius:'var(--radius-sm)', padding:'12px 14px' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--teal)', marginBottom:4 }}>💳 Platform Fee</div>
            <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>
              A 3.5% fee is auto-deducted from each completed in-app paid job. Off-app payments receive no platform benefits or dispute support.
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ProviderNav />
    </div>
  );
};
