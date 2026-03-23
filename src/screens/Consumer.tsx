import React, { useState } from 'react';
import { MapPin, Shield, ChevronRight, AlertTriangle, Phone, MessageCircle, Navigation, CheckCircle, Wrench, Zap, Car, MoreHorizontal, Search, Filter, Star, UserCheck, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppHeader, ConsumerNav, RatingStars, Avt, NotifBell, PanicBanner } from '../components/Shared';
import type { Provider } from '../types';

export const PROVIDERS: Provider[] = [
  { id:'1', name:"Jason's Plumbing",    trade:'Plumber',            rating:4.8, jobCount:128, distance:'2.1 km', priceFrom:450, verified:true,  qualVerified:true,  available:true,  initials:'JP', score:96 },
  { id:'2', name:"Maya Electrical",      trade:'Electrician',        rating:4.8, jobCount:93,  distance:'3.4 km', priceFrom:650, verified:true,  qualVerified:true,  available:true,  initials:'ME', score:94 },
  { id:'3', name:"Mike the Handyman",    trade:'Handyman',           rating:4.8, jobCount:156, distance:'1.8 km', priceFrom:200, verified:true,  qualVerified:false, available:false, initials:'MH', score:91 },
  { id:'4', name:"Sarah's Repairs",      trade:'General Contractor', rating:4.9, jobCount:97,  distance:'4.2 km', priceFrom:200, verified:true,  qualVerified:true,  available:true,  initials:'SR', score:89 },
  { id:'5', name:"John's Electric",      trade:'Electrician',        rating:4.7, jobCount:103, distance:'5.1 km', priceFrom:400, verified:true,  qualVerified:false, available:false, initials:'JE', score:85 },
];

// ── Consumer Home ─────────────────────────────────────────────────────────────
export const ConsumerHomeScreen: React.FC = () => {
  const { navigate, selectProvider } = useApp();
  const cats = [
    { icon:<Wrench size={28} color="var(--teal)"/>,     label:'Plumber',       sub:'Fast & reliable' },
    { icon:<Zap    size={28} color="var(--yellow-dark)"/>, label:'Electrician', sub:'Certified pros' },
    { icon:<Car    size={28} color="var(--navy)"/>,      label:'Mechanic',      sub:'Mobile & trusted' },
    { icon:<MoreHorizontal size={28} color="var(--text-secondary)"/>, label:'More Services', sub:'View all' },
  ];
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
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'white' }}>Hi, Thandi 👋</div>
          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:14, marginTop:2 }}>What service do you need today?</div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {/* Category grid */}
          <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {cats.map(c => (
              <button key={c.label} onClick={() => navigate('find-provider')} style={{ background:'white', border:'1.5px solid var(--border)', borderRadius:'var(--radius-md)', padding:'20px 16px', cursor:'pointer', textAlign:'left', boxShadow:'var(--shadow-sm)', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ marginBottom:10 }}>{c.icon}</div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, color:'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>{c.sub}</div>
              </button>
            ))}
          </div>

          {/* Trust row */}
          <button onClick={() => navigate('find-provider')} className="card" style={{ display:'flex', alignItems:'center', gap:12, width:'100%', cursor:'pointer', border:'none', textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'var(--teal-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Shield size={18} color="var(--teal)" />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>All providers are verified &amp; background checked</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:2 }}>ID verification · Document screening · Review integrity</div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </button>

          {/* Emergency */}
          <button onClick={() => navigate('consumer-safety')} style={{ background:'var(--red-panic)', border:'none', borderRadius:'var(--radius-md)', padding:'18px 22px', display:'flex', alignItems:'center', gap:12, width:'100%', cursor:'pointer', boxShadow:'0 4px 16px rgba(229,62,62,0.3)', transition:'transform 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.transform='scale(1.01)')}
            onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
            <AlertTriangle size={22} color="white" />
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, color:'white' }}>Emergency? Tap for help →</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:2 }}>One tap sends alert to your trusted contact &amp; security partner</div>
            </div>
          </button>

          {/* Recently booked */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom:0 }}>Recently Booked</div>
              <button onClick={() => navigate('consumer-bookings')} style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--teal)', background:'none', border:'none', cursor:'pointer' }}>View all</button>
            </div>
            <button className="provider-row" onClick={() => { selectProvider(PROVIDERS[0]); navigate('provider-arrived'); }}>
              <Avt initials="SE" size={50} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>Sipho the Electrician</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>Plug repair · Completed</div>
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <span className="badge badge-green">Completed</span>
                  <RatingStars rating={5} size={12} />
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          </div>

          {/* Top providers shortcut */}
          <div>
            <div className="section-row">
              <div className="section-title" style={{ marginBottom:0 }}>Top Providers Near You</div>
              <button onClick={() => navigate('top-providers')} style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--teal)', background:'none', border:'none', cursor:'pointer' }}>View all</button>
            </div>
            {PROVIDERS.slice(0,2).map((p,i) => (
              <button key={p.id} className="provider-row" style={{ marginBottom:i===0?10:0 }} onClick={() => { selectProvider(p); navigate('find-provider'); }}>
                <Avt initials={p.initials} size={48} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{p.name}</div>
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:3 }}>
                    <RatingStars rating={p.rating} size={12} />
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>· {p.distance}</span>
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:4 }}>
                    {p.verified && <span className="badge badge-green" style={{ fontSize:10 }}>✓ ID Verified</span>}
                    {p.available && <span className="badge badge-teal" style={{ fontSize:10 }}>● Available</span>}
                  </div>
                </div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14 }}>From R{p.priceFrom}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Find Provider ─────────────────────────────────────────────────────────────
