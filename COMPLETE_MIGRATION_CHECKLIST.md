# ✅ Complete Migration Checklist for Approval Workflow

## Overview
This checklist includes ALL migrations needed to fix the approval workflow, including the RLS policy fix.

---

## 🔍 The Issues Being Fixed

1. ❌ Approved submissions don't appear on map
2. ❌ RLS policies block admin inserts
3. ❌ No tracking of who approved what
4. ❌ Users don't get points for approved content

---

## 📋 Migration Order (Run in Supabase SQL Editor)

### ✅ Step 1: Add Tracking Columns
**File:** `scripts/add-verified-by-to-pins.sql`

**What it does:**
- Adds `verified_by` column to `pins` table
- Adds `reviewed_by` columns to all submission tables
- Creates indexes for performance

**Run this first** because the API expects these columns to exist.

```sql
-- Copy and paste entire contents of:
-- scripts/add-verified-by-to-pins.sql
```

---

### ✅ Step 2: Add Score Function
**File:** `scripts/add-increment-score-function.sql`

**What it does:**
- Creates `increment_user_score()` function
- Awards points to users when content is approved

```sql
-- Copy and paste entire contents of:
-- scripts/add-increment-score-function.sql
```

---

### ✅ Step 3: Fix RLS Policies (IMPORTANT!)
**File:** `scripts/fix-rls-for-approvals.sql`

**What it does:**
- Allows admins to INSERT into `zones` table
- Allows admins to INSERT into `pins` table
- Allows admins to UPDATE submission tables
- Allows admins to VIEW all submissions

**This fixes the error:**
```
Error: new row violates row-level security policy for table "zones"
```

```sql
-- Copy and paste entire contents of:
-- scripts/fix-rls-for-approvals.sql
```

---

## 🧪 Testing After Migration

### Test 1: Zone Approval
```
1. Submit zone (as user)
   → Go to /submit
   → Select "Safety Zone"
   → Draw area on map
   → Submit

2. Approve zone (as admin)
   → Go to /admin/dashboard
   → Find zone in "Zones" tab
   → Click "Approve"

3. Verify:
   ✓ Success toast: "Zone approved and now visible on the map"
   ✓ Zone disappears from pending
   ✓ Go to city page
   ✓ Zone appears on map! 🎉
```

### Test 2: Pin Approval
```
1. Submit pin (as user)
   → Go to /submit
   → Select "Scam/Incident"
   → Mark location on map
   → Submit

2. Approve pin (as admin)
   → Go to /admin/dashboard
   → Find pin in "Pins" tab
   → Click "Approve"

3. Verify:
   ✓ Success toast: "Pin approved and now visible on the map"
   ✓ Pin disappears from pending
   ✓ Go to city page
   ✓ Pin appears on map! 🎉
   ✓ User got +20 points
```

### Test 3: Tip Approval
```
1. Submit tip (as user)
   → Go to /submit
   → Select "Tip"
   → Fill form
   → Submit

2. Approve tip (as admin)
   → Go to /admin/dashboard
   → Find tip in "Tips" tab
   → Click "Approve"

3. Verify:
   ✓ Success toast: "Tip approved and visible in community feed"
   ✓ Tip appears in /community
```

---

## 🔍 Verification Queries

Run these in Supabase SQL Editor to verify migrations:

### Check Columns Added
```sql
-- Check verified_by exists in pins
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'pins' 
AND column_name = 'verified_by';
-- Should return: verified_by

-- Check reviewed_by exists in submissions
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'pin_submissions' 
AND column_name = 'reviewed_by';
-- Should return: reviewed_by
```

### Check Function Created
```sql
-- Check increment_user_score function
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'increment_user_score';
-- Should return: increment_user_score
```

