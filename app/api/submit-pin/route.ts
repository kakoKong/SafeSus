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
    const { type, title, summary, details, location } = body;

    // Validate required fields
    if (!type || !title || !summary || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, summary, and location are required.' },
        { status: 400 }
      );
    }

    // Validate location format (GeoJSON Point)
    if (
      !location.type || 
      location.type !== 'Point' || 
      !Array.isArray(location.coordinates) || 
      location.coordinates.length !== 2
    ) {
      return NextResponse.json(
        { error: 'Invalid location format. Must be a GeoJSON Point with [longitude, latitude].' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['scam', 'harassment', 'overcharge', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert pin submission
    const { data, error } = await supabase
      .from('pin_submissions')
      .insert({
        user_id: user.id,
        city_id: 1, // Default to Bangkok for now - should be dynamic based on map location
        type,
        title,
        summary,
        details: details || null,
        location: `SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})`,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit pin. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pin submitted successfully for review.',
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

