-- Fix user_profiles table to allow 'admin' role
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add new constraint with admin role included
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('traveler', 'local', 'guardian', 'admin'));

-- Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'user_profiles'::regclass
AND conname = 'user_profiles_role_check';

-- Now you can insert/update admin users
-- Example:
-- INSERT INTO user_profiles (user_id, role, score) 
-- VALUES ('your-user-id-here', 'admin', 0)
-- ON CONFLICT (user_id) 
-- DO UPDATE SET role = 'admin';

