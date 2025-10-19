# Safesus - Project Summary

## Overview

**Safesus** is a mobile-first Progressive Web App that provides safety intelligence and real-time awareness for travelers in Thailand. It combines visual safety zone maps, scam pattern databases, and location-based alerts to help tourists travel confidently.

**Tagline**: "Know Before You Go"

---

## Core Value Proposition

1. **Planning Mode**: Research cities before arrival with visual safety zones and scam patterns
2. **Live Mode**: Real-time location-based warnings while exploring
3. **Community-Powered**: Curated safety information augmented by traveler contributions

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router, React Server Components)
- **TypeScript** (Full type safety)
- **Tailwind CSS** (Utility-first styling)
- **shadcn/ui** (Accessible component library)

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage)
- **PostGIS** (Geospatial queries)
- **Row-Level Security** (Fine-grained access control)

### Mapping & Geospatial
- **Mapbox GL JS** (Interactive maps)
- **turf.js** (Client-side geospatial calculations)
- **GeoJSON** (Standard geospatial format)

### Analytics & Monitoring
- **PostHog** (Product analytics)
- **Sentry** (Error tracking)

---

## Architecture

### Pages (Public)
```
/                    Landing page with hero and CTAs
/cities              City list (Bangkok, Phuket, etc.)
/city/[slug]         City detail with map, zones, scams, rules
/live                Real-time location mode with nearby warnings
/community           Community guidelines and contribution info
/privacy             Privacy policy
/terms               Terms of service
```

### Pages (Authenticated)
```
/submit              Submit safety tips (pending review)
/account/saved       User's saved cities
/account/requests    User's city requests
```

### Pages (Admin)
```
/admin/review        Moderation queue for community submissions
```

### API Routes
```
GET  /api/cities                List of supported cities
GET  /api/city/[slug]          City detail with zones, pins, rules
POST /api/save                  Save a city to user account
DEL  /api/save                  Remove saved city
POST /api/submit-tip            Submit community contribution
GET  /api/live/nearby           Get nearby warnings (Live Mode)
GET  /api/auth/callback         OAuth callback handler
```

---

## Database Schema

### Core Tables
- **cities**: List of supported cities
- **zones**: Safety zones (polygons) - recommended/neutral/avoid
- **pins**: Scam/incident markers (points)
- **rules**: Do's and Don'ts for each city

### User Tables
- **saved_cities**: User's saved destinations (RLS enabled)
- **tip_submissions**: Community contributions (RLS enabled)

### Geospatial
- PostGIS extension for spatial queries
- GIST indexes on geometry columns
- Custom function: `nearby_pins(lat, lng, radius)`

---

## Key Features

### 1. Safety Zone Visualization
- **Color-coded polygons** on map
  - Blue: Recommended areas
  - Gray: Neutral areas
  - Red: Avoid areas
- **Tap interactions** to view zone details
- **Reason labels** explaining safety assessment

### 2. Scam Pattern Database
- **Location-specific** scam markers
- **Categories**: scam, harassment, overcharge, other
- **Detailed descriptions** with prevention advice
- **Community submissions** (moderated)

### 3. Live Mode
- **Permission explainer** (privacy-first approach)
- **Real-time positioning** with blue dot
- **Nearby warnings list** (sorted by distance)
- **Current zone status** overlay
- **Unsupported area fallback** with general safety tips

### 4. Authentication
- **Google OAuth** (optional)
- **Magic link email** authentication
- **Supabase Auth** (secure, scalable)
- **Protected routes** (save cities, submit tips)

### 5. Community Contributions
- **Hybrid submission form** (category + title + summary + details)
- **Moderation queue** for admin review
- **Pending → Approved/Rejected** workflow
- **Trust policy** and guidelines

---

## Mobile-First Design

### Responsive Breakpoints
- **Mobile**: < 768px (primary target)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Touch Targets
- Minimum 44px x 44px for all interactive elements
- Larger tap zones for map pins
- Swipe gestures for bottom sheets

### Performance
- Lazy-loaded map
- Simplified polygons for fast rendering
- Code-split heavy components
- Optimized images

---

## PWA Features

- **Installable**: Add to home screen prompt
- **Offline Support**: Service worker caching
- **App-like Experience**: Standalone display mode
- **Fast Loading**: Static generation where possible
- **Mobile Icons**: 72px to 512px sizes

---

