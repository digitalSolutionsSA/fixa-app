export type UserMode = 'consumer' | 'provider' | null;

export type Screen =
  // Shared
  | 'onboarding'
  | 'mode-select'
  | 'auth'
  // Consumer
  | 'consumer-home'
  | 'find-provider'
  | 'plumber-screen'
  | 'electrician-screen'
  | 'mechanic-screen'
  | 'job-in-progress'
  | 'provider-arrived'
  | 'consumer-bookings'
  | 'consumer-safety'
  | 'consumer-profile'
  // Provider
  | 'provider-home'
  | 'provider-job-request'
  | 'provider-jobs'
  | 'provider-earnings'
  | 'provider-ranking'
  | 'provider-profile'
  | 'top-providers';

export interface Provider {
  id: string;
  name: string;
  trade: string;
  rating: number;
  jobCount: number;
  distance: string;
  priceFrom: number;
  verified: boolean;
  qualVerified: boolean;
  available: boolean;
  initials: string;
  score?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  customer?: string;
  location: string;
  distance: string;
  price: number;
  status: 'new' | 'active' | 'completed';
  time?: string;
  date?: string;
}

export interface AppState {
  mode: UserMode;
  screen: Screen;
  selectedProvider: Provider | null;
  activeJob: Job | null;
  panicActive: boolean;
}