### Check RLS Policies
```sql
-- Check zones policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'zones'
ORDER BY policyname;
-- Should include:
-- • Admins can insert zones
-- • Admins can update zones
-- • Public can view zones

-- Check pins policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'pins'
ORDER BY policyname;
-- Should include:
-- • Admins can insert pins
-- • Admins can update pins
-- • Public can view pins
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "new row violates row-level security policy"
**Cause:** RLS policies not updated
**Solution:** Run `fix-rls-for-approvals.sql` (Step 3)

### Issue 2: "column verified_by does not exist"
**Cause:** Step 1 migration not run
**Solution:** Run `add-verified-by-to-pins.sql` (Step 1)

### Issue 3: "function increment_user_score does not exist"
**Cause:** Step 2 migration not run
**Solution:** Run `add-increment-score-function.sql` (Step 2)

### Issue 4: "permission denied"
**Cause:** Not logged in as admin
**Solution:** Check `user_profiles` table, ensure `role = 'admin'`

### Issue 5: Approved content still doesn't appear
**Check:**
1. Did all 3 migrations run successfully?
2. Is user actually an admin in `user_profiles`?
3. Check browser console for API errors
4. Verify data in `pins`/`zones` tables

---

## 📊 What Each Migration Does

### Migration 1: Tracking Columns
```
BEFORE:
pins (id, city_id, type, title, location, status)

AFTER:
pins (id, city_id, type, title, location, status, verified_by)
                                                   ↑ NEW!
```

### Migration 2: Score Function
```
ADDS:
increment_user_score(user_id, points)
• Automatically creates user_profile if needed
• Adds points to user's score
• Called when content is approved
```

### Migration 3: RLS Policies
```
BEFORE:
zones table:
• SELECT allowed for public ✅
• INSERT blocked for everyone ❌

AFTER:
zones table:
• SELECT allowed for public ✅
• INSERT allowed for admins ✅
• UPDATE allowed for admins ✅
```

---

## 🎯 Expected Behavior After Migrations

### For Users:
1. ✅ Submit pins/zones/tips
2. ✅ See status update to "approved"
3. ✅ See content on map immediately
4. ✅ Earn +20 points when approved

### For Admins:
1. ✅ View all pending submissions
2. ✅ Click "Approve" button
3. ✅ See clear success message
4. ✅ Content appears on map instantly
5. ✅ Track who approved what

### For Platform:
1. ✅ Proper workflow between tables
2. ✅ Security maintained
3. ✅ Data integrity preserved
4. ✅ Scalable and reliable

---

## 📝 Migration Rollback (If Needed)

If something goes wrong, you can rollback:

### Rollback Step 3 (RLS Policies)
```sql
-- Drop admin policies
DROP POLICY IF EXISTS "Admins can insert zones" ON zones;
DROP POLICY IF EXISTS "Admins can update zones" ON zones;
DROP POLICY IF EXISTS "Admins can insert pins" ON pins;
DROP POLICY IF EXISTS "Admins can update pins" ON pins;
-- etc.
```

### Rollback Step 2 (Function)
```sql
DROP FUNCTION IF EXISTS increment_user_score(UUID, INTEGER);
```

### Rollback Step 1 (Columns)
```sql
ALTER TABLE pins DROP COLUMN IF EXISTS verified_by;
ALTER TABLE pin_submissions DROP COLUMN IF EXISTS reviewed_by;
ALTER TABLE zone_submissions DROP COLUMN IF EXISTS reviewed_by;
ALTER TABLE tip_submissions DROP COLUMN IF EXISTS reviewed_by;
```

---

## ✅ Final Checklist

Before testing:
- [ ] Ran migration 1 (tracking columns)
- [ ] Ran migration 2 (score function)
- [ ] Ran migration 3 (RLS policies)
- [ ] Verified all queries return expected results
- [ ] Refreshed admin dashboard page

During testing:
- [ ] Submitted test zone
- [ ] Approved test zone
- [ ] Zone appeared on map
- [ ] Submitted test pin
- [ ] Approved test pin
- [ ] Pin appeared on map
- [ ] User earned points

After testing:
- [ ] No console errors
- [ ] Data in correct tables
- [ ] RLS policies working
- [ ] Everything functional

---

## 🎉 Success!

Once all migrations are complete and tests pass:
- ✅ Approval workflow fully functional
- ✅ Content appears on maps immediately
- ✅ Users get rewarded
- ✅ Admins have proper access
- ✅ Security maintained

**Your SafeSus platform is now production-ready! 🚀**

