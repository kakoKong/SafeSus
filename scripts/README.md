# Database Setup & Seeding

## Initial Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Copy your project URL and keys

### 2. Enable PostGIS
1. In Supabase dashboard, go to Database > Extensions
2. Enable the `postgis` extension

### 3. Run Schema
1. In Supabase dashboard, go to SQL Editor
2. Copy the contents of `schema.sql`
3. Paste and execute

### 4. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
SENTRY_DSN=your_sentry_dsn

# Feature Flags
NEXT_PUBLIC_FEATURE_SAFETY_PULSE=false
NEXT_PUBLIC_FEATURE_ASK_SAFI=false
NEXT_PUBLIC_SUPPORTED_COUNTRY=TH
```

### 5. Run Seed Script
```bash
npm run seed
```

This will populate the database with:
- Bangkok city with full data (zones, pins, rules)
- 3 additional cities (Phuket, Chiang Mai, Koh Samui) as placeholders

## Database Structure

### Tables
- **cities**: List of supported cities
- **zones**: Safety zones (polygons) for each city
- **pins**: Scam/incident markers (points) for each city
- **rules**: Do's and Don'ts for each city
- **saved_cities**: User's saved cities (requires auth)
- **tip_submissions**: Community contributions (requires auth)

### PostGIS Functions
- **nearby_pins(lat, lng, radius)**: Find pins within radius (meters)

## Maintenance

### Adding a New City
1. Insert city record
2. Add zones with proper geometries
3. Add pins (scams/incidents)
4. Add rules (do's and don'ts)

### Updating Seed Data
Edit `seed.ts` and run `npm run seed` again. Note: This will create duplicates if data already exists. Consider adding update logic or clearing data first.

### Viewing Data
Use Supabase Table Editor or SQL Editor to view and manage data.

