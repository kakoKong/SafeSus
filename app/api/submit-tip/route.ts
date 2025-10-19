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

  const { city_id, category, title, summary, details, location } = await request.json();

  if (!category || !title || !summary) {
    return NextResponse.json(
      { error: 'Category, title, and summary are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('tip_submissions')
    .insert({
      user_id: user.id,
      city_id,
      category,
      title,
      summary,
      details,
      location,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, submission: data });
}

