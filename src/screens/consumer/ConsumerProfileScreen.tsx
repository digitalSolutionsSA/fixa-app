import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Save,
  Loader2,
  CheckCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Download,
  Check,
  Users,
  CreditCard,
  ClipboardList,
  Bell,
  Lock,
  Scale,
  HelpCircle,
  User,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { ConsumerNav, Avt } from '../../components/Shared';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name?: string | null) {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

// ── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 10,
  fontSize: 14,
  fontFamily: 'inherit',
  background: 'var(--bg)',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
  display: 'block',
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Section =
  | 'menu'
  | 'personal'
  | 'trusted-contact'
  | 'payment'
  | 'notifications'
  | 'privacy'
  | 'legal'
  | 'support';

interface ConsumerProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface TrustedContact {
  name: string;
  phone: string;
  relationship: string;
}

interface NotificationPrefs {
  bookingUpdates: boolean;
  providerArrival: boolean;
  promotions: boolean;
  safety: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const MenuRow: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon, label, onClick,
}) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%',
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
      padding: '16px 18px', cursor: 'pointer', textAlign: 'left', marginBottom: 10,
    }}
  >
    <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{icon}</span>
    <span style={{ flex: 1, fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
      {label}
    </span>
    <ChevronRight size={18} color="var(--text-muted)" />
  </button>
);

const BackHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
    <button
      onClick={onBack}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-primary)' }}
    >
      ← 
    </button>
    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 18 }}>{title}</div>
  </div>
);

