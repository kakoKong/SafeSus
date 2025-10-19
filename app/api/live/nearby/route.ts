import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const cityId = searchParams.get('cityId');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude required' },
      { status: 400 }
    );
  }

  const supabase = createClient();

  // Get zones for the city
  let zonesQuery = supabase.from('zones').select('*');
  if (cityId) {
    zonesQuery = zonesQuery.eq('city_id', parseInt(cityId));
  }
  const { data: zones } = await zonesQuery;

  // Get nearby pins (within 500m) using PostGIS
  let pinsQuery = supabase.rpc('nearby_pins', {
    lat,
    lng,
    radius: 500,
  });

  if (cityId) {
    pinsQuery = pinsQuery.eq('city_id', parseInt(cityId));
  }

  const { data: nearbyPins } = await pinsQuery;

  // Find current zone (client-side check will be more accurate)
  // For now, return all zones and let client determine which one user is in

  return NextResponse.json({
    zones: zones || [],
    nearbyPins: nearbyPins || [],
  });
}

