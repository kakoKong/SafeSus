import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const { type, id } = await request.json();

  if (!type || !id) {
    return NextResponse.json({ error: 'Type and ID required' }, { status: 400 });
  }

  try {
    if (type === 'tip') {
      // For tips, just update status
      const { error } = await supabase
        .from('tip_submissions')
        .update({ status: 'approved', reviewed_by: user.id })
        .eq('id', id);

      if (error) throw error;

    } else if (type === 'pin') {
      // Get the pin submission
      const { data: submission, error: fetchError } = await supabase
        .from('pin_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create the pin in the pins table
      const { error: insertError } = await supabase
        .from('pins')
        .insert({
          city_id: submission.city_id,
          type: submission.type,
          title: submission.title,
          summary: submission.summary,
          details: submission.details,
          location: submission.location,
          status: 'approved',
          verified_by: user.id,
        });

      if (insertError) throw insertError;

      // Update submission status
      const { error: updateError } = await supabase
        .from('pin_submissions')
        .update({ status: 'approved', reviewed_by: user.id })
        .eq('id', id);

      if (updateError) throw updateError;

    } else if (type === 'zone') {
      // Get the zone submission
      const { data: submission, error: fetchError } = await supabase
        .from('zone_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create the zone in the zones table
      const { error: insertError } = await supabase
        .from('zones')
        .insert({
          city_id: submission.city_id,
          label: submission.label,
          level: submission.level,
          reason_short: submission.reason_short,
          reason_long: submission.reason_long,
          geom: submission.geom,
          verified_by: user.id,
        });

      if (insertError) throw insertError;

      // Update submission status
      const { error: updateError } = await supabase
        .from('zone_submissions')
        .update({ status: 'approved', reviewed_by: user.id })
        .eq('id', id);

      if (updateError) throw updateError;

    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Award points to the submitter
    try {
      if (type === 'pin' || type === 'zone') {
        const { data: submission } = await supabase
          .from(type === 'pin' ? 'pin_submissions' : 'zone_submissions')
          .select('user_id')
          .eq('id', id)
          .single();

        if (submission?.user_id) {
          await supabase.rpc('increment_user_score', {
            target_user_id: submission.user_id,
            points: 20, // Bonus for approved pin/zone
          });
        }
      }
    } catch (pointsError) {
      console.error('Error awarding points:', pointsError);
      // Don't fail the approval if points fail
    }

    return NextResponse.json({ success: true, message: 'Submission approved and published' });

  } catch (error: any) {
    console.error('Error approving submission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

