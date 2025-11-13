import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();

  try {
    // Get recent approved pins (alerts)
    const { data: pinsData, error: pinsError } = await supabase
      .from('pins')
      .select('id, title, summary, type, created_at, city_id')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (pinsError) throw pinsError;

    // Get unique city IDs
    const cityIds = Array.from(new Set((pinsData || []).map(p => p.city_id).filter(Boolean)));
    
    // Fetch cities
    const { data: citiesData } = cityIds.length > 0
      ? await supabase
          .from('cities')
          .select('id, name, slug')
          .in('id', cityIds)
      : { data: [] };

    // Create city lookup map
    const cityMap = new Map((citiesData || []).map(c => [c.id, c]));

    const pins = (pinsData || []).map(pin => {
      const city = pin.city_id ? cityMap.get(pin.city_id) : null;
      return {
        id: pin.id,
        title: pin.title,
        summary: pin.summary,
        type: pin.type,
        city_name: city?.name,
        city_slug: city?.slug,
        created_at: pin.created_at,
      };
    });

    return NextResponse.json({ pins });
  } catch (error: any) {
    console.error('Recent pins error:', error);
    return NextResponse.json({ error: error.message, pins: [] }, { status: 500 });
  }
}

