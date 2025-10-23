# 🚩 Report Features Implementation

## Overview
Users can now report inappropriate or inaccurate content throughout the SafeSus app. Reports are managed by admins through the admin dashboard.

---

## 📍 Where Users Can Report Content

### 1. **City Detail Pages** (`/city/[slug]`)
Users can report **zones** and **pins** when viewing them on the map:

**How it works:**
- Click any zone or pin on the map to open detail sheet
- Report button (flag icon) appears in top-right corner
- User can select reason and submit report

**What can be reported:**
- ✅ Safety zones (recommended/avoid/caution/neutral)
- ✅ Scam/incident pins

**Location:**
```tsx
// Sheet header for zones and pins
<ReportButton targetType="zone" targetId={zone.id} compact />
<ReportButton targetType="pin" targetId={pin.id} compact />
```

---

### 2. **Live Mode** (`/live`)
Users can report **nearby warnings** (pins) in real-time:

**How it works:**
- Enable Live Mode to see nearby warnings
- Click any warning to view details
- Report button appears in detail sheet
- Submit report with reason

**What can be reported:**
- ✅ Nearby scam/incident warnings

**Location:**
```tsx
// Warning detail sheet
<ReportButton targetType="pin" targetId={warning.id} compact />
```

---

### 3. **Community Feed** (`/community`)
Users can report **approved tip submissions**:

**How it works:**
- Browse community-verified tips
- Each tip card has a report button (top-right)
- Click to report with reason

**What can be reported:**
- ✅ Community tip submissions (approved content)

**Location:**
```tsx
// Each activity card in the feed
<ReportButton targetType="tip" targetId={activity.id} compact />
```

---

## 🛡️ Admin Dashboard Report Management (`/admin/dashboard`)

### Reports Tab
Admins can view and manage all user reports:

**Features:**
- **View all reports** - See every report submitted by users
- **Status badges** - Track pending/reviewed/dismissed reports
- **Target information** - See what content was reported (tip/pin/zone)
- **User details** - View who submitted the report
- **Actions:**
  - ✅ **Mark Reviewed** - Acknowledge report and take action
  - ❌ **Dismiss** - Reject report as invalid

**Report Card Display:**
```
┌─────────────────────────────────────┐
│ [Pending] [pin] 2024-10-23          │
│ Report: Spam/Inappropriate          │
│ This pin contains spam content...   │
│ Target: pin ID: 123                 │
│ Reporter: user@example.com          │
│                                      │
│ [Mark Reviewed] [Dismiss]           │
└─────────────────────────────────────┘
```

**Stats Dashboard:**
- Shows count of pending reports
- Integrated with other admin metrics

---

## 🎯 What Content Can Be Reported

| Content Type | Where to Report | Admin View |
|-------------|----------------|------------|
| Safety Zones | City pages | Reports tab |
| Scam Pins | City pages, Live mode | Reports tab |
| Tip Submissions | Community feed | Reports tab |
| Zone Submissions | *(via zones on map after approval)* | Reports tab |
| Pin Submissions | *(via pins on map after approval)* | Reports tab |

---

## 🔄 Report Workflow

### User Side:
1. User finds problematic content
2. Clicks flag button (compact mode)
3. Opens report dialog
4. Selects reason from dropdown:
   - Spam
   - Inappropriate
   - Inaccurate
   - Outdated
   - Offensive
   - Other
5. Optional: Adds details
6. Submits report
7. Sees success toast

### Admin Side:
1. Admin opens dashboard (`/admin/dashboard`)
2. Clicks "Reports" tab
3. Views all pending reports (sorted by date)
4. Reviews report details
5. Takes action:
   - **Mark Reviewed** - Acknowledges and handles issue
   - **Dismiss** - Rejects report
6. Report status updates
7. Stats refresh

---

## 🗺️ Map Integration

Reports are fully integrated with map features:

**City Map View:**
- Click zone → View details → Report button
- Click pin → View details → Report button
- Works with all zone levels (recommended/caution/avoid)
- Works with all pin types (scam/harassment/overcharge)

