import React, { useState } from 'react';
import { Wrench, Shield, CreditCard, ArrowRight, Zap, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useApp();
  const [slide, setSlide] = useState(0);
  const slides = [
    { icon: <Wrench size={52} color="var(--yellow)" />, title: 'Trusted Local Tradespeople', sub: 'Find verified plumbers, electricians & mechanics near you in minutes.' },
    { icon: <Shield size={52} color="var(--yellow)" />, title: 'Safety First, Always', sub: 'Live tracking, panic alerts & background-checked providers for total peace of mind.' },
    { icon: <CreditCard size={52} color="var(--yellow)" />, title: 'Pay Securely In-App', sub: 'No cash, no surprises. Confirmed prices, insured when paid in-app.' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--teal)' }}>
      {/* Hero area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ marginBottom:40 }}>
          <div style={{ fontFamily:'var(--font-head)', fontSize:56, fontWeight:900, color:'white', letterSpacing:-1, lineHeight:1 }}>FI<span style={{ color:'var(--yellow)' }}>X</span>A</div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)', letterSpacing:'2px', textTransform:'uppercase', marginTop:6 }}>by PUBLICON</div>
        </div>
        <div style={{ width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28, animation:'scalePop 0.5s ease' }}>
          {slides[slide].icon}
        </div>
        <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:26, color:'white', marginBottom:12, lineHeight:1.2 }}>{slides[slide].title}</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:16, lineHeight:1.6, maxWidth:320 }}>{slides[slide].sub}</p>
        <div style={{ display:'flex', gap:10, marginTop:28 }}>
          {slides.map((_,i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width:i===slide?28:8, height:8, borderRadius:4, background:i===slide?'var(--yellow)':'rgba(255,255,255,0.3)', cursor:'pointer', transition:'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ background:'white', borderRadius:'32px 32px 0 0', padding:'32px 24px 40px' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginBottom:24 }}>
          {['ID Verified Providers','In-App Payments','Live Job Tracking','Panic Button','Reviews & Rankings'].map(f => (
            <span key={f} className="badge badge-teal">{f}</span>
          ))}
        </div>
        <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('mode-select')}>
          Get Started <ArrowRight size={18} />
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'var(--text-muted)', lineHeight:1.6, marginTop:16 }}>
          By continuing you agree to our Terms of Service &amp; Privacy Policy.<br/>All data processed in accordance with POPIA.
        </p>
      </div>
    </div>
  );
};

export const ModeSelectScreen: React.FC = () => {
  const { setMode, navigate } = useApp();
  const choose = (mode: 'consumer'|'provider') => { setMode(mode); navigate(mode==='consumer'?'consumer-home':'provider-home'); };
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ background:'var(--teal)', padding:'24px 20px 28px', textAlign:'center', flexShrink:0 }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:38, fontWeight:900, color:'white', letterSpacing:-1 }}>FI<span style={{ color:'var(--yellow)' }}>X</span>A</div>
        <div style={{ fontFamily:'var(--font-head)', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.7)', letterSpacing:'2px', textTransform:'uppercase', marginTop:4 }}>by PUBLICON</div>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'24px', gap:20, maxWidth:520, margin:'0 auto', width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <h2 style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:24, color:'var(--text-primary)' }}>How are you using FIXA?</h2>
          <p style={{ color:'var(--text-secondary)', fontSize:15, marginTop:6 }}>Choose your role to get started</p>
        </div>

        {/* Consumer */}
        <button onClick={() => choose('consumer')} className="card card-clickable" style={{ padding:24, textAlign:'left', border:'2px solid var(--border)', cursor:'pointer', background:'white' }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'var(--teal-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
            <Star size={26} color="var(--teal)" />
          </div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'var(--text-primary)', marginBottom:6 }}>I need a service</div>
          <div style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.6 }}>Find and book verified tradespeople near you. Plumbers, electricians, mechanics &amp; more.</div>
          <div style={{ marginTop:14, display:'flex', alignItems:'center', color:'var(--teal)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, gap:6 }}>
            Continue as Customer <ArrowRight size={15} />
          </div>
        </button>

        {/* Provider */}
        <button onClick={() => choose('provider')} style={{ background:'var(--teal)', borderRadius:'var(--radius-lg)', padding:24, cursor:'pointer', textAlign:'left', border:'none', boxShadow:'var(--shadow-md)', transition:'transform 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.transform='translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform='translateY(0)')}>
          <div style={{ width:52, height:52, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
            <Zap size={26} color="var(--yellow)" />
          </div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:20, color:'white', marginBottom:6 }}>I'm a service provider</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>Join FIXA to receive job leads, grow your business and get paid securely in-app.</div>
          <div style={{ marginTop:14, display:'flex', alignItems:'center', color:'var(--yellow)', fontFamily:'var(--font-head)', fontWeight:700, fontSize:14, gap:6 }}>
            Continue as Provider <ArrowRight size={15} />
          </div>
        </button>
      </div>
    </div>
  );
};