export const FindProviderScreen: React.FC = () => {
  const { navigate, selectProvider } = useApp();
  const [filter, setFilter] = useState<'near'|'top'|'available'>('near');
  const filtered = filter === 'available' ? PROVIDERS.filter(p => p.available) : PROVIDERS;
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Find a Provider" back="consumer-home"
        sub={
          <div style={{ display:'flex', gap:8, position:'relative' }}>
            <div style={{ flex:1, position:'relative' }}>
              <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.6)' }} />
              <input style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:'var(--radius-sm)', border:'1.5px solid rgba(255,255,255,0.25)', background:'rgba(255,255,255,0.15)', color:'white', fontFamily:'var(--font-body)', fontSize:14, outline:'none' }} placeholder="Search plumbers, electricians…" />
            </div>
            <button style={{ background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:'var(--radius-sm)', padding:'0 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, color:'white', fontFamily:'var(--font-head)', fontWeight:700, fontSize:13 }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        }
      />
      <div className="screen">
        <div className="screen-content">
          {/* Map */}
          <div className="map-bg" style={{ borderRadius:'var(--radius-md)', height:220 }}>
            <div style={{ position:'absolute', top:12, left:12 }}>
              <span className="badge badge-teal">📍 Sandton</span>
            </div>
            {[[28,40],[55,65],[72,28],[42,78],[18,62]].map(([x,y],i) => (
              <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)' }}>
                <div style={{ width:i===0?34:26, height:i===0?34:26, borderRadius:'50%', background:i===0?'var(--teal)':'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)', border:i===0?'2px solid white':'none' }}>
                  <MapPin size={i===0?16:12} color="white" />
                </div>
                {i===0 && <div style={{ position:'absolute', top:-28, left:'50%', transform:'translateX(-50%)', background:'var(--teal)', color:'white', borderRadius:6, padding:'2px 8px', fontSize:11, fontFamily:'var(--font-head)', fontWeight:700, whiteSpace:'nowrap' }}>You</div>}
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="chip-scroll">
            {([['near','📍 Near Me'],['top','⭐ Top Rated'],['available','🟢 Available Now']] as const).map(([id,label]) => (
              <button key={id} className={`chip ${filter===id?'active':'inactive'}`} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>

          {/* Provider list */}
          {filtered.map((p,i) => (
            <button key={p.id} className="provider-row animate-in" style={{ animationDelay:`${i*0.05}s` }} onClick={() => { selectProvider(p); navigate('provider-arrived'); }}>
              <Avt initials={p.initials} size={54} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{p.name}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, flexShrink:0, marginLeft:8 }}>From R{p.priceFrom}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
                  <RatingStars rating={p.rating} size={12} />
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>· {p.distance}</span>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                  {p.verified     && <span className="badge badge-green"  style={{ fontSize:10, padding:'2px 7px' }}>✓ ID Verified</span>}
                  {p.qualVerified && <span className="badge badge-teal"   style={{ fontSize:10, padding:'2px 7px' }}>✓ Qual. Screened</span>}
                  {p.available    && <span className="badge badge-green"  style={{ fontSize:10, padding:'2px 7px' }}>● Available</span>}
                  {!p.available   && <span className="badge badge-gray"   style={{ fontSize:10, padding:'2px 7px' }}>Busy</span>}
                </div>
              </div>
            </button>
          ))}

          <button className="btn btn-primary btn-full btn-lg" onClick={() => { selectProvider(PROVIDERS[0]); navigate('job-in-progress'); }}>
            Book a Provider
          </button>
          <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', lineHeight:1.5 }}>
            Identity and document checks are automated screenings and do not constitute professional certification or guarantees.
          </p>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Job In Progress ───────────────────────────────────────────────────────────
export const JobInProgressScreen: React.FC = () => {
  const { navigate, triggerPanic, selectedProvider } = useApp();
  const p = selectedProvider || PROVIDERS[0];
  const steps = [
    { label:'Job Confirmed',     time:'09:10', state:'done' },
    { label:'Provider On Route', time:'09:35', state:'done' },
    { label:'Arrived',           time:null,    state:'active' },
    { label:'Job Complete',      time:null,    state:'idle' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Job in Progress" back="find-provider"
        right={<button className="back-btn"><Navigation size={16} color="white" /></button>}
      />
      <PanicBanner />
      <div className="screen">
        {/* Map */}
        <div className="map-bg" style={{ height:220, margin:'16px', borderRadius:'var(--radius-md)', flexShrink:0 }}>
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
            <polyline points="60,180 110,130 170,90 220,60" stroke="var(--teal)" strokeWidth="3" strokeDasharray="7,5" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ position:'absolute', left:'18%', top:'72%', transform:'translate(-50%,-50%)' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)', border:'2px solid white' }}>
              <Wrench size={16} color="white" />
            </div>
          </div>
          <div style={{ position:'absolute', right:'18%', top:'22%', transform:'translate(50%,-50%)' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-md)' }}>
              <MapPin size={15} color="white" />
            </div>
          </div>
          <div style={{ position:'absolute', top:12, right:12, width:48, height:48, borderRadius:'50%', background:'var(--teal)', border:'3px solid white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-lg)' }}>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:800, color:'white', fontSize:14 }}>{p.initials}</span>
          </div>
          <div style={{ position:'absolute', bottom:12, left:12, background:'white', borderRadius:10, padding:'6px 12px', boxShadow:'var(--shadow-md)' }}>
            <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--text-primary)' }}>ETA: <span style={{ color:'var(--green)' }}>12 min</span></span>
          </div>
        </div>

        <div className="screen-content" style={{ paddingTop:0 }}>
          {/* Status card */}
          <div className="card animate-in">
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18 }}>{p.name.split("'")[0].split(' ')[0]} is on the way</div>
            <div style={{ fontSize:14, color:'var(--text-secondary)', marginTop:3 }}>Arriving in <strong style={{ color:'var(--green)' }}>12 minutes</strong></div>
            <div className="divider" />
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {steps.map((s,i) => (
                <React.Fragment key={s.label}>
                  <div className="step-item">
                    <div className={`step-dot ${s.state}`} />
                    <span style={{ flex:1, fontFamily:'var(--font-head)', fontWeight:s.state!=='idle'?700:500, fontSize:14, color:s.state!=='idle'?'var(--text-primary)':'var(--text-muted)' }}>{s.label}</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{s.time || '—'}</span>
                  </div>
                  {i<steps.length-1 && <div className={`step-line ${s.state==='done'?'done':'idle'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Provider detail */}
          <div className="card d1 animate-in" style={{ display:'flex', gap:12, alignItems:'center' }}>
            <Avt initials={p.initials} size={52} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{p.name}</div>
              <RatingStars rating={p.rating} />
              <div style={{ display:'flex', gap:6, marginTop:4 }}>
                {p.verified && <span className="badge badge-green" style={{ fontSize:10 }}>✓ ID Verified</span>}
                <span className="badge badge-gray" style={{ fontSize:10 }}>{p.trade}</span>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18 }}>R{p.priceFrom}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>In-App</div>
            </div>
          </div>

          {/* Panic */}
          <button onClick={triggerPanic} className="btn btn-danger btn-full panic-pulse d2 animate-in" style={{ fontSize:16, padding:'18px', gap:10 }}>
            <AlertTriangle size={22} /> Panic / Emergency
          </button>
          <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', marginTop:-6 }}>Tap if you feel unsafe – help will be sent immediately. No guarantee of response times.</p>

          {/* Actions */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[{icon:<MessageCircle size={22}/>,label:'Chat'},{icon:<Phone size={22}/>,label:'Call'},{icon:<Navigation size={22}/>,label:'Track'}].map(a => (
              <button key={a.label} className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', border:'none', padding:'16px 8px', transition:'box-shadow 0.2s' }}>
                <div style={{ color:'var(--teal)' }}>{a.icon}</div>
                <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--text-secondary)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Provider Arrived ──────────────────────────────────────────────────────────
export const ProviderArrivedScreen: React.FC = () => {
  const { navigate, selectedProvider } = useApp();
  const p = selectedProvider || PROVIDERS[0];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="FIXA" showLogo back="consumer-home"
        right={<button className="back-btn"><Navigation size={16} color="white" /></button>}
      />
      <div className="screen">
        <div className="screen-content">
          {/* Arrival banner */}
          <div className="animate-in" style={{ background:'var(--green-light)', border:'2px solid var(--green)', borderRadius:'var(--radius-md)', padding:18, display:'flex', gap:14, alignItems:'flex-start' }}>
            <CheckCircle size={26} color="var(--green)" style={{ flexShrink:0, marginTop:1 }} />
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:17 }}>Your FIXA provider has arrived.</div>
              <div style={{ fontSize:14, color:'var(--text-secondary)', marginTop:3 }}>You can verify their profile before starting the job.</div>
            </div>
          </div>

          {/* Provider card */}
          <div className="card d1 animate-in">
            <div style={{ display:'flex', gap:16, alignItems:'center', paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
              <Avt initials={p.initials} size={64} />
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20 }}>{p.name}</div>
                <div style={{ display:'flex', gap:6, marginTop:4, alignItems:'center' }}>
                  <RatingStars rating={p.rating} size={14} />
                  <span style={{ fontSize:13, color:'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:6 }}>
                  {p.verified && <span className="badge badge-green">✓ ID Verified</span>}
                  <span className="badge badge-gray">{p.trade}</span>
                </div>
              </div>
            </div>
            <div style={{ paddingTop:16, display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { label:'Identity Verified',              done:p.verified },
                { label:'Qualification Screened',         done:p.qualVerified },
                { label:'Reviews from Paid Jobs Only',    done:true },
                { label:`${p.jobCount} Jobs Completed`,   done:true, icon:'🧰' },
              ].map((row,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:row.done?'var(--green)':'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {row.icon ? <span style={{ fontSize:13 }}>{row.icon}</span> : <CheckCircle size={14} color="white" />}
                  </div>
                  <span style={{ fontFamily:'var(--font-head)', fontWeight:row.done?700:500, fontSize:14, color:row.done?'var(--text-primary)':'var(--text-muted)' }}>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background:'#FFF8E1', border:'1px solid #F5B800', borderRadius:'var(--radius-sm)', padding:'12px 14px' }}>
            <p style={{ fontSize:12, color:'#7A6000', lineHeight:1.6 }}>⚠️ FIXA verifications are automated screenings and do not constitute professional certification or guarantees. Providers are independent contractors.</p>
          </div>

          <button className="btn btn-primary btn-full btn-lg d2 animate-in" onClick={() => navigate('job-in-progress')}>
            Verify &amp; Start Job
          </button>
          <button className="btn btn-secondary btn-full d3 animate-in" onClick={() => navigate('consumer-safety')}>
            Report Issue
          </button>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const ConsumerBookingsScreen: React.FC = () => {
  const { navigate } = useApp();
  const [tab, setTab] = useState<'active'|'past'>('active');
  const active = [{ name:"Jason's Plumbing", service:'Blocked Sink', date:'Today, 10:00', price:450, status:'On Route', initials:'JP' }];
  const past = [
    { name:'Sipho the Electrician', service:'Plug Repair',    date:'Last Monday',  price:350, status:'Completed', initials:'SE' },
    { name:'Mike the Handyman',     service:'Door Fix',        date:'2 weeks ago',  price:200, status:'Completed', initials:'MH' },
    { name:"Sarah's Repairs",       service:'Geyser Blanket',  date:'Last month',   price:550, status:'Completed', initials:'SR' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="My Bookings" />
      <div className="screen">
        <div className="screen-content">
          <div className="tab-row">
            <button className={`tab-btn ${tab==='active'?'active':''}`} onClick={() => setTab('active')}>Active ({active.length})</button>
            <button className={`tab-btn ${tab==='past'?'active':''}`} onClick={() => setTab('past')}>Past ({past.length})</button>
          </div>
          {(tab==='active'?active:past).map((b,i) => (
            <div key={i} className="card card-clickable animate-in" style={{ animationDelay:`${i*0.05}s` }} onClick={() => navigate(tab==='active'?'job-in-progress':'consumer-home')}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <Avt initials={b.initials} size={48} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{b.name}</div>
                  <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>{b.service}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{b.date}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:17 }}>R{b.price}</div>
                  <span className={`badge ${b.status==='Completed'?'badge-green':'badge-teal'}`} style={{ marginTop:4, display:'block', textAlign:'center' }}>{b.status}</span>
                </div>
              </div>
              {tab==='active' && (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:14 }}>
                  <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('provider-arrived'); }}>View Details</button>
                  <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate('job-in-progress'); }}>Track Job</button>
                </div>
              )}
            </div>
          ))}
          {(tab==='active'?active:past).length === 0 && (
            <div className="empty-state">
              <Briefcase size={40} />
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:16 }}>No bookings yet</div>
              <button className="btn btn-primary" onClick={() => navigate('find-provider')}>Find a Provider</button>
            </div>
          )}
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Safety Screen ─────────────────────────────────────────────────────────────
export const ConsumerSafetyScreen: React.FC = () => {
  const { triggerPanic } = useApp();
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Safety Centre" />
      <PanicBanner />
      <div className="screen">
        <div className="screen-content">
          {/* Panic */}
          <div style={{ background:'var(--red-light)', border:'2px solid var(--red-panic)', borderRadius:'var(--radius-lg)', padding:28, textAlign:'center' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, color:'var(--red-panic)', marginBottom:8 }}>⚠️ Emergency Panic Button</div>
            <div style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:22, maxWidth:360, margin:'0 auto 22px' }}>
              One tap sends your GPS location and alerts your trusted contact &amp; private security partner. Visible only during an active job.
            </div>
            <button onClick={triggerPanic} className="btn btn-danger panic-pulse btn-lg" style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:18, padding:'20px 56px' }}>
              🚨 PANIC
            </button>
            <p style={{ marginTop:14, fontSize:11, color:'var(--text-muted)', lineHeight:1.6 }}>
              No guaranteed response times. FIXA does not guarantee outcomes. Security escalation handled via licensed partner protocols.
            </p>
          </div>

          {/* Safety features */}
          <div className="section-title">Safety Features</div>
          {[
            { icon:'📍', title:'Live Job Tracking',         desc:'Track your provider\'s real-time location throughout your booking.' },
            { icon:'✅', title:'Provider Verification',      desc:'All providers submit government ID and documents for automated screening.' },
            { icon:'👥', title:'Trusted Contact Alerts',     desc:'Add a trusted person who is notified instantly when panic is activated.' },
            { icon:'🔒', title:'In-App Payments Only',       desc:'All jobs paid through the app. Dispute support available for in-app transactions.' },
            { icon:'🛡️', title:'Security Partner Network',   desc:'Panic alerts can be routed to a licensed private security partner in your area.' },
            { icon:'📋', title:'Incident Logging',           desc:'All safety events are GPS and timestamp logged in the admin system.' },
          ].map((f,i) => (
            <div key={i} className="card animate-in" style={{ animationDelay:`${i*0.04}s`, display:'flex', gap:14 }}>
              <div style={{ fontSize:30, lineHeight:1, flexShrink:0 }}>{f.icon}</div>
              <div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, marginBottom:4 }}>{f.title}</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}

          {/* Trusted contact */}
          <div className="card">
            <div className="section-title">Trusted Contact</div>
            <div className="form-group" style={{ marginBottom:12 }}>
              <label className="form-label">Name</label>
              <input className="input" placeholder="e.g. Nomsa Dlamini" defaultValue="Nomsa Dlamini" />
            </div>
            <div className="form-group" style={{ marginBottom:16 }}>
              <label className="form-label">Phone Number</label>
              <input className="input" placeholder="+27 82 000 0000" defaultValue="+27 82 555 0123" />
            </div>
            <button className="btn btn-primary btn-full">Save Trusted Contact</button>
          </div>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// Need Briefcase for empty state
import { Briefcase } from 'lucide-react';

// ── Top Providers ─────────────────────────────────────────────────────────────
export const TopProvidersScreen: React.FC = () => {
  const { navigate, selectProvider } = useApp();
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <AppHeader title="Top Providers in Your Area" back="consumer-home" />
      <div className="screen">
        <div className="screen-content">
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <MapPin size={15} color="var(--green)" />
            <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:600 }}>Sandton, 3.5 km away</span>
            <span className="badge badge-green" style={{ marginLeft:'auto' }}>✓ All Verified &amp; Rated</span>
          </div>
          {PROVIDERS.map((p,i) => (
            <button key={p.id} className="provider-row animate-in" style={{ animationDelay:`${i*0.05}s` }} onClick={() => { selectProvider(p); navigate('provider-arrived'); }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--teal)', color:'white', fontFamily:'var(--font-head)', fontWeight:800, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
              <Avt initials={p.initials} size={52} />
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:15 }}>{p.name}</div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, flexShrink:0 }}>From R{p.priceFrom}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                  <RatingStars rating={p.rating} size={12} />
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>({p.jobCount} jobs)</span>
                  <span style={{ fontSize:12, color:'var(--text-muted)' }}>· {p.distance}</span>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:5, flexWrap:'wrap', alignItems:'center' }}>
                  {p.verified && <span className="badge badge-green" style={{ fontSize:10 }}>✓ ID Verified</span>}
                  {p.qualVerified && <span className="badge badge-gray" style={{ fontSize:10 }}>✓ Qual. Screened</span>}
                  <span className="badge badge-gray" style={{ fontSize:10 }}>{p.trade}</span>
                  {i===0 && <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto', fontSize:12, padding:'6px 14px' }} onClick={e => { e.stopPropagation(); selectProvider(p); navigate('provider-arrived'); }}>Request Job</button>}
                </div>
              </div>
            </button>
          ))}
          <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)' }}>Ranked by Best Match · Response time · Reviews · Completion rate</p>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};

// ── Consumer Profile ──────────────────────────────────────────────────────────
export const ConsumerProfileScreen: React.FC = () => {
  const { navigate, setMode } = useApp();
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={{ background:'var(--teal)', padding:'24px 20px 32px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:16, alignItems:'center', maxWidth:700, margin:'0 auto' }}>
          <Avt initials="TD" size={64} />
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:22, color:'white' }}>Thandi Dlamini</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)', marginTop:2 }}>thandi@email.com</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>📍 Sandton, Johannesburg</div>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-content">
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[{val:'8',l:'Bookings'},{val:'4.9',l:'Avg Rating'},{val:'R3,850',l:'Total Spent'}].map((s,i) => (
              <div key={i} className="stat-card" style={{ textAlign:'center' }}>
                <div className="stat-num" style={{ color:'var(--teal)', textAlign:'center' }}>{s.val}</div>
                <div className="stat-label" style={{ textAlign:'center' }}>{s.l}</div>
              </div>
            ))}
          </div>

          {[
            { label:'Personal Information',     icon:'👤' },
            { label:'Trusted Contact',          icon:'👥', nav:'consumer-safety' as const },
            { label:'Payment Methods',          icon:'💳' },
            { label:'Booking History',          icon:'📋', nav:'consumer-bookings' as const },
            { label:'Notifications',            icon:'🔔' },
            { label:'Privacy &amp; Data (POPIA)', icon:'🔒' },
            { label:'Legal Disclaimers',        icon:'⚖️' },
            { label:'Help &amp; Support',         icon:'❓' },
          ].map((item,i) => (
            <button key={i} className="card" style={{ width:'100%', display:'flex', alignItems:'center', gap:14, cursor:'pointer', border:'none', textAlign:'left', transition:'box-shadow 0.2s' }}
              onClick={() => item.nav && navigate(item.nav)}
              onMouseEnter={e => e.currentTarget.style.boxShadow='var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='var(--shadow-sm)'}>
              <span style={{ fontSize:22 }}>{item.icon}</span>
              <span style={{ flex:1, fontFamily:'var(--font-head)', fontWeight:700, fontSize:15 }} dangerouslySetInnerHTML={{ __html: item.label }} />
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}

          <button className="btn btn-full" style={{ background:'var(--red-light)', color:'var(--red-panic)', fontFamily:'var(--font-head)', fontWeight:800, border:'2px solid var(--red-panic)', borderRadius:'var(--radius-sm)', padding:'13px', fontSize:14, cursor:'pointer', marginTop:8 }}
            onClick={() => { setMode(null); navigate('mode-select'); }}>
            Sign Out
          </button>
        </div>
      </div>
      <ConsumerNav />
    </div>
  );
};
