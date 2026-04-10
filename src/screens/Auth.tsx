import React, { useMemo, useState } from 'react';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const AuthScreen: React.FC = () => {
  const app = useApp();

  const { navigate, mode } = app;

  const loginFn = typeof app.login === 'function' ? app.login : null;
  const registerFn = typeof app.register === 'function' ? app.register : null;

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSignupAttempt, setLastSignupAttempt] = useState(0);

  const activeRole: 'consumer' | 'provider' = mode === 'provider' ? 'provider' : 'consumer';

  const demoCredentials = useMemo(
    () => ({
      consumer: {
        email: 'customer@demo.co.za',
        password: 'admin123',
      },
      provider: {
        email: 'provider@demo.co.za',
        password: 'admin123',
      },
    }),
    []
  );

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const handleBack = () => {
    if (isSubmitting) return;
    navigate('mode-select');
  };

  const handleSignIn = async () => {
    resetFeedback();

    const cleanEmail = email.trim();
    const rawPassword = password;

    if (!cleanEmail || !rawPassword) {
      setError('Please enter your email and password.');
      return;
    }

    if (!loginFn) {
      setError(
        'Login is not available from the app context right now. Please refresh the app and try again.'
      );
      return;
    }

    console.log('AUTH SIGNIN FORM', {
      email: cleanEmail,
      passwordLength: rawPassword.length,
      passwordStartsWithSpace: rawPassword.startsWith(' '),
      passwordEndsWithSpace: rawPassword.endsWith(' '),
      activeRole,
    });

    setIsSubmitting(true);

    try {
      const result = await loginFn(cleanEmail, rawPassword);

      if (!result?.success) {
        setError(result?.error || 'Unable to sign in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    resetFeedback();

    const now = Date.now();

    if (now - lastSignupAttempt < 5000) {
      setError('Please wait a few seconds before trying again.');
      return;
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const rawPassword = password;

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!rawPassword) {
      setError('Please enter a password.');
      return;
    }

    if (rawPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!registerFn) {
      setError(
        'Sign up is not available from the app context right now. Please refresh the app and try again.'
      );
      return;
    }

    console.log('AUTH SIGNUP FORM', {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      passwordLength: rawPassword.length,
      passwordStartsWithSpace: rawPassword.startsWith(' '),
      passwordEndsWithSpace: rawPassword.endsWith(' '),
      activeRole,
    });

    setLastSignupAttempt(now);
    setIsSubmitting(true);

    try {
      const result = await registerFn(
        cleanName,
        cleanEmail,
        cleanPhone,
        rawPassword,
        activeRole
      );

      if (!result?.success) {
        setError(result?.error || 'Unable to sign up.');
        return;
      }

      setPassword('');

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Account created successfully. Please sign in to continue.');
      }

      setTab('signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginAsDemo = async (role: 'consumer' | 'provider') => {
    resetFeedback();

    if (!loginFn) {
      setError(
        'Login is not available from the app context right now. Please refresh the app and try again.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const creds = demoCredentials[role];
      const result = await loginFn(creds.email, creds.password);

      if (!result?.success) {
        setError(result?.error || 'Unable to sign in with the demo account.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to sign in with the demo account.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (tab === 'signin') {
      await handleSignIn();
    } else {
      await handleSignUp();
    }
  };

  const roleLabel = activeRole === 'provider' ? 'Provider' : 'Consumer';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          background: 'var(--teal)',
          padding: '20px 20px 28px',
          color: 'white',
        }}
      >
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            padding: 0,
            marginBottom: 18,
            fontSize: 14,
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div style={{ textAlign: 'center' }}>
          <img
            src="/fixa-logo.png"
            alt="Fixa Logo"
            style={{
              width: 110,
              height: 'auto',
              display: 'block',
              margin: '0 auto 16px',
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: 24,
              lineHeight: 1.2,
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
            }}
          >
            {tab === 'signin' ? `Sign in as ${roleLabel}` : `Create your ${roleLabel} account`}
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: 'rgba(255,255,255,0.84)',
              fontSize: 14,
            }}
          >
            {activeRole === 'provider'
              ? 'You are continuing as a service provider. Only provider accounts can sign in here.'
              : 'You are continuing as a consumer. Only consumer accounts can sign in here.'}
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 460,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 18,
            }}
          >
            <button
              onClick={() => {
                if (isSubmitting) return;
                resetFeedback();
                setTab('signin');
              }}
              disabled={isSubmitting}
              style={{
                height: 46,
                borderRadius: 12,
                border: tab === 'signin' ? '2px solid var(--teal)' : '1px solid var(--border)',
                background: tab === 'signin' ? 'rgba(0, 128, 128, 0.08)' : 'white',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              type="button"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LogIn size={16} />
                Sign In
              </span>
            </button>

            <button
              onClick={() => {
                if (isSubmitting) return;
                resetFeedback();
                setTab('signup');
              }}
              disabled={isSubmitting}
              style={{
                height: 46,
                borderRadius: 12,
                border: tab === 'signup' ? '2px solid var(--teal)' : '1px solid var(--border)',
                background: tab === 'signup' ? 'rgba(0, 128, 128, 0.08)' : 'white',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
              type="button"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <UserPlus size={16} />
                Sign Up
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: 'white',
                borderRadius: 18,
                padding: 22,
                boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  marginBottom: 18,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(0, 128, 128, 0.06)',
                  border: '1px solid rgba(0, 128, 128, 0.14)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}
              >
                Continuing as: <span style={{ color: 'var(--teal)' }}>{roleLabel}</span>
              </div>

              {tab === 'signup' && (
                <>
                  <label
                    htmlFor="full-name"
                    style={{
                      display: 'block',
                      fontSize: 13,
                      marginBottom: 6,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Full name
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    style={inputStyle}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />

                  <label
                    htmlFor="phone"
                    style={{
                      display: 'block',
                      fontSize: 13,
                      marginBottom: 6,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 082 123 4567"
                    style={inputStyle}
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                </>
              )}

              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: 13,
                  marginBottom: 6,
                  color: 'var(--text-secondary)',
                }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                disabled={isSubmitting}
              />

              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: 13,
                  marginBottom: 6,
                  color: 'var(--text-secondary)',
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={inputStyle}
                disabled={isSubmitting}
              />

              {error && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(220, 38, 38, 0.08)',
                    color: '#b91c1c',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(15, 118, 110, 0.08)',
                    color: '#0f766e',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 12,
                  border: 'none',
                  background: 'var(--teal)',
                  color: 'white',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting
                  ? tab === 'signin'
                    ? 'Signing In...'
                    : 'Signing Up...'
                  : tab === 'signin'
                  ? activeRole === 'provider'
                    ? 'Sign In as Provider'
                    : 'Sign In as Consumer'
                  : activeRole === 'provider'
                  ? 'Sign Up as Provider'
                  : 'Sign Up as Consumer'}
              </button>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 18,
                  borderTop: '1px solid var(--border)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 10px',
                    textAlign: 'center',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Demo accounts for previewing the app
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  <button
                    onClick={() => void loginAsDemo('consumer')}
                    style={secondaryButtonStyle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Demo Consumer
                  </button>

                  <button
                    onClick={() => void loginAsDemo('provider')}
                    style={secondaryButtonStyle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Demo Provider
                  </button>
                </div>

                <p
                  style={{
                    margin: '12px 0 0',
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  Consumer demo: customer@demo.co.za / admin123
                  <br />
                  Provider demo: provider@demo.co.za / admin123
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 46,
  borderRadius: 12,
  border: '1px solid var(--border)',
  padding: '0 14px',
  fontSize: 14,
  marginBottom: 14,
  outline: 'none',
  background: 'white',
  boxSizing: 'border-box',
};

const secondaryButtonStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: '#f8fafc',
  cursor: 'pointer',
  fontWeight: 700,
};