import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bangkok seed data
const bangkokZones = [
  {
    label: 'Sukhumvit 24-39',
    level: 'recommended',
    reason_short: 'Well-lit, many expats; safer at night for solo travelers.',
    reason_long: 'Main roads with frequent patrols, close to BTS stations. Popular expat area with international hotels and restaurants.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5595, 13.7307],
        [100.5695, 13.7307],
        [100.5695, 13.7407],
        [100.5595, 13.7407],
        [100.5595, 13.7307]
      ]]
    }
  },
  {
    label: 'Old Town (Rattanakosin)',
    level: 'recommended',
    reason_short: 'Tourist-friendly area with temples and attractions.',
    reason_long: 'Heavy tourist presence means plenty of security. Watch for scams near Grand Palace.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.4900, 13.7500],
        [100.5000, 13.7500],
        [100.5000, 13.7600],
        [100.4900, 13.7600],
        [100.4900, 13.7500]
      ]]
    }
  },
  {
    label: 'Siam & Ratchaprasong',
    level: 'recommended',
    reason_short: 'Major shopping district with excellent security.',
    reason_long: 'Central shopping area with heavy police presence, CCTV everywhere, and well-lit streets. Safe day and night with major malls like Siam Paragon and CentralWorld.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5300, 13.7400],
        [100.5450, 13.7400],
        [100.5450, 13.7550],
        [100.5300, 13.7550],
        [100.5300, 13.7400]
      ]]
    }
  },
  {
    label: 'Asoke & Phrom Phong',
    level: 'recommended',
    reason_short: 'Upper-class residential with international community.',
    reason_long: 'Home to many embassies, luxury condos, and expat families. Well-maintained sidewalks, good lighting, and 24/7 security guards.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5600, 13.7300],
        [100.5750, 13.7300],
        [100.5750, 13.7400],
        [100.5600, 13.7400],
        [100.5600, 13.7300]
      ]]
    }
  },
  {
    label: 'Thonglor & Ekkamai',
    level: 'recommended',
    reason_short: 'Trendy neighborhood popular with locals and expats.',
    reason_long: 'Upscale dining and nightlife district frequented by Thai professionals. Generally safe but stay alert for drunk drivers late at night.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5750, 13.7200],
        [100.5950, 13.7200],
        [100.5950, 13.7350],
        [100.5750, 13.7350],
        [100.5750, 13.7200]
      ]]
    }
  },
  {
    label: 'Chatuchak Market Area',
    level: 'recommended',
    reason_short: 'Busy market with tourist police presence on weekends.',
    reason_long: 'Famous weekend market attracts huge crowds. Watch for pickpockets in crowded areas. Tourist police booth available for help.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5450, 13.7950],
        [100.5550, 13.7950],
        [100.5550, 13.8050],
        [100.5450, 13.8050],
        [100.5450, 13.7950]
      ]]
    }
  },
  {
    label: 'Ari & Saphan Khwai',
    level: 'recommended',
    reason_short: 'Hip local neighborhood with cafes and boutiques.',
    reason_long: 'Popular with young Thai professionals and digital nomads. Generally safe residential area with charming cafes and street food.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5350, 13.7750],
        [100.5450, 13.7750],
        [100.5450, 13.7850],
        [100.5350, 13.7850],
        [100.5350, 13.7750]
      ]]
    }
  },
  {
    label: 'Nana Plaza (late night)',
    level: 'avoid',
    reason_short: 'Harassment & pickpocket reports after bars close.',
    reason_long: 'Entertainment district that becomes less safe after midnight. Drunk tourists often targeted.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5570, 13.7380],
        [100.5600, 13.7380],
        [100.5600, 13.7410],
        [100.5570, 13.7410],
        [100.5570, 13.7380]
      ]]
    }
  },
  {
    label: 'Khlong Toei (after dark)',
    level: 'avoid',
    reason_short: 'Low-income area with higher crime rates at night.',
    reason_long: 'Industrial and residential area that tourists should avoid after dark. Not tourist-friendly.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5700, 13.7100],
        [100.5850, 13.7100],
        [100.5850, 13.7200],
        [100.5700, 13.7200],
        [100.5700, 13.7100]
      ]]
    }
  },
  {
    label: 'Khaosan Road (late night)',
    level: 'neutral',
    reason_short: 'Backpacker hub gets rowdy after midnight; watch drinks.',
    reason_long: 'Famous backpacker street with cheap accommodations and party scene. Drink spiking reported. Keep valuables secure and never leave drinks unattended.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.4970, 13.7580],
        [100.4990, 13.7580],
        [100.4990, 13.7600],
        [100.4970, 13.7600],
        [100.4970, 13.7580]
      ]]
    }
  },
  {
    label: 'Patpong Night Market',
    level: 'neutral',
    reason_short: 'Red-light district with aggressive touts and scams.',
    reason_long: 'Famous night market mixed with adult entertainment. Aggressive sellers, counterfeit goods, and overpricing common. Stay alert and bargain hard.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5320, 13.7280],
        [100.5350, 13.7280],
        [100.5350, 13.7300],
        [100.5320, 13.7300],
        [100.5320, 13.7280]
      ]]
    }
  },
  {
    label: 'Pratunam Market Area',
    level: 'neutral',
    reason_short: 'Crowded wholesale market; watch for pickpockets.',
    reason_long: 'Extremely crowded clothing market. Pickpockets operate in dense crowds. Keep bags in front and valuables secured.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5380, 13.7500],
        [100.5430, 13.7500],
        [100.5430, 13.7540],
        [100.5380, 13.7540],
        [100.5380, 13.7500]
      ]]
    }
  },
  {
    label: 'Chinatown (Yaowarat)',
    level: 'neutral',
    reason_short: 'Bustling at night but very crowded; watch belongings.',
    reason_long: 'Famous food street gets extremely crowded on weekends. Pickpockets work the crowds. Amazing food but keep valuables secure.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5020, 13.7380],
        [100.5130, 13.7380],
        [100.5130, 13.7430],
        [100.5020, 13.7430],
        [100.5020, 13.7380]
      ]]
    }
  },
  {
    label: 'Soi Cowboy',
    level: 'neutral',
    reason_short: 'Red-light district; scams and overcharging common.',
    reason_long: 'Small entertainment district known for nightlife. Overcharging, drink scams, and aggressive touts. Know prices beforehand.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5600, 13.7380],
        [100.5620, 13.7380],
        [100.5620, 13.7395],
        [100.5600, 13.7395],
        [100.5600, 13.7380]
      ]]
    }
  },
  {
    label: 'Khlong Toei Market (early morning)',
    level: 'neutral',
    reason_short: 'Busy wholesale market; congested with little lighting.',
    reason_long: 'Bangkok\'s largest fresh market operates 2am-9am. Dark, wet, crowded conditions. Go with a local guide if possible.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5680, 13.7180],
        [100.5720, 13.7180],
        [100.5720, 13.7220],
        [100.5680, 13.7220],
        [100.5680, 13.7180]
      ]]
    }
  },
  {
    label: 'Ramkhamhaeng Area (late night)',
    level: 'avoid',
    reason_short: 'Student area far from tourist zones; unsafe after dark.',
    reason_long: 'Large university area with little tourist infrastructure. Poorly lit side streets and limited English speakers. Avoid unless visiting locals.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.6100, 13.7500],
        [100.6250, 13.7500],
        [100.6250, 13.7650],
        [100.6100, 13.7650],
        [100.6100, 13.7500]
      ]]
    }
  },
  {
    label: 'Bang Khen (after dark)',
    level: 'avoid',
    reason_short: 'Residential suburbs with poor lighting and little security.',
    reason_long: 'Far from city center with limited public transport at night. Not tourist-friendly and difficult to navigate. Stay in central areas.',
    geom: {
      type: 'Polygon',
      coordinates: [[
        [100.5800, 13.8700],
        [100.6000, 13.8700],
        [100.6000, 13.8900],
        [100.5800, 13.8900],
        [100.5800, 13.8700]
      ]]
    }
  }
];

