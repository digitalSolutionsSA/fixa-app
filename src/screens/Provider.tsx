import React, { useState } from 'react';
import { MapPin, ChevronRight, Check, Star, BarChart2, CheckCircle, AlertTriangle, DollarSign, TrendingUp, UserCheck, Clock, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader, ProviderNav, ConsumerNav, RatingStars, Avt, NotifBell } from '../components/Shared';
import type { Provider } from '../types';
import { PROVIDERS } from './Consumer';

// ── Provider Home ─────────────────────────────────────────────────────────────
export const ProviderHomeScreen: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={{ background:'var(--teal)', padding:'16px 20px 22px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', maxWidth:700, margin:'0 auto', width:'100%' }}>
          <div className="logo-wrap">
            <span className="logo-main">FI<span className="logo-x">X</span>A</span>
            <span className="logo-sub">by PUBLICON</span>
          </div>
          <NotifBell count={1} />
        </div>
        <div style={{ maxWidth:700, margin:'14px auto 0', width:'100%' }}>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'white' }}>Welcome back, Danny</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#4ADE80' }} />
            <span style={{ color:'rgba(255,255,255,0.85)', fontSize:14 }}>You're Live &amp; Visible in Sandton.</span>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[{val:'2',l:'New Requests',color:'var(--red-panic)'},{val:'R4,650',l:'This Week',color:'var(--teal)'},{val:'4.8',l:'Rating',color:'var(--yellow-dark)'}].map((s,i) => (
              <div key={i} className="stat-card" style={{ textAlign:'center', cursor:i===0?'pointer':undefined }} onClick={i===0?() => navigate('provider-job-request'):undefined}>
                <div className="stat-num" style={{ color:s.color, textAlign:'center' }}>{s.val}</div>
                <div className="stat-label" style={{ textAlign:'center' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:15 }}>Account Status</div>
              <span className="badge badge-green">● Live &amp; Visible</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>Response Time</span>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, color:'var(--green)' }}>Excellent</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>Subscription</span>
              <span className="badge badge-teal">Active – R45/mo</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:14, color:'var(--text-secondary)' }}>Provider Score</span>
              <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, color:'var(--teal)' }}>92/100</span>
            </div>
          </div>

          {/* Action buttons */}
          <button className="btn btn-primary btn-full btn-lg" style={{ position:'relative', fontSize:16 }} onClick={() => navigate('provider-job-request')}>
            New Job Requests
            <span style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.25)', borderRadius:20, padding:'2px 8px', fontFamily:'var(--font-head)', fontWeight:900, fontSize:13 }}>2</span>
          </button>
          <button className="btn btn-secondary btn-full" style={{ fontSize:15 }} onClick={() => navigate('provider-jobs')}>
            Current Jobs <ChevronRight size={16} />
          </button>

          {/* Tips */}
          <div className="card">
            <div className="section-title">Tips to Rank Higher</div>
            {['Complete jobs professionally','Respond quickly to requests','Get 5-star reviews','Accept in-app payments only'].map((tip,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:i<3?10:0 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Check size={13} color="white" />
                </div>
                <span style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:14 }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Emergency */}
          <button style={{ background:'linear-gradient(135deg, #c0392b, var(--red-panic))', border:'none', borderRadius:'var(--radius-md)', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, width:'100%', cursor:'pointer', boxShadow:'0 4px 16px rgba(229,62,62,0.3)' }}>
            <AlertTriangle size={22} color="white" />
            <span style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, color:'white' }}>Emergency? Tap for help →</span>
          </button>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Job Request ───────────────────────────────────────────────────────
