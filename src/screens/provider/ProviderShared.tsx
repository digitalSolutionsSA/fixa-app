import React from 'react';
import { ChevronRight } from 'lucide-react';
import { rowBetween } from './constants';

// ── ProfileMenuButton ─────────────────────────────────────────────────────────

const menuButtonStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  cursor: 'pointer',
  border: 'none',
  textAlign: 'left',
  transition: 'box-shadow 0.2s',
};

export function ProfileMenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="card"
      style={menuButtonStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26 }}>
        {icon}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15 }}>
        {label}
      </span>
      <ChevronRight size={16} color="var(--text-muted)" />
    </button>
  );
}

// ── BackSectionHeader ─────────────────────────────────────────────────────────

export function BackSectionHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="card" style={{ padding: '12px 14px' }}>
      <button
        onClick={onBack}
        style={{
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 0,
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <ChevronRight
          size={18}
          color="var(--text-muted)"
          style={{ transform: 'rotate(180deg)' }}
        />
        <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>
          {title}
        </span>
      </button>
    </div>
  );
}

// ── ToggleRow ─────────────────────────────────────────────────────────────────

export function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={rowBetween}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
            {desc}
          </div>
        </div>

        <button
          onClick={onChange}
          style={{
            width: 54,
            height: 30,
            borderRadius: 999,
            border: 'none',
            background: checked ? 'var(--teal)' : 'var(--border)',
            position: 'relative',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: checked ? 27 : 3,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          />
        </button>
      </div>
    </div>
  );
}