const bangkokPins = [
  {
    type: 'scam',
    title: 'Temple Closed Redirect',
    summary: 'Strangers claim temple is closed; redirect to gem shop.',
    details: 'Common near Grand Palace. Friendly locals tell you the temple is closed for a holiday and offer to take you to a "special government gem shop" instead. Politely decline and check for yourself.',
    location: {
      type: 'Point',
      coordinates: [100.4926, 13.7527]
    }
  },
  {
    type: 'overcharge',
    title: 'Airport Taxi Overcharge',
    summary: 'Quotes 5-10x normal rate; use Grab or metered taxi.',
    details: 'Unofficial taxi drivers approach tourists at airport. Always use the official taxi stand or Grab/Bolt app. Meter should start at 35 baht.',
    location: {
      type: 'Point',
      coordinates: [100.7501, 13.6900]
    }
  },
  {
    type: 'scam',
    title: 'Tuk-tuk "Lucky Buddha" Tour',
    summary: 'Driver offers cheap tour but pressures you to visit shops.',
    details: 'Very cheap tuk-tuk tour (20-40 baht) but driver gets commission from shops. You\'ll be pressured to buy overpriced goods. Stick to metered taxis or Grab.',
    location: {
      type: 'Point',
      coordinates: [100.4950, 13.7530]
    }
  },
  {
    type: 'harassment',
    title: 'Aggressive Street Vendors',
    summary: 'Vendors at tourist spots can be pushy; firm "no" works.',
    details: 'Common at Khao San Road and major temples. Say "mai ao" (don\'t want) firmly and keep walking.',
    location: {
      type: 'Point',
      coordinates: [100.4973, 13.7589]
    }
  },
  {
    type: 'scam',
    title: 'Jet Ski Rental Damage Scam',
    summary: 'Operators claim you damaged jet ski; demand large payment.',
    details: 'Take photos/video before and after rental. If pressured, call tourist police at 1155. This scam is more common in Pattaya/Phuket but can happen here too.',
    location: {
      type: 'Point',
      coordinates: [100.5200, 13.7400]
    }
  },
  {
    type: 'scam',
    title: 'Fake Monks Asking for Donations',
    summary: 'Men dressed as monks aggressively ask for money.',
    details: 'Real Buddhist monks do not ask for money directly, especially not in tourist areas. Genuine monks accept offerings at temples during morning alms rounds only.',
    location: {
      type: 'Point',
      coordinates: [100.5400, 13.7470]
    }
  },
  {
    type: 'scam',
    title: 'Taxi Meter "Broken"',
    summary: 'Driver claims meter is broken, quotes inflated price.',
    details: 'Near major hotels and tourist sites. Insist on meter or exit the taxi. Meter rate is 35 baht flag fall + 6-10 baht per km. Use Grab/Bolt if uncertain.',
    location: {
      type: 'Point',
      coordinates: [100.5340, 13.7480]
    }
  },
  {
    type: 'overcharge',
    title: 'Chatuchak Market Overpricing',
    summary: 'Vendors quote tourist prices 3-5x local rate.',
    details: 'Always bargain at Chatuchak Weekend Market. Start at 50% of asking price. Walk away if they won\'t negotiate - they\'ll often call you back.',
    location: {
      type: 'Point',
      coordinates: [100.5500, 13.8000]
    }
  },
  {
    type: 'scam',
    title: 'Massage Happy Ending Pressure',
    summary: 'Traditional massage turns into pressure for extra services.',
    details: 'Some massage parlors pressure clients for "special" services. Choose reputable spas with reviews. Say "mai chai" (no) firmly. Tourist police: 1155.',
    location: {
      type: 'Point',
      coordinates: [100.5580, 13.7390]
    }
  },
  {
    type: 'other',
    title: 'Motorbike Snatch & Grab',
    summary: 'Thieves on motorbikes grab phones and bags from pedestrians.',
    details: 'Common on Sukhumvit and quiet streets at night. Walk away from the road, keep phone and bag on the building side. Don\'t use phone while walking near traffic.',
    location: {
      type: 'Point',
      coordinates: [100.5650, 13.7350]
    }
  },
  {
    type: 'other',
    title: 'Pickpockets on Crowded BTS',
    summary: 'Thieves target phones and wallets during rush hour.',
    details: 'Peak times 7-9am and 5-7pm. Keep valuables in front pockets. Be extra alert at busy stations like Siam, Asok, and Phrom Phong.',
    location: {
      type: 'Point',
      coordinates: [100.5350, 13.7467]
    }
  },
  {
    type: 'other',
    title: 'Phone Theft at Rooftop Bars',
    summary: 'Phones left on tables stolen while owners enjoy views.',
    details: 'Popular at Sky Bar, Octave, and other rooftops. Never leave valuables unattended. Keep phone in zipped pocket, not on table.',
    location: {
      type: 'Point',
      coordinates: [100.5244, 13.7245]
    }
  },
  {
    type: 'scam',
    title: 'Friendly Stranger Bird Feed Scam',
    summary: 'Someone hands you birdseed, then demands payment.',
    details: 'At Sanam Luang and Lumpini Park. Don\'t accept anything from strangers. If pressured, say "mai ao kha/krap" and walk away quickly.',
    location: {
      type: 'Point',
      coordinates: [100.4950, 13.7550]
    }
  },
  {
    type: 'scam',
    title: 'Ping Pong Show Drink Bill Scam',
    summary: 'Free show turns into 10,000+ baht drink bill.',
    details: 'Patpong area scam. Touts offer free adult show, then you\'re charged 500+ baht per drink. Bouncers block exit until you pay. Avoid entirely or ask for written prices first.',
    location: {
      type: 'Point',
      coordinates: [100.5330, 13.7290]
    }
  },
  {
    type: 'overcharge',
    title: 'BTS/MRT Taxi Queue Premium',
    summary: 'Taxis at stations refuse meter, charge flat rate.',
    details: 'Common at Phaya Thai, Asok, and other major stations. Walk 100m away from station and hail a taxi on the street, or use Grab/Bolt.',
    location: {
      type: 'Point',
      coordinates: [100.5607, 13.7386]
    }
  },
  {
    type: 'harassment',
    title: 'Khao San Road Drink Spiking',
    summary: 'Reports of drinks being drugged at some bars.',
    details: 'Never leave drinks unattended. Order drinks directly from bartender. If drink tastes odd, discard immediately. Travel with friends at night.',
    location: {
      type: 'Point',
      coordinates: [100.4980, 13.7590]
    }
  },
  {
    type: 'scam',
    title: 'Gold Shop Bait and Switch',
    summary: 'Show quality gold, deliver low-grade imitation.',
    details: 'Only buy gold from certified shops with receipts. Avoid shops you\'re taken to by taxi/tuk-tuk drivers. Check for Thai Gold Traders Association membership.',
    location: {
      type: 'Point',
      coordinates: [100.5070, 13.7400]
    }
  },
  {
    type: 'scam',
    title: 'Friendly Card Game Invitation',
    summary: 'Stranger invites you home to meet family; leads to card game.',
    details: 'Common on Sukhumvit. Friendly Thai person befriends you, invites you home. You\'re lured into card game and lose thousands. Never go to someone\'s home you just met.',
    location: {
      type: 'Point',
      coordinates: [100.5550, 13.7310]
    }
  },
  {
    type: 'other',
    title: 'Beach Club Locker Theft',
    summary: 'Valuables stolen from unsecured lockers.',
    details: 'Use hotel safe instead. If using locker, bring your own lock. Never leave phone, wallet, or passport at beach clubs.',
    location: {
      type: 'Point',
      coordinates: [100.5180, 13.7380]
    }
  },
  {
    type: 'overcharge',
    title: 'Restaurant Tourist Menu Prices',
    summary: 'Different menu with inflated prices for foreigners.',
    details: 'Common in tourist areas. Ask to see menu with prices before ordering. Check prices match what you ordered on the bill. Use Google Maps reviews.',
    location: {
      type: 'Point',
      coordinates: [100.4965, 13.7585]
    }
  },
  {
    type: 'scam',
    title: 'Longtail Boat Overcharge',
    summary: 'Agree on 500 baht, charged 2000 at the end.',
    details: 'At piers near Wat Arun and Grand Palace. Get price in writing or show on phone. Share boats with other tourists to split cost. Tourist boats are often overpriced.',
    location: {
      type: 'Point',
      coordinates: [100.4893, 13.7437]
    }
  },
  {
    type: 'scam',
    title: 'Street Fortune Teller Curse',
    summary: 'Tells you that you\'re cursed, demands money to remove.',
    details: 'Near temples and tourist areas. Avoid engaging with street fortune tellers entirely. Real Thai fortune tellers work from small shops, not on the street.',
    location: {
      type: 'Point',
      coordinates: [100.4940, 13.7520]
    }
  },
  {
    type: 'other',
    title: 'Shopping Mall Distraction Theft',
    summary: 'One person distracts while another steals from your bag.',
    details: 'At MBK, Platinum, and Pratunam. Keep bags zipped and in front. Be wary of people who bump into you or drop things near you.',
    location: {
      type: 'Point',
      coordinates: [100.5330, 13.7448]
    }
  },
  {
    type: 'other',
    title: 'Tourist Police Booth - Siam',
    summary: 'Tourist police available 24/7 for help and complaints.',
    details: 'English-speaking officers can help with scams, theft reports, and emergencies. Hotline: 1155. Located near Siam BTS station.',
    location: {
      type: 'Point',
      coordinates: [100.5349, 13.7465]
    }
  },
  {
    type: 'other',
    title: 'Safe Crossing - Asoke Junction',
    summary: 'Use pedestrian bridge to cross safely.',
    details: 'One of Bangkok\'s busiest intersections. Always use the pedestrian skywalk. Crossing at street level is dangerous despite crosswalks.',
    location: {
      type: 'Point',
      coordinates: [100.5605, 13.7372]
    }
  },
  {
    type: 'other',
    title: 'Pharmacy & Medical - Bumrungrad Hospital',
    summary: 'International hospital with 24/7 emergency services.',
    details: 'English-speaking staff, accepts international insurance. For minor issues, pharmacies in Thailand can dispense many medications without prescription.',
    location: {
      type: 'Point',
      coordinates: [100.5651, 13.7442]
    }
  }
];

