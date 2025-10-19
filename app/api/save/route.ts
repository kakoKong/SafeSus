import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { city_id } = await request.json();

  if (!city_id) {
    return NextResponse.json({ error: 'City ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('saved_cities')
    .insert({ user_id: user.id, city_id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { city_id } = await request.json();

  if (!city_id) {
    return NextResponse.json({ error: 'City ID required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('saved_cities')
    .delete()
    .eq('user_id', user.id)
    .eq('city_id', city_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

