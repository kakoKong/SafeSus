import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TipCategory } from '@/lib/tip-categories';

// Helper to intelligently assign categories based on content
function assignCategory(title: string, summary: string, type?: string): TipCategory {
  const content = `${title} ${summary}`.toLowerCase();
  
  // Transportation
  if (content.match(/taxi|tuk tuk|grab|uber|transport|bus|train|mrt|bts|metro|airport|ride/i)) {
    return 'transportation';
  }
  
  // Shopping
  if (content.match(/shop|market|mall|buy|price|bargain|souvenir|store|vendor/i)) {
    return 'shopping';
  }
  
  // Dining
  if (content.match(/food|restaurant|eat|dining|street food|drink|menu|cafe|bar/i)) {
    return 'dining';
  }
  
  // Accommodation
  if (content.match(/hotel|hostel|accommodation|stay|room|booking|check.?in|lodging/i)) {
    return 'accommodation';
  }
  
  // Cultural
  if (content.match(/temple|culture|dress|respect|etiquette|custom|tradition|religious|buddha|shrine/i)) {
    return 'cultural';
  }
  
  // Money
  if (content.match(/atm|money|cash|exchange|bank|currency|baht|dollar|pay|card|fee/i)) {
    return 'money';
  }
  
  // Communication
  if (content.match(/sim|phone|wifi|internet|call|language|speak|translate|app|mobile/i)) {
    return 'communication';
  }
  
  // Attractions
  if (content.match(/tour|attraction|palace|museum|park|sightseeing|visit|tourist spot|landmark/i)) {
    return 'attractions';
  }
  
  // Default to general safety
  return 'general_safety';
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    // Get recently approved pins (scams) with city info
    const { data: pins, error: pinsError } = await supabase
      .from('pins')
      .select(`
        id,
        type,
        title,
        summary,
        created_at,
        city:cities!inner(name, slug)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(Math.ceil(limit * 0.6));

    if (pinsError) throw pinsError;

    // Transform pins data with intelligent categorization
    const tipArticles = (pins || []).map(pin => ({
      id: pin.id,
      title: pin.title,
      summary: pin.summary,
      tip_category: assignCategory(pin.title, pin.summary, pin.type),
      city_name: pin.city?.name,
      city_slug: pin.city?.slug,
      created_at: pin.created_at,
    }));

    // Get some rules as tips
    const { data: rules, error: rulesError } = await supabase
      .from('rules')
      .select(`
        id,
        kind,
        title,
        reason,
        created_at,
        city:cities!inner(name, slug)
      `)
      .order('created_at', { ascending: false })
      .limit(Math.ceil(limit * 0.4));

    if (!rulesError && rules) {
      const ruleTips = rules.map(rule => ({
        id: rule.id + 10000, // Offset to avoid collision with pin IDs
        title: rule.title,
        summary: rule.reason,
        tip_category: assignCategory(rule.title, rule.reason),
        city_name: rule.city?.name,
        city_slug: rule.city?.slug,
        created_at: rule.created_at,
      }));
      
      tipArticles.push(...ruleTips);
    }

    // Shuffle and limit
    const shuffled = tipArticles.sort(() => Math.random() - 0.5).slice(0, limit);

    return NextResponse.json({ tips: shuffled });
  } catch (error: any) {
    console.error('Featured tips error:', error);
    return NextResponse.json({ error: error.message, tips: [] }, { status: 500 });
  }
}

