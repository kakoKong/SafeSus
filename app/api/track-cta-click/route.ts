import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    
    // Get user if authenticated (optional)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { cta_type } = body;

    if (!cta_type) {
      return NextResponse.json(
        { error: 'cta_type is required' },
        { status: 400 }
      );
    }

    // Get request metadata for analytics
    const headers = request.headers;
    const userAgent = headers.get('user-agent') || null;
    const referrer = headers.get('referer') || null;
    
    // Get IP address (if available through headers)
    const forwarded = headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : 
                      headers.get('x-real-ip') || null;

    // Insert click record
    const { error } = await supabase
      .from('cta_clicks')
      .insert({
        cta_type,
        user_id: user?.id || null,
        user_agent: userAgent,
        referrer: referrer,
        ip_address: ipAddress,
      });

    if (error) {
      console.error('Error tracking CTA click:', error);
      // Don't fail the request if tracking fails
      return NextResponse.json({ success: true, tracked: false });
    }

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    console.error('Error in track-cta-click:', error);
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: true, tracked: false });
  }
}

