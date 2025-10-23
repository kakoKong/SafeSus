# Migration Guide - Safesus MVP Refinements

## Prerequisites
- Supabase project set up
- Database connection established
- PostGIS extension enabled

## Step 1: Database Migration

### Run the updated schema

```bash
# Connect to your Supabase database
psql -h your-supabase-host -U postgres -d postgres

# Run the schema file
\i scripts/schema.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `scripts/schema.sql`
3. Execute

### Verify new tables exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles',
  'zone_submissions',
  'pin_submissions',
  'verifications',
  'reports',
  'badges',
  'user_badges'
);
```

## Step 2: Seed Initial Data

### Create sample badges

```sql
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Contributor', 'Submit your first tip', '🌟', 'tips_submitted', 1),
('Helpful Local', 'Get 5 tips approved', '🏅', 'tips_approved', 5),
('Safety Champion', 'Contribute 10 verified tips', '🏆', 'tips_approved', 10),
('Guardian Angel', 'Verify 25 submissions', '👼', 'verifications', 25),
('Community Hero', 'Reach 100 contribution points', '🦸', 'score', 100);
```

### Create first guardian user

After a user signs up, promote them to guardian:

```sql
-- Replace 'user-uuid-here' with actual user ID from auth.users
INSERT INTO user_profiles (user_id, role, score) 
VALUES ('user-uuid-here', 'guardian', 0)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'guardian';
```

## Step 3: Environment Variables

No new environment variables needed! Existing Supabase configuration works.

Verify you have:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## Step 4: Test the Flow

### 1. User Registration Flow
1. Sign up a new user
2. Check that `user_profiles` entry is auto-created
3. Verify default role is 'traveler'

### 2. Submission Flow
1. Go to `/submit`
2. Submit a travel tip
3. Check `tip_submissions` table for pending entry

### 3. Guardian Flow
1. Promote a user to guardian (SQL above)
2. Guardian signs in
3. Navigate to `/guardian`
4. Should see pending submissions
5. Approve a submission
6. Check that:
   - Submission status changed to 'approved'
   - Verification record created
   - Submitter's score increased by 10

### 4. Community Feed
1. Visit `/community`
2. Should see approved submissions
3. Click report button
4. Submit a report
5. Guardians should see report in future dashboard

### 5. Profile Page
1. Visit `/account`
2. Should see:
   - User role badge
   - Contribution score
   - Activity stats
   - Badges (if earned)

## Step 5: Update Existing Data (Optional)

If you have existing zones, update them to support the new 'caution' level:

```sql
-- Update zones table constraint
ALTER TABLE zones 
DROP CONSTRAINT IF EXISTS zones_level_check;

ALTER TABLE zones 
ADD CONSTRAINT zones_level_check 
CHECK (level IN ('recommended','neutral','caution','avoid'));
```

## Step 6: Deploy

### Via Vercel/Railway/etc.

```bash
# Install dependencies (if new ones added)
npm install

# Build
npm run build

# Deploy
git add .
git commit -m "Implement MVP refinements"
git push origin main
```

## Troubleshooting

### Issue: RLS policies blocking access
**Solution**: Ensure user has a profile in `user_profiles` table

```sql
-- Check user profile exists
SELECT * FROM user_profiles WHERE user_id = 'user-uuid';

-- Create if missing
INSERT INTO user_profiles (user_id, role, score) 
VALUES ('user-uuid', 'traveler', 0);
```

### Issue: Guardian dashboard shows "Access denied"
**Solution**: User role must be 'guardian'

```sql
UPDATE user_profiles 
SET role = 'guardian' 
WHERE user_id = 'user-uuid';
```

### Issue: Submissions not appearing in community feed
**Solution**: Check submission status

```sql
-- Should be 'approved' to appear
UPDATE tip_submissions 
SET status = 'approved' 
WHERE id = submission_id;
```

### Issue: Map not showing caution zones
**Solution**: Clear cache and verify color function

```sql
-- Check zone data
SELECT id, label, level FROM zones WHERE level = 'caution';
```

## Rollback Plan

If you need to rollback:

```sql
-- Drop new tables
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS pin_submissions CASCADE;
DROP TABLE IF EXISTS zone_submissions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Revert zones constraint
ALTER TABLE zones 
DROP CONSTRAINT IF EXISTS zones_level_check;

ALTER TABLE zones 
ADD CONSTRAINT zones_level_check 
CHECK (level IN ('recommended','neutral','avoid'));
```

## Performance Notes

- All new tables have appropriate indexes
- RLS policies are optimized
- Spatial indexes maintained on geographic data
- No performance impact expected with <10,000 users

## Monitoring

Key metrics to watch:
- Pending submissions count
- Guardian response time (time from submission to verification)
- Report queue length
- User score distribution

```sql
-- Dashboard queries
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM tip_submissions;

SELECT 
  role,
  COUNT(*) as user_count,
  AVG(score) as avg_score
FROM user_profiles
GROUP BY role;
```

## Next Steps

1. ✅ Run migrations
2. ✅ Create guardian users
3. ✅ Seed badges
4. ✅ Test flow end-to-end
5. 🔄 Set up monitoring
6. 🔄 Train guardians on review process
7. 🔄 Launch community onboarding

## Support

For issues or questions:
1. Check `REFINEMENTS.md` for feature details
2. Review RLS policies in `schema.sql`
3. Check Supabase logs for database errors
4. Verify user roles and permissions

---

**Migration completed!** 🎉

Your Safesus MVP is now ready with full community verification, user roles, and gamification features.

