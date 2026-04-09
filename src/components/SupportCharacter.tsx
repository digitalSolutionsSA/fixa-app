import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const QUICK_QS = [
  { q: 'How do I book?', a: "Tap 'Browse', choose your category, pick a verified provider and tap Book Now. Easy!" },
  { q: 'How does payment work?', a: 'All payments go through the app. Only in-app paid jobs qualify for dispute protection, reviews, and ranking.' },
  { q: 'Is my data safe?', a: 'Absolutely. All documents are encrypted and processed under POPIA. Your safety is our top priority.' },
  { q: 'What is the Panic Button?', a: 'During an active job, one tap logs your GPS, alerts admin, and notifies your trusted contact. No confirmation screen.' },
  { q: 'Are providers verified?', a: 'Yes — ID and documents are screened. Look for the shield badge. Note: this is screening, not professional certification.' },
  { q: 'Dispute a job?', a: 'Only in-app paid jobs qualify. Go to My Jobs → tap the job → Raise Dispute. Our team responds within 24h.' },
];

interface Message { id: string; from: 'user'|'bot'; text: string; }

export function SupportCharacter() {
  const { supportOpen, setSupportOpen } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', from: 'bot', text: "Hey! 👋 I'm Fixy, your FIXA assistant. How can I help?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pulse, setPulse] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const send = (text: string) => {
    setMessages(p => [...p, { id: Date.now().toString(), from: 'user', text }]);
    setInput('');
    setTyping(true);
    const match = QUICK_QS.find(q => text.toLowerCase().includes(q.q.split(' ')[2] || ''));
    setTimeout(() => {
      setMessages(p => [...p, {
        id: (Date.now()+1).toString(), from: 'bot',
        text: match?.a || "For more help, contact support@fixaapp.co.za or call +27 11 000 0001. 😊",
      }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <>
      {/* FAB */}
      <div style={{ position: 'fixed', bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom) + 14px)', right: 16, zIndex: 300 }}>
        {pulse && !supportOpen && (
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'rgba(27,184,200,0.25)', animation: 'pulse-ring 1.5s ease-in-out infinite', pointerEvents: 'none' }} />
        )}
        <button
          onClick={() => { setSupportOpen(!supportOpen); setPulse(false); }}
          style={{
            width: 58, height: 58, borderRadius: '50%', padding: 0,
            border: '3px solid var(--fixa-teal)', background: '#fff',
            overflow: 'hidden', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(27,184,200,0.45)',
            transition: 'transform 0.2s',
            display: 'block',
          }}
          onTouchStart={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img src="/support-character.jpeg" alt="Fixy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </button>
        {!supportOpen && (
          <div style={{
            position: 'absolute', bottom: '110%', right: 0,
            background: 'var(--fixa-teal)', color: '#fff', padding: '5px 10px',
            borderRadius: '10px 10px 0 10px', fontSize: 11, fontWeight: 700,
            whiteSpace: 'nowrap', boxShadow: 'var(--shadow-teal)',
            pointerEvents: 'none',
          }}>
            Need help? 👋
          </div>
        )}
      </div>

      {/* Chat window – slides up from bottom on mobile */}
      {supportOpen && (
        <div
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-h) + var(--safe-bottom) + 82px)',
            right: 16, left: 16,
            maxWidth: 380, marginLeft: 'auto',
            maxHeight: '55vh',
            background: 'linear-gradient(180deg,#0D1B2A 0%,#112233 100%)',
            border: '1px solid rgba(27,184,200,0.28)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            zIndex: 299, overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
            background: 'linear-gradient(90deg, var(--fixa-teal-dark), var(--fixa-teal))',
            flexShrink: 0,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }}>
              <img src="/support-character.jpeg" alt="Fixy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14, color: '#fff', lineHeight: 1 }}>Fixy</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                FIXA Support
              </div>
            </div>
            <button onClick={() => setSupportOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: 22, lineHeight: 1, padding: 4, minHeight: 'unset', minWidth: 'unset', cursor: 'pointer' }}>×</button>
          </div>

          {/* Quick questions */}
          <div style={{ display: 'flex', gap: 6, padding: '8px 10px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none', borderBottom: '1px solid rgba(27,184,200,0.1)' }}>
            {QUICK_QS.slice(0, 4).map(q => (
              <button key={q.q} onClick={() => send(q.q)} style={{
                flexShrink: 0, padding: '5px 10px', borderRadius: 999,
                background: 'rgba(27,184,200,0.1)', border: '1px solid rgba(27,184,200,0.22)',
                color: 'var(--fixa-teal-light)', fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', cursor: 'pointer',
                minHeight: 'unset',
              }}>
                {q.q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', gap: 6, alignItems: 'flex-end' }}>
                {msg.from === 'bot' && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                    <img src="/support-character.jpeg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  </div>
                )}
                <div style={{
                  maxWidth: '78%', padding: '9px 11px', fontSize: 13, lineHeight: 1.5,
                  borderRadius: msg.from === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                  background: msg.from === 'user' ? 'linear-gradient(135deg, var(--fixa-teal), var(--fixa-teal-dark))' : 'rgba(255,255,255,0.06)',
                  border: msg.from === 'bot' ? '1px solid rgba(27,184,200,0.12)' : 'none',
                  color: '#fff',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden' }}>
                  <img src="/support-character.jpeg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(27,184,200,0.12)', borderRadius: '14px 14px 14px 3px', padding: '10px 14px', display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fixa-teal)', animation: 'chat-bounce 1.2s ease-in-out infinite', animationDelay: `${i*0.16}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={e => { e.preventDefault(); if (input.trim()) send(input.trim()); }}
            style={{ display: 'flex', gap: 8, padding: '8px 10px', borderTop: '1px solid rgba(27,184,200,0.1)', background: 'rgba(0,0,0,0.15)', flexShrink: 0 }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(27,184,200,0.18)',
                borderRadius: 999, padding: '9px 14px', color: '#fff', fontSize: 14,
              }}
            />
            <button type="submit" disabled={!input.trim()} style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: input.trim() ? 'var(--fixa-teal)' : 'rgba(27,184,200,0.18)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 'unset', minWidth: 'unset',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            </button>
          </form>
        </div>
      )}

      <style>{`@keyframes chat-bounce{0%,80%,100%{transform:scale(0);opacity:.3}40%{transform:scale(1);opacity:1}}`}</style>
    </>
  );
}
