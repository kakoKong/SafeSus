# Safesus - Know Before You Go

A mobile-first PWA that delivers safety intelligence and real-time awareness for travelers in Thailand.

## 🎯 Features

### Planning Mode
- **City Safety Zones**: Visual maps showing safe, neutral, and avoid areas
- **Scam Patterns**: Common tourist scams with locations and prevention tips
- **Local Rules**: Do's and Don'ts for each city
- **Save Cities**: Quick access to your planned destinations

### Live Mode
- **Real-time Location**: See your position on the safety map
- **Nearby Warnings**: Get alerts about scams and unsafe areas within 500m
- **Zone Status**: Know immediately which zone you're in
- **Privacy-First**: Location used only for real-time features, never tracked

### Community Features
- **Submit Tips**: Share safety experiences to help other travelers
- **Moderation**: All submissions reviewed before publication
- **Trust System**: Curated and community-sourced information

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Mapping**: Mapbox GL JS
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Authentication**: Supabase Auth (Google + Email)
- **Analytics**: PostHog
- **Error Tracking**: Sentry
- **Geospatial**: turf.js

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Mapbox account

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd SafeSus
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for seeding)
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox public access token

   Optional:
   - `NEXT_PUBLIC_POSTHOG_KEY`: PostHog API key
   - `SENTRY_DSN`: Sentry DSN for error tracking

3. **Set up the database**

   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. Enable PostGIS extension:
      - Go to Database > Extensions
      - Enable `postgis`
   
   c. Run the schema:
      - Go to SQL Editor
      - Copy contents from `scripts/schema.sql`
      - Execute
   
   d. Configure Authentication:
      - Go to Authentication > Providers
      - Enable Email and Google providers
      - Add your site URL to redirect URLs

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Get a Mapbox token**
   - Sign up at [mapbox.com](https://mapbox.com)
   - Create a token with public scopes
   - Add to `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
SafeSus/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── account/           # User account pages
│   ├── admin/             # Admin pages
│   ├── auth/              # Auth callbacks
│   ├── city/              # City detail pages
│   ├── cities/            # City list
│   ├── community/         # Community page
│   ├── live/              # Live mode
│   ├── privacy/           # Privacy policy
│   ├── submit/            # Tip submission
│   ├── terms/             # Terms of service
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── map/              # Map components
│   ├── shared/           # Shared components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities
│   ├── supabase/         # Supabase clients
│   ├── analytics.ts      # Analytics helpers
│   ├── geospatial.ts     # Geospatial functions
│   └── utils.ts          # General utilities
├── types/                # TypeScript types
├── scripts/              # Database scripts
│   ├── schema.sql        # Database schema
│   ├── seed.ts           # Seed script
│   └── README.md         # Database docs
├── public/               # Static assets
│   ├── icons/            # PWA icons
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── README.md            # This file
```

## 🗺 Supported Cities

- **Bangkok** ✅ (Full coverage)
- **Phuket** 🚧 (Coming soon)
- **Chiang Mai** 🚧 (Coming soon)
- **Koh Samui** 🚧 (Coming soon)

Want to see your city? Request it from any city detail page!

## 🔒 Security & Privacy

- **No Location Tracking**: Location data used only for real-time features, never stored
- **Secure Authentication**: Powered by Supabase Auth
- **Row-Level Security**: Database access controlled per user
- **Moderated Content**: All user submissions reviewed before publication
- **Privacy-First Analytics**: Anonymous usage data only

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database

### Adding a New City

1. Insert city record in `cities` table
2. Create zones (safety areas) with proper GeoJSON geometries
3. Add pins (scam/incident locations)
4. Add rules (do's and don'ts)

See `scripts/seed.ts` for examples.

### Feature Flags

Toggle features via environment variables:

- `NEXT_PUBLIC_FEATURE_SAFETY_PULSE=false` - Safety pulse indicator (v1.5)
- `NEXT_PUBLIC_FEATURE_ASK_SAFI=false` - AI assistant (v2.0)
- `NEXT_PUBLIC_SUPPORTED_COUNTRY=TH` - Country filter

## 📱 PWA Setup

The app is configured as a Progressive Web App:

1. **Install Prompt**: Users can install to home screen
2. **Offline Support**: Basic caching via service worker
3. **Mobile-First**: Optimized for mobile devices
4. **Touch Targets**: 44px minimum for accessibility

To test PWA features:
1. Build the app: `npm run build`
2. Serve it: `npm run start`
3. Open in Chrome and check the install prompt

## 📊 Analytics

PostHog tracks these events:
- `city_view` - City detail page view
- `zone_popover_open` - Zone details opened
- `pin_details_open` - Pin/scam details opened
- `save_city` - City saved
- `submit_tip` - Tip submitted
- `live_mode_enabled` - Live mode activated
- `nearby_warning_open` - Nearby warning viewed

## 🐛 Error Tracking

Sentry captures:
- Frontend errors
- API route errors
- Unhandled promise rejections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Guidelines

- Follow existing code style
- Add TypeScript types for new features
- Test on mobile devices
- Update documentation

## 📄 License

MIT License - feel free to use for your own projects!

## 🙏 Acknowledgments

- Safety data curated from traveler experiences
- Map tiles by Mapbox
- Icons by Lucide
- UI components by shadcn/ui

## 📧 Contact

- Website: [safesus.com](https://safesus.com)
- Email: hello@safesus.com
- Report issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Note**: This is an MVP. Some features are placeholders for future releases. See TODO.md for development roadmap.

# SafeSus
