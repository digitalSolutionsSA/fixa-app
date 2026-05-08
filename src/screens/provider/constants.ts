import React from 'react';

// ── Trade categories ──────────────────────────────────────────────────────────

export const TRADE_CATEGORIES = ['Plumber', 'Electrician', 'Mechanic'] as const;
export type TradeCategory = typeof TRADE_CATEGORIES[number];

// ── Shared empty/default data ─────────────────────────────────────────────────

export const EMPTY_NEW_JOBS: Array<{
  id: string; title: string; customer: string; location: string;
  distance: string; price: number; urgent: boolean; desc: string;
}> = [];

export const EMPTY_ACTIVE_JOBS: Array<{
  t: string; c: string; l: string; km: string; p: number; urg: boolean;
}> = [];

export const EMPTY_DONE_JOBS: Array<{
  t: string; c: string; l: string; km: string; p: number; urg: boolean;
}> = [];

export const EMPTY_RECENT_JOBS: Array<{
  n: string; s: string; w: string; d: string; p: number; r: number;
}> = [];

export const EMPTY_VERIFICATION_DOCS = [
  { name: 'South African ID',  status: 'Not uploaded', note: 'Upload your ID to begin verification' },
  { name: 'Trade Certificate', status: 'Not uploaded', note: 'Upload your trade certificate if applicable' },
  { name: 'Proof of Address',  status: 'Not uploaded', note: 'Upload a recent proof of address' },
];

export const EMPTY_EARNINGS_BARS = [
  { l: 'Mon', h: 0 }, { l: 'Tue', h: 0 }, { l: 'Wed', h: 0 }, { l: 'Thu', h: 0 },
  { l: 'Fri', h: 0 }, { l: 'Sat', h: 0 }, { l: 'Sun', h: 0 },
];

export const plans = [
  { name: 'Free Tier', price: 'R0/mo',      current: true,  features: ['Basic profile access', 'Standard support'] },
  { name: 'Pro Tier',  price: 'Coming soon', current: false, features: ['Ranking boost', 'Priority support', 'Featured placement'] },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

export const getInitials = (name?: string) =>
  (name || 'P').trim().split(/\s+/).map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();

export const resolveUserName  = (user: any) =>
  user?.name || user?.fullName || user?.full_name || user?.user_metadata?.full_name || '';

export const resolveUserPhone = (user: any) =>
  user?.phone || user?.phoneNumber || user?.phone_number || user?.user_metadata?.phone || '';

export const resolveUserEmail = (user: any) =>
  user?.email || user?.user_metadata?.email || '';

// ── Shared types ──────────────────────────────────────────────────────────────

export type ProfileSection =
  | 'menu' | 'edit-profile' | 'verification' | 'billing'
  | 'notifications' | 'privacy' | 'legal' | 'support';

export type NotificationPrefs = {
  newRequests: boolean; jobUpdates: boolean; payoutAlerts: boolean;
  rankingUpdates: boolean; marketing: boolean;
};

export type ProviderProfileForm = {
  fullName:      string;
  tradeCategory: TradeCategory | '';
  phone:         string;
  email:         string;
  bio:           string;
  area:          string;
};

export const sectionTitleMap: Record<Exclude<ProfileSection, 'menu'>, string> = {
  'edit-profile': 'Edit Profile',
  verification:   'Verification Documents',
  billing:        'Subscription & Billing',
  notifications:  'Notifications',
  privacy:        'Privacy & Data (POPIA)',
  legal:          'Legal Disclaimers',
  support:        'Help & Support',
};

// ── Shared styles ─────────────────────────────────────────────────────────────

export const inputStyle: React.CSSProperties = {
  width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
  padding: '12px 14px', fontSize: 14, color: 'var(--text-primary)',
  background: 'white', outline: 'none', boxSizing: 'border-box',
};

export const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-head)', fontWeight: 700,
  fontSize: 13, marginBottom: 8, color: 'var(--text-primary)',
};

export const rowBetween: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
};