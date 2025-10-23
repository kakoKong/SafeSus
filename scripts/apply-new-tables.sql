-- Add new tables for interactive map features
-- Run this in your Supabase SQL Editor

-- User profiles table (for roles and reputation)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('traveler','local','guardian','admin')) DEFAULT 'traveler',
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Zone submissions table (pending zone contributions)
CREATE TABLE IF NOT EXISTS zone_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  level TEXT CHECK (level IN ('recommended','neutral','caution','avoid')) NOT NULL,
  reason_short TEXT NOT NULL,
  reason_long TEXT,
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pin submissions table (pending pin contributions)
CREATE TABLE IF NOT EXISTS pin_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('scam','harassment','overcharge','other')) NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  location GEOMETRY(Point, 4326) NOT NULL,
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Verifications table (guardian approvals)
CREATE TABLE IF NOT EXISTS verifications (
  id SERIAL PRIMARY KEY,
  guardian_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type TEXT CHECK (target_type IN ('tip','zone','pin')) NOT NULL,
  target_id INTEGER NOT NULL,
  status TEXT CHECK (status IN ('approved','rejected')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reports table (fake/spam flags)
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type TEXT CHECK (target_type IN ('zone','pin','tip','rule')) NOT NULL,
  target_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('pending','reviewed','dismissed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Badges table (contribution rewards)
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User badges table (earned badges)
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Update zones table to support caution level
ALTER TABLE zones DROP CONSTRAINT IF EXISTS zones_level_check;
ALTER TABLE zones ADD CONSTRAINT zones_level_check 
  CHECK (level IN ('recommended','neutral','caution','avoid'));

-- Add verified_by to zones if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='zones' AND column_name='verified_by') THEN
    ALTER TABLE zones ADD COLUMN verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add updated_at to zones if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='zones' AND column_name='updated_at') THEN
    ALTER TABLE zones ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zone_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for zone_submissions
CREATE POLICY "Users can view their own zone submissions"
  ON zone_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zone submissions"
  ON zone_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guardians can view all zone submissions"
  ON zone_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'guardian'
    )
  );

-- RLS Policies for pin_submissions
CREATE POLICY "Users can view their own pin submissions"
  ON pin_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pin submissions"
  ON pin_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guardians can view all pin submissions"
  ON pin_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'guardian'
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view user profiles for leaderboard"
  ON user_profiles FOR SELECT
  USING (true);

-- RLS Policies for verifications
CREATE POLICY "Guardians can insert verifications"
  ON verifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'guardian'
    )
  );

CREATE POLICY "Guardians can view all verifications"
  ON verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'guardian'
    )
  );

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Guardians can view all reports"
  ON reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'guardian'
    )
  );

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view all user badges"
  ON user_badges FOR SELECT
  USING (true);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS idx_zone_submissions_geom ON zone_submissions USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_pin_submissions_location ON pin_submissions USING GIST (location);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! New tables created:';
  RAISE NOTICE '- user_profiles';
  RAISE NOTICE '- zone_submissions';
  RAISE NOTICE '- pin_submissions';
  RAISE NOTICE '- verifications';
  RAISE NOTICE '- reports';
  RAISE NOTICE '- badges';
  RAISE NOTICE '- user_badges';
END $$;

