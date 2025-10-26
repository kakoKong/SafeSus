import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name, slug, country, supported')
      .order('name');

    if (error) throw error;

    return NextResponse.json({ cities: cities || [] });
  } catch (error: any) {
    console.error('Cities fetch error:', error);
    return NextResponse.json({ error: error.message, cities: [] }, { status: 500 });
  }
}