const ToggleRow: React.FC<{ title: string; desc: string; checked: boolean; onChange: () => void }> = ({
  title, desc, checked, onChange,
}) => (
  <div
    className="card"
    style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, cursor: 'pointer' }}
    onClick={onChange}
  >
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{desc}</div>
    </div>
    <div
      style={{
        width: 44, height: 26, borderRadius: 13, flexShrink: 0, transition: 'background 0.2s',
        background: checked ? 'var(--teal)' : 'var(--border)', position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3, width: 20, height: 20,
          borderRadius: '50%', background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        }}
      />
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const ConsumerProfileScreen: React.FC = () => {
  const { navigate, currentUser, isDemo, logout } = useApp();

  const [section, setSection] = useState<Section>('menu');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initials = useMemo(() => getInitials(currentUser?.name), [currentUser?.name]);

  // ── Profile state ───────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ConsumerProfile>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [trustedContact, setTrustedContact] = useState<TrustedContact>({
    name: '',
    phone: '',
    relationship: '',
  });

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    bookingUpdates: true,
    providerArrival: true,
    promotions: false,
    safety: true,
  });

  // ── Load from Supabase ──────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      let userId: string | null = currentUser?.id ?? null;
      if (!userId) {
        const { data: s } = await supabase.auth.getSession();
        userId = s?.session?.user?.id ?? null;
      }

      if (!userId || userId.startsWith('demo-')) {
        // Demo fallback
        setProfile({
          fullName: currentUser?.name || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          location: isDemo ? 'Sandton, Johannesburg' : '',
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, area, trusted_contact_name, trusted_contact_phone, trusted_contact_relationship')
        .eq('id', userId)
        .maybeSingle();

      if (error) console.error('Load profile error:', error);

      setProfile({
        fullName: data?.full_name || currentUser?.name || '',
        email: data?.email || currentUser?.email || '',
        phone: data?.phone || currentUser?.phone || '',
        location: data?.area || '',
      });

      setTrustedContact({
        name: data?.trusted_contact_name || '',
        phone: data?.trusted_contact_phone || '',
        relationship: data?.trusted_contact_relationship || '',
      });

      setIsLoading(false);
    };

    load();
  }, [currentUser?.id]);

  // ── Save helpers ────────────────────────────────────────────────────────────
  const showSaved = (msg: string) => {
    setSaveMessage(msg);
    window.setTimeout(() => setSaveMessage(''), 2400);
  };

  const getUserId = async (): Promise<string | null> => {
    if (currentUser?.id && !currentUser.id.startsWith('demo-')) return currentUser.id;
    const { data: s } = await supabase.auth.getSession();
    return s?.session?.user?.id ?? null;
  };

  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    const userId = await getUserId();

    if (!userId || userId.startsWith('demo-')) {
      showSaved('Profile updated successfully');
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        area: profile.location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    showSaved(error ? 'Error saving. Please try again.' : 'Personal information saved');
    setIsSaving(false);
  }, [profile, currentUser?.id]);

  const saveTrustedContact = useCallback(async () => {
    setIsSaving(true);
    const userId = await getUserId();

    if (!userId || userId.startsWith('demo-')) {
      showSaved('Trusted contact saved');
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        trusted_contact_name: trustedContact.name,
        trusted_contact_phone: trustedContact.phone,
        trusted_contact_relationship: trustedContact.relationship,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    showSaved(error ? 'Error saving. Please try again.' : 'Trusted contact saved');
    setIsSaving(false);
  }, [trustedContact, currentUser?.id]);

  // ── Renders ─────────────────────────────────────────────────────────────────

  const renderMenu = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        {(isDemo
          ? [{ val: '8', l: 'Bookings' }, { val: '4.9', l: 'Avg Rating' }, { val: 'R3,850', l: 'Total Spent' }]
          : [{ val: '0', l: 'Bookings' }, { val: '—', l: 'Avg Rating' }, { val: 'R0', l: 'Total Spent' }]
        ).map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-num" style={{ color: 'var(--teal)', textAlign: 'center' }}>{s.val}</div>
            <div className="stat-label" style={{ textAlign: 'center' }}>{s.l}</div>
          </div>
        ))}
      </div>

      <MenuRow icon={<User size={20} color="#f59e0b" />} label="Personal Information" onClick={() => setSection('personal')} />
      <MenuRow icon={<Users size={20} color="#0f766e" />} label="Trusted Contact" onClick={() => setSection('trusted-contact')} />
      <MenuRow icon={<CreditCard size={20} color="#eab308" />} label="Payment Methods" onClick={() => setSection('payment')} />
      <MenuRow icon={<ClipboardList size={20} color="#6b7280" />} label="Booking History" onClick={() => navigate('consumer-bookings' as any)} />
      <MenuRow icon={<Bell size={20} color="#f59e0b" />} label="Notifications" onClick={() => setSection('notifications')} />
      <MenuRow icon={<Lock size={20} color="#ca8a04" />} label="Privacy & Data (POPIA)" onClick={() => setSection('privacy')} />
      <MenuRow icon={<Scale size={20} color="#6b7280" />} label="Legal Disclaimers" onClick={() => setSection('legal')} />
      <MenuRow icon={<HelpCircle size={20} color="#0f766e" />} label="Help & Support" onClick={() => setSection('support')} />

      <button
        className="btn btn-full"
        style={{
          background: 'var(--red-light)', color: 'var(--red-panic)',
          fontFamily: 'var(--font-head)', fontWeight: 800,
          border: '2px solid var(--red-panic)', borderRadius: 'var(--radius-sm)',
          padding: '13px', fontSize: 14, cursor: 'pointer', marginTop: 8,
        }}
        onClick={logout}
      >
        Sign Out
      </button>
    </>
  );

  const renderPersonal = () => (
    <>
      <BackHeader title="Personal Information" onBack={() => setSection('menu')} />

      {isLoading ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
          <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading…</span>
        </div>
      ) : (
        <div className="card">
          <label style={labelStyle}>Full Name</label>
          <input
            style={inputStyle}
            value={profile.fullName}
            onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
          />

          <div style={{ height: 14 }} />

          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              style={{ ...inputStyle, paddingLeft: 38 }}
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div style={{ height: 14 }} />

          <label style={labelStyle}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              style={{ ...inputStyle, paddingLeft: 38 }}
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+27 82 000 0000"
            />
          </div>

          <div style={{ height: 14 }} />

          <label style={labelStyle}>Location / Area</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              style={{ ...inputStyle, paddingLeft: 38 }}
              value={profile.location}
              onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Sandton, Johannesburg"
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={saveProfile}
            disabled={isSaving}
          >
            {isSaving
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      )}
    </>
  );

  const renderTrustedContact = () => (
    <>
      <BackHeader title="Trusted Contact" onBack={() => setSection('menu')} />

      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Your trusted contact is alerted in an emergency when you tap the panic button. Keep this up to date.
        </div>
      </div>

      {isLoading ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
          <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading…</span>
        </div>
      ) : (
        <div className="card">
          <label style={labelStyle}>Contact Name</label>
          <input
            style={inputStyle}
            value={trustedContact.name}
            onChange={(e) => setTrustedContact((t) => ({ ...t, name: e.target.value }))}
            placeholder="e.g. Jane van Rooyen"
          />

          <div style={{ height: 14 }} />

          <label style={labelStyle}>Contact Phone</label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              style={{ ...inputStyle, paddingLeft: 38 }}
              value={trustedContact.phone}
              onChange={(e) => setTrustedContact((t) => ({ ...t, phone: e.target.value }))}
              placeholder="+27 82 000 0000"
            />
          </div>

          <div style={{ height: 14 }} />

          <label style={labelStyle}>Relationship</label>
          <input
            style={inputStyle}
            value={trustedContact.relationship}
            onChange={(e) => setTrustedContact((t) => ({ ...t, relationship: e.target.value }))}
            placeholder="e.g. Spouse, Parent, Friend"
          />

          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={saveTrustedContact}
            disabled={isSaving}
          >
            {isSaving
              ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
              : <><Save size={16} /> Save Contact</>}
          </button>
        </div>
      )}
    </>
  );

  const renderPayment = () => (
    <>
      <BackHeader title="Payment Methods" onBack={() => setSection('menu')} />
      <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
        <CreditCard size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>No payment methods yet</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
          Payment methods will be available when in-app payments go live.
        </div>
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <BackHeader title="Notifications" onBack={() => setSection('menu')} />

      <ToggleRow
        title="Booking updates"
        desc="Confirmations, cancellations and status changes."
        checked={notifPrefs.bookingUpdates}
        onChange={() => setNotifPrefs((p) => ({ ...p, bookingUpdates: !p.bookingUpdates }))}
      />
      <ToggleRow
        title="Provider arrival alerts"
        desc="Get notified when your provider is on the way."
        checked={notifPrefs.providerArrival}
        onChange={() => setNotifPrefs((p) => ({ ...p, providerArrival: !p.providerArrival }))}
      />
      <ToggleRow
        title="Safety alerts"
        desc="Emergency and safety-related notifications."
        checked={notifPrefs.safety}
        onChange={() => setNotifPrefs((p) => ({ ...p, safety: !p.safety }))}
      />
      <ToggleRow
        title="Promotions & news"
        desc="Platform updates, offers and feature announcements."
        checked={notifPrefs.promotions}
        onChange={() => setNotifPrefs((p) => ({ ...p, promotions: !p.promotions }))}
      />

      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        onClick={() => showSaved('Notification preferences saved')}
      >
        <Save size={16} /> Save Preferences
      </button>
    </>
  );

  const renderPrivacy = () => (
    <>
      <BackHeader title="Privacy & Data (POPIA)" onBack={() => setSection('menu')} />

      <div className="card">
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 10 }}>POPIA Data Controls</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Your data is used to match you with providers, process bookings and support dispute resolution under the Protection of Personal Information Act.
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Data export requested')}>
            <Download size={16} /> Request My Data Export
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Consent preferences updated')}>
            <Lock size={16} /> Manage Consent
          </button>
          <button
            className="btn btn-full"
            style={{ background: 'var(--red-light)', color: 'var(--red-panic)', border: '2px solid var(--red-panic)', fontFamily: 'var(--font-head)', fontWeight: 800 }}
            onClick={() => showSaved('Account deletion request submitted')}
          >
            <X size={16} /> Request Account Deletion
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Stored Data</div>
        {['Identity and contact information', 'Booking and service history', 'Trusted contact details', 'In-app communication records'].map((item) => (
          <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <Check size={14} color="var(--green)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderLegal = () => (
    <>
      <BackHeader title="Legal Disclaimers" onBack={() => setSection('menu')} />

      <div className="card">
        <div style={{ display: 'grid', gap: 14 }}>
          {[
            { title: 'Platform Role', body: 'FIXA connects consumers with independent service providers. FIXA is not the employer and does not guarantee work quality.' },
            { title: 'Dispute Support', body: 'Platform-backed dispute support only applies to bookings made and paid through the app.' },
            { title: 'Consumer Protection', body: 'You retain all rights under the Consumer Protection Act for services rendered through the platform.' },
            { title: 'Data Privacy', body: 'Your personal data is handled in accordance with POPIA and only shared with providers during active bookings.' },
          ].map((item) => (
            <div key={item.title} style={{ paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderSupport = () => (
    <>
      <BackHeader title="Help & Support" onBack={() => setSection('menu')} />

      <div className="card">
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Need help?</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          Reach us for booking issues, provider disputes, account questions or technical support.
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <button className="btn btn-primary btn-full" onClick={() => showSaved('Support chat opened')}>
            <HelpCircle size={16} /> Start Support Chat
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Email support opened')}>
            <Mail size={16} /> Email Support
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Call support opened')}>
            <Phone size={16} /> Call Support
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15, marginBottom: 12 }}>Common Topics</div>
        {['How to cancel a booking', 'Disputing a charge or review', 'How trusted contact alerts work', 'Updating payment details'].map((t) => (
          <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <CheckCircle size={14} color="var(--teal)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderSection = () => {
    switch (section) {
      case 'menu':            return renderMenu();
      case 'personal':        return renderPersonal();
      case 'trusted-contact': return renderTrustedContact();
      case 'payment':         return renderPayment();
      case 'notifications':   return renderNotifications();
      case 'privacy':         return renderPrivacy();
      case 'legal':           return renderLegal();
      case 'support':         return renderSupport();
      default:                return renderMenu();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: 'var(--teal)', padding: '24px 20px 32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', maxWidth: 700, margin: '0 auto' }}>
          <Avt initials={initials} size={64} />
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'white' }}>
              {profile.fullName || currentUser?.name || 'User'}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {profile.email || currentUser?.email || 'No email available'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              📍 {profile.location || 'Location not set yet'}
            </div>
          </div>
        </div>
      </div>

      <div className="screen">
        <div className="screen-content">
          {/* Toast notification */}
          {saveMessage && (
            <div
              className="card"
              style={{
                background: saveMessage.startsWith('Error') ? 'rgba(239,68,68,0.08)' : 'rgba(20,184,166,0.08)',
                border: saveMessage.startsWith('Error') ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(20,184,166,0.25)',
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 4,
              }}
            >
              <CheckCircle size={18} color={saveMessage.startsWith('Error') ? 'var(--red-panic)' : 'var(--teal)'} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{saveMessage}</span>
            </div>
          )}

          {renderSection()}
        </div>
      </div>

      <ConsumerNav />
    </div>
  );
};