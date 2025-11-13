import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TipCategory } from '@/lib/tip-categories';

// Helper to intelligently assign categories based on content
function assignCategory(title: string, summary: string): TipCategory {
  const content = `${title} ${summary}`.toLowerCase();
  
  if (content.match(/taxi|tuk tuk|grab|uber|transport|bus|train|mrt|bts|metro|airport|ride/i)) return 'transportation';
  if (content.match(/shop|market|mall|buy|price|bargain|souvenir|store|vendor/i)) return 'shopping';
  if (content.match(/food|restaurant|eat|dining|street food|drink|menu|cafe|bar/i)) return 'dining';
  if (content.match(/hotel|hostel|accommodation|stay|room|booking|check.?in|lodging/i)) return 'accommodation';
  if (content.match(/temple|culture|dress|respect|etiquette|custom|tradition|religious|buddha|shrine/i)) return 'cultural';
  if (content.match(/atm|money|cash|exchange|bank|currency|baht|dollar|pay|card|fee/i)) return 'money';
  if (content.match(/sim|phone|wifi|internet|call|language|speak|translate|app|mobile/i)) return 'communication';
  if (content.match(/tour|attraction|palace|museum|park|sightseeing|visit|tourist spot|landmark/i)) return 'attractions';
  
  return 'general_safety';
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search in tip submissions
    const { data: tipsData, error: tipsError } = await supabase
      .from('tip_submissions')
      .select('id, title, summary, city_id')
      .eq('status', 'approved')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .limit(20);

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

    // Format results
    const results = (tipsData || []).map(tip => {
      const city = tip.city_id ? cityMap.get(tip.city_id) : null;
      return {
        id: tip.id,
        title: tip.title,
        summary: tip.summary,
        tip_category: assignCategory(tip.title, tip.summary),
        city_name: city?.name,
        city_slug: city?.slug,
      };
    });

    // Sort by relevance (exact title match first)
    const sorted = results.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const bExact = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      return bExact - aExact;
    });

    return NextResponse.json({ results: sorted });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message, results: [] }, { status: 500 });
  }
}

