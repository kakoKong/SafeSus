import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch user's notifications
export async function GET(request: Request) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data: notifications, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }

  // Get unread count
  const { data: unreadCountData } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  return NextResponse.json({ 
    notifications: notifications || [], 
    unreadCount: unreadCountData?.length || 0 
  });
}

// POST - Create a new notification (admin/system use)
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
  const { targetUserId, type, title, message, link, metadata } = body;

  if (!targetUserId || !type || !title || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: targetUserId,
      type,
      title,
      message,
      link,
      metadata,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }

  return NextResponse.json({ notification });
}

