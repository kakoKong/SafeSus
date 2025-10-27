# Notification System

## Overview

The SafeSus notification system provides real-time alerts to users for:
- **Guardians/Admins**: Notifications when new submissions need review
- **Submitters**: Notifications when their submissions are approved/rejected
- **Travelers**: Scam alerts for cities they have saved

## Architecture

### Database (Automatic Triggers)

The system uses PostgreSQL triggers to automatically create notifications:

1. **On Pin Submission** (`notify_guardians_on_submission`)
   - Triggers when a new pin is inserted with `approved = FALSE`
   - Notifies all guardians and admins
   - Includes pin details and link to admin dashboard

2. **On Rule Submission** (`notify_guardians_on_rule_submission`)
   - Triggers when a new rule is inserted with `approved = FALSE`
   - Notifies all guardians and admins
   - Includes rule details and link to admin dashboard

3. **On Pin Approval/Rejection** (`notify_submitter_on_pin_approval`)
   - Triggers when a pin's `approved` status changes
   - Notifies the submitter
   - Includes approval status and link to their contributions

4. **On Rule Approval/Rejection** (`notify_submitter_on_rule_approval`)
   - Triggers when a rule's `approved` status changes
   - Notifies the submitter
   - Includes approval status and link to their contributions

### API Endpoints

#### GET /api/notifications
Fetch user's notifications
- Query params: `unreadOnly=true`, `limit=50`
- Returns: `{ notifications: [], unreadCount: number }`

#### PATCH /api/notifications/[id]
Mark a notification as read/unread
- Body: `{ is_read: boolean }`

#### POST /api/notifications/mark-all-read
Mark all user's notifications as read

#### DELETE /api/notifications/[id]
Delete a notification

#### POST /api/notifications/scam-alert
Send scam alert to users who have saved the city (Admin/Guardian only)
- Body: `{ cityId, pinId, scamTitle, scamSummary, cityName }`
- Notifies all users who have saved that city

### Frontend Components

#### NotificationDropdown
- Located in the header (bell icon)
- Shows unread count badge
- Real-time polling (every 30 seconds)
- Interactive dropdown with mark as read/delete actions

## Usage

### Automatic Notifications (No Code Required)

Notifications are automatically sent when:
1. User submits a pin → Guardians notified
2. User submits a rule → Guardians notified
3. Guardian approves/rejects a pin → Submitter notified
4. Guardian approves/rejects a rule → Submitter notified

### Manual Scam Alerts

When approving a scam pin, send alerts to travelers:

```typescript
// After approving a scam pin
const response = await fetch('/api/notifications/scam-alert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cityId: pin.city_id,
    pinId: pin.id,
    scamTitle: pin.title,
    scamSummary: pin.summary,
    cityName: 'Bangkok' // or fetch from city data
  })
});
```

### Notification Types

- `submission_pending`: New submission awaiting review (Guardian)
- `submission_approved`: Submission was approved (Submitter)
- `submission_rejected`: Submission was rejected (Submitter)
- `new_scam_alert`: New scam alert in saved city (Traveler)

## Database Schema

```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);
```

## Migration

Run the migration to set up the system:

```bash
# Apply migration manually via Supabase dashboard
# Or use Supabase CLI:
supabase db push
```

File: `supabase/migrations/20240128000000_create_notifications.sql`

## Future Enhancements

- [ ] Push notifications (web + mobile)
- [ ] Email notifications for critical alerts
- [ ] Notification preferences/settings
- [ ] In-app notification sound/visual indicators
- [ ] Notification grouping/batching
- [ ] Webhook support for external integrations

