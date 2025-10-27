-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'submission_pending', 'submission_approved', 'submission_rejected', 'new_scam_alert'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- Optional link to the relevant content
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- Additional data like pin_id, city_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow system to create notifications (admins and guardians via service role)
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM notifications
    WHERE user_id = p_user_id AND is_read = FALSE
  );
END;
$$;

-- Function to create notification for guardians when new submission is made
CREATE OR REPLACE FUNCTION notify_guardians_on_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  guardian_record RECORD;
  city_name TEXT;
BEGIN
  -- Only notify on insert and if pending approval
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    -- Get city name
    SELECT name INTO city_name FROM cities WHERE id = NEW.city_id;
    
    -- Notify all guardians
    FOR guardian_record IN 
      SELECT user_id as id FROM user_profiles WHERE role IN ('guardian', 'admin')
    LOOP
      INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES (
        guardian_record.id,
        'submission_pending',
        'New Submission Awaiting Review',
        format('A new %s has been submitted in %s and needs your review.', 
          CASE 
            WHEN NEW.type = 'scam' THEN 'scam alert'
            WHEN NEW.type = 'harassment' THEN 'harassment report'
            WHEN NEW.type = 'overcharge' THEN 'overcharge report'
            ELSE 'incident'
          END,
          COALESCE(city_name, 'a city')
        ),
        format('/admin/review'),
        jsonb_build_object('pin_id', NEW.id, 'city_id', NEW.city_id, 'type', NEW.type)
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for pin submissions
DROP TRIGGER IF EXISTS notify_guardians_on_pin_submission ON pin_submissions;
CREATE TRIGGER notify_guardians_on_pin_submission
  AFTER INSERT ON pin_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_guardians_on_submission();

-- Function to create notification for guardians when new rule submission is made
CREATE OR REPLACE FUNCTION notify_guardians_on_rule_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  guardian_record RECORD;
  city_name TEXT;
BEGIN
  -- Only notify on insert and if pending approval
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    -- Get city name
    SELECT name INTO city_name FROM cities WHERE id = NEW.city_id;
    
    -- Notify all guardians
    FOR guardian_record IN 
      SELECT user_id as id FROM user_profiles WHERE role IN ('guardian', 'admin')
    LOOP
      INSERT INTO notifications (user_id, type, title, message, link, metadata)
      VALUES (
        guardian_record.id,
        'submission_pending',
        'New Tip Awaiting Review',
        format('A new safety tip has been submitted in %s and needs your review.', 
          COALESCE(city_name, 'a city')
        ),
        format('/admin/review'),
        jsonb_build_object('tip_id', NEW.id, 'city_id', NEW.city_id, 'category', NEW.category)
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for tip submissions (rules)
DROP TRIGGER IF EXISTS notify_guardians_on_tip_submission_trigger ON tip_submissions;
CREATE TRIGGER notify_guardians_on_tip_submission_trigger
  AFTER INSERT ON tip_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_guardians_on_rule_submission();

-- Function to notify submitter when their submission is approved/rejected
CREATE OR REPLACE FUNCTION notify_submitter_on_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  city_name TEXT;
  notification_type TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only notify on status change from pending
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status != 'pending' AND NEW.user_id IS NOT NULL THEN
    -- Get city name
    SELECT name INTO city_name FROM cities WHERE id = NEW.city_id;
    
    IF NEW.status = 'approved' THEN
      notification_type := 'submission_approved';
      notification_title := 'Submission Approved!';
      notification_message := format('Your submission in %s has been approved and is now live. Thank you for contributing!', 
        COALESCE(city_name, 'a city')
      );
    ELSIF NEW.status = 'rejected' THEN
      notification_type := 'submission_rejected';
      notification_title := 'Submission Not Approved';
      notification_message := format('Your submission in %s was not approved. Please ensure it meets our guidelines.', 
        COALESCE(city_name, 'a city')
      );
    ELSE
      RETURN NEW; -- No notification for other status changes
    END IF;
    
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.user_id,
      notification_type,
      notification_title,
      notification_message,
      format('/account?tab=contributions'),
      jsonb_build_object('pin_id', NEW.id, 'city_id', NEW.city_id, 'status', NEW.status)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for pin submission approval/rejection
DROP TRIGGER IF EXISTS notify_submitter_on_pin_approval ON pin_submissions;
CREATE TRIGGER notify_submitter_on_pin_approval
  AFTER UPDATE ON pin_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_submitter_on_approval();

-- Function to notify submitter when their rule is approved/rejected
CREATE OR REPLACE FUNCTION notify_submitter_on_rule_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  city_name TEXT;
  notification_type TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only notify on status change from pending
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status != 'pending' AND NEW.user_id IS NOT NULL THEN
    -- Get city name
    SELECT name INTO city_name FROM cities WHERE id = NEW.city_id;
    
    IF NEW.approved = TRUE THEN
      notification_type := 'submission_approved';
      notification_title := 'Tip Approved!';
      notification_message := format('Your safety tip for %s has been approved and is now visible to the community!', 
        COALESCE(city_name, 'a city')
      );
    ELSE
      notification_type := 'submission_rejected';
      notification_title := 'Tip Not Approved';
      notification_message := format('Your tip for %s was not approved. Please review our guidelines and try again.', 
        COALESCE(city_name, 'a city')
      );
    END IF;
    
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.user_id,
      notification_type,
      notification_title,
      notification_message,
      format('/account?tab=contributions'),
      jsonb_build_object('tip_id', NEW.id, 'city_id', NEW.city_id, 'status', NEW.status)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for tip submission approval/rejection
DROP TRIGGER IF EXISTS notify_submitter_on_tip_approval_trigger ON tip_submissions;
CREATE TRIGGER notify_submitter_on_tip_approval_trigger
  AFTER UPDATE ON tip_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_submitter_on_rule_approval();

COMMENT ON TABLE notifications IS 'Store user notifications for submissions, approvals, and alerts';

