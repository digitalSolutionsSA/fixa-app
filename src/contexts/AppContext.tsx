import React, { createContext, useContext, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AppState, Screen, Provider, Job, UserMode } from '../types';

type DemoRole = 'consumer' | 'provider';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: DemoRole;
};

type SafeUser = Omit<DemoUser, 'password'>;

type AuthResult = {
  success: boolean;
  error?: string;
};

interface AppContextType extends AppState {
  currentUser: SafeUser | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  navigate: (screen: Screen) => void;
  setMode: (mode: UserMode) => void;
  selectProvider: (p: Provider | null) => void;
  setActiveJob: (j: Job | null) => void;
  triggerPanic: () => void;
  dismissPanic: () => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: DemoRole
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-customer-1',
    name: 'Demo Customer',
    email: 'customer@demo.co.za',
    phone: '+27 82 000 0001',
    password: 'admin123',
    role: 'consumer',
  },
  {
    id: 'demo-provider-1',
    name: 'Demo Service Provider',
    email: 'provider@demo.co.za',
    phone: '+27 82 000 0002',
    password: 'admin123',
    role: 'provider',
  },
];

function stripPassword(user: DemoUser): SafeUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function normalizeRole(role: unknown): DemoRole | null {
  if (typeof role !== 'string') return null;

  const normalized = role.trim().toLowerCase();

  if (normalized === 'consumer' || normalized === 'customer') return 'consumer';
  if (normalized === 'provider') return 'provider';

  return null;
}

function getHomeScreenForRole(role: DemoRole): Screen {
  return role === 'consumer' ? 'consumer-home' : 'provider-home';
}

