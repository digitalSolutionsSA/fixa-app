import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { AppHeader, ProviderNav } from '../../components/Shared';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';

function calcScore(rating: number, jobCount: number): number {
  const ratingPts = (rating / 5) * 50;
  const jobPts    = Math.min(jobCount / 20, 1) * 30;
  const bonusPts  = jobCount >= 5 ? 10 : jobCount >= 1 ? 5 : 0;
  return Math.round(Math.min(ratingPts + jobPts + bonusPts, 100));
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Top Performer';
  if (score >= 60) return 'Rising Star';
  if (score >= 30) return 'Building Up';
  return 'Getting Started';
}

const FACTORS = [
  { icon: '📋', label: 'Job Completion Rate',          weight: '25%' },
  { icon: '⭐', label: 'Review Score (90-day weighted)', weight: '25%' },
  { icon: '⏱️', label: 'Response Time',                weight: '20%' },
  { icon: '💳', label: 'In-App Payment Compliance',    weight: '15%' },
  { icon: '🪪', label: 'Verification Level',           weight: '10%' },
  { icon: '📅', label: 'Consistency Bonus',            weight: '5%'  },
];

export const ProviderRankingScreen: React.FC = () => {
  const { currentUser, isDemo } = useApp();
  const [rating,   setRating]   = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (isDemo || !currentUser?.id) { setLoading(false); return; }
    supabase
      .from('profiles')
      .select('rating, job_count')
      .eq('id', currentUser.id)
      .maybeSingle()
      .then(({ data }) => {
        setRating(data?.rating ?? 0);
        setJobCount(data?.job_count ?? 0);
        setLoading(false);
      });
  }, [currentUser?.id, isDemo]);

  const score = isDemo ? 72 : calcScore(rating, jobCount);
  const label = scoreLabel(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader title="Provider Performance" back="provider-home" />
      <div className="screen">
        <div className="screen-content">

          {loading ? (
            <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation:'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <div className="card animate-in" style={{ textAlign:'center', padding:28 }}>
              <div style={{ fontSize:14, color:'var(--text-secondary)', marginBottom:8 }}>Your Provider Score</div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <span style={{ fontSize:40 }}>🏆</span>
                <div style={{ flex:1 }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${score}%`, transition:'width 0.8s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>0</span>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>100</span>
                  </div>
                </div>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:900, fontSize:40, color:'var(--teal)' }}>
                  {score}
                </div>
              </div>
              <div style={{ marginTop:10, display:'flex', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
                <span className="badge badge-green">{label}</span>
                {rating > 0 && <span className="badge badge-teal">⭐ {rating.toFixed(1)} rating</span>}
                {jobCount > 0 && <span className="badge badge-gray">{jobCount} jobs done</span>}
              </div>
            </div>
          )}

          <div className="card d1 animate-in">
            <div className="section-title">Ranking Algorithm</div>
            <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:14, lineHeight:1.5 }}>
              Your score is recalculated after every completed job:
            </p>
            {FACTORS.map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--bg)', borderRadius:'var(--radius-sm)', padding:'12px 14px', marginBottom:i < FACTORS.length-1 ? 8 : 0 }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{f.icon}</span>
                <span style={{ flex:1, fontFamily:'var(--font-head)', fontWeight:700, fontSize:14 }}>{f.label}</span>
                <span className="badge badge-teal" style={{ fontSize:11 }}>{f.weight}</span>
              </div>
            ))}
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:12, lineHeight:1.5 }}>
              Only in-app paid jobs count toward ranking.
            </p>
          </div>

          <div className="card d5 animate-in">
            <div className="section-title">Verification Level</div>
            {[
              { l:'Level 1 – Identity Confirmed', d:'Upload your government ID and complete selfie matching.' },
              { l:'Level 2 – Documents Screened', d:'Upload certificates and supporting documents for review.' },
              { l:'Level 3 – Partner Verified',   d:'Advanced human or partner review.' },
            ].map((v, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', paddingBottom:i<2?14:0, borderBottom:i<2?'1px solid var(--border)':'none', marginBottom:i<2?14:0 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ color:'var(--text-muted)', fontFamily:'var(--font-head)', fontWeight:800, fontSize:12 }}>{i+1}</span>
                </div>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:14, marginBottom:3 }}>{v.l}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.5 }}>{v.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ background:'var(--teal-light)', border:'1px solid rgba(0,168,150,0.2)' }}>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:13, color:'var(--teal)', marginBottom:6 }}>How to improve your score</div>
            {['Complete more jobs successfully','Collect 5-star reviews from every customer','Respond to requests within 10 minutes','Keep all payments in-app'].map((tip, i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:i<3?8:0 }}>
                <Check size={14} color="var(--teal)" />
                <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <ProviderNav />
    </div>
  );
};