const bangkokRules = [
  { kind: 'do', title: 'Use Grab or Bolt', reason: 'Fixed pricing reduces overcharge risk.' },
  { kind: 'do', title: 'Dress modestly at temples', reason: 'Cover shoulders and knees; shows respect.' },
  { kind: 'do', title: 'Keep valuables secure', reason: 'Pickpockets target crowded tourist areas.' },
  { kind: 'do', title: 'Learn basic Thai phrases', reason: 'Locals appreciate effort; helps with navigation.' },
  { kind: 'do', title: 'Carry small bills', reason: 'Taxi and street vendor change is often limited.' },
  { kind: 'do', title: 'Use hotel safe for passport', reason: 'Keep copies on phone; originals secure.' },
  { kind: 'do', title: 'Stay hydrated', reason: 'Bangkok heat and humidity cause dehydration quickly.' },
  { kind: 'do', title: 'Bargain at markets', reason: 'Expected at street markets and smaller shops.' },
  { kind: 'do', title: 'Check taxi meter is running', reason: 'Should start at 35 baht when you begin trip.' },
  { kind: 'do', title: 'Download offline maps', reason: 'Internet can be unreliable in some areas.' },
  { kind: 'do', title: 'Take photos of tuk-tuk license', reason: 'Helpful if you need to file complaint.' },
  { kind: 'do', title: 'Bring sunscreen and umbrella', reason: 'Sun is intense; sudden rain showers common.' },
  { kind: 'do', title: 'Try street food carefully', reason: 'Choose busy stalls with high turnover for freshness.' },
  { kind: 'do', title: 'Save Tourist Police number (1155)', reason: 'English-speaking help available 24/7.' },
  { kind: 'do', title: 'Use BTS/MRT during rush hour', reason: 'Much faster than taxis in traffic.' },
  { kind: 'dont', title: 'Follow strangers to "closed" sites', reason: 'Classic redirect scam to shops.' },
  { kind: 'dont', title: 'Exchange money on street', reason: 'Counterfeit bills common; use banks or official booths.' },
  { kind: 'dont', title: 'Take unmarked taxis', reason: 'Overcharging guaranteed; use meter or app.' },
  { kind: 'dont', title: 'Touch anyone\'s head', reason: 'Culturally offensive; head is sacred.' },
  { kind: 'dont', title: 'Step on money or images of King', reason: 'Serious offense; can face legal consequences.' },
  { kind: 'dont', title: 'Point feet at Buddha statues', reason: 'Feet are considered lowest/dirtiest part.' },
  { kind: 'dont', title: 'Accept rides from unlicensed taxis', reason: 'No insurance coverage if accident occurs.' },
  { kind: 'dont', title: 'Leave drinks unattended', reason: 'Drink spiking reported in tourist nightlife areas.' },
  { kind: 'dont', title: 'Trust "closed temple" claims', reason: 'Verify yourself; likely a scam redirect.' },
  { kind: 'dont', title: 'Flash expensive jewelry/watches', reason: 'Attracts thieves, especially on motorbikes.' },
  { kind: 'dont', title: 'Take photos of locals without asking', reason: 'Polite to ask permission first; "thaai roop dai mai?"' },
  { kind: 'dont', title: 'Rent jet skis without documentation', reason: 'Damage scam very common at beaches.' },
  { kind: 'dont', title: 'Buy from persistent street sellers', reason: 'Overpriced and often counterfeit goods.' },
  { kind: 'dont', title: 'Go to upstairs bars with touts', reason: 'Drink bill scams extremely common.' },
  { kind: 'dont', title: 'Take unofficial "Grand Palace" tours', reason: 'Overpriced and unnecessary; easy to explore alone.' },
  { kind: 'dont', title: 'Accept free drinks from strangers', reason: 'Potential spiking or expectation of payment.' },
  { kind: 'dont', title: 'Walk alone in dark alleys late night', reason: 'Stick to main roads; use taxis after midnight.' },
  { kind: 'dont', title: 'Wear shoes inside temples/homes', reason: 'Always remove footwear at entrances.' },
  { kind: 'dont', title: 'Argue loudly with locals', reason: 'Losing face is serious; stay calm and respectful.' }
];

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Check if Bangkok already exists
    const { data: existingCity } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', 'bangkok')
      .single();

    let city;

    if (existingCity) {
      console.log('📍 Bangkok already exists, cleaning up old data...');
      
      // Delete old zones, pins, and rules for Bangkok
      await supabase.from('zones').delete().eq('city_id', existingCity.id);
      await supabase.from('pins').delete().eq('city_id', existingCity.id);
      await supabase.from('rules').delete().eq('city_id', existingCity.id);
      
      console.log('🧹 Cleaned up old Bangkok data');
      
      // Use existing city
      city = existingCity;
      console.log('✅ Using existing city: Bangkok');
    } else {
      // Insert Bangkok city
      const { data: newCity, error: cityError } = await supabase
        .from('cities')
        .insert({
          name: 'Bangkok',
          country: 'Thailand',
          slug: 'bangkok',
          supported: true
        })
        .select()
        .single();

      if (cityError) {
        console.error('Error inserting city:', cityError);
        return;
      }

      city = newCity;
      console.log('✅ Created city:', city.name);
    }

    // Insert zones
    const zonesWithCityId = bangkokZones.map(zone => ({
      ...zone,
      city_id: city.id
    }));

    const { error: zonesError } = await supabase
      .from('zones')
      .insert(zonesWithCityId);

    if (zonesError) {
      console.error('Error inserting zones:', zonesError);
    } else {
      console.log(`✅ Created ${bangkokZones.length} zones`);
    }

    // Insert pins
    const pinsWithCityId = bangkokPins.map(pin => ({
      ...pin,
      city_id: city.id,
      status: 'approved',
      source: 'curated'
    }));

    const { error: pinsError } = await supabase
      .from('pins')
      .insert(pinsWithCityId);

    if (pinsError) {
      console.error('Error inserting pins:', pinsError);
    } else {
      console.log(`✅ Created ${bangkokPins.length} pins`);
    }

    // Insert rules
    const rulesWithCityId = bangkokRules.map(rule => ({
      ...rule,
      city_id: city.id
    }));

    const { error: rulesError } = await supabase
      .from('rules')
      .insert(rulesWithCityId);

    if (rulesError) {
      console.error('Error inserting rules:', rulesError);
    } else {
      console.log(`✅ Created ${bangkokRules.length} rules`);
    }

    // Add other cities (without detailed data)
    const otherCities = [
      { name: 'Phuket', slug: 'phuket' },
      { name: 'Chiang Mai', slug: 'chiang-mai' },
      { name: 'Koh Samui', slug: 'koh-samui' }
    ];

    const { error: otherCitiesError } = await supabase
      .from('cities')
      .insert(otherCities.map(c => ({
        ...c,
        country: 'Thailand',
        supported: true
      })));

    if (otherCitiesError) {
      console.error('Error inserting other cities:', otherCitiesError);
    } else {
      console.log(`✅ Created ${otherCities.length} additional cities`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  }
}

// Run seed
seed();

