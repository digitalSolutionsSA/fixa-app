# FIXA by PUBLICON

A two-sided service marketplace connecting consumers to local service providers (plumbers, electricians, mechanics).

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## 🧱 Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **React Router v6** for navigation
- **Lucide React** for icons
- No UI framework — all styles are custom CSS with CSS variables

## 🎨 Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--fixa-teal` | `#1BB8C8` | Primary brand |
| `--fixa-yellow` | `#F5C800` | Accent / CTA |
| `--fixa-dark` | `#0D1B2A` | Background |

## 👤 User Roles (Demo)

Use the **role switcher** in the top nav to switch between:

| Role | View |
|------|------|
| **Consumer** | Home, browse providers, my jobs, panic button |
| **Provider** | Dashboard, leads, earnings, ranking |
| **Admin** | Platform overview, panic alerts, verification queue |

## 📁 Project Structure

```
src/
├── assets/          # Logo + support character
├── components/
│   ├── Layout.tsx       # Top navbar + page shell
│   ├── SupportCharacter.tsx  # Fixy chat assistant
│   └── UI.tsx           # Shared components (Card, Button, Badge, etc.)
├── contexts/
│   └── AppContext.tsx    # Global state
├── pages/
│   ├── ConsumerHome.tsx
│   ├── BrowsePage.tsx
│   ├── MyJobsPage.tsx
│   ├── ProviderDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── ProfileAndNotifications.tsx
├── types/index.ts       # TypeScript interfaces
└── utils/mockData.ts    # Demo data
```

## 🔑 Key Features

- **Trust & Safety**: Verification badge system (3 levels), panic button during active jobs
- **In-App Payments Only**: Only in-app paid jobs qualify for reviews, disputes, and ranking
- **Fixy**: AI-powered support character — click the floating avatar (bottom right) to chat
- **Ranking Algorithm**: Weighted scoring across 6 factors (completion rate, reviews, response time, payment compliance, verification, subscription)
- **POPIA Compliant**: Data protection disclaimers and consent flows

## ⚠️ Legal Disclaimers (from Brief)

Per the Master Brief:
- Never say "certified", "approved", or "guaranteed" about providers
- Emergency features do not guarantee response times
- Providers are independent contractors
- Platform is not responsible for workmanship quality

## 📋 MVP Scope

- One metro (Johannesburg)
- 3 service categories: Plumbing, Electrical, Mechanical
- No insurer integrations
- No advanced AI matching
