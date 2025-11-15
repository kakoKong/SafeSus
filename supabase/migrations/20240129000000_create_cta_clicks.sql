-- Create cta_clicks table to track CTA button clicks
CREATE TABLE IF NOT EXISTS cta_clicks (
  id BIGSERIAL PRIMARY KEY,
  cta_type VARCHAR(50) NOT NULL, -- 'waitlist_button', 'submit_tip', etc.
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, for logged-in users
  ip_address INET, -- Optional, for analytics
  user_agent TEXT, -- Optional, for analytics
  referrer TEXT, -- Optional, where the user came from
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_cta_clicks_cta_type ON cta_clicks(cta_type);
CREATE INDEX idx_cta_clicks_user_id ON cta_clicks(user_id);
CREATE INDEX idx_cta_clicks_created_at ON cta_clicks(created_at DESC);

-- Enable RLS
ALTER TABLE cta_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anyone to insert (for tracking), but only admins can view
CREATE POLICY "Anyone can insert cta clicks"
  ON cta_clicks
  FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own clicks
CREATE POLICY "Users can view their own cta clicks"
  ON cta_clicks
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM user_profiles WHERE role IN ('admin', 'guardian')
  ));

COMMENT ON TABLE cta_clicks IS 'Track CTA button clicks for analytics';

