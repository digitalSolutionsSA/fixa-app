// "What do you need?" options on the Request a Job screen, per provider trade.
// Keys match the `trade` values stored on provider profiles.
const JOB_TYPES_BY_TRADE: Record<string, string[]> = {
  Plumber: [
    'Burst pipe / leak',
    'Blocked drain',
    'Geyser problem',
    'Leaking tap / toilet',
    'Toilet not flushing',
    'Low water pressure',
    'Bathroom / kitchen installation',
  ],
  Electrician: [
    'Electrical fault',
    'No power / tripped breaker',
    'Light installation',
    'Plug / switch repair',
    'DB board / wiring',
    'Certificate of Compliance (COC)',
    'Appliance installation',
  ],
  Mechanic: [
    'Car service / maintenance',
    "Won't start / battery",
    'Brakes',
    'Tyre change',
    'Engine / warning light',
    'Aircon / auto electrics',
  ],
  'Pool Services': [
    'Pool cleaning',
    'Green / cloudy water',
    'Pump / filter problem',
    'Leak detection',
    'Chemical balancing',
  ],
  Security: [
    'Alarm system',
    'CCTV cameras',
    'Electric fence',
    'Gate motor',
    'Intercom / access control',
  ],
  Solar: [
    'Solar panel installation',
    'Inverter / battery problem',
    'Solar geyser',
    'System not producing power',
    'Panel cleaning / maintenance',
  ],
  Renovation: [
    'Painting',
    'Tiling / flooring',
    'Carpentry / woodwork',
    'Roofing / waterproofing',
    'Plastering / drywall',
    'Kitchen / bathroom remodel',
  ],
  Printing: [
    'Business cards',
    'Flyers / posters',
    'Banners / signage',
    'Vehicle branding',
    'T-shirts / apparel',
  ],
};

const GENERAL_JOB_TYPES = [
  'General repairs',
  'Garden / landscaping',
  'Cleaning',
  'Handyman work',
  'Moving help',
];

export function getJobTypesForTrade(trade?: string | null): string[] {
  const list = (trade && JOB_TYPES_BY_TRADE[trade]) || GENERAL_JOB_TYPES;
  return [...list, 'Other'];
}
