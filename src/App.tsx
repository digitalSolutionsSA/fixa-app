import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { OnboardingScreen, ModeSelectScreen } from './screens/Onboarding';
import { AuthScreen } from './screens/Auth';
import { ConsumerHome } from './pages/ConsumerHome';
import { ProviderHomeScreen } from './screens/provider/ProviderHomeScreen';
import {
  FindProviderScreen,
  JobInProgressScreen,
  ProviderArrivedScreen,
  ConsumerBookingsScreen,
  ConsumerSafetyScreen,
  ConsumerProfileScreen,
  TopProvidersScreen,
} from './screens/Consumer';
import { BookJobScreen } from './screens/consumer/BookJobScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import {
  ProviderJobRequestScreen,
  ProviderJobsScreen,
  ProviderEarningsScreen,
  ProviderRankingScreen,
  ProviderProfileScreen,
} from './screens/Provider';
import {
  PlumberScreen,
  ElectricianScreen,
  MechanicScreen,
} from './screens/consumer/CategoryProviderScreen';

const LoadingScreen: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--teal)' }}>
    <div className="logo-wrap" style={{ marginBottom: 12 }}>
      <span className="logo-main" style={{ color: 'white', fontSize: 42 }}>
        FI<span className="logo-x" style={{ color: 'var(--navy)' }}>X</span>A
      </span>
    </div>
    <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ScreenRouter: React.FC = () => {
  const { screen, sessionLoading } = useApp();

  if (sessionLoading) return <LoadingScreen />;

  const map: Record<string, React.ReactNode> = {
    onboarding:    <OnboardingScreen />,
    'mode-select': <ModeSelectScreen />,
    auth:          <AuthScreen />,
    // Consumer
    'consumer-home':      <ConsumerHome />,
    'find-provider':      <FindProviderScreen />,
    'plumber-screen':     <PlumberScreen />,
    'electrician-screen': <ElectricianScreen />,
    'mechanic-screen':    <MechanicScreen />,
    'book-job':           <BookJobScreen />,
    'job-in-progress':    <JobInProgressScreen />,
    'provider-arrived':   <ProviderArrivedScreen />,
    'consumer-bookings':  <ConsumerBookingsScreen />,
    'consumer-safety':    <ConsumerSafetyScreen />,
    'consumer-profile':   <ConsumerProfileScreen />,
    'top-providers':      <TopProvidersScreen />,
    'notifications':      <NotificationsScreen />,
    // Provider
    'provider-home':        <ProviderHomeScreen />,
    'provider-job-request': <ProviderJobRequestScreen />,
    'provider-jobs':        <ProviderJobsScreen />,
    'provider-earnings':    <ProviderEarningsScreen />,
    'provider-ranking':     <ProviderRankingScreen />,
    'provider-profile':     <ProviderProfileScreen />,
  };

  return <>{map[screen] || <OnboardingScreen />}</>;
};

function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}

export default App;
