import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { OnboardingScreen, ModeSelectScreen } from './screens/Onboarding';
import { AuthScreen } from './screens/Auth';
import { ConsumerHome } from './pages/ConsumerHome';
import { ProviderDashboard } from './pages/ProviderDashboard';
import {
  FindProviderScreen,
  JobInProgressScreen,
  ProviderArrivedScreen,
  ConsumerBookingsScreen,
  ConsumerSafetyScreen,
  ConsumerProfileScreen,
  TopProvidersScreen,
} from './screens/Consumer';
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

const ScreenRouter: React.FC = () => {
  const { screen } = useApp();

  const map: Record<string, React.ReactNode> = {
    onboarding:   <OnboardingScreen />,
    'mode-select': <ModeSelectScreen />,
    auth:         <AuthScreen />,
    // Consumer
    'consumer-home':     <ConsumerHome />,
    'find-provider':     <FindProviderScreen />,
    'plumber-screen':    <PlumberScreen />,
    'electrician-screen': <ElectricianScreen />,
    'mechanic-screen':   <MechanicScreen />,
    'job-in-progress':   <JobInProgressScreen />,
    'provider-arrived':  <ProviderArrivedScreen />,
    'consumer-bookings': <ConsumerBookingsScreen />,
    'consumer-safety':   <ConsumerSafetyScreen />,
    'consumer-profile':  <ConsumerProfileScreen />,
    'top-providers':     <TopProvidersScreen />,
    // Provider
    'provider-home':        <ProviderDashboard />,
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