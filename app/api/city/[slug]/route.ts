import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Helper to normalize geometry to GeoJSON Point format
function normalizeToGeoJSONPoint(geom: any): GeoJSON.Point | null {
  if (!geom) return null;
  
  // Already GeoJSON Point
  if (geom.type === 'Point' && Array.isArray(geom.coordinates) && geom.coordinates.length === 2) {
    const [lng, lat] = geom.coordinates;
    if (typeof lng === 'number' && typeof lat === 'number' && 
        !isNaN(lng) && !isNaN(lat) &&
        lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      return geom;
    }
  }
  
  // Try to extract coordinates from various formats
  let coords: [number, number] | null = null;
  
  // String format: POINT(lng lat) or SRID=4326;POINT(lng lat)
  if (typeof geom === 'string') {
    const match = geom.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lng) && !isNaN(lat)) {
        coords = [lng, lat];
      }
    }
  }
  
  // Object with coordinates array
  if (!coords && typeof geom === 'object' && Array.isArray(geom.coordinates)) {
    const [lng, lat] = geom.coordinates;
    if (typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat)) {
      coords = [lng, lat];
    }
  }
  
  // Object with x/y or lng/lat
  if (!coords && typeof geom === 'object') {
    if ('x' in geom && 'y' in geom) {
      coords = [geom.x, geom.y];
    } else if ('longitude' in geom && 'latitude' in geom) {
      coords = [geom.longitude, geom.latitude];
    } else if ('lng' in geom && 'lat' in geom) {
      coords = [geom.lng, geom.lat];
    }
  }
  
  if (coords && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90) {
    return {
      type: 'Point',
      coordinates: coords
    };
  }
  
  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient();
  const { slug } = params;

  // Get city
  const { data: city, error: cityError } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (cityError || !city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  // Get zones
  const { data: zones, error: zonesError } = await supabase
    .from('zones')
    .select('*')
    .eq('city_id', city.id);

  // Get pins - Supabase PostGIS should return GeoJSON automatically
  // But we'll normalize it to ensure proper format
  const { data: pins, error: pinsError } = await supabase
    .from('pins')
    .select('*')
    .eq('city_id', city.id)
    .eq('status', 'approved');

  // Get reports (incident reports with locations)
  const { data: reports, error: reportsError } = await supabase
    .from('reports')
    .select('*')
    .eq('city_id', city.id)
    .eq('status', 'approved')
    .not('geom', 'is', null);

  // Get tips with locations
  const { data: tips, error: tipsError } = await supabase
    .from('tip_submissions')
    .select('*')
    .eq('city_id', city.id)
    .eq('status', 'approved')
    .or('location.not.is.null,location_v2.not.is.null');

  // Get incidents (aggregated incidents with locations)
  const { data: incidents, error: incidentsError } = await supabase
    .from('incidents')
    .select('*')
    .eq('city_id', city.id)
    .eq('status', 'live')
    .not('geom', 'is', null);

  // Get rules
  const { data: rules, error: rulesError } = await supabase
    .from('rules')
    .select('*')
    .eq('city_id', city.id);

  if (zonesError || pinsError || reportsError || tipsError || incidentsError || rulesError) {
    console.error('Error fetching city data:', { zonesError, pinsError, reportsError, tipsError, incidentsError, rulesError });
    return NextResponse.json(
      { error: 'Failed to fetch city data' },
      { status: 500 }
    );
  }

  // Normalize pins - ensure location is valid GeoJSON Point
  const normalizedPins = (pins || [])
    .map((pin: any) => {
      // Debug: log first pin's location format
      if (pin && pins && pins.indexOf(pin) === 0) {
        console.log(`[API] Sample pin location format:`, {
          pinId: pin.id,
          location: pin.location,
          geom: pin.geom,
          locationType: typeof pin.location,
          locationKeys: pin.location ? Object.keys(pin.location) : null
        });
      }
      
      const location = normalizeToGeoJSONPoint(pin.location || pin.geom);
      if (!location) {
        console.warn(`[API] Pin ${pin.id} has invalid location, skipping. Original:`, pin.location || pin.geom);
        return null;
      }
      return {
        ...pin,
        location
      };
    })
    .filter((pin): pin is any => pin !== null);
  
  console.log(`[API] Normalized ${normalizedPins.length} pins from ${(pins || []).length} total`);
  
  // Normalize reports
  const normalizedReports = (reports || [])
    .map((r: any) => {
      const geom = normalizeToGeoJSONPoint(r.geom || r.location);
      return geom ? { ...r, geom } : null;
    })
    .filter((r): r is any => r !== null);
  
  // Normalize tips
  const normalizedTips = (tips || [])
    .map((t: any) => {
      const location = normalizeToGeoJSONPoint(t.location || t.location_v2);
      return location ? { ...t, location } : null;
    })
    .filter((t): t is any => t !== null);
  
  // Normalize incidents
  const normalizedIncidents = (incidents || [])
    .map((i: any) => {
      const geom = normalizeToGeoJSONPoint(i.geom || i.location);
      return geom ? { ...i, geom } : null;
    })
    .filter((i): i is any => i !== null);

  return NextResponse.json({
    city: {
      ...city,
      zones: zones || [],
      pins: normalizedPins,
      reports: normalizedReports,
      tips: normalizedTips,
      incidents: normalizedIncidents,
      rules: rules || [],
    },
  });
}

