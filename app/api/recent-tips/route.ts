import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { TipCategory } from '@/lib/tip-categories';

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

export async function GET() {
  const supabase = createClient();

  try {
    // Get recent approved pins
    const { data: pins, error: pinsError } = await supabase
      .from('pins')
      .select(`
        id,
        title,
        summary,
        created_at,
        city:cities!inner(name, slug)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);

    if (pinsError) throw pinsError;

    const tips = (pins || []).map(pin => {
      const city = Array.isArray(pin.city) ? pin.city[0] : pin.city;
      return {
        id: pin.id,
        title: pin.title,
        tip_category: assignCategory(pin.title, pin.summary),
        city_name: city?.name,
        city_slug: city?.slug,
        created_at: pin.created_at,
      };
    });

    return NextResponse.json({ tips });
  } catch (error: any) {
    console.error('Recent tips error:', error);
    return NextResponse.json({ error: error.message, tips: [] }, { status: 500 });
  }
}

