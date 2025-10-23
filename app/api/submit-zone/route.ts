import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { label, level, reason_short, reason_long, geom } = body;

    // Validate required fields
    if (!label || !level || !reason_short || !geom) {
      return NextResponse.json(
        { error: 'Missing required fields: label, level, reason_short, and geom are required.' },
        { status: 400 }
      );
    }

    // Validate geom format (GeoJSON Polygon)
    if (
      !geom.type || 
      geom.type !== 'Polygon' || 
      !Array.isArray(geom.coordinates) ||
      !Array.isArray(geom.coordinates[0]) ||
      geom.coordinates[0].length < 4 // Polygons need at least 4 points (last point = first point)
    ) {
      return NextResponse.json(
        { error: 'Invalid geometry format. Must be a GeoJSON Polygon with at least 4 coordinate pairs.' },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['recommended', 'neutral', 'caution', 'avoid'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert GeoJSON coordinates to WKT format for PostGIS
    const coords = geom.coordinates[0].map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(',');
    const wkt = `SRID=4326;POLYGON((${coords}))`;

    // Insert zone submission
    const { data, error } = await supabase
      .from('zone_submissions')
      .insert({
        user_id: user.id,
        city_id: 1, // Default to Bangkok for now - should be dynamic based on map location
        label,
        level,
        reason_short,
        reason_long: reason_long || null,
        geom: wkt,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit zone. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Zone submitted successfully for review.',
      data 
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

