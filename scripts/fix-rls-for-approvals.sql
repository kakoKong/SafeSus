-- Fix RLS policies to allow admins to insert approved pins and zones
-- This is needed for the approval workflow to work

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can insert zones" ON zones;
DROP POLICY IF EXISTS "Admins can update zones" ON zones;
DROP POLICY IF EXISTS "Admins can insert pins" ON pins;
DROP POLICY IF EXISTS "Admins can update pins" ON pins;

-- Allow admins to insert zones (for approvals)
CREATE POLICY "Admins can insert zones"
  ON zones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update zones
CREATE POLICY "Admins can update zones"
  ON zones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to insert pins (for approvals)
CREATE POLICY "Admins can insert pins"
  ON pins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update pins
CREATE POLICY "Admins can update pins"
  ON pins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Allow admins to update submission tables (to mark as approved/rejected)
DROP POLICY IF EXISTS "Admins can update tip submissions" ON tip_submissions;
DROP POLICY IF EXISTS "Admins can update pin submissions" ON pin_submissions;
DROP POLICY IF EXISTS "Admins can update zone submissions" ON zone_submissions;

CREATE POLICY "Admins can update tip submissions"
  ON tip_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update pin submissions"
  ON pin_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update zone submissions"
  ON zone_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Also allow admins to view all submissions
DROP POLICY IF EXISTS "Admins can view all tip submissions" ON tip_submissions;
DROP POLICY IF EXISTS "Admins can view all pin submissions" ON pin_submissions;
DROP POLICY IF EXISTS "Admins can view all zone submissions" ON zone_submissions;

CREATE POLICY "Admins can view all tip submissions"
  ON tip_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all pin submissions"
  ON pin_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all zone submissions"
  ON zone_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

