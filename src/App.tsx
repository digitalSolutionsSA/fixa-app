import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { OnboardingScreen, ModeSelectScreen } from './screens/Onboarding';
import {
  ConsumerHomeScreen, FindProviderScreen, JobInProgressScreen,
  ProviderArrivedScreen, ConsumerBookingsScreen, ConsumerSafetyScreen,
  ConsumerProfileScreen, TopProvidersScreen,
} from './screens/Consumer';
import {
  ProviderHomeScreen, ProviderJobRequestScreen, ProviderJobsScreen,
  ProviderEarningsScreen, ProviderRankingScreen, ProviderProfileScreen,
} from './screens/Provider';

const ScreenRouter: React.FC = () => {
  const { screen } = useApp();
  const map: Record<string, React.ReactNode> = {
    'onboarding':          <OnboardingScreen />,
    'mode-select':         <ModeSelectScreen />,
    'consumer-home':       <ConsumerHomeScreen />,
    'find-provider':       <FindProviderScreen />,
    'job-in-progress':     <JobInProgressScreen />,
    'provider-arrived':    <ProviderArrivedScreen />,
    'consumer-bookings':   <ConsumerBookingsScreen />,
    'consumer-safety':     <ConsumerSafetyScreen />,
    'consumer-profile':    <ConsumerProfileScreen />,
    'top-providers':       <TopProvidersScreen />,
    'provider-home':       <ProviderHomeScreen />,
    'provider-job-request':<ProviderJobRequestScreen />,
    'provider-jobs':       <ProviderJobsScreen />,
    'provider-earnings':   <ProviderEarningsScreen />,
    'provider-ranking':    <ProviderRankingScreen />,
    'provider-profile':    <ProviderProfileScreen />,
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
