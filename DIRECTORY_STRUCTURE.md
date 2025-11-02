# Directory Structure

This document explains the organization of the SafeSus codebase.

## Overview

SafeSus is a Next.js 14 application using the App Router pattern. The codebase follows a feature-based structure with clear separation of concerns.

## Root Directory

```
SafeSus/
├── app/                    # Next.js App Router pages and API routes
├── components/             # React components organized by purpose
├── lib/                    # Utility functions and shared logic
├── types/                  # TypeScript type definitions
├── scripts/                # Database scripts and seed data
├── supabase/              # Supabase configuration and migrations
└── public/                 # Static assets (images, manifest, service worker)
```

## `/app` - Pages and API Routes

Next.js App Router directory. Each subdirectory represents a route.

### Pages (`app/*/page.tsx`)
- `/` - Landing page
- `/cities` - City list page
- `/city/[slug]` - City detail page with interactive map
- `/live` - Live mode with geolocation
- `/submit` - Tip submission form
- `/community` - Community guidelines
- `/about` - About page
- `/account/*` - User account pages (saved cities, requests)
- `/admin/*` - Admin dashboard and review pages
- `/privacy`, `/terms` - Legal pages
- `/auth/callback` - Authentication callback handler

### API Routes (`app/api/*/route.ts`)
Organized by feature domain:
- `/api/cities` - List all cities
- `/api/city/[slug]` - Get city details
- `/api/live/nearby` - Get nearby warnings for live mode
- `/api/submit-tip`, `/api/submit-pin`, `/api/submit-zone` - Submission endpoints
- `/api/search-tips` - Search functionality
- `/api/notifications/*` - Notification management
- `/api/admin/*` - Admin operations (approve, assign roles)
- `/api/save` - Save/unsave cities
- `/api/featured-tips`, `/api/recent-tips` - Content feeds

## `/components` - React Components

Components are organized by purpose:

### `/components/shared`
Reusable components used across multiple pages:
- `Header.tsx` - Main navigation header
- `LoginModal.tsx` - Authentication modal
- `NotificationDropdown.tsx` - Notification bell and dropdown
- `FeaturedTips.tsx` - Display featured tips
- `RecentTipsFeed.tsx` - Feed of recent tips
- `TripPlanner.tsx` - Trip planning component
- `TripChecklist.tsx` - Pre-trip checklist
- `QuickTipSearch.tsx` - Search component
- `ReportButton.tsx` - Report functionality
- `EmptyState.tsx` - Empty state placeholder
- `DistancePill.tsx` - Distance display component
- `TipCategoryFilter.tsx` - Filter by category
- `TipImageWithFallback.tsx` - Image with fallback handling
- `AppDownloadButtons.tsx` - PWA download prompts
- `ModeToggle.tsx` - Planning/Live mode switcher
- `Analytics.tsx` - Analytics integration wrapper

### `/components/map`
Map-related components:
- `MapView.tsx` - Main map component (Mapbox integration)
- `MapFilters.tsx` - Layer toggles (zones, tips)
- `InteractiveMapDrawer.tsx` - Draw zones/pins on map

### `/components/ui`
Base UI components (shadcn/ui):
- Primitive components: `button`, `card`, `input`, `textarea`, `select`, etc.
- Complex components: `dialog`, `dropdown-menu`, `sheet`, `tabs`, etc.
- Toast notification system: `toast`, `toaster`, `use-toast`

## `/lib` - Shared Utilities

### `/lib/supabase`
Supabase client initialization:
- `client.ts` - Client-side Supabase client
- `server.ts` - Server-side Supabase client

### Core Utilities (`/lib`)
- `utils.ts` - General utilities (cn, formatDistance, colors, isActivePath)
- `geospatial.ts` - Geospatial calculations (distance, zones, pins)
- `auth-context.tsx` - Authentication context provider
- `analytics.ts` - Analytics event tracking (PostHog)
- `tip-categories.ts` - Tip category definitions
- `tip-images.ts` - Tip image URL generation

## `/types` - TypeScript Definitions

- `index.ts` - All TypeScript interfaces and types:
  - Domain models: `City`, `Zone`, `Pin`, `Rule`, `TipSubmission`
  - User types: `UserProfile`, `UserRole`
  - Submission types: `ZoneSubmission`, `PinSubmission`
  - Utility types: `ZoneLevel`, `PinType`, `TipCategory`, etc.

## `/scripts` - Database Scripts

SQL migration scripts and seed data:
- `schema.sql` - Main database schema
- `seed.ts` - Seed script (Bangkok data)
- Various migration scripts for schema updates

## `/supabase` - Supabase Configuration

- `config.toml` - Supabase project configuration
- `migrations/` - Database migrations (PostgreSQL)

## Design Patterns

### Component Organization
- **Feature-based grouping**: Components in `/shared` are reusable; feature-specific components stay with their pages
- **Co-location**: Related components stay together (e.g., map components)

### API Route Organization
- **RESTful naming**: Use nouns for resources (`/api/cities`, `/api/tips`)
- **Nested routes**: Use dynamic segments for specific resources (`/api/city/[slug]`)
- **Feature grouping**: Related endpoints under feature paths (`/api/notifications/*`)

### Code Reusability
- **Utility functions**: Common logic extracted to `/lib`
- **Shared components**: Cross-page components in `/components/shared`
- **Type safety**: All types defined in `/types/index.ts`

## Best Practices

1. **Client vs Server Components**: Use `'use client'` directive only when needed (state, hooks, browser APIs)
2. **API Routes**: Keep server-side logic in API routes; use client components for UI
3. **Type Safety**: Import types from `/types`; avoid inline type definitions
4. **Styling**: Use Tailwind CSS utility classes; use `cn()` for conditional classes
5. **Geospatial**: Use functions from `/lib/geospatial.ts` for all distance/zone calculations
6. **Navigation**: Use `isActivePath()` from utils for active link detection

## Future Considerations

Potential improvements to directory structure:
- Move map components to `/features/map` if map features grow significantly
- Consider `/features/*` structure for larger feature domains (auth, admin, submissions)
- Extract API route logic to `/lib/api` handlers if routes become complex
