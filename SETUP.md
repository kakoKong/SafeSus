# Safesus - Quick Setup Guide

This guide will get you running locally in ~15 minutes.

## Prerequisites

✅ Node.js 18+ installed  
✅ npm or yarn installed  
✅ A Supabase account (free tier is fine)  
✅ A Mapbox account (free tier is fine)

## Step-by-Step Setup

### 1. Install Dependencies (2 min)

```bash
npm install
```

### 2. Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose an organization, name your project (e.g., "safesus-dev")
4. Choose a database password (save this!)
5. Choose a region close to you
6. Click "Create new project" and wait ~2 minutes

### 3. Enable PostGIS (1 min)

1. In your Supabase project, go to **Database** → **Extensions**
2. Search for "postgis"
3. Click **Enable** on the PostGIS extension

### 4. Run Database Schema (2 min)

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open `scripts/schema.sql` in your project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned"

### 5. Configure Authentication (2 min)

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add `http://localhost:3000/**` to **Redirect URLs**
3. Go to **Authentication** → **Providers**
4. Enable **Email** provider (already enabled by default)
5. (Optional) Enable **Google** provider:
   - You'll need Google OAuth credentials
   - Or skip this for now and use email-only

### 6. Get API Keys (1 min)

1. In Supabase, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJh...`)
   - **service_role** key (starts with `eyJh...`) - **Keep this secret!**

### 7. Get Mapbox Token (2 min)

1. Go to [mapbox.com](https://mapbox.com) and sign up/login
2. Go to **Account** → **Access Tokens**
3. Copy your **Default public token** OR create a new one
   - Scopes needed: `styles:tiles`, `styles:read`, `fonts:read`

### 8. Configure Environment Variables (1 min)

1. In your project root, create `.env.local`:

```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJh...your_service_key

# Mapbox (required)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...your_mapbox_token

# Analytics (optional - can use dummy values for now)
NEXT_PUBLIC_POSTHOG_KEY=phc_test123
SENTRY_DSN=https://test@sentry.io/test

# Feature Flags (optional)
NEXT_PUBLIC_FEATURE_SAFETY_PULSE=false
NEXT_PUBLIC_FEATURE_ASK_SAFI=false
NEXT_PUBLIC_SUPPORTED_COUNTRY=TH
```

Replace the values with your actual keys from steps 6 and 7.

### 9. Seed the Database (1 min)

```bash
npm run seed
```

You should see:
```
✅ Created city: Bangkok
✅ Created 4 zones
✅ Created 5 pins
✅ Created 8 rules
✅ Created 3 additional cities
🎉 Seed completed successfully!
```

### 10. Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## ✅ Verify Everything Works

### Test Landing Page
- Open http://localhost:3000
- Should see "Safesus - Know Before You Go"
- Click "Open App" → should go to `/cities`

### Test City List
- Should see Bangkok, Phuket, Chiang Mai, Koh Samui
- Click Bangkok

### Test City Detail (Bangkok)
- Should see a map with blue and red zones
- Should see scam pins on the map
- Try clicking a zone or pin
- Click "Save City" → should prompt login

### Test Live Mode
- Click "Live Now" in header
- Should see permission explainer
- Click "Enable Live Mode"
- Grant location permission in browser
- Should see map centered on your location

### Test Authentication
- Click user icon in header
- Try signing in with email
- Should receive magic link email

---

## 🐛 Troubleshooting

### "Failed to fetch city data"
- Check your Supabase URL in `.env.local`
- Verify the schema ran successfully
- Check browser console for specific error

### Map is blank or tiles won't load
- Verify Mapbox token in `.env.local`
- Check browser console for 401 errors
- Make sure token has correct scopes

### "No cities available"
- Run `npm run seed` again
- Check Supabase Table Editor for data in `cities` table

### Seed script fails
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set
- Check that PostGIS extension is enabled
- Verify schema ran successfully

### Authentication not working
- Check redirect URLs in Supabase
- Clear cookies and try again
- Check browser console for errors

---

## 📱 Next Steps

1. **Customize Bangkok data**: Edit `scripts/seed.ts` and re-run
2. **Add more cities**: Create zones/pins for other cities
3. **Test on mobile**: Open on your phone via local network
4. **Deploy**: Follow deployment guide in README.md

---

## 🎨 Optional: Add PWA Icons

The manifest references icons in `/public/icons/`. For now, these can be placeholder images. To generate proper icons:

1. Create a 512x512 logo
2. Use a tool like [realfavicongenerator.net](https://realfavicongenerator.net/)
3. Place generated icons in `/public/icons/`

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [shadcn/ui Docs](https://ui.shadcn.com/)

---

**Need help?** Open an issue on GitHub or check the troubleshooting section above.

Happy coding! 🚀

