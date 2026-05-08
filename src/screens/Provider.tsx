/*
 * Provider.tsx — barrel re-export file
 *
 * All screens now live in src/screens/provider/ as individual files.
 * Everything is re-exported here so that nothing else in the project
 * needs to change — App.tsx and any other file that previously imported
 * from this file will continue to work unchanged.
 *
 * Folder structure created:
 *   src/screens/provider/
 *     constants.ts                ← shared data, types, helpers & styles
 *     ProviderShared.tsx          ← shared UI sub-components
 *     ProviderHomeScreen.tsx
 *     ProviderJobRequestScreen.tsx
 *     ProviderJobsScreen.tsx
 *     ProviderEarningsScreen.tsx
 *     ProviderRankingScreen.tsx
 *     ProviderProfileScreen.tsx
 */

export { ProviderHomeScreen }        from './provider/ProviderHomeScreen';
export { ProviderJobRequestScreen }  from './provider/ProviderJobRequestScreen';
export { ProviderJobsScreen }        from './provider/ProviderJobsScreen';
export { ProviderEarningsScreen }    from './provider/ProviderEarningsScreen';
export { ProviderRankingScreen }     from './provider/ProviderRankingScreen';
export { ProviderProfileScreen }     from './provider/ProviderProfileScreen';