function getRoleMismatchMessage(selectedRole: DemoRole, actualRole: DemoRole): string {
  if (selectedRole === actualRole) return '';

  if (selectedRole === 'provider' && actualRole === 'consumer') {
    return 'This account is registered as a consumer, not a provider.';
  }

  if (selectedRole === 'consumer' && actualRole === 'provider') {
    return 'This account is registered as a provider, not a consumer.';
  }

  return 'This account does not match the selected sign-in role.';
}

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const maybeError = error as { status?: number; message?: string };
  const message = maybeError.message?.toLowerCase() || '';

  return (
    maybeError.status === 429 ||
    message.includes('too many requests') ||
    message.includes('rate limit')
  );
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    mode: null,
    screen: 'onboarding',
    selectedProvider: null,
    activeJob: null,
    panicActive: false,
  });

  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const lastRegisterAttemptRef = useRef(0);

  const navigate = (screen: Screen) => {
    setState((s) => ({ ...s, screen }));
  };

  const setMode = (mode: UserMode) => {
    setState((s) => ({ ...s, mode }));
  };

  const selectProvider = (p: Provider | null) => {
    setState((s) => ({ ...s, selectedProvider: p }));
  };

  const setActiveJob = (j: Job | null) => {
    setState((s) => ({ ...s, activeJob: j }));
  };

  const triggerPanic = () => {
    setState((s) => ({ ...s, panicActive: true }));
  };

  const dismissPanic = () => {
    setState((s) => ({ ...s, panicActive: false }));
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const selectedMode = normalizeRole(state.mode);

    if (!normalizedEmail || !password) {
      return {
        success: false,
        error: 'Email and password are required.',
      };
    }

    if (!selectedMode) {
      return {
        success: false,
        error: 'Please choose whether you are signing in as a consumer or provider first.',
      };
    }

    const matchedDemoUser = DEMO_USERS.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
    );

    if (matchedDemoUser) {
      const actualRole = normalizeRole(matchedDemoUser.role);

      if (!actualRole) {
        return {
          success: false,
          error: 'This demo account has an invalid role configuration.',
        };
      }

      if (selectedMode !== actualRole) {
        return {
          success: false,
          error: getRoleMismatchMessage(selectedMode, actualRole),
        };
      }

      const safeUser = stripPassword(matchedDemoUser);

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsDemo(true);

      setState((s) => ({
        ...s,
        mode: actualRole,
        screen: getHomeScreenForRole(actualRole),
        selectedProvider: null,
        activeJob: null,
        panicActive: false,
      }));

      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      if (isRateLimitError(error)) {
        return {
          success: false,
          error: 'Too many sign-in attempts. Please wait a few minutes and try again.',
        };
      }

      return {
        success: false,
        error: error?.message || 'Invalid email or password.',
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      await supabase.auth.signOut();

      return {
        success: false,
        error: profileError.message || 'Unable to load your profile.',
      };
    }

    const actualRole =
      normalizeRole(profile?.role) ||
      normalizeRole(data.user.user_metadata?.role);

    if (!actualRole) {
      await supabase.auth.signOut();

      return {
        success: false,
        error: 'Your account role is missing or invalid. Please contact support.',
      };
    }

    if (selectedMode !== actualRole) {
      await supabase.auth.signOut();

      return {
        success: false,
        error: getRoleMismatchMessage(selectedMode, actualRole),
      };
    }

    const safeUser: SafeUser = {
      id: data.user.id,
      name:
        profile?.full_name ||
        data.user.user_metadata?.full_name ||
        data.user.email?.split('@')[0] ||
        'User',
      email: profile?.email || data.user.email || normalizedEmail,
      phone: profile?.phone || data.user.user_metadata?.phone || '',
      role: actualRole,
    };

    setCurrentUser(safeUser);
    setIsAuthenticated(true);
    setIsDemo(false);

    setState((s) => ({
      ...s,
      mode: actualRole,
      screen: getHomeScreenForRole(actualRole),
      selectedProvider: null,
      activeJob: null,
      panicActive: false,
    }));

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: DemoRole
  ): Promise<AuthResult> => {
    const now = Date.now();

    if (now - lastRegisterAttemptRef.current < 5000) {
      return {
        success: false,
        error: 'Please wait a few seconds before trying again.',
      };
    }

    lastRegisterAttemptRef.current = now;

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const normalizedRole = normalizeRole(role);
    const selectedMode = normalizeRole(state.mode);

    if (!trimmedName || !normalizedEmail || !trimmedPhone || !password) {
      return {
        success: false,
        error: 'Please fill in all fields.',
      };
    }

    if (!normalizedRole) {
      return {
        success: false,
        error: 'Please choose a valid account type.',
      };
    }

    if (!selectedMode) {
      return {
        success: false,
        error: 'Please choose whether you are signing up as a consumer or provider first.',
      };
    }

    if (selectedMode !== normalizedRole) {
      return {
        success: false,
        error: 'The selected sign-up role does not match the chosen account type.',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long.',
      };
    }

    const demoEmails = DEMO_USERS.map((user) => user.email.toLowerCase());

    if (demoEmails.includes(normalizedEmail)) {
      return {
        success: false,
        error: 'That demo account already exists. Please sign in instead.',
      };
    }

    const { data: existingProfile } = await supabase
  .from('profiles')
  .select('id, email, phone')
  .or(`email.eq.${normalizedEmail},phone.eq.${trimmedPhone}`)
  .maybeSingle();

if (existingProfile) {
  return {
    success: false,
    error: 'An account with this email or phone number already exists.',
  };
}

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          phone: trimmedPhone,
          role: normalizedRole,
        },
      },
    });

    if (error || !data.user) {
  console.error('SUPABASE SIGNUP ERROR:', {
    error,
    message: error?.message,
    status: (error as any)?.status,
    code: (error as any)?.code,
    name: (error as any)?.name,
    email: normalizedEmail,
    phone: trimmedPhone,
    role: normalizedRole,
  });

  if (isRateLimitError(error)) {
    return {
      success: false,
      error: 'Too many sign-up attempts. Please wait a few minutes and try again.',
    };
  }

  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = (error as any)?.code?.toLowerCase?.() || '';

  if (
    errorMessage.includes('already registered') ||
    errorMessage.includes('already exists') ||
    errorCode.includes('user_already_exists') ||
    errorCode.includes('email_exists')
  ) {
    return {
      success: false,
      error: 'This email address is already registered. Please sign in instead.',
    };
  }

  return {
    success: false,
    error: error?.message || 'Unable to sign up.',
  };
}
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: data.user.id,
        full_name: trimmedName,
        email: normalizedEmail,
        phone: trimmedPhone,
        role: normalizedRole,
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      return {
        success: false,
        error: profileError.message || 'Account created, but profile setup failed.',
      };
    }

    const sessionExists = !!data.session;

    if (sessionExists) {
      const safeUser: SafeUser = {
        id: data.user.id,
        name: trimmedName,
        email: normalizedEmail,
        phone: trimmedPhone,
        role: normalizedRole,
      };

      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      setIsDemo(false);

      setState((s) => ({
        ...s,
        mode: normalizedRole,
        screen: getHomeScreenForRole(normalizedRole),
        selectedProvider: null,
        activeJob: null,
        panicActive: false,
      }));
    }

    return {
      success: true,
      error: sessionExists
        ? undefined
        : 'Account created successfully. Please check your email to confirm your account before signing in.',
    };
  };

  const logout = async () => {
    const isDemoUser = isDemo || currentUser?.id?.startsWith('demo-');

    if (!isDemoUser) {
      await supabase.auth.signOut();
    }

    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsDemo(false);

    setState({
      mode: null,
      screen: 'onboarding',
      selectedProvider: null,
      activeJob: null,
      panicActive: false,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        currentUser,
        isAuthenticated,
        isDemo,
        navigate,
        setMode,
        selectProvider,
        setActiveJob,
        triggerPanic,
        dismissPanic,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};