export const ProviderJobRequestScreen: React.FC = () => {
  const { navigate } = useApp();
  const [accepted, setAccepted] = useState<string|null>(null);
  const jobs = [
    { id:'a', title:'Blocked Sink',  customer:'Lisa M.', location:'Sandton', distance:'3.5 km', price:450, urgent:true,  desc:'Customer needs sink unclogged today.' },
    { id:'b', title:'Mount TV',       customer:'James K.', location:'Rosebank', distance:'6.2 km', price:750, urgent:false, desc:'75" TV to be mounted on brick wall.' },
  ];
  const handleAccept = (id: string) => {
    setAccepted(id);
    setTimeout(() => navigate('provider-jobs'), 1600);
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="New Job Requests" back="provider-home" />
      <div className="screen">
        <div className="screen-content">
          {accepted ? (
            <div className="empty-state scale-pop" style={{ minHeight:300 }}>
              <div style={{ width:90, height:90, borderRadius:'50%', background:'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <CheckCircle size={50} color="var(--green)" />
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22 }}>Job Accepted!</div>
              <div style={{ fontSize:15, color:'var(--text-secondary)' }}>Navigating to your jobs…</div>
            </div>
          ) : (
            <>
              {jobs.map((job,i) => (
                <div key={job.id} className="card animate-in" style={{ animationDelay:`${i*0.07}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20 }}>{job.title}</div>
                        {job.urgent && <span className="badge badge-red">Urgent</span>}
                      </div>
                      <div style={{ fontSize:14, color:'var(--text-secondary)', marginTop:4 }}>{job.desc}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                    <MapPin size={14} color="var(--text-muted)" />
                    <span style={{ fontSize:14, color:'var(--text-secondary)' }}>{job.customer} – {job.location}, {job.distance}</span>
                  </div>
                  <div className="divider" />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:16 }}>
                    <div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:32, color:'var(--text-primary)' }}>R{job.price}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}><strong>Confirmed Price</strong> (In-App Payment Only)</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>After 3.5% platform fee:</div>
                      <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:16, color:'var(--green)' }}>R{(job.price*0.965).toFixed(0)} earned</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <button className="btn btn-secondary" onClick={() => navigate('provider-home')}>Decline</button>
                    <button className="btn btn-accent" onClick={() => handleAccept(job.id)}>Accept Job</button>
                  </div>
                </div>
              ))}
              <button className="btn btn-primary btn-full" onClick={() => navigate('provider-jobs')}>View All Jobs</button>
            </>
          )}
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Jobs ─────────────────────────────────────────────────────────────
export const ProviderJobsScreen: React.FC = () => {
  const { navigate } = useApp();
  const [tab, setTab] = useState<'new'|'active'|'done'>('new');
  const allJobs = {
    new:    [{ t:'Blocked Sink', c:'Lisa M.',     l:'Sandton',  km:'3.5', p:450, urg:true  },{ t:'Mount TV',     c:'James K.',   l:'Rosebank', km:'6.2', p:750, urg:false }],
    active: [{ t:'Leak Fix',     c:'Thandi D.',   l:'Fourways', km:'4.1', p:380, urg:false }],
    done:   [{ t:'Geyser Install',c:'Peter V.',    l:'Midrand',  km:'8.0', p:1200,urg:false },{ t:'Tap Repair',   c:'Susan M.',   l:'Sandton',  km:'3.0', p:320, urg:false }],
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="My Jobs" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab==='new'?'active':''}`} onClick={() => setTab('new')}>New (2)</button>
            <button className={`tab-btn ${tab==='active'?'active':''}`} onClick={() => setTab('active')}>Active</button>
            <button className={`tab-btn ${tab==='done'?'active':''}`} onClick={() => setTab('done')}>Completed</button>
          </div>
          {allJobs[tab].map((j,i) => (
            <div key={i} className="card card-clickable animate-in" style={{ animationDelay:`${i*0.06}s` }} onClick={() => navigate('provider-job-request')}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:16 }}>{j.t}</div>
                    {j.urg && <span className="badge badge-red" style={{ fontSize:10 }}>Urgent</span>}
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{j.c}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>{j.l} · {j.km} km</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20 }}>R{j.p}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>In-App Only</div>
                </div>
              </div>
              {tab==='new' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={e => e.stopPropagation()}>Details</button>
                  <button className="btn btn-accent btn-sm" onClick={e => { e.stopPropagation(); navigate('provider-home'); }}>Accept</button>
                </div>
              )}
              {tab==='done' && <div style={{ marginTop:8 }}><RatingStars rating={4.8} size={13} /></div>}
            </div>
          ))}
          {allJobs[tab].length===0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:16 }}>No jobs here</div>
            </div>
          )}
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Earnings ─────────────────────────────────────────────────────────
export const ProviderEarningsScreen: React.FC = () => {
  const [period, setPeriod] = useState<'week'|'month'|'all'>('week');
  const bars = [
    {l:'Mon',h:45},{l:'Tue',h:62},{l:'Wed',h:38},{l:'Thu',h:71},{l:'Fri',h:55},{l:'Sat',h:85},{l:'Sun',h:95,hi:true},
  ];
  const totals = { week:'4,650', month:'18,200', all:'94,750' };
  const jobNums = { week:'7', month:'28', all:'128' };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Earnings Dashboard" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${period==='week'?'active':''}`}  onClick={() => setPeriod('week')}>This Week</button>
            <button className={`tab-btn ${period==='month'?'active':''}`} onClick={() => setPeriod('month')}>Month</button>
            <button className={`tab-btn ${period==='all'?'active':''}`}   onClick={() => setPeriod('all')}>All-Time</button>
          </div>

          {/* Total */}
          <div className="card">
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:40, color:'var(--text-primary)' }}>R{totals[period]}</div>
            <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:20 }}>Total Earnings</div>
            <div className="earn-bars-row">
              {bars.map(b => (
                <div key={b.l} className="earn-bar">
                  <div className={`earn-bar-fill ${b.hi?'hi':''}`} style={{ height:b.h }} />
                  <span className="earn-bar-label">{b.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[
              { icon:<Briefcase size={18} color="var(--teal)"/>,    label:'Jobs Done',  val:jobNums[period] },
              { icon:<Star      size={18} color="var(--yellow-dark)"/>, label:'Avg Rating', val:'4.8' },
              { icon:<DollarSign size={18} color="var(--green)"/>,  label:'Platform Fee',val:'3.5%' },
            ].map((s,i) => (
              <div key={i} className="stat-card" style={{ textAlign:'center' }}>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:6 }}>{s.icon}</div>
                <div className="stat-num" style={{ textAlign:'center', fontSize:22 }}>{s.val}</div>
                <div className="stat-label" style={{ textAlign:'center' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div className="section-title">Recent Jobs</div>
          {[
            { n:"Jason's Plumbing", s:'Blocked Sink', w:'Today',     d:'3.1 km', p:450, r:5 },
            { n:'Mount TV',          s:'TV Mounting',  w:'Yesterday', d:'6.2 km', p:750, r:4 },
            { n:'Blocked Sink',      s:'Plumbing',     w:'Last week', d:'9.2 km', p:425, r:4 },
          ].map((j,i) => (
            <div key={i} className="card animate-in" style={{ animationDelay:`${i*0.05}s`, marginBottom:i<2?10:0 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <Avt initials={j.n.substring(0,2).toUpperCase()} size={46} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14 }}>{j.n}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{j.s}</div>
                  <div style={{ display:'flex', gap:6, marginTop:3, alignItems:'center' }}>
                    <MapPin size={11} color="var(--text-muted)" />
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>{j.d}</span>
                    <RatingStars rating={j.r} size={11} />
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{j.w}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:18 }}>R{j.p}</div>
                  <div style={{ fontSize:11, color:'var(--green)' }}>+R{(j.p*0.965).toFixed(0)} net</div>
                </div>
              </div>
            </div>
          ))}

          {/* Payout note */}
          <div style={{ background:'var(--teal-light)', border:'1px solid var(--teal)', borderRadius:'var(--radius-sm)', padding:'12px 14px' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--teal)', marginBottom:4 }}>💳 Platform Fee</div>
            <p style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.6 }}>A 3.5% fee is auto-deducted from each completed in-app paid job. Off-app payments receive no platform benefits or dispute support.</p>
          </div>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Ranking ──────────────────────────────────────────────────────────
export const ProviderRankingScreen: React.FC = () => {
  const { navigate } = useApp();
  const factors = [
    { icon:'📋', label:'Job Completion Rate',           weight:'25%', done:true },
    { icon:'⭐', label:'Review Score (90-day weighted)', weight:'25%', done:true },
    { icon:'⏱️', label:'Response Time',                 weight:'20%', done:true },
    { icon:'💳', label:'In-App Payment Compliance',     weight:'15%', done:true },
    { icon:'🪪', label:'Verification Level',             weight:'10%', done:true },
    { icon:'📦', label:'Subscription Tier',              weight:'5%',  done:false },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Provider Performance" back="provider-home" />
      <div className="screen">
        <div className="screen-content">
          {/* Score */}
          <div className="card animate-in" style={{ textAlign:'center', padding:28 }}>
            <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:8 }}>Your Provider Score</div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <span style={{ fontSize:40 }}>🏆</span>
              <div style={{ flex:1 }}>
                <div className="progress-bar"><div className="progress-fill" style={{ width:'92%' }} /></div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>0</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>100</span>
                </div>
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:40, color:'var(--teal)' }}>92</div>
            </div>
            <div style={{ marginTop:10 }}><span className="badge badge-green">Top 10% in Sandton</span></div>
          </div>

          {/* Ranking factors */}
          <div className="card d1 animate-in">
            <div className="section-title">Ranking Algorithm</div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14, lineHeight:1.5 }}>Your ranking is recalculated after every job based on these weighted factors:</p>
            {factors.map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--bg)', borderRadius:'var(--radius-sm)', padding:'12px 14px', marginBottom:i<factors.length-1?8:0 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{f.icon}</span>
                <span style={{ flex:1, fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{f.label}</span>
                <span className="badge badge-teal" style={{ fontSize:11 }}>{f.weight}</span>
                <div style={{ width:24, height:24, borderRadius:'50%', background:f.done?'var(--green)':'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {f.done && <Check size={13} color="white" />}
                </div>
              </div>
            ))}
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:12, lineHeight:1.5 }}>Qualifications boost trust but do not guarantee higher placement. Only in-app paid jobs count toward ranking.</p>
          </div>

          {/* Subscription tiers */}
          <div className="section-title d2 animate-in">Subscription Tiers</div>
          <div className="tier-card free-tier d2 animate-in">
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'var(--text-primary)' }}>Free Tier</div>
            <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>5 free leads · Limited profile visibility · Standard features</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--text-primary)' }}>R0/month</div>
          </div>
          <div className="tier-card active-tier d3 animate-in">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'white' }}>Active Tier ✓ Current</div>
              <span style={{ background:'var(--yellow)', color:'#333', padding:'4px 10px', borderRadius:8, fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>Active</span>
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>Unlimited leads · Standard ranking · Full job history · Dispute support</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:24, color:'white' }}>R45/month</div>
          </div>
          <div className="tier-card pro-tier d4 animate-in">
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:16, color:'white' }}>Pro Tier <span style={{ fontSize:12, opacity:0.7 }}>Coming Soon</span></div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.8)', lineHeight:1.5 }}>Ranking boost · Priority support · Enhanced trust badges · Featured placement</div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:24, color:'var(--yellow)' }}>TBD</div>
          </div>

          {/* Verification levels */}
          <div className="card d5 animate-in">
            <div className="section-title">Verification Level</div>
            {[
              { l:'Level 1 – Identity Confirmed', d:'Government ID upload · Selfie match · AI confidence score', done:true },
              { l:'Level 2 – Documents Screened',  d:'Certificates uploaded · AI checks for consistency & tampering', done:true },
              { l:'Level 3 – Partner Verified',     d:'Human review or partner confirmation (Phase 2)', done:false },
            ].map((v,i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', paddingBottom:i<2?14:0, borderBottom:i<2?'1px solid var(--border)':'none', marginBottom:i<2?14:0 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:v.done?'var(--green)':'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {v.done ? <Check size={14} color="white" /> : <span style={{ color:'var(--text-muted)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>3</span>}
                </div>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, marginBottom:3 }}>{v.l}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5 }}>{v.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};

// ── Provider Profile ──────────────────────────────────────────────────────────
export const ProviderProfileScreen: React.FC = () => {
  const { navigate, setMode } = useApp();
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={{ background:'var(--teal)', padding:'24px 20px 32px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:16, alignItems:'center', maxWidth:700, margin:'0 auto' }}>
          <Avt initials="DN" size={68} />
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'white' }}>Danny Nkosi</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)', marginTop:2 }}>Plumber · Active Tier</div>
            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              <span className="badge" style={{ background:'rgba(255,255,255,0.2)', color:'white', fontSize:11 }}>✓ ID Verified</span>
              <RatingStars rating={4.8} size={12} />
            </div>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-content">
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[{v:'128',l:'Jobs'},{v:'4.8',l:'Rating'},{v:'92',l:'Score'},{v:'R45',l:'Tier/mo'}].map((s,i) => (
              <div key={i} className="stat-card" style={{ textAlign:'center', padding:14 }}>
                <div className="stat-num" style={{ color:'var(--teal)', textAlign:'center', fontSize:20 }}>{s.v}</div>
                <div className="stat-label" style={{ textAlign:'center' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {[
            { label:'Edit Profile',                icon:'✏️',  nav:null },
            { label:'Verification Documents',      icon:'📄',  nav:null },
            { label:'Subscription & Billing',      icon:'💳',  nav:null },
            { label:'Ranking & Performance',       icon:'📊',  nav:'provider-ranking' as const },
            { label:'Earnings History',            icon:'💰',  nav:'provider-earnings' as const },
            { label:'Job History',                 icon:'📋',  nav:'provider-jobs' as const },
            { label:'Notifications',               icon:'🔔',  nav:null },
            { label:'Privacy & Data (POPIA)',      icon:'🔒',  nav:null },
            { label:'Legal Disclaimers',           icon:'⚖️',  nav:null },
            { label:'Help & Support',              icon:'❓',  nav:null },
          ].map((item,i) => (
            <button key={i} className="card" style={{ width:'100%', display:'flex', alignItems:'center', gap:14, cursor:'pointer', border:'none', textAlign:'left', transition:'box-shadow 0.2s' }}
              onClick={() => item.nav && navigate(item.nav as any)}
              onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <span style={{ flex:1, fontFamily:'var(--font-head)', fontWeight:700, fontSize:15 }}>{item.label}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}

          <button className="btn btn-full" style={{ background:'var(--red-light)', color:'var(--red-panic)', fontFamily:'var(--font-head)', fontWeight:800, border:'2px solid var(--red-panic)', borderRadius:'var(--radius-sm)', padding:'13px', fontSize:14, cursor:'pointer', marginTop:8 }}
            onClick={() => { setMode(null); navigate('mode-select'); }}>
            Sign Out
          </button>
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};
