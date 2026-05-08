import type { Provider } from '../../types';

export const PROVIDERS: Provider[] = [
  { id: '1', name: "Jason's Plumbing", trade: 'Plumber', rating: 4.8, jobCount: 128, distance: '2.1 km', priceFrom: 450, verified: true, qualVerified: true, available: true, initials: 'JP', score: 96 },
  { id: '2', name: 'Maya Electrical', trade: 'Electrician', rating: 4.8, jobCount: 93, distance: '3.4 km', priceFrom: 650, verified: true, qualVerified: true, available: true, initials: 'ME', score: 94 },
  { id: '3', name: 'Mike the Handyman', trade: 'Handyman', rating: 4.8, jobCount: 156, distance: '1.8 km', priceFrom: 200, verified: true, qualVerified: false, available: false, initials: 'MH', score: 91 },
  { id: '4', name: "Sarah's Repairs", trade: 'General Contractor', rating: 4.9, jobCount: 97, distance: '4.2 km', priceFrom: 200, verified: true, qualVerified: true, available: true, initials: 'SR', score: 89 },
  { id: '5', name: "John's Electric", trade: 'Electrician', rating: 4.7, jobCount: 103, distance: '5.1 km', priceFrom: 400, verified: true, qualVerified: false, available: false, initials: 'JE', score: 85 },
];

export function getSafeSelectedProvider(selectedProvider: any, isDemo?: boolean) {
  if (selectedProvider) return selectedProvider;
  if (isDemo) return PROVIDERS[0];
  return null;
}
