import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function normalizeToGeoJSONPoint(geom: any): GeoJSON.Point | null {
  if (!geom) return null;

  if (geom.type === 'Point' && Array.isArray(geom.coordinates) && geom.coordinates.length === 2) {
    const [lng, lat] = geom.coordinates;
    if (
      typeof lng === 'number' && typeof lat === 'number' &&
      !isNaN(lng) && !isNaN(lat) &&
      lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
    ) {
      return geom;
    }
  }

  let coords: [number, number] | null = null;

  if (typeof geom === 'string') {
    const match = geom.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
    if (match) {
      const lng = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      if (!isNaN(lng) && !isNaN(lat)) coords = [lng, lat];
    }
  }

  if (!coords && typeof geom === 'object' && Array.isArray(geom.coordinates)) {
    const [lng, lat] = geom.coordinates;
    if (typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat)) {
      coords = [lng, lat];
    }
  }

  if (!coords && typeof geom === 'object') {
    if ('x' in geom && 'y' in geom) {
      // @ts-ignore
      coords = [geom.x, geom.y];
    } else if ('longitude' in geom && 'latitude' in geom) {
      // @ts-ignore
      coords = [geom.longitude, geom.latitude];
    } else if ('lng' in geom && 'lat' in geom) {
      // @ts-ignore
      coords = [geom.lng, geom.lat];
    }
  }

  if (coords && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90) {
    return {
      type: 'Point',
      coordinates: coords,
    };
  }

  return null;
}

function haversineDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '1000'); // meters
  const include = (searchParams.get('include') || 'pins,tips').split(','); // e.g., pins,tips
  const limit = parseInt(searchParams.get('limit') || '200');

  if (!isFinite(lat) || !isFinite(lng)) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    // Nearby pins via existing RPC (server-side geospatial)
    let nearbyPins: any[] = [];
    if (include.includes('pins')) {
      const { data: nearbyPinsData, error: nearbyPinsError } = await supabase.rpc('nearby_pins', {
        lat,
        lng,
        radius,
      });
      if (nearbyPinsError) {
        console.error('nearby_pins RPC error:', nearbyPinsError);
      }
      nearbyPins = (nearbyPinsData || [])
        .filter((pin: any) => pin.status === 'approved')
        .map((pin: any) => {
          const location = normalizeToGeoJSONPoint(pin.location || pin.geom);
          return {
            id: pin.id,
            city_id: pin.city_id,
            type: pin.type,
            title: pin.title,
            summary: pin.summary,
            details: pin.details,
            location,
            status: pin.status,
            source: pin.source,
            created_at: pin.created_at,
            distance: pin.distance || null,
          };
        })
        .filter((p: any) => !!p.location);
    }

    // Nearby tips by fetching a reasonable set and filtering in server (fallback if no RPC)
    let nearbyTips: any[] = [];
    if (include.includes('tips')) {
      const { data: tipsData, error: tipsError } = await supabase
        .from('tip_submissions')
        .select('id, title, summary, location, location_v2, status, created_at, city_id')
        .eq('status', 'approved')
        .not('location', 'is', null)
        .order('created_at', { ascending: false })
        .limit(limit);

      // If no rows due to old column name usage, try location_v2 fallback list
      let tips = tipsData || [];
      if (tipsError) {
        console.error('tips query error:', tipsError);
      }

      // Normalize and filter by haversine distance
      nearbyTips = tips
        .map((t: any) => {
          const point = normalizeToGeoJSONPoint(t.location || t.location_v2);
          if (!point) return null;
          const [plng, plat] = point.coordinates;
          const distance = haversineDistanceMeters(lat, lng, plat, plng);
          return distance <= radius
            ? {
                id: t.id,
                title: t.title,
                summary: t.summary,
                city_id: t.city_id,
                created_at: t.created_at,
                location: point,
                distance,
              }
            : null;
        })
        .filter((t): t is any => t !== null)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return NextResponse.json({
      pins: nearbyPins,
      tips: nearbyTips,
      center: { lat, lng },
      radius,
      count: { pins: nearbyPins.length, tips: nearbyTips.length },
    });
  } catch (error: any) {
    console.error('nearby API error:', error);
    return NextResponse.json({ error: 'Failed to fetch nearby data' }, { status: 500 });
  }
}
