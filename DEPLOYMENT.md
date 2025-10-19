# Deployment Guide

This guide covers deploying Safesus to production.

## Recommended Platform: Vercel

Vercel is the easiest option since it's made by the Next.js team.

### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free tier is fine for MVP)
- Production Supabase project
- Mapbox token

### Steps

#### 1. Push to Git

```bash
git init
git add .
git commit -m "Initial commit: Safesus MVP"
git remote add origin <your-repo-url>
git push -u origin main
```

#### 2. Create Production Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (separate from dev)
3. Enable PostGIS extension
4. Run `scripts/schema.sql` in SQL Editor
5. Run seed script (update `.env` with prod keys first):
   ```bash
   npm run seed
   ```
6. Configure Auth:
   - Add production URL to redirect URLs
   - Enable Google OAuth (optional)

#### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<production-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<production-service-key>
   NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
   NEXT_PUBLIC_POSTHOG_KEY=<posthog-key>
   SENTRY_DSN=<sentry-dsn>
   NEXT_PUBLIC_FEATURE_SAFETY_PULSE=false
   NEXT_PUBLIC_FEATURE_ASK_SAFI=false
   NEXT_PUBLIC_SUPPORTED_COUNTRY=TH
   ```

6. Click "Deploy"

#### 4. Configure Custom Domain (Optional)

1. In Vercel project settings, go to Domains
2. Add your domain (e.g., safesus.com)
3. Update DNS records as instructed
4. Update Supabase Auth redirect URLs with new domain

#### 5. Post-Deployment

1. **Update Supabase Auth URLs**:
   - Go to Supabase → Authentication → URL Configuration
   - Add `https://yourdomain.com/**` to redirect URLs

2. **Test Critical Paths**:
   - ✅ Landing page loads
   - ✅ City list loads data
   - ✅ City detail page loads
   - ✅ Map renders correctly
   - ✅ Login works (email & Google)
   - ✅ Live mode requests location
   - ✅ Submit tip works

3. **Set up monitoring**:
   - PostHog dashboard for analytics
   - Sentry for error tracking
   - Vercel Analytics (optional)

---

## Alternative: Self-Hosted

If you prefer to self-host:

### Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t safesus .
docker run -p 3000:3000 --env-file .env.local safesus
```

### VPS (DigitalOcean, AWS, etc.)

1. Provision a server (Ubuntu 22.04 recommended)
2. Install Node.js 18+
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Run with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "safesus" -- start
   pm2 save
   pm2 startup
   ```
7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

---

## Environment Variables Reference

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key (server-only)
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox public token

### Optional
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `SENTRY_DSN` - Sentry error tracking DSN
- `NEXT_PUBLIC_FEATURE_SAFETY_PULSE` - Enable safety pulse (default: false)
- `NEXT_PUBLIC_FEATURE_ASK_SAFI` - Enable AI assistant (default: false)
- `NEXT_PUBLIC_SUPPORTED_COUNTRY` - Country code (default: TH)
- `ADMIN_SECRET` - Admin password for /admin routes (optional)

---

## Performance Optimization

### Before Production

1. **Optimize Images**: Use Next.js Image component
2. **Simplify Polygons**: Reduce zone polygon complexity
3. **Enable Caching**: Configure CDN caching headers
4. **Minimize Bundle**: Analyze with `npm run build`
5. **Lazy Load**: Code-split heavy components

### Monitoring

- Set up Vercel Analytics
- Configure PostHog for user behavior
- Enable Sentry for error tracking
- Monitor Core Web Vitals

---

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] Service role key is only used server-side
- [ ] Supabase RLS policies are enabled
- [ ] API routes validate user input
- [ ] Rate limiting configured (Vercel Pro or custom)
- [ ] CORS properly configured
- [ ] Content Security Policy headers set
- [ ] HTTPS enabled (automatic on Vercel)

---

## Maintenance

### Regular Tasks

- Monitor error logs (Sentry)
- Review user submissions (/admin/review)
- Update city data as needed
- Check analytics for usage patterns
- Update dependencies monthly

### Backups

Supabase automatically backs up your database. Additional backups:
```bash
# Export data
pg_dump $DATABASE_URL > backup.sql

# Or use Supabase CLI
supabase db dump -f backup.sql
```

---

## Scaling

### Database
- Upgrade Supabase plan as needed
- Add database indexes for slow queries
- Consider read replicas for high traffic

### CDN
- Enable Vercel Edge Caching
- Cache static assets aggressively
- Use ISR (Incremental Static Regeneration) for city pages

### API
- Add Redis caching layer
- Implement rate limiting
- Use API routes sparingly (prefer SSR/SSG)

---

## Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify Node.js version matches
- Check for TypeScript errors: `npm run build`

### Map Not Loading
- Verify Mapbox token in production env
- Check CORS settings
- Verify domain in Mapbox dashboard

### Auth Not Working
- Check redirect URLs in Supabase
- Verify environment variables
- Clear cookies and try again

---

**Need help?** Check the [Vercel docs](https://vercel.com/docs) or [Next.js deployment guide](https://nextjs.org/docs/deployment).

