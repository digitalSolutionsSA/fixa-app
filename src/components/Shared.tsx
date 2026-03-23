import React from 'react';
import { Home, Briefcase, DollarSign, User, MapPin, Shield, Bell, ChevronLeft, Info, AlertTriangle, Star, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Screen } from '../types';

export const FIXALogo: React.FC<{ size?: 'sm'|'md'|'lg' }> = ({ size = 'md' }) => {
  const fs = size === 'sm' ? 20 : size === 'md' ? 26 : 38;
  return (
    <div className="logo-wrap">
      <span className="logo-main" style={{ fontSize: fs }}>FI<span className="logo-x">X</span>A</span>
      <span className="logo-sub">by PUBLICON</span>
    </div>
  );
};

export const RatingStars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 13 }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
    <Star size={size} fill="var(--yellow)" color="var(--yellow)" />
    <span style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:size, color:'var(--text-primary)' }}>{rating.toFixed(1)}</span>
  </span>
);

export const Avt: React.FC<{ initials: string; size?: number; bg?: string }> = ({ initials, size = 48, bg }) => (
  <div className="avatar" style={{ width:size, height:size, fontSize:size*0.36, background: bg || undefined }}>
    {initials}
  </div>
);

export const NotifBell: React.FC<{ count?: number }> = ({ count = 0 }) => (
  <div style={{ position:'relative', cursor:'pointer' }}>
    <Bell size={22} color="white" />
    {count > 0 && <span style={{ position:'absolute', top:-4, right:-4, background:'var(--red-panic)', color:'white', fontSize:9, fontWeight:800, width:15, height:15, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)' }}>{count}</span>}
  </div>
);

export const AppHeader: React.FC<{
  title?: string;
  back?: Screen;
  showLogo?: boolean;
  right?: React.ReactNode;
  sub?: React.ReactNode;
}> = ({ title, back, showLogo, right, sub }) => {
  const { navigate } = useApp();
  return (
    <div style={{ background:'var(--teal)', flexShrink:0, boxShadow:'0 2px 8px rgba(0,0,0,0.15)', zIndex:10 }}>
      <div style={{ height:60, display:'flex', alignItems:'center', gap:12, padding:'0 20px' }}>
        {back && (
          <button className="back-btn" onClick={() => navigate(back)}>
            <ChevronLeft size={20} color="white" />
          </button>
        )}
        {showLogo ? <FIXALogo /> : (
          <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:19, color:'white', flex:1 }}>{title}</h2>
        )}
        {right && <div style={{ marginLeft:'auto' }}>{right}</div>}
        {!right && !showLogo && <Info size={18} color="rgba(255,255,255,0.5)" style={{ marginLeft:'auto' }} />}
      </div>
      {sub && <div style={{ padding:'0 20px 14px' }}>{sub}</div>}
    </div>
  );
};

export const PanicBanner: React.FC = () => {
  const { panicActive, dismissPanic } = useApp();
  if (!panicActive) return null;
  return (
    <div style={{ background:'var(--red-panic)', padding:'12px 20px', display:'flex', alignItems:'center', gap:10, flexShrink:0, animation:'fadeIn 0.3s ease' }}>
      <AlertTriangle size={18} color="white" />
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:'var(--font-head)', fontWeight:800, color:'white', fontSize:13 }}>🚨 Emergency Alert Sent</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.85)', marginTop:1 }}>Your trusted contact & admin have been notified. GPS logged.</div>
      </div>
      <button onClick={dismissPanic} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:8, padding:'6px 12px', color:'white', fontFamily:'var(--font-head)', fontWeight:700, fontSize:12, cursor:'pointer' }}>Dismiss</button>
    </div>
  );
};

export const ConsumerNav: React.FC = () => {
  const { screen, navigate } = useApp();
  const items: { label:string; icon:React.ReactNode; screen:Screen }[] = [
    { label:'Home',     icon:<Home size={22}/>,     screen:'consumer-home' },
    { label:'Bookings', icon:<Briefcase size={22}/>, screen:'consumer-bookings' },
    { label:'Track',    icon:<MapPin size={22}/>,    screen:'job-in-progress' },
    { label:'Safety',   icon:<Shield size={22}/>,    screen:'consumer-safety' },
    { label:'Profile',  icon:<User size={22}/>,      screen:'consumer-profile' },
  ];
  return (
    <div className="bottom-nav">
      {items.map(i => (
        <button key={i.screen} className={`nav-item ${screen===i.screen?'active':''}`} onClick={() => navigate(i.screen)}>
          {i.icon}<span>{i.label}</span>
        </button>
      ))}
    </div>
  );
};

export const ProviderNav: React.FC = () => {
  const { screen, navigate } = useApp();
  const items: { label:string; icon:React.ReactNode; screen:Screen; badge?:number }[] = [
    { label:'Home',     icon:<Home size={22}/>,       screen:'provider-home' },
    { label:'Jobs',     icon:<Briefcase size={22}/>,  screen:'provider-jobs',     badge:2 },
    { label:'Earnings', icon:<DollarSign size={22}/>, screen:'provider-earnings' },
    { label:'Ranking',  icon:<BarChart2 size={22}/>,  screen:'provider-ranking' },
    { label:'Profile',  icon:<User size={22}/>,       screen:'provider-profile' },
  ];
  return (
    <div className="bottom-nav">
      {items.map(i => (
        <button key={i.screen} className={`nav-item ${screen===i.screen?'active':''}`} onClick={() => navigate(i.screen)}>
          <div style={{ position:'relative' }}>
            {i.icon}
            {i.badge && <span className="nav-badge">{i.badge}</span>}
          </div>
          <span>{i.label}</span>
        </button>
      ))}
    </div>
  );
};
