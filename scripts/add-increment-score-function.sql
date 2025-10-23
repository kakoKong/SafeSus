-- Create function to increment user score
CREATE OR REPLACE FUNCTION increment_user_score(
  target_user_id UUID,
  points INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure user profile exists
  INSERT INTO user_profiles (user_id, score, role)
  VALUES (target_user_id, points, 'traveler')
  ON CONFLICT (user_id)
  DO UPDATE SET 
    score = user_profiles.score + points,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_user_score(UUID, INTEGER) TO authenticated;

