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

function getDbRole(role: DemoRole): 'customer' | 'provider' {
  return role === 'provider' ? 'provider' : 'customer';
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

function safeTrim(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeEmail(value: unknown): string {
  return safeTrim(value).toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback;

  const maybeError = error as { message?: string; status?: number; code?: string };
  const message = maybeError.message?.trim();

  if (!message) return fallback;

  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email address before signing in.';
  }

  if (lower.includes('failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (lower.includes('fetch')) {
    return 'Network error. Please try again.';
  }

  return message;
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
    try {
      const normalizedEmail = normalizeEmail(email);
      const cleanPassword = typeof password === 'string' ? password : '';
      const selectedMode = normalizeRole(state.mode);

      console.log('LOGIN INPUT', {
        normalizedEmail,
        passwordExists: !!cleanPassword,
        selectedMode,
        emailType: typeof email,
        passwordType: typeof password,
      });

      if (!normalizedEmail || !cleanPassword) {
        return {
          success: false,
          error: 'Email and password are required.',
        };
      }

      if (!isValidEmail(normalizedEmail)) {
        return {
          success: false,
          error: 'Please enter a valid email address.',
        };
      }

      if (!selectedMode) {
        return {
          success: false,
          error: 'Please choose whether you are signing in as a consumer or provider first.',
        };
      }

      const matchedDemoUser = DEMO_USERS.find(
        (user) => user.email.toLowerCase() === normalizedEmail && user.password === cleanPassword
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
        password: cleanPassword,
      });

      if (error || !data.user) {
        console.error('SUPABASE LOGIN ERROR:', {
          error,
          message: (error as any)?.message,
          status: (error as any)?.status,
          code: (error as any)?.code,
          email: normalizedEmail,
        });

        if (isRateLimitError(error)) {
          return {
            success: false,
            error: 'Too many sign-in attempts. Please wait a few minutes and try again.',
          };
        }

        return {
          success: false,
          error: getAuthErrorMessage(error, 'Invalid email or password.'),
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
        normalizeRole(profile?.role) || normalizeRole(data.user.user_metadata?.role);

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
    } catch (error) {
      console.error('LOGIN UNEXPECTED ERROR:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error, 'Something went wrong while signing in.'),
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: DemoRole
  ): Promise<AuthResult> => {
    try {
      const now = Date.now();

      if (now - lastRegisterAttemptRef.current < 5000) {
        return {
          success: false,
          error: 'Please wait a few seconds before trying again.',
        };
      }

      lastRegisterAttemptRef.current = now;

      const trimmedName = safeTrim(name);
      const normalizedEmail = normalizeEmail(email);
      const trimmedPhone = safeTrim(phone);
      const cleanPassword = typeof password === 'string' ? password : '';
      const normalizedRole = normalizeRole(role);
      const selectedMode = normalizeRole(state.mode);

      if (!trimmedName || !normalizedEmail || !trimmedPhone || !cleanPassword) {
        return {
          success: false,
          error: 'Please fill in all fields.',
        };
      }

      if (!isValidEmail(normalizedEmail)) {
        return {
          success: false,
          error: 'Please enter a valid email address.',
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

      if (cleanPassword.length < 6) {
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

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: trimmedName,
            phone: trimmedPhone,
            role: getDbRole(normalizedRole),
          },
        },
      });

      if (error || !data.user) {
        console.error('SUPABASE SIGNUP ERROR:', {
          error,
          message: (error as any)?.message,
          status: (error as any)?.status,
          code: (error as any)?.code,
          name: (error as any)?.name,
          email: normalizedEmail,
          phone: trimmedPhone,
          role: getDbRole(normalizedRole),
        });

        if (isRateLimitError(error)) {
          return {
            success: false,
            error: 'Too many sign-up attempts. Please wait a few minutes and try again.',
          };
        }

        const errorMessage = (error as any)?.message?.toLowerCase?.() || '';
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
          error: getAuthErrorMessage(error, 'Unable to sign up.'),
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
    } catch (error) {
      console.error('REGISTER UNEXPECTED ERROR:', error);
      return {
        success: false,
        error: getAuthErrorMessage(error, 'Something went wrong while signing up.'),
      };
    }
  };

  const logout = async () => {
    try {
      const isDemoUser = isDemo || currentUser?.id?.startsWith('demo-');

      if (!isDemoUser) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('LOGOUT ERROR:', error);
    } finally {
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
    }
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