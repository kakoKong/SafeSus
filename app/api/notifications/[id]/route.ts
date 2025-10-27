import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH - Mark notification as read
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notificationId = params.id;
  const body = await request.json();
  const { is_read } = body;

  // Update notification
  const { data: notification, error } = await supabase
    .from('notifications')
    .update({ 
      is_read: is_read, 
      read_at: is_read ? new Date().toISOString() : null 
    })
    .eq('id', notificationId)
    .eq('user_id', user.id) // Ensure user can only update their own notifications
    .select()
    .single();

  if (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }

  return NextResponse.json({ notification });
}

// DELETE - Delete notification
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notificationId = params.id;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_id', user.id); // Ensure user can only delete their own notifications

  if (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

