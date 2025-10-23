# Admin Dashboard Setup Guide

## Overview
The admin dashboard provides comprehensive access to ALL submissions, reports, and user management. It is **strictly protected** and only accessible to users with the `admin` role.

## 🔐 Security Features

### Multi-Layer Protection
1. **Client-side check**: Verifies admin role before rendering
2. **RLS Policies**: Database-level access control
3. **Redirect on failure**: Automatically redirects unauthorized users
4. **Toast notifications**: Clear access denial messages

### Access Flow
```
User navigates to /admin/dashboard
        ↓
Client checks authentication
        ↓
Client checks admin role
        ↓
If NOT admin → Toast + Redirect to /
        ↓
If admin → Load dashboard data
```

## 📋 Setup Instructions

### 1. Run Database Migration

First, ensure all tables exist by running the migration:

**Via Supabase Dashboard**:
1. Go to SQL Editor
2. Copy contents of `scripts/apply-new-tables.sql`
3. Run the query
4. Verify all 7 tables were created

**Tables Created**:
- `user_profiles` (includes admin role)
- `zone_submissions`
- `pin_submissions`
- `verifications`
- `reports`
- `badges`
- `user_badges`

### 2. Install Dependencies

```bash
npm install @radix-ui/react-tabs
```

Or just run:
```bash
npm install
```

### 3. Create First Admin User

After a user signs up, promote them to admin using SQL:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Create/update their profile to admin
INSERT INTO user_profiles (user_id, role, score) 
VALUES ('your-user-id-here', 'admin', 0)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

**Example**:
```sql
INSERT INTO user_profiles (user_id, role, score) 
VALUES ('a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6', 'admin', 0)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

## 📊 Dashboard Features

### Overview Stats
- Total Users
- Total Guardians
- Pending Tips
- Pending Pins
- Pending Zones
- Pending Reports

### Submissions Management

#### Tips Tab
- View all tip submissions (pending, approved, rejected)
- See submission details (title, summary, category, date)
- Approve or reject pending tips
- Status badges for visual identification

#### Pins Tab
- View all scam/incident pin submissions
- See location and details
- Approve or reject pending pins
- Type badges (scam, harassment, overcharge)

#### Zones Tab
- View all safety zone submissions
- See zone name, level, and reasoning
- Approve or reject pending zones
- Color-coded level badges

#### Reports Tab
- View all user reports
- See report reason and target
- Mark as reviewed or dismiss
- Track report status

### Actions Available
- ✅ Approve submissions → Changes status to 'approved'
- ❌ Reject submissions → Changes status to 'rejected'
- 👁️ Review reports → Marks as 'reviewed'
- 🗑️ Dismiss reports → Marks as 'dismissed'

## 🎯 Admin Roles

### Role Hierarchy
```
Admin > Guardian > Local > Traveler
```

### Admin Permissions
- ✅ View ALL submissions (not just pending)
- ✅ View ALL reports
- ✅ Approve/reject any submission
- ✅ Access admin dashboard
- ✅ Assign roles to other users (via API)
- ✅ View all user statistics

### Guardian Permissions
- ✅ View pending submissions only
- ✅ Approve/reject submissions
- ✅ View own verifications
- ❌ Cannot access admin dashboard
- ❌ Cannot assign roles

## 🔑 Assigning Roles

### Via SQL (Manual)
```sql
-- Make user a guardian
UPDATE user_profiles 
SET role = 'guardian' 
WHERE user_id = 'user-uuid-here';

-- Make user an admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'user-uuid-here';
```

### Via API (Programmatic)
```bash
POST /api/admin/assign-role

Headers:
  Content-Type: application/json