**Live Mode Map:**
- Real-time warnings displayed
- Click warning → Report available
- Geolocation-based filtering
- Distance calculations maintained

---

## 💾 Database Schema

Reports are stored in the `reports` table:

```sql
reports
├── id (primary key)
├── user_id (who reported)
├── target_type ('tip', 'pin', 'zone')
├── target_id (ID of reported item)
├── reason (category)
├── details (optional text)
├── status ('pending', 'reviewed', 'dismissed')
└── created_at
```

**Row Level Security (RLS):**
- Users can only create reports (INSERT)
- Users can view their own reports
- Admins can view all reports
- Admins can update report status

---

## 🎨 UI Components

### ReportButton Component
**Location:** `/components/shared/ReportButton.tsx`

**Props:**
```typescript
{
  targetType: 'tip' | 'pin' | 'zone';
  targetId: number;
  compact?: boolean; // Flag icon only (default: false)
}
```

**Variants:**
- **Compact mode** (used in sheets): Flag icon button
- **Full mode**: Button with "Report" text

**Features:**
- Auto-detects if user is logged in
- Shows login modal if not authenticated
- Toast notifications on success/error
- Integrated with Supabase

---

## ✅ Testing Checklist

### User Flow:
- [ ] Report zone from city page
- [ ] Report pin from city page
- [ ] Report warning from live mode
- [ ] Report tip from community feed
- [ ] Verify login required
- [ ] Check toast notifications

### Admin Flow:
- [ ] View all reports in dashboard
- [ ] Filter by status (pending/reviewed/dismissed)
- [ ] Mark report as reviewed
- [ ] Dismiss invalid report
- [ ] Verify stats update

### Edge Cases:
- [ ] Report without login → Login modal
- [ ] Report same item twice → Allowed (multiple users can report)
- [ ] Report deleted content → Handle gracefully
- [ ] Report as admin → Works normally

---

## 🚀 Benefits

### For Users:
1. **Community Moderation** - Help keep content accurate
2. **Easy Access** - Report buttons everywhere content is shown
3. **Quick Process** - 3-click report submission
4. **Transparent** - See their own reports in account

### For Admins:
1. **Centralized View** - All reports in one dashboard
2. **Context Rich** - See target type, ID, and reporter
3. **Action Tracking** - Status management (pending/reviewed/dismissed)
4. **Metrics** - Report count in stats

### For Platform:
1. **Content Quality** - Community-driven moderation
2. **Spam Prevention** - Quick removal of bad content
3. **Trust Building** - Users feel heard
4. **Scalability** - Reduces manual monitoring

---

## 📊 Report Reasons

Available report categories:
- **Spam** - Promotional or repetitive content
- **Inappropriate** - Offensive or harmful content
- **Inaccurate** - Wrong information
- **Outdated** - No longer relevant
- **Offensive** - Violates community standards
- **Other** - Custom reason (requires details)

---

## 🔐 Security Features

1. **Authentication Required** - Must be logged in to report
2. **RLS Policies** - Database-level security
3. **Admin-Only Review** - Only admins see all reports
4. **Audit Trail** - Track who reported, when, and why
5. **Rate Limiting** - (Future: Prevent spam reports)

---

## 📱 Responsive Design

Report buttons work on all screen sizes:
- **Desktop**: Full hover states, tooltips
- **Mobile**: Touch-optimized, compact icons
- **Tablet**: Adaptive layout

---

## 🎯 Summary

✅ **Report buttons added to:**
- City detail page (zones & pins)
- Live mode (warnings)
- Community feed (tips)

✅ **Admin dashboard features:**
- Reports tab with full management
- Status tracking (pending/reviewed/dismissed)
- Integration with stats

✅ **User experience:**
- One-click reporting
- Login protection
- Toast feedback
- Simple reason selection

✅ **Security:**
- RLS policies
- Admin-only access
- Authenticated actions

---

**Your SafeSus app now has comprehensive report functionality! 🎉**

Users can flag bad content anywhere they see it, and admins have a centralized dashboard to manage all reports efficiently.

