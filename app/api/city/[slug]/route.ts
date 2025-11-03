import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

  // Get pins (published map points)
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
    return NextResponse.json(
      { error: 'Failed to fetch city data' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    city: {
      ...city,
      zones: zones || [],
      pins: pins || [],
      reports: reports || [],
      tips: tips || [],
      incidents: incidents || [],
      rules: rules || [],
    },
  });
}

