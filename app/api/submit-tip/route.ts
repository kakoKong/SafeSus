import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { city_id, category, title, summary, details, location, occurred_at } = await request.json();

  if (!category || !title || !summary) {
    return NextResponse.json(
      { error: 'Category, title, and summary are required' },
      { status: 400 }
    );
  }

  // Insert into tip_submissions table
  const locationWkt = location ? `SRID=4326;POINT(${location.coordinates[0]} ${location.coordinates[1]})` : null;
  
  const { data, error } = await supabase
    .from('tip_submissions')
    .insert({
      user_id: user.id,
      city_id,
      category,
      title,
      summary,
      details: details || null,
      location: locationWkt,
      location_v2: locationWkt, // Use location_v2 for new submissions
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, submission: data });
}

