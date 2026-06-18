import React, { useEffect, useState } from 'react';
import { Bell, Loader2, CheckCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { AppHeader } from '../components/Shared';
import { getNotifications, markAllRead, type DbNotification } from '../lib/notifications';

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function typeColor(type: DbNotification['type']) {
  if (type === 'success') return 'var(--green)';
  if (type === 'warning') return '#D97706';
  if (type === 'error')   return 'var(--red-panic)';
  return 'var(--teal)';
}

export const NotificationsScreen: React.FC = () => {
  const { currentUser, isDemo, refreshNotifCount, mode } = useApp();
  const backScreen = mode === 'provider' ? 'provider-home' : 'consumer-home';

  const [notifs, setNotifs]   = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo || !currentUser?.id) { setLoading(false); return; }
    getNotifications(currentUser.id).then((data) => {
      setNotifs(data);
      setLoading(false);
    });
  }, [currentUser?.id, isDemo]);

  const handleMarkAll = async () => {
    if (!currentUser?.id) return;
    await markAllRead(currentUser.id);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    refreshNotifCount();
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title="Notifications"
        back={backScreen as any}
        right={
          unread > 0 ? (
            <button
              onClick={handleMarkAll}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '6px 12px', color: 'white', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="screen">
        <div className="screen-content">
          {loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
              <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading…</span>
            </div>
          )}

          {!loading && notifs.length === 0 && (
            <div className="empty-state">
              <Bell size={40} />
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 16 }}>No notifications yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center' }}>
                Job updates, acceptances and alerts will appear here.
              </div>
            </div>
          )}

          {!loading && notifs.map((n, i) => (
            <div
              key={n.id}
              className="card animate-in"
              style={{
                animationDelay: `${i * 0.04}s`,
                borderLeft: `4px solid ${typeColor(n.type)}`,
                opacity: n.read ? 0.7 : 1,
                background: n.read ? 'var(--card)' : 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    {!n.read && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', marginRight: 7, verticalAlign: 'middle' }} />}
                    {n.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.body}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{timeAgo(n.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
