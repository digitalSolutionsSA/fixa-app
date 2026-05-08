import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Star, CheckCircle, DollarSign, Briefcase, Pencil, FileText, CreditCard,
  Bell, Lock, Scale, HelpCircle, Mail, Phone, Camera, Save, Shield,
  Download, Upload, X, Check, Loader2,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { supabase } from '../../lib/supabase';
import { ProviderNav, Avt } from '../../components/Shared';
import {
  EMPTY_VERIFICATION_DOCS, plans, getInitials, resolveUserName,
  resolveUserPhone, resolveUserEmail, ProfileSection, NotificationPrefs,
  ProviderProfileForm, sectionTitleMap, inputStyle, labelStyle, rowBetween,
  TRADE_CATEGORIES, TradeCategory,
} from './constants';
import { ProfileMenuButton, BackSectionHeader, ToggleRow } from './ProviderShared';

export const ProviderProfileScreen: React.FC = () => {
  const { navigate, setMode, user, currentUser } = useApp() as any;

  const resolvedName  = resolveUserName(user);
  const resolvedPhone = resolveUserPhone(user);
  const resolvedEmail = resolveUserEmail(user);

  const [section, setSection]         = useState<ProfileSection>('menu');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving]       = useState(false);
  const [isLoading, setIsLoading]     = useState(true);

  const [profile, setProfile] = useState<ProviderProfileForm>({
    fullName: '', tradeCategory: '', phone: '', email: '', bio: '', area: '',
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
        setProfile({ fullName: resolvedName || '', tradeCategory: '', phone: resolvedPhone || '', email: resolvedEmail || '', bio: '', area: '' });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, trade, bio, area')
        .eq('id', userId)
        .maybeSingle();

      if (error) console.error('Error loading profile:', error);

      const cat = (data?.trade || '') as TradeCategory | '';
      setProfile({
        fullName:      data?.full_name || resolvedName  || '',
        tradeCategory: TRADE_CATEGORIES.includes(cat as any) ? cat : '',
        phone:         data?.phone     || resolvedPhone || '',
        email:         data?.email     || resolvedEmail || '',
        bio:           data?.bio       || '',
        area:          data?.area      || '',
      });
      setIsLoading(false);
    };
    load();
  }, [currentUser?.id]);

  const [verificationDocs, setVerificationDocs] = useState(EMPTY_VERIFICATION_DOCS);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    newRequests: true, jobUpdates: true, payoutAlerts: true, rankingUpdates: true, marketing: false,
  });
  const [currentPlan, setCurrentPlan] = useState('Free Tier');

  const stats = useMemo(() => [
    { v: '0', l: 'Jobs' }, { v: '0.0', l: 'Rating' }, { v: '0', l: 'Score' },
  ], []);

  const showSaved = (msg: string) => {
    setSaveMessage(msg);
    window.setTimeout(() => setSaveMessage(''), 2200);
  };

  const updateField = <K extends keyof ProviderProfileForm>(key: K, value: ProviderProfileForm[K]) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  const toggleNotification = (key: keyof NotificationPrefs) =>
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const simulateUpload = (docName: string) => {
    setVerificationDocs((prev) =>
      prev.map((doc) => doc.name === docName ? { ...doc, status: 'Pending', note: 'Uploaded. Awaiting review' } : doc)
    );
    showSaved(`${docName} uploaded for review`);
  };

  // ── Save to Supabase ────────────────────────────────────────────────────────
  const saveProfile = useCallback(async () => {
    setIsSaving(true);
    let userId: string | null = currentUser?.id ?? null;
    if (!userId) {
      const { data: s } = await supabase.auth.getSession();
      userId = s?.session?.user?.id ?? null;
    }

    if (!userId || userId.startsWith('demo-')) {
      showSaved('Profile updated successfully');
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name:  profile.fullName,
        phone:      profile.phone,
        email:      profile.email,
        trade:      profile.tradeCategory,   // stores exact value: "Plumber" | "Electrician" | "Mechanic"
        bio:        profile.bio,
        area:       profile.area,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    showSaved(error ? 'Error saving profile. Please try again.' : 'Profile updated successfully');
    setIsSaving(false);
  }, [currentUser?.id, profile]);

  const displayTrade = profile.tradeCategory || 'New Provider';

  // ── Renders ───────────────────────────────────────────────────────────────

  const renderMenu = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ textAlign: 'center', padding: 14 }}>
            <div className="stat-num" style={{ color: 'var(--teal)', textAlign: 'center', fontSize: 20 }}>{s.v}</div>
            <div className="stat-label" style={{ textAlign: 'center' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <ProfileMenuButton icon={<Pencil size={20} color="#f59e0b" />}     label="Edit Profile"            onClick={() => setSection('edit-profile')} />
      <ProfileMenuButton icon={<FileText size={20} color="#64748b" />}   label="Verification Documents"  onClick={() => setSection('verification')} />
      <ProfileMenuButton icon={<CreditCard size={20} color="#eab308" />} label="Subscription & Billing"  onClick={() => setSection('billing')} />
      <ProfileMenuButton icon={<Star size={20} color="#0f766e" />}       label="Ranking & Performance"   onClick={() => navigate('provider-ranking')} />
      <ProfileMenuButton icon={<DollarSign size={20} color="#16a34a" />} label="Earnings History"        onClick={() => navigate('provider-earnings')} />
      <ProfileMenuButton icon={<Briefcase size={20} color="#6b7280" />}  label="Job History"             onClick={() => navigate('provider-jobs')} />
      <ProfileMenuButton icon={<Bell size={20} color="#f59e0b" />}       label="Notifications"           onClick={() => setSection('notifications')} />
      <ProfileMenuButton icon={<Lock size={20} color="#ca8a04" />}       label="Privacy & Data (POPIA)"  onClick={() => setSection('privacy')} />
      <ProfileMenuButton icon={<Scale size={20} color="#6b7280" />}      label="Legal Disclaimers"       onClick={() => setSection('legal')} />
      <ProfileMenuButton icon={<HelpCircle size={20} color="#0f766e" />} label="Help & Support"          onClick={() => setSection('support')} />
      <button
        className="btn btn-full"
        style={{ background: 'var(--red-light)', color: 'var(--red-panic)', fontFamily: 'var(--font-head)', fontWeight: 800, border: '2px solid var(--red-panic)', borderRadius: 'var(--radius-sm)', padding: '13px', fontSize: 14, cursor: 'pointer', marginTop: 8 }}
        onClick={() => { setMode(null); navigate('mode-select'); }}
      >
        Sign Out
      </button>
    </>
  );

  const renderEditProfile = () => (
    <>
      <BackSectionHeader title={sectionTitleMap['edit-profile']} onBack={() => setSection('menu')} />
      {isLoading ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 32 }}>
          <Loader2 size={20} color="var(--teal)" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Loading profile…</span>
        </div>
      ) : (
        <>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avt initials={getInitials(profile.fullName || resolvedName)} size={68} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>Profile Photo</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Update your public provider avatar and identity photo.</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <button className="btn btn-secondary" type="button"><Camera size={16} /> Change Photo</button>
              <button className="btn btn-secondary" type="button"><X size={16} /> Remove</button>
            </div>
          </div>

          <div className="card">
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={profile.fullName} onChange={(e) => updateField('fullName', e.target.value)} />

            <div style={{ height: 14 }} />

            <label style={labelStyle}>Trade / Category</label>
            <select
              style={{ ...inputStyle, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36, cursor: 'pointer' }}
              value={profile.tradeCategory}
              onChange={(e) => updateField('tradeCategory', e.target.value as TradeCategory | '')}
            >
              <option value="">Select your trade…</option>
              {TRADE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div style={{ height: 14 }} />

            <label style={labelStyle}>Phone</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input style={{ ...inputStyle, paddingLeft: 38 }} value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </div>

            <div style={{ height: 14 }} />

            <label style={labelStyle}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input style={{ ...inputStyle, paddingLeft: 38 }} value={profile.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>

            <div style={{ height: 14 }} />

            <label style={labelStyle}>Primary Service Area</label>
            <input style={inputStyle} value={profile.area} onChange={(e) => updateField('area', e.target.value)} placeholder="e.g. Pretoria East" />

            <div style={{ height: 14 }} />

            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }}
              value={profile.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell customers a bit about your services and experience"
            />

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={saveProfile}
              disabled={isSaving}
            >
              {isSaving
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </>
      )}
    </>
  );

  const renderVerification = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.verification} onBack={() => setSection('menu')} />
      <div className="card">
        <div className="section-title" style={{ marginBottom: 10 }}>Verification Status</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} color="var(--text-muted)" />
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 14 }}>Not verified yet</span>
          <span className="badge" style={{ background: 'rgba(148,163,184,0.12)', color: 'var(--text-muted)' }}>New Provider</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>Upload your documents to start verification and improve trust on your profile.</div>
      </div>
      {verificationDocs.map((doc) => {
        const approved = doc.status === 'Approved';
        const pending  = doc.status === 'Pending';
        return (
          <div key={doc.name} className="card">
            <div style={rowBetween}>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 15 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{doc.note}</div>
              </div>
              <span className="badge" style={{ background: approved ? 'rgba(34,197,94,0.12)' : pending ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.12)', color: approved ? 'var(--green)' : pending ? '#b45309' : 'var(--text-muted)', fontSize: 11 }}>
                {doc.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <button className="btn btn-secondary" onClick={() => showSaved(`${doc.name} preview opened`)}><Download size={16} /> View</button>
              <button className="btn btn-primary" onClick={() => simulateUpload(doc.name)}><Upload size={16} /> Upload</button>
            </div>
          </div>
        );
      })}
    </>
  );

  const renderBilling = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.billing} onBack={() => setSection('menu')} />
      <div className="card">
        <div style={rowBetween}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16 }}>Current Plan</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{currentPlan}</div>
          </div>
          <span className="badge badge-teal">Active</span>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'var(--bg)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Billing status</div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 14, marginTop: 4 }}>No monthly subscription charge</div>
        </div>
      </div>
      {plans.map((plan) => (
        <div key={plan.name} className="card" style={{ border: plan.name === currentPlan ? '2px solid var(--teal)' : '1px solid var(--border)' }}>
          <div style={rowBetween}>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 16 }}>{plan.name}</div>
              <div style={{ fontSize: 20, fontFamily: 'var(--font-head)', fontWeight: 900, marginTop: 4 }}>{plan.price}</div>
            </div>
            {plan.current && <span className="badge badge-teal">Current</span>}
          </div>
          <div style={{ marginTop: 12 }}>
            {plan.features.map((f) => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Check size={14} color="var(--green)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
          <button className={plan.current ? 'btn btn-secondary btn-full' : 'btn btn-primary btn-full'} style={{ marginTop: 8 }}
            onClick={() => {
              if (!plan.current && plan.name !== 'Pro Tier') { setCurrentPlan(plan.name); showSaved(`${plan.name} selected`); }
              else if (plan.name === 'Pro Tier') showSaved('Pro Tier is not available yet');
              else showSaved('You are already on this plan');
            }}>
            {plan.current ? 'Current Plan' : plan.name === 'Pro Tier' ? 'Notify Me' : 'Switch Plan'}
          </button>
        </div>
      ))}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 10 }}>Billing Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => showSaved('Invoice downloaded')}><Download size={16} /> Invoice</button>
          <button className="btn btn-secondary" onClick={() => showSaved('Billing settings opened')}><CreditCard size={16} /> Billing Settings</button>
        </div>
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.notifications} onBack={() => setSection('menu')} />
      <ToggleRow title="New job requests"  desc="Get notified the moment a lead appears in your area."      checked={notificationPrefs.newRequests}    onChange={() => toggleNotification('newRequests')} />
      <ToggleRow title="Job updates"       desc="Arrival changes, cancellations, and client status updates." checked={notificationPrefs.jobUpdates}     onChange={() => toggleNotification('jobUpdates')} />
      <ToggleRow title="Payout alerts"     desc="Payment received and earnings summary alerts."              checked={notificationPrefs.payoutAlerts}   onChange={() => toggleNotification('payoutAlerts')} />
      <ToggleRow title="Ranking updates"   desc="Get notified when your provider score changes."             checked={notificationPrefs.rankingUpdates} onChange={() => toggleNotification('rankingUpdates')} />
      <ToggleRow title="Marketing updates" desc="Promotions, feature launches and occasional platform news." checked={notificationPrefs.marketing}      onChange={() => toggleNotification('marketing')} />
      <button className="btn btn-primary btn-full" onClick={() => showSaved('Notification preferences saved')}><Save size={16} /> Save Preferences</button>
    </>
  );

  const renderPrivacy = () => (
    <>
      <BackSectionHeader title={sectionTitleMap.privacy} onBack={() => setSection('menu')} />
      <div className="card">
        <div className="section-title">POPIA Data Controls</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Your profile data is used to match you with customers, verify your identity, process platform payments and support dispute resolution.</div>
        <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Data export requested')}><Download size={16} /> Request My Data Export</button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Privacy preferences updated')}><Lock size={16} /> Manage Consent</button>
          <button className="btn btn-full" style={{ background: 'var(--red-light)', color: 'var(--red-panic)', border: '2px solid var(--red-panic)', fontFamily: 'var(--font-head)', fontWeight: 800 }} onClick={() => showSaved('Account deletion request submitted')}><X size={16} /> Request Account Deletion</button>
        </div>
      </div>
      <div className="card">
        <div className="section-title">Stored Data</div>
        {['Identity and verification documents','Public provider profile information','Job history and ratings','Billing and subscription records','In-app support and dispute records'].map((item) => (
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
      <BackSectionHeader title={sectionTitleMap.legal} onBack={() => setSection('menu')} />
      <div className="card">
        <div className="section-title">Provider Legal Summary</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            { title: 'Independent Contractor', body: 'Providers operate independently and are responsible for their own tools, travel, tax and service delivery.' },
            { title: 'Platform Fees', body: 'A 3.5% fee is deducted from qualifying in-app paid jobs for payment handling and platform services.' },
            { title: 'Dispute Handling', body: 'Only jobs managed and paid through the platform qualify for platform-backed dispute support.' },
            { title: 'Verification', body: 'Identity and document verification increase trust but do not guarantee work, ranking or legality of off-platform conduct.' },
          ].map((item) => (
            <div key={item.title} style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
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
      <BackSectionHeader title={sectionTitleMap.support} onBack={() => setSection('menu')} />
      <div className="card">
        <div className="section-title">Need help?</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Use one of the options below to contact support about billing, verification, customer disputes or technical issues.</div>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          <button className="btn btn-primary btn-full" onClick={() => showSaved('Support chat opened')}><HelpCircle size={16} /> Start Support Chat</button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Support email composer opened')}><Mail size={16} /> Email Support</button>
          <button className="btn btn-secondary btn-full" onClick={() => showSaved('Call support action opened')}><Phone size={16} /> Call Support</button>
        </div>
      </div>
      <div className="card">
        <div className="section-title">Common Help Topics</div>
        {['How verification reviews work','How provider score is calculated','How subscription billing works','What happens during a dispute'].map((topic) => (
          <div key={topic} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <CheckCircle size={14} color="var(--teal)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{topic}</span>
          </div>
        ))}
      </div>
    </>
  );

  const renderSection = () => {
    switch (section) {
      case 'menu':          return renderMenu();
      case 'edit-profile':  return renderEditProfile();
      case 'verification':  return renderVerification();
      case 'billing':       return renderBilling();
      case 'notifications': return renderNotifications();
      case 'privacy':       return renderPrivacy();
      case 'legal':         return renderLegal();
      case 'support':       return renderSupport();
      default:              return renderMenu();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div style={{ background: 'var(--teal)', padding: '24px 20px 32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', maxWidth: 700, margin: '0 auto' }}>
          <Avt initials={getInitials(profile.fullName || resolvedName)} size={68} />
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 900, fontSize: 22, color: 'white' }}>{profile.fullName || resolvedName || 'Provider'}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{displayTrade}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}>New Account</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11 }}>★ 0.0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="screen">
        <div className="screen-content">
          {saveMessage && (
            <div className="card" style={{ background: saveMessage.startsWith('Error') ? 'rgba(239,68,68,0.08)' : 'rgba(20,184,166,0.08)', border: saveMessage.startsWith('Error') ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(20,184,166,0.25)', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
              <CheckCircle size={18} color={saveMessage.startsWith('Error') ? 'var(--red-panic)' : 'var(--teal)'} />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{saveMessage}</span>
            </div>
          )}
          {renderSection()}
        </div>
      </div>
      <ProviderNav />
    </div>
  );
};