## Data Model Example (Bangkok)

### Zones (4)
1. Sukhumvit 24-39 (recommended)
2. Old Town/Rattanakosin (recommended)
3. Nana Plaza late night (avoid)
4. Khlong Toei after dark (avoid)

### Pins (5)
1. Temple Closed Redirect scam
2. Airport Taxi Overcharge
3. Tuk-tuk "Lucky Buddha" Tour
4. Aggressive Street Vendors
5. Jet Ski Rental Damage

### Rules (8)
- 4 Do's (Use Grab, dress modestly, etc.)
- 4 Don'ts (Don't follow strangers, etc.)

---

## Analytics Events

Tracked via PostHog:
- `city_view` - User views city detail
- `zone_popover_open` - User taps zone
- `pin_details_open` - User taps scam pin
- `save_city` - User saves city
- `submit_tip` - User submits tip
- `live_mode_enabled` - User enables Live Mode
- `nearby_warning_open` - User views nearby warning

---

## Security Measures

### Authentication
- Secure token-based auth (Supabase)
- HTTP-only cookies
- CSRF protection

### Database
- Row-Level Security policies
- Server-side validation
- Prepared statements (SQL injection protection)

### API
- Server-side only for sensitive operations
- Input validation with Zod (optional)
- Rate limiting (recommended for production)

### Privacy
- No location tracking or history storage
- Location used only for real-time features
- Anonymous analytics
- GDPR-compliant (Supabase EU region option)

---

## Deployment

### Recommended: Vercel
- One-click deploy from Git
- Automatic HTTPS
- Edge caching
- Preview deployments
- Built-in analytics

### Environment Setup
1. Production Supabase project
2. Environment variables in Vercel
3. Auth redirect URLs configured
4. Custom domain (optional)

---

## Future Roadmap

### v1.5 (Enhancements)
- Safety Pulse indicator
- Complete data for Phuket, Chiang Mai, Samui
- Improved animations
- User profile page

### v2.0 (Major Features)
- AI assistant "Ask Safi"
- Route safety assessment
- Historical heatmaps
- User reputation system

### Geographic Expansion
- More Thailand cities
- Vietnam, Cambodia, Malaysia
- Philippines, Indonesia

---

## File Structure Highlights

```
SafeSus/
├── app/                     # Next.js pages (App Router)
├── components/
│   ├── map/MapView.tsx     # Core map component
│   ├── shared/             # Reusable components
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── supabase/           # DB clients
│   ├── analytics.ts        # PostHog integration
│   ├── geospatial.ts       # turf.js helpers
│   └── utils.ts            # General utilities
├── types/index.ts          # TypeScript definitions
├── scripts/
│   ├── schema.sql          # DB schema
│   └── seed.ts             # Seed script
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── .env.local.example      # Environment template
├── README.md               # Main documentation
├── SETUP.md                # Quick setup guide
├── DEPLOYMENT.md           # Deployment guide
└── TODO.md                 # Development roadmap
```

---

## Key Numbers (MVP)

- **4 cities** (Bangkok full data, 3 placeholders)
- **12 pages** (landing, app, legal, admin)
- **8 API routes**
- **6 database tables**
- **~50 components**
- **~3,000 lines of code** (excluding dependencies)

---

## Development Time

**Total: ~8-12 hours** for MVP (with existing knowledge of stack)

Breakdown:
1. Setup & dependencies: 1 hour
2. Database schema & seed: 1 hour
3. Map integration: 2 hours
4. Pages & components: 4 hours
5. Authentication: 1 hour
6. API routes: 1 hour
7. Testing & fixes: 2 hours

---

## Success Metrics

### Launch Goals (First 3 Months)
- 1,000+ monthly active users
- 50+ community tip submissions
- 10+ saved cities per active user
- <2s average page load time
- 95%+ uptime

### Quality Metrics
- <1% error rate (Sentry)
- >90% mobile traffic (expected)
- >50% PWA install rate
- >4.5/5 user satisfaction

---

## Contact & Support

- **Documentation**: README.md, SETUP.md, DEPLOYMENT.md
- **Code**: Well-commented, TypeScript-typed
- **Issues**: GitHub Issues for bug reports
- **Email**: hello@safesus.com (placeholder)

---

## License

MIT License - Free to use and modify for personal/commercial projects.

---

**Built with ❤️ for travelers who want to explore confidently.**

