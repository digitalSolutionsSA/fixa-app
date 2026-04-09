import React from 'react';

// ── Badge ──
interface BadgeProps { children: React.ReactNode; variant?: 'teal'|'yellow'|'success'|'danger'|'warning'|'gray'; }
export function Badge({ children, variant = 'teal' }: BadgeProps) {
  const styles: Record<string, React.CSSProperties> = {
    teal:    { background: 'rgba(27,184,200,0.15)',  color: '#1BB8C8',  border: '1px solid rgba(27,184,200,0.3)' },
    yellow:  { background: 'rgba(245,200,0,0.15)',   color: '#F5C800',  border: '1px solid rgba(245,200,0,0.3)' },
    success: { background: 'rgba(34,197,94,0.15)',   color: '#22C55E',  border: '1px solid rgba(34,197,94,0.3)' },
    danger:  { background: 'rgba(239,68,68,0.15)',   color: '#EF4444',  border: '1px solid rgba(239,68,68,0.3)' },
    warning: { background: 'rgba(245,158,11,0.15)',  color: '#F59E0B',  border: '1px solid rgba(245,158,11,0.3)' },
    gray:    { background: 'rgba(143,163,177,0.12)', color: '#8FA3B1',  border: '1px solid rgba(143,163,177,0.25)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap', lineHeight: 1.6,
      ...styles[variant],
    }}>
      {children}
    </span>
  );
}

// ── Card ──
export function Card({
  children, style, onClick, hoverable, glow, className,
}: {
  children: React.ReactNode; style?: React.CSSProperties;
  onClick?: () => void; hoverable?: boolean; glow?: boolean; className?: string;
}) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(17,34,51,0.95) 0%, rgba(13,27,42,0.98) 100%)',
        border: glow ? '1px solid rgba(27,184,200,0.45)' : '1px solid rgba(27,184,200,0.1)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: glow ? 'var(--shadow-teal)' : 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'border-color 0.15s ease',
        ...style,
      }}
      onTouchStart={hoverable ? (e => (e.currentTarget.style.borderColor = 'rgba(27,184,200,0.35)')) : undefined}
      onTouchEnd={hoverable ? (e => (e.currentTarget.style.borderColor = glow ? 'rgba(27,184,200,0.45)' : 'rgba(27,184,200,0.1)')) : undefined}
    >
      {children}
    </div>
  );
}

// ── Button ──
export function Button({
  children, variant = 'primary', size = 'md', fullWidth, icon, style, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'secondary'|'danger'|'ghost'|'yellow';
  size?: 'sm'|'md'|'lg'; fullWidth?: boolean; icon?: React.ReactNode;
}) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary:   { background: 'linear-gradient(135deg, var(--fixa-teal), var(--fixa-teal-dark))', color: '#fff', boxShadow: 'var(--shadow-teal)', border: 'none' },
    secondary: { background: 'rgba(27,184,200,0.1)', color: 'var(--fixa-teal-light)', border: '1px solid rgba(27,184,200,0.28)' },
    danger:    { background: 'linear-gradient(135deg,#EF4444,#DC2626)', color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(239,68,68,0.35)' },
    ghost:     { background: 'transparent', color: 'var(--fixa-gray)', border: '1px solid rgba(143,163,177,0.2)' },
    yellow:    { background: 'linear-gradient(135deg, var(--fixa-yellow), var(--fixa-yellow-dark))', color: 'var(--fixa-dark)', border: 'none', boxShadow: 'var(--shadow-yellow)' },
  };
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '8px 16px', fontSize: 13 },
    md: { padding: '12px 22px', fontSize: 14 },
    lg: { padding: '15px 28px', fontSize: 16 },
  };
  return (
    <button
      {...props}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        fontFamily: 'var(--font-body)', fontWeight: 700, borderRadius: 'var(--radius-full)',
        cursor: 'pointer', transition: 'opacity 0.15s', whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...sizeStyles[size], ...variantStyles[variant], ...style,
      }}
    >
      {icon}{children}
    </button>
  );
}

// ── Avatar ──
export function Avatar({ name, size = 40, src }: { name: string; size?: number; src?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#1BB8C8','#0E8FA0','#F5C800','#22C55E','#8B5CF6'];
  const color = colors[name.charCodeAt(0) % colors.length];
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${color}44`, flexShrink: 0 }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `${color}18`, border: `2px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: size * 0.36, color,
    }}>
      {initials}
    </div>
  );
}

// ── StarRating ──
export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < Math.round(rating) ? '#F5C800' : 'rgba(143,163,177,0.25)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: 12, color: 'var(--fixa-gray)', marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

// ── VerificationBadge ──
export function VerificationBadge({ level }: { level: 1|2|3 }) {
  const map = {
    1: { label: 'ID Verified',      color: '#F59E0B' },
    2: { label: 'Docs Screened',    color: '#1BB8C8' },
    3: { label: 'Partner Verified', color: '#22C55E' },
  };
  const { label, color } = map[level];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 999,
      background: `${color}18`, border: `1px solid ${color}44`,
      fontSize: 11, fontWeight: 700, color,
    }}>
      🛡️ {label}
    </span>
  );
}

// ── JobStatusBadge ──
export function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    pending:     { label: 'Pending',     variant: 'warning' },
    accepted:    { label: 'Accepted',    variant: 'teal' },
    'in-progress':{ label: 'In Progress', variant: 'yellow' },
    completed:   { label: 'Completed',   variant: 'success' },
    disputed:    { label: 'Disputed',    variant: 'danger' },
    cancelled:   { label: 'Cancelled',   variant: 'gray' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'gray' as BadgeProps['variant'] };
  return <Badge variant={variant}>{label}</Badge>;
}

// ── SectionTitle ──
export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.2 }}>{children}</h2>
      {sub && <p style={{ fontSize: 12, color: 'var(--fixa-gray)', marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

// ── EmptyState ──
export function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 10, textAlign: 'center' }}>
      <div style={{ fontSize: 44, opacity: 0.35 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: '#fff' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--fixa-gray)' }}>{sub}</div>}
    </div>
  );
}

// ── Divider ──
export function Divider() {
  return <div style={{ height: 1, background: 'rgba(27,184,200,0.09)', margin: '10px 0' }} />;
}