Body:
{
  "user_id": "uuid-of-target-user",
  "role": "admin" | "guardian" | "local" | "traveler"
}
```

**Example**:
```javascript
const response = await fetch('/api/admin/assign-role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    role: 'guardian'
  })
});
```

## 🚀 Accessing the Dashboard

### URL
```
https://your-domain.com/admin/dashboard
```

### Access Requirements
1. Must be signed in
2. Must have `admin` role in `user_profiles` table
3. Both conditions enforced client-side and database-side

### What Happens Without Access
- User sees toast: "Access Denied - This page is restricted to administrators only"
- Automatically redirected to home page
- No data is loaded or exposed

## 📱 User Interface

### Layout
```
┌─────────────────────────────────────────┐
│  🛡️ Admin Dashboard                     │
│  Comprehensive view of all submissions  │
├─────────────────────────────────────────┤
│  [Stats Cards: 6 metrics]               │
├─────────────────────────────────────────┤
│  [Tips] [Pins] [Zones] [Reports]       │
│                                          │
│  ┌────────────────────────────────┐    │
│  │ Submission Card                │    │
│  │ • Status badge                 │    │
│  │ • Category/Type                │    │
│  │ • Date                         │    │
│  │ • Full details                 │    │
│  │ [Approve] [Reject] buttons     │    │
│  └────────────────────────────────┘    │
│                                          │
│  [More submissions...]                  │
└─────────────────────────────────────────┘
```

### Color Coding
- **Green badges**: Approved
- **Yellow badges**: Pending
- **Red badges**: Rejected
- **Blue badges**: Zone level (Recommended)
- **Amber badges**: Zone level (Caution)
- **Red badges**: Zone level (Avoid)

## 🔍 Monitoring

### Key Metrics to Watch
- Pending submissions count
- Approval/rejection ratios
- Report resolution time
- Guardian activity
- User growth

### SQL Queries for Monitoring

**Submission Status Overview**:
```sql
SELECT 
  'tips' as type,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM tip_submissions
UNION ALL
SELECT 
  'pins' as type,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM pin_submissions
UNION ALL
SELECT 
  'zones' as type,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM zone_submissions;
```

**User Role Distribution**:
```sql
SELECT 
  role,
  COUNT(*) as count
FROM user_profiles
GROUP BY role
ORDER BY count DESC;
```

## 🛡️ Security Best Practices

### 1. Limit Admin Accounts
- Only create admin accounts for trusted team members
- Review admin list regularly
- Remove admin access when no longer needed

### 2. Monitor Admin Actions
Consider adding audit logging:
```sql
CREATE TABLE admin_actions (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### 3. Regular Security Audits
```sql
-- Check all admins
SELECT 
  up.user_id, 
  u.email, 
  up.created_at as admin_since
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE up.role = 'admin';
```

## 🐛 Troubleshooting

### Issue: "Access Denied" but user should be admin
**Solution**:
```sql
-- Verify user profile exists
SELECT * FROM user_profiles WHERE user_id = 'your-user-id';

-- If missing, create it
INSERT INTO user_profiles (user_id, role, score) 
VALUES ('your-user-id', 'admin', 0);

-- If exists but wrong role
UPDATE user_profiles 
SET role = 'admin' 
WHERE user_id = 'your-user-id';
```

### Issue: Dashboard loads but shows no data
**Solution**:
- Check RLS policies are enabled
- Verify tables were created
- Check browser console for errors
- Try refreshing the page

### Issue: Approve/Reject buttons don't work
**Solution**:
- Check network tab for API errors
- Verify user is still authenticated
- Check database connection
- Review RLS policies

## 📖 Related Documentation

- **Main Schema**: `scripts/schema.sql`
- **Migration**: `scripts/apply-new-tables.sql`
- **Guardian Dashboard**: `app/guardian/page.tsx`
- **Role Assignment API**: `app/api/admin/assign-role/route.ts`

## 🎊 Testing Checklist

Before deploying:

- [ ] Migration run successfully
- [ ] First admin user created
- [ ] Can access `/admin/dashboard` as admin
- [ ] Non-admin users are redirected
- [ ] All tabs load correctly
- [ ] Stats display accurately
- [ ] Can approve submissions
- [ ] Can reject submissions
- [ ] Can review reports
- [ ] All badges display correctly
- [ ] Mobile responsive
- [ ] No console errors

## 🚀 Ready to Deploy!

Once setup is complete:
1. ✅ Admin role added to schema
2. ✅ Dashboard created with full access
3. ✅ Security enforced at multiple levels
4. ✅ Role assignment API available
5. ✅ All submissions visible

**Your admin dashboard is now fully functional and secure!** 🎉

---

**Questions?** Check the main `REFINEMENTS.md` for more context.

