import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Check if requester is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Verify requester is admin
    const { data: requesterProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!requesterProfile || requesterProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Only administrators can assign roles.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { user_id, role } = body;

    // Validate required fields
    if (!user_id || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id and role are required.' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['traveler', 'local', 'guardian', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', user_id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({ user_id, role, score: 0 })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${role}`,
      data: result
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

