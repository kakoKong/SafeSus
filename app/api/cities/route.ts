import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  console.log('inside get function')
  const { data: cities, error } = await supabase
    .from('cities')
    .select('*')
    .eq('supported', true)
    .order('name');

  console.log(cities)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cities });
}

