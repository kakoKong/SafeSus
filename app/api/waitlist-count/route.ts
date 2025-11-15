import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const airtableBaseId = process.env.AIRTABLE_BASE_ID || 'appA2ZLE9CJxyUC1r';
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || 'Waitlist SignUps';
    const airtableApiKey = process.env.AIRTABLE_API_KEY;

    if (!airtableApiKey) {
      console.error('AIRTABLE_API_KEY is not set');
      return NextResponse.json(
        { error: 'Airtable API key not configured' },
        { status: 500 }
      );
    }

    // Fetch records from Airtable
    const url = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch waitlist count', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const count = data.records?.length || 0;

    // Cache for 5 minutes
    return NextResponse.json(
      { count },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

