-- Add 10 more zones for Bangkok
-- Mix of large and small zones with different safety levels
-- Run this in Supabase SQL Editor

BEGIN;

-- Zone 6: Large - Sukhumvit Road Corridor (RECOMMENDED)
-- Covers major tourist-friendly area from Asoke to Phrom Phong
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1, 
  'Sukhumvit Corridor (Asoke to Phrom Phong)', 
  'recommended',
  'Well-developed tourist area with good transport and lower scam risk',
  'Sukhumvit Road from Asoke to Phrom Phong is a major tourist corridor with excellent BTS access, international hotels, and reputable businesses. Lower incidence of scams compared to other areas. Many expats and long-term travelers stay here. Still exercise normal caution with taxis and street vendors.',
  ST_GeomFromText('POLYGON((100.5400 13.7300, 100.5700 13.7300, 100.5700 13.7500, 100.5400 13.7500, 100.5400 13.7300))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 7: Large - Old City / Rattanakosin (CAUTION)
-- Covers historic center with many tourist attractions and scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Rattanakosin (Old City)',
  'caution',
  'Historic area with high tourist density and frequent scams',
  'The old city area including Grand Palace, Wat Pho, Wat Arun, and surrounding streets sees heavy tourist traffic. High concentration of tuk-tuk scams, gem shop scams, and overcharging. Many drivers refuse meters. Exercise extra caution, especially around temple areas. Use BTS to Saphan Taksin and take boat to avoid ground transport scams.',
  ST_GeomFromText('POLYGON((100.4850 13.7400, 100.5050 13.7400, 100.5050 13.7600, 100.4850 13.7600, 100.4850 13.7400))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 8: Large - Silom Business District (RECOMMENDED)
-- Financial district, generally safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Silom Business District',
  'recommended',
  'Financial district with good security and lower tourist scam activity',
  'Silom Road and surrounding business district is well-policed and generally safe. Lower tourist scam activity as it caters more to business travelers and locals. Good BTS/MRT connections. Patpong Night Market area (within this zone) has some touts but generally safe. Exercise normal caution at night.',
  ST_GeomFromText('POLYGON((100.5150 13.7200, 100.5400 13.7200, 100.5400 13.7400, 100.5150 13.7400, 100.5150 13.7200))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 9: Medium - Phrom Phong / EmQuartier (RECOMMENDED)
-- Upscale shopping area
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Phrom Phong / EmQuartier',
  'recommended',
  'Upscale shopping district, very safe and tourist-friendly',
  'Phrom Phong area around EmQuartier and Emporium malls is an upscale shopping district. Very safe, well-maintained, and tourist-friendly. Excellent BTS access. Lower scam risk. Many high-end hotels and restaurants. One of the safest areas for tourists.',
  ST_GeomFromText('POLYGON((100.5600 13.7300, 100.5700 13.7300, 100.5700 13.7400, 100.5600 13.7400, 100.5600 13.7300))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 10: Medium - Asoke / Terminal 21 (NEUTRAL)
-- Busy intersection, generally safe but watch for scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Asoke Intersection / Terminal 21',
  'neutral',
  'Busy commercial area, generally safe but watch for taxi scams',
  'Asoke intersection is a major transport hub with BTS and MRT connections. Terminal 21 mall is popular with tourists. Generally safe but taxi drivers at the intersection often refuse meters. Use BTS/MRT when possible. Some touts around the area but less aggressive than other tourist zones.',
  ST_GeomFromText('POLYGON((100.5450 13.7350, 100.5550 13.7350, 100.5550 13.7450, 100.5450 13.7450, 100.5450 13.7350))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 11: Small - Soi Cowboy Area (CAUTION)
-- Red light district, some scams and harassment
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Soi Cowboy Area',
  'caution',
  'Entertainment area with some scams and aggressive touts',
  'Soi Cowboy is a short entertainment street off Sukhumvit. While generally safe, there are aggressive touts, overpriced drinks, and some taxi scams. Best to avoid if not your scene. If visiting, be aware of drink prices and taxi meter refusal.',
  ST_GeomFromText('POLYGON((100.5500 13.7380, 100.5520 13.7380, 100.5520 13.7420, 100.5500 13.7420, 100.5500 13.7380))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 12: Small - Patpong Night Market (CAUTION)
-- Night market with some scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Patpong Night Market',
  'caution',
  'Night market area with overpricing and some aggressive vendors',
  'Patpong Night Market is popular with tourists but known for aggressive vendors and overpricing. Negotiate hard (start at 30-40% of asking price). Some vendors may try to switch items after negotiation. Generally safe but be assertive. Watch for pickpockets in crowds.',
  ST_GeomFromText('POLYGON((100.5200 13.7250, 100.5250 13.7250, 100.5250 13.7300, 100.5200 13.7300, 100.5200 13.7250))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 13: Small - Victory Monument (NEUTRAL)
-- Transport hub, generally safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Victory Monument Area',
  'neutral',
  'Major transport hub, generally safe but watch for pickpockets',
  'Victory Monument is a major bus and BTS hub. Generally safe area with good food options and local shopping. Watch for pickpockets in crowded areas, especially around the monument and bus stops. Taxi drivers here are generally more honest than tourist areas.',
  ST_GeomFromText('POLYGON((100.5400 13.7650, 100.5450 13.7650, 100.5450 13.7700, 100.5400 13.7700, 100.5400 13.7650))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 14: Small - Thonglor / Ekkamai (RECOMMENDED)
-- Trendy area, very safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Thonglor / Ekkamai',
  'recommended',
  'Trendy expat area, very safe with excellent food and nightlife',
  'Thonglor (Sukhumvit Soi 55) and Ekkamai (Soi 63) are trendy areas popular with expats and locals. Excellent restaurants, cafes, and nightlife. Very safe, minimal scam activity. Good BTS access. Higher prices but worth it for quality and safety.',
  ST_GeomFromText('POLYGON((100.5750 13.7200, 100.5850 13.7200, 100.5850 13.7300, 100.5750 13.7300, 100.5750 13.7200))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 15: Small - Lumpini Park Area (RECOMMENDED)
-- Park and surrounding area, very safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Lumpini Park Area',
  'recommended',
  'Park and surrounding business district, very safe and pleasant',
  'Lumpini Park and surrounding Silom/Sathorn area is one of the safest in Bangkok. Well-maintained park, good for jogging and exercise. Surrounding area has good restaurants and is popular with expats. Minimal scam activity. Excellent for families.',
  ST_GeomFromText('POLYGON((100.5350 13.7250, 100.5450 13.7250, 100.5450 13.7350, 100.5350 13.7350, 100.5350 13.7250))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 16: Large - Don Mueang Airport Area (NEUTRAL)
-- Airport area, generally safe but watch for taxi scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Don Mueang Airport Area',
  'neutral',
  'Airport area, generally safe but watch for unauthorized taxis',
  'Don Mueang Airport (domestic flights) area is generally safe. Use official taxi counters inside terminal. Avoid unauthorized taxis offering rides outside. Some overcharging reported. Good public transport connections via A1/A2 buses to BTS/MRT.',
  ST_GeomFromText('POLYGON((100.6000 13.9000, 100.6200 13.9000, 100.6200 13.9200, 100.6000 13.9200, 100.6000 13.9000))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 17: Large - Thonburi / West Bank (NEUTRAL)
-- Less touristy, generally safer but less English spoken
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Thonburi West Bank',
  'neutral',
  'Local residential area, generally safe but less tourist infrastructure',
  'Thonburi side of the river is more residential and less touristy. Generally safer with lower scam activity, but less English spoken and fewer tourist amenities. Good for authentic local experience. Use ferry or BTS Gold Line to access. Some areas can be quiet at night.',
  ST_GeomFromText('POLYGON((100.4600 13.7200, 100.4850 13.7200, 100.4850 13.7500, 100.4600 13.7500, 100.4600 13.7200))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 18: Medium - Ramkhamhaeng University Area (RECOMMENDED)
-- Student area, generally safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Ramkhamhaeng University Area',
  'recommended',
  'Student area with affordable food and generally safe environment',
  'Area around Ramkhamhaeng University is popular with students and locals. Very affordable food, good street food scene, and generally safe. Lower tourist scam activity. Good for budget travelers. ARL (Airport Rail Link) connects to city center.',
  ST_GeomFromText('POLYGON((100.6000 13.7500, 100.6150 13.7500, 100.6150 13.7650, 100.6000 13.7650, 100.6000 13.7500))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 19: Small - Lat Krabang / Suvarnabhumi Airport (CAUTION)
-- Airport area with many scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Suvarnabhumi Airport / Lat Krabang',
  'caution',
  'Airport area with high scam activity, especially unauthorized taxis',
  'Suvarnabhumi Airport area has many scams targeting arriving tourists. Unauthorized taxis in terminal charge 3-5x normal rates. Always use official taxi counter on level 1. Some hotels in Lat Krabang area have mixed reviews. Use Airport Rail Link (ARL) to city center for safety.',
  ST_GeomFromText('POLYGON((100.7400 13.6800, 100.7600 13.6800, 100.7600 13.7000, 100.7400 13.7000, 100.7400 13.6800))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 20: Large - Bang Na / Eastern Bangkok (NEUTRAL)
-- Suburban area, generally safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Bang Na / Eastern Suburbs',
  'neutral',
  'Suburban area, generally safe but less tourist infrastructure',
  'Bang Na and eastern suburbs are residential areas with shopping malls like Mega Bangna. Generally safe with lower tourist scam activity. Good for families and long-term stays. Less English spoken. BTS extension reaches some areas.',
  ST_GeomFromText('POLYGON((100.6000 13.6500, 100.6500 13.6500, 100.6500 13.7000, 100.6000 13.7000, 100.6000 13.6500))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 21: Medium - Phra Khanong / On Nut (RECOMMENDED)
-- Affordable expat area, very safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Phra Khanong / On Nut',
  'recommended',
  'Affordable expat area, very safe with good food scene',
  'Phra Khanong and On Nut (Sukhumvit Soi 77) are popular with budget-conscious expats and long-term travelers. Excellent street food, affordable accommodation, and very safe. Good BTS access. Minimal scam activity. Great local vibe.',
  ST_GeomFromText('POLYGON((100.5850 13.7100, 100.6000 13.7100, 100.6000 13.7250, 100.5850 13.7250, 100.5850 13.7100))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 22: Small - Ratchada / Huai Khwang (CAUTION)
-- Nightlife area with some scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Ratchada / Huai Khwang',
  'caution',
  'Nightlife area with some taxi scams and overcharging',
  'Ratchada Road and Huai Khwang area has night markets and nightlife. Some taxi meter refusal and overcharging reported, especially at night. Ratchada Train Night Market is popular but negotiate prices. Exercise caution with late-night transport.',
  ST_GeomFromText('POLYGON((100.5700 13.7600, 100.5850 13.7600, 100.5850 13.7750, 100.5700 13.7750, 100.5700 13.7600))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 23: Large - Northern Bangkok / Chatuchak Extended (NEUTRAL)
-- Large residential and market area
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Northern Bangkok / Chatuchak Extended',
  'neutral',
  'Large residential area with markets, generally safe but watch for pickpockets',
  'Northern Bangkok area including extended Chatuchak district is mostly residential with local markets. Generally safe but watch for pickpockets in crowded markets. Lower tourist scam activity. Good MRT access. More authentic local experience.',
  ST_GeomFromText('POLYGON((100.5500 13.8000, 100.5800 13.8000, 100.5800 13.8300, 100.5500 13.8300, 100.5500 13.8000))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 24: Small - Saphan Phut / Pak Khlong Market (CAUTION)
-- Flower market area, some scams
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Saphan Phut / Pak Khlong Flower Market',
  'caution',
  'Market area with some overcharging and aggressive vendors',
  'Pak Khlong Talat (flower market) and Saphan Phut area is popular for night photography. Some aggressive vendors and overcharging reported. Taxi drivers in area may refuse meters. Exercise caution, especially at night. Beautiful area but negotiate prices firmly.',
  ST_GeomFromText('POLYGON((100.5000 13.7350, 100.5100 13.7350, 100.5100 13.7450, 100.5000 13.7450, 100.5000 13.7350))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 25: Medium - Ari / Sanam Pao (RECOMMENDED)
-- Trendy local area, very safe
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Ari / Sanam Pao',
  'recommended',
  'Trendy local neighborhood, very safe with excellent food',
  'Ari (BTS station) and Sanam Pao area is a trendy neighborhood popular with young Thais and expats. Excellent cafes, restaurants, and local vibe. Very safe, minimal scam activity. Good BTS access. Great for experiencing modern Bangkok lifestyle.',
  ST_GeomFromText('POLYGON((100.5400 13.7750, 100.5500 13.7750, 100.5500 13.7850, 100.5400 13.7850, 100.5400 13.7750))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 26: Small - Nana Plaza / Soi 4 (AVOID)
-- High risk area with persistent scams and harassment
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Nana Plaza / Sukhumvit Soi 4',
  'avoid',
  'High risk area with aggressive scams, harassment, and safety concerns',
  'Sukhumvit Soi 4 (Nana) has the highest concentration of tourist scams in Bangkok. Aggressive touts who physically grab tourists, persistent taxi meter refusal, overcharging, and harassment. Multiple reports of incidents. Avoid walking alone here, especially at night. Use BTS to avoid ground level.',
  ST_GeomFromText('POLYGON((100.5520 13.7380, 100.5570 13.7380, 100.5570 13.7430, 100.5520 13.7430, 100.5520 13.7380))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 27: Small - Klong Toey Slum Area (AVOID)
-- High crime area, not safe for tourists
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Klong Toey Slum Area',
  'avoid',
  'High crime area, not safe for tourists especially at night',
  'Klong Toey is a large slum area with high crime rates. Not safe for tourists, especially after dark. Multiple reports of theft, muggings, and incidents. Avoid this area entirely. No tourist attractions here anyway.',
  ST_GeomFromText('POLYGON((100.5600 13.7100, 100.5700 13.7100, 100.5700 13.7200, 100.5600 13.7200, 100.5600 13.7100))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 28: Medium - Khlong San / Old Market Area (AVOID)
-- High incident area with scams and safety issues
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Khlong San Old Market Area',
  'avoid',
  'High incident area with persistent scams and safety concerns',
  'Khlong San area has multiple reports of aggressive scams, pickpocketing, and incidents. Market vendors are known for aggressive tactics and overcharging. Taxi drivers refuse meters consistently. Multiple tourist incidents reported. Best to avoid this area.',
  ST_GeomFromText('POLYGON((100.5000 13.7200, 100.5100 13.7200, 100.5100 13.7300, 100.5000 13.7300, 100.5000 13.7200))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 29: Small - Soi Nana / Soi 3 (AVOID)
-- Known scam hotspot
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Soi Nana / Sukhumvit Soi 3',
  'avoid',
  'Known scam hotspot with high incident density',
  'Sukhumvit Soi 3 (Soi Nana) has very high scam activity. Persistent gem shop scams, tuk-tuk tours that take hours, and aggressive touts. Multiple reports of tourists being scammed here. High incident density. Avoid this area if possible.',
  ST_GeomFromText('POLYGON((100.5480 13.7380, 100.5520 13.7380, 100.5520 13.7420, 100.5480 13.7420, 100.5480 13.7380))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 30: Medium - Pratunam Market Area (AVOID)
-- High scam and pickpocket area
INSERT INTO public.zones (
  city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1,
  'Pratunam Market Area',
  'avoid',
  'High pickpocket and scam activity, especially in crowded market',
  'Pratunam Market area has very high pickpocket activity and aggressive vendor scams. Multiple reports of theft and overcharging. Extremely crowded making it easy for pickpockets. Taxi drivers here consistently refuse meters. High incident reports. Exercise extreme caution or avoid.',
  ST_GeomFromText('POLYGON((100.5350 13.7500, 100.5450 13.7500, 100.5450 13.7600, 100.5350 13.7600, 100.5350 13.7500))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- ============================================
-- TIPS AND TRICKS (20 tips across Bangkok)
-- ============================================

-- Tip 1: ATM Safety - Siam Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use ATMs Inside Banks for Safety - Siam',
  'Avoid standalone ATMs at night, especially in tourist areas like Siam',
  'ATMs inside banks (especially during banking hours) are safer. Skimming devices are less common. Avoid ATMs in dark alleys or tourist-only areas. Check for card skimmers before using. Siam area has many bank ATMs.',
  ST_GeomFromText('POINT(100.5350 13.7450)', 4326),
  ST_GeomFromText('POINT(100.5350 13.7450)', 4326),
  'approved',
  NOW()
);

-- Tip 2: BTS/MRT is Safest Transport - Sukhumvit
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'BTS SkyTrain is Safest Transport - Sukhumvit Line',
  'Use BTS or MRT to avoid taxi/tuk-tuk scams on Sukhumvit',
  'BTS SkyTrain and MRT are the safest and most reliable transport. Fixed prices, no scams, air-conditioned. Much better than negotiating with taxis or tuk-tuks. Get a Rabbit card for convenience. Sukhumvit line connects major tourist areas.',
  ST_GeomFromText('POINT(100.5600 13.7350)', 4326),
  ST_GeomFromText('POINT(100.5600 13.7350)', 4326),
  'approved',
  NOW()
);

-- Tip 3: Street Food Safety - Yaowarat (Chinatown)
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Street Food Safety - Yaowarat (Chinatown)',
  'Best street food area, generally safe and clean',
  'Yaowarat Road (Chinatown) has excellent street food that locals eat. Generally very safe. Look for stalls with high turnover and locals eating there. Avoid raw seafood if you have sensitive stomach. Best visited in evening.',
  ST_GeomFromText('POINT(100.5100 13.7380)', 4326),
  ST_GeomFromText('POINT(100.5100 13.7380)', 4326),
  'approved',
  NOW()
);

-- Tip 4: Temple Dress Code - Grand Palace Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'do_dont',
  'Temple Dress Code - Grand Palace & Wat Pho',
  'Respect temple dress codes to avoid being denied entry',
  'All temples require covered shoulders and knees (both men and women). You can rent/buy sarongs at temple entrances (usually 100-200 baht). Better to bring your own. Showing respect helps avoid issues with staff. Grand Palace is strictest.',
  ST_GeomFromText('POINT(100.4925 13.7500)', 4326),
  ST_GeomFromText('POINT(100.4925 13.7500)', 4326),
  'approved',
  NOW()
);

-- Tip 5: Grab App is Safer - Khao San Road
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use Grab App Instead of Hailing Taxis - Khao San',
  'Grab app shows fixed price, prevents meter refusal scams',
  'Grab (Thailand version of Uber) shows fixed prices before booking, preventing meter refusal and route scams. Usually cheaper than taxis. Download before arriving. Works better than Uber in Bangkok. Essential around Khao San where taxis refuse meters.',
  ST_GeomFromText('POINT(100.4960 13.7610)', 4326),
  ST_GeomFromText('POINT(100.4960 13.7610)', 4326),
  'approved',
  NOW()
);

-- Tip 6: ATM Safety - Sukhumvit Soi 11
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use ATMs Inside Banks - Sukhumvit Soi 11',
  'Avoid standalone ATMs at night in tourist areas',
  'ATMs inside banks are safer from skimming. Sukhumvit Soi 11 has many standalone ATMs that are riskier. Walk to a bank branch instead. Check for any suspicious devices attached to ATM before using.',
  ST_GeomFromText('POINT(100.5550 13.7400)', 4326),
  ST_GeomFromText('POINT(100.5550 13.7400)', 4326),
  'approved',
  NOW()
);

-- Tip 7: Street Food Safety - Victory Monument
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Excellent Street Food - Victory Monument',
  'Local food hub with authentic and safe street food',
  'Victory Monument area has excellent street food popular with locals. Very affordable and generally safe. Look for busy stalls with locals. Good variety of Thai dishes. Less touristy than other areas.',
  ST_GeomFromText('POINT(100.5420 13.7670)', 4326),
  ST_GeomFromText('POINT(100.5420 13.7670)', 4326),
  'approved',
  NOW()
);

-- Tip 8: BTS/MRT Safety - Chatuchak Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Use MRT to Chatuchak Market - Avoid Taxi Scams',
  'MRT directly connects to Chatuchak, avoid taxi meter refusal',
  'Chatuchak Market is directly accessible via MRT (Kamphaeng Phet station). Avoid taxis which often refuse meters for this route. MRT is air-conditioned and much cheaper. Market is huge, arrive early to avoid crowds.',
  ST_GeomFromText('POINT(100.5570 13.8000)', 4326),
  ST_GeomFromText('POINT(100.5570 13.8000)', 4326),
  'approved',
  NOW()
);

-- Tip 9: Grab App - Airport to City
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use Grab from Suvarnabhumi Airport',
  'Grab app prevents airport taxi scams',
  'From Suvarnabhumi Airport, use Grab app instead of airport taxis. Shows fixed price (usually 300-400 baht to city). Avoid unauthorized taxis in terminal. Grab pickup is on level 1. Much safer than negotiating with drivers.',
  ST_GeomFromText('POINT(100.7520 13.6890)', 4326),
  ST_GeomFromText('POINT(100.7520 13.6890)', 4326),
  'approved',
  NOW()
);

-- Tip 10: Temple Dress Code - Wat Arun
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'do_dont',
  'Temple Dress Code - Wat Arun',
  'Cover shoulders and knees for temple visits',
  'Wat Arun (Temple of Dawn) requires proper dress. Cover shoulders and knees. Can rent sarong at entrance if needed. Best visited early morning or sunset. Take ferry from Tha Tien pier.',
  ST_GeomFromText('POINT(100.4880 13.7430)', 4326),
  ST_GeomFromText('POINT(100.4880 13.7430)', 4326),
  'approved',
  NOW()
);

-- Tip 11: Street Food - On Nut Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Affordable Street Food - On Nut',
  'Budget-friendly area with excellent local food',
  'On Nut (Sukhumvit Soi 77) has excellent and affordable street food. Popular with expats and locals. Very safe area. Good BTS access. Great for budget travelers looking for authentic Thai food.',
  ST_GeomFromText('POINT(100.5920 13.7150)', 4326),
  ST_GeomFromText('POINT(100.5920 13.7150)', 4326),
  'approved',
  NOW()
);

-- Tip 12: ATM Safety - MBK/Siam Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use Bank ATMs - MBK Shopping Area',
  'Safer to use ATMs inside banks near shopping malls',
  'MBK and Siam area have many bank branches with ATMs inside. Much safer than standalone machines. Avoid ATMs in dark corners of shopping centers. Check for skimming devices before using.',
  ST_GeomFromText('POINT(100.5320 13.7440)', 4326),
  ST_GeomFromText('POINT(100.5320 13.7440)', 4326),
  'approved',
  NOW()
);

-- Tip 13: BTS/MRT - Silom Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Use BTS/MRT in Silom - Avoid Traffic',
  'Silom has excellent BTS and MRT connections, avoid taxis',
  'Silom area has both BTS (Sala Daeng) and MRT (Silom) stations. Much faster than taxis in traffic. Avoid taxi meter refusal by using public transport. Very convenient for business district.',
  ST_GeomFromText('POINT(100.5350 13.7280)', 4326),
  ST_GeomFromText('POINT(100.5350 13.7280)', 4326),
  'approved',
  NOW()
);

-- Tip 14: Street Food - Ari Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Trendy Street Food - Ari Neighborhood',
  'Modern cafes and street food in trendy area',
  'Ari area has mix of trendy cafes and excellent street food. Popular with young Thais and expats. Very safe area. Good BTS access. Great for experiencing modern Bangkok food scene.',
  ST_GeomFromText('POINT(100.5450 13.7800)', 4326),
  ST_GeomFromText('POINT(100.5450 13.7800)', 4326),
  'approved',
  NOW()
);

-- Tip 15: Grab App - Thonglor Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use Grab in Thonglor - Avoid Taxi Scams',
  'Thonglor taxis often refuse meters, use Grab instead',
  'Thonglor area has many taxis that refuse meters, especially at night. Use Grab app for fixed prices. Shows route and price upfront. Much more reliable than hailing taxis in this area.',
  ST_GeomFromText('POINT(100.5800 13.7250)', 4326),
  ST_GeomFromText('POINT(100.5800 13.7250)', 4326),
  'approved',
  NOW()
);

-- Tip 16: Temple Etiquette - Wat Saket (Golden Mount)
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'do_dont',
  'Temple Etiquette - Wat Saket',
  'Respectful behavior at temples',
  'Wat Saket (Golden Mount) requires covered shoulders and knees. Remove shoes before entering buildings. Don''t point feet at Buddha images. Speak quietly. Best visited early morning for cooler weather and fewer crowds.',
  ST_GeomFromText('POINT(100.5050 13.7530)', 4326),
  ST_GeomFromText('POINT(100.5050 13.7530)', 4326),
  'approved',
  NOW()
);

-- Tip 17: Street Food - Phra Khanong
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Local Street Food - Phra Khanong',
  'Authentic local food scene, very affordable',
  'Phra Khanong has excellent local street food popular with expats. Very affordable and authentic. Less touristy. Good BTS access. Great for budget travelers. Many food stalls along Sukhumvit Road.',
  ST_GeomFromText('POINT(100.5900 13.7150)', 4326),
  ST_GeomFromText('POINT(100.5900 13.7150)', 4326),
  'approved',
  NOW()
);

-- Tip 18: ATM Safety - Asoke Area
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'scam',
  'Use Bank ATMs - Asoke Intersection',
  'Safer ATMs inside banks near major intersection',
  'Asoke intersection has many bank branches. Use ATMs inside banks rather than standalone machines. Terminal 21 mall has bank ATMs on lower floors. Much safer from skimming devices.',
  ST_GeomFromText('POINT(100.5500 13.7400)', 4326),
  ST_GeomFromText('POINT(100.5500 13.7400)', 4326),
  'approved',
  NOW()
);

-- Tip 19: BTS/MRT - Phrom Phong
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'BTS Access - Phrom Phong Shopping',
  'Excellent BTS connection to upscale shopping area',
  'Phrom Phong BTS station connects directly to EmQuartier and Emporium malls. Much better than taxis. Avoid taxi meter refusal by using BTS. Very convenient and air-conditioned. Rabbit card recommended.',
  ST_GeomFromText('POINT(100.5650 13.7350)', 4326),
  ST_GeomFromText('POINT(100.5650 13.7350)', 4326),
  'approved',
  NOW()
);

-- Tip 20: Street Food - Ratchada Night Market
INSERT INTO public.tip_submissions (
  user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  NULL, 1, 'stay',
  'Night Market Food - Ratchada Train Market',
  'Excellent night market food, negotiate prices',
  'Ratchada Train Night Market has great street food. Very popular with locals and tourists. Negotiate prices (start at 30-40% of asking). Watch for pickpockets in crowds. Best visited Thursday-Sunday evenings. MRT to Thailand Cultural Centre.',
  ST_GeomFromText('POINT(100.5770 13.7680)', 4326),
  ST_GeomFromText('POINT(100.5770 13.7680)', 4326),
  'approved',
  NOW()
);

COMMIT;

-- Verify all new zones and tips
SELECT 
  'Zones' as type,
  COUNT(*) as count
FROM public.zones
WHERE city_id = 1
UNION ALL
SELECT 
  'Tips' as type,
  COUNT(*) as count
FROM public.tip_submissions
WHERE city_id = 1 AND status = 'approved';

-- Show sample of new tips
SELECT 
  id,
  title,
  category,
  ST_AsText(location) as location
FROM public.tip_submissions
WHERE city_id = 1 AND status = 'approved'
ORDER BY id DESC
LIMIT 20;

