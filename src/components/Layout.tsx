import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import fixaLogo from '../assets/fixa-logo.png';

interface NavItem { path: string; label: string; icon: React.ReactNode; }

const consumerNav: NavItem[] = [
  { path: '/', label: 'Home', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> },
  { path: '/browse', label: 'Browse', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> },
  { path: '/my-jobs', label: 'My Jobs', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg> },
  { path: '/notifications', label: 'Alerts', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12z"/></svg> },
  { path: '/profile', label: 'Me', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
];

const providerNav: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
  { path: '/leads', label: 'Leads', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> },
  { path: '/earnings', label: 'Earnings', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg> },
  { path: '/notifications', label: 'Alerts', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12z"/></svg> },
  { path: '/profile', label: 'Me', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
];

const adminNav: NavItem[] = [
  { path: '/', label: 'Overview', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
  { path: '/users', label: 'Users', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { path: '/alerts', label: 'Alerts', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12z"/></svg> },
  { path: '/reports', label: 'Reports', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> },
  { path: '/profile', label: 'Me', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, activeRole, notifications } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = activeRole === 'admin' ? adminNav : activeRole === 'provider' ? providerNav : consumerNav;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--fixa-dark)' }}>
      {/* ── Sticky top header ── */}
      <header style={{
        height: 'var(--header-h)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        background: 'rgba(13,27,42,0.97)',
        borderBottom: '1px solid rgba(27,184,200,0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 200,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1 }}
          onClick={() => navigate('/')}
        >
          <img src={fixaLogo} alt="FIXA" style={{ height: 34, width: 34, borderRadius: '50%' }} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 17, color: '#fff' }}>FIXA</div>
            <div style={{ fontSize: 8, color: 'var(--fixa-teal)', fontWeight: 700, letterSpacing: 1.5 }}>BY PUBLICON</div>
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Notification bell */}
          <button
            onClick={() => navigate('/notifications')}
            style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(27,184,200,0.18)',
              borderRadius: '50%', width: 38, height: 38, minHeight: 38, minWidth: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fixa-gray)',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72C7.37 5.03 5.12 7.75 5.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 1, right: 1,
                background: 'var(--fixa-danger)', color: '#fff',
                borderRadius: '50%', width: 15, height: 15,
                fontSize: 8, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--fixa-dark)',
              }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--fixa-teal-dark), var(--fixa-teal))',
              border: '2px solid rgba(27,184,200,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 13, color: '#fff',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {currentUser?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="page-scroll" style={{ flex: 1 }}>
        {children}
      </div>

      {/* ── Bottom tab bar ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 'calc(var(--bottom-nav-h) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        display: 'flex', alignItems: 'flex-start',
        background: 'rgba(10,20,34,0.97)',
        borderTop: '1px solid rgba(27,184,200,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 200,
      }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path || (item.path === '/leads' && location.pathname === '/');
          const isAlerts = item.path === '/notifications' || item.path === '/alerts';
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: '10px 4px 0',
                background: 'none', border: 'none',
                color: isActive ? 'var(--fixa-teal)' : 'var(--fixa-gray)',
                fontSize: 10, fontWeight: 700,
                fontFamily: 'var(--font-body)',
                transition: 'color 0.15s ease',
                position: 'relative',
                minHeight: 'var(--bottom-nav-h)',
              }}
            >
              {/* Active pip */}
              {isActive && (
                <span style={{
                  position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                  width: 28, height: 3, borderRadius: 2,
                  background: 'var(--fixa-teal)',
                  boxShadow: '0 0 8px var(--fixa-teal)',
                }} />
              )}

              {/* Badge for alerts */}
              <span style={{ position: 'relative' }}>
                {item.icon}
                {isAlerts && unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -6,
                    background: 'var(--fixa-danger)',
                    color: '#fff', borderRadius: 999,
                    fontSize: 8, fontWeight: 900,
                    minWidth: 14, height: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 3px',
                    border: '1.5px solid rgba(10,20,34,0.97)',
                  }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </span>
              <span style={{ fontSize: 10 }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
