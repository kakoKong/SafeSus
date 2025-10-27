import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// POST - Create scam alert notification for users in area
export async function POST(request: Request) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin or guardian
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'guardian'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { cityId, pinId, scamTitle, scamSummary, cityName } = body;

  if (!cityId || !pinId || !scamTitle) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Get all users who have saved this city or have role 'traveler'/'local'
  const { data: savedCities } = await supabase
    .from('saved_cities')
    .select('user_id')
    .eq('city_id', cityId);

  const userIds = savedCities?.map((sc) => sc.user_id) || [];

  if (userIds.length === 0) {
    return NextResponse.json({ message: 'No users to notify' });
  }

  // Create notifications for all users who have this city saved
  const notifications = userIds.map((userId) => ({
    user_id: userId,
    type: 'new_scam_alert',
    title: `New Scam Alert in ${cityName || 'Your Saved City'}`,
    message: `${scamTitle}${scamSummary ? ': ' + scamSummary.substring(0, 100) : ''}`,
    link: `/city/${cityId}?highlight=${pinId}`,
    metadata: {
      city_id: cityId,
      pin_id: pinId,
      scam_title: scamTitle,
    },
  }));

  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select();

  if (error) {
    console.error('Error creating scam alert notifications:', error);
    return NextResponse.json({ error: 'Failed to create notifications' }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    notificationsCreated: data?.length || 0 
  });
}

