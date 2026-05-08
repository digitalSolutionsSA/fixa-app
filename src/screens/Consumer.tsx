/**
 * src/screens/Consumer.tsx
 *
 * This file is the drop-in replacement for the original Consumer.tsx monolith.
 * All screens now live in src/screens/consumer/ as individual files.
 * Everything is re-exported here so that nothing else in the project needs
 * to change — App.tsx, ConsumerHome.tsx and any other file that previously
 * imported from this file will continue to work unchanged.
 *
 * Folder structure created:
 *   src/screens/consumer/
 *     providers.ts               ← shared PROVIDERS data + getSafeSelectedProvider
 *     ConsumerHomeScreen.tsx
 *     FindProviderScreen.tsx
 *     JobInProgressScreen.tsx
 *     ProviderArrivedScreen.tsx
 *     ConsumerBookingsScreen.tsx
 *     ConsumerSafetyScreen.tsx
 *     TopProvidersScreen.tsx
 *     ConsumerProfileScreen.tsx
 */

export { ConsumerHomeScreen }     from './consumer/ConsumerHomeScreen';
export { FindProviderScreen }     from './consumer/FindProviderScreen';
export { JobInProgressScreen }    from './consumer/JobInProgressScreen';
export { ProviderArrivedScreen }  from './consumer/ProviderArrivedScreen';
export { ConsumerBookingsScreen } from './consumer/ConsumerBookingsScreen';
export { ConsumerSafetyScreen }   from './consumer/ConsumerSafetyScreen';
export { TopProvidersScreen }     from './consumer/TopProvidersScreen';
export { ConsumerProfileScreen }  from './consumer/ConsumerProfileScreen';

// Shared provider data (re-exported in case anything imports it from here)
export { PROVIDERS, getSafeSelectedProvider } from './consumer/providers';