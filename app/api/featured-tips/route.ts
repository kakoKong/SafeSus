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
    // Get recently approved tip submissions with city info
    const { data: tipsData, error: tipsError } = await supabase
      .from('tip_submissions')
      .select('id, category, title, summary, created_at, city_id')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (tipsError) throw tipsError;

    // Get unique city IDs
    const cityIds = Array.from(new Set((tipsData || []).map(t => t.city_id).filter(Boolean)));
    
    // Fetch cities
    const { data: citiesData } = cityIds.length > 0
      ? await supabase
          .from('cities')
          .select('id, name, slug')
          .in('id', cityIds)
      : { data: [] };

    // Create city lookup map
    const cityMap = new Map((citiesData || []).map(c => [c.id, c]));

    // Transform tip submissions data with intelligent categorization
    const tipArticles = (tipsData || []).map(tip => {
      const city = tip.city_id ? cityMap.get(tip.city_id) : null;
      return {
        id: tip.id,
        title: tip.title,
        summary: tip.summary,
        tip_category: assignCategory(tip.title, tip.summary, tip.category),
        city_name: city?.name,
        city_slug: city?.slug,
        created_at: tip.created_at,
      };
    });

    // Shuffle and limit
    const shuffled = tipArticles.sort(() => Math.random() - 0.5).slice(0, limit);

    return NextResponse.json({ tips: shuffled });
  } catch (error: any) {
    console.error('Featured tips error:', error);
    return NextResponse.json({ error: error.message, tips: [] }, { status: 500 });
  }
}

