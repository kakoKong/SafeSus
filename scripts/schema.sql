-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT DEFAULT 'Thailand',
  slug TEXT UNIQUE NOT NULL,
  supported BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Zones table (organic blobs for safety areas)
CREATE TABLE IF NOT EXISTS zones (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  level TEXT CHECK (level IN ('recommended','neutral','avoid')) NOT NULL,
  reason_short TEXT NOT NULL,
  reason_long TEXT,
  geom GEOMETRY(Polygon, 4326) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index on zones
CREATE INDEX IF NOT EXISTS idx_zones_geom ON zones USING GIST (geom);

-- Pins table (scams/incidents)
CREATE TABLE IF NOT EXISTS pins (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('scam','harassment','overcharge','other')) NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  location GEOMETRY(Point, 4326) NOT NULL,
  status TEXT CHECK (status IN ('approved','pending','rejected')) DEFAULT 'approved',
  source TEXT CHECK (source IN ('curated','user')) DEFAULT 'curated',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create spatial index on pins
CREATE INDEX IF NOT EXISTS idx_pins_location ON pins USING GIST (location);

-- Rules table (do & don't)
CREATE TABLE IF NOT EXISTS rules (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('do','dont')) NOT NULL,
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved cities table (user favorites)
CREATE TABLE IF NOT EXISTS saved_cities (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, city_id)
);

-- Tip submissions table (pending user contributions)
CREATE TABLE IF NOT EXISTS tip_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  city_id INTEGER,
  category TEXT CHECK (category IN ('stay','scam','do_dont')) NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  details TEXT,
  location GEOMETRY(Point, 4326),
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Function to find nearby pins (for Live Mode)
CREATE OR REPLACE FUNCTION nearby_pins(lat DOUBLE PRECISION, lng DOUBLE PRECISION, radius INTEGER)
RETURNS TABLE (
  id INTEGER,
  city_id INTEGER,
  type TEXT,
  title TEXT,
  summary TEXT,
  details TEXT,
  location GEOMETRY(Point, 4326),
  status TEXT,
  source TEXT,
  created_at TIMESTAMP,
  distance DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.city_id,
    p.type,
    p.title,
    p.summary,
    p.details,
    p.location,
    p.status,
    p.source,
    p.created_at,
    ST_Distance(
      p.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) AS distance
  FROM pins p
  WHERE p.status = 'approved'
    AND ST_DWithin(
      p.location::geography,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius
    )
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE saved_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tip_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for saved_cities
CREATE POLICY "Users can view their own saved cities"
  ON saved_cities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved cities"
  ON saved_cities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved cities"
  ON saved_cities FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for tip_submissions
CREATE POLICY "Users can view their own submissions"
  ON tip_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON tip_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read access for approved content
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view cities"
  ON cities FOR SELECT
  USING (true);

CREATE POLICY "Public can view zones"
  ON zones FOR SELECT
  USING (true);

CREATE POLICY "Public can view approved pins"
  ON pins FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Public can view rules"
  ON rules FOR SELECT
  USING (true);

