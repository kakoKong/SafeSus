-- Seed script for Bangkok with zones, pins, tips, and incidents
-- NOTE: Schema currently has 4 zone levels: 'avoid', 'caution', 'neutral', 'recommended'
-- For 5 levels, you may want to add 'very_safe' or modify the schema

BEGIN;

-- 1. Insert Bangkok city
INSERT INTO public.cities (id, name, country, slug, supported, timezone, created_at)
VALUES (
  1,
  'Bangkok',
  'Thailand',
  'bangkok',
  true,
  'Asia/Bangkok',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  country = EXCLUDED.country,
  slug = EXCLUDED.slug,
  supported = EXCLUDED.supported,
  timezone = EXCLUDED.timezone;

-- Reset sequences if needed
SELECT setval('cities_id_seq', COALESCE((SELECT MAX(id) FROM public.cities), 1), true);

-- 2. Insert Zones (Polygons covering different Bangkok areas)
-- Zone 1: Khao San Road area - CAUTION (high tourist scam activity)
INSERT INTO public.zones (
  id, city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  1, 1, 'Khao San Road Area', 'caution',
  'High tourist density, frequent scams and overcharging',
  'Khao San Road and surrounding areas see heavy tourist traffic. Common issues include taxi scams, overpriced tuk-tuks, gem shop scams, and aggressive touts. Exercise caution especially at night.',
  ST_GeomFromText('POLYGON((100.4930 13.7580, 100.4980 13.7580, 100.4980 13.7650, 100.4930 13.7650, 100.4930 13.7580))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 2: Sukhumvit Soi 4 (Nana) - AVOID (known for scams and harassment)
INSERT INTO public.zones (
  id, city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  2, 1, 'Nana Plaza Area', 'avoid',
  'High risk area with scams and harassment',
  'Sukhumvit Soi 4 (Nana) area is known for tourist scams, aggressive touts, and potential safety issues. Avoid walking alone at night. Taxi and tuk-tuk drivers here frequently overcharge.',
  ST_GeomFromText('POLYGON((100.5520 13.7380, 100.5570 13.7380, 100.5570 13.7430, 100.5520 13.7430, 100.5520 13.7380))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 3: Chatuchak Weekend Market - NEUTRAL (generally safe, watch pickpockets)
INSERT INTO public.zones (
  id, city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  3, 1, 'Chatuchak Market Area', 'neutral',
  'Generally safe but watch for pickpockets in crowds',
  'Chatuchak Weekend Market is safe overall but crowded. Main risks are pickpocketing and minor overcharging. Keep valuables secure and negotiate prices.',
  ST_GeomFromText('POLYGON((100.5540 13.7980, 100.5600 13.7980, 100.5600 13.8030, 100.5540 13.8030, 100.5540 13.7980))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 4: MBK/Siam area - RECOMMENDED (tourist-friendly, generally safe)
INSERT INTO public.zones (
  id, city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  4, 1, 'Siam Shopping District', 'recommended',
  'Tourist-friendly area with good transport links and lower scam risk',
  'MBK, Siam Paragon, and CentralWorld area is well-developed for tourism. Lower scam risk, good BTS connections, and generally safe. Still exercise normal caution.',
  ST_GeomFromText('POLYGON((100.5300 13.7420, 100.5400 13.7420, 100.5400 13.7480, 100.5300 13.7480, 100.5300 13.7420))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Zone 5: Grand Palace area - CAUTION (tourist scam hotspot)
INSERT INTO public.zones (
  id, city_id, label, level, reason_short, reason_long, geom, verified_by, created_at, updated_at
)
VALUES (
  5, 1, 'Grand Palace & Wat Pho', 'caution',
  'Heavy tourist area with frequent closure scams and overcharging',
  'Popular tourist destination but known for "temple closure" scams where touts claim temples are closed and redirect you to gem shops. Tuk-tuk and taxi drivers often refuse meter here.',
  ST_GeomFromText('POLYGON((100.4900 13.7450, 100.5000 13.7450, 100.5000 13.7520, 100.4900 13.7520, 100.4900 13.7450))', 4326),
  NULL,
  NOW(),
  NOW()
);

-- Reset zone sequence
SELECT setval('zones_id_seq', COALESCE((SELECT MAX(id) FROM public.zones), 1), true);

-- 3. Insert Pins (Approved map points with locations)

-- Pin 1: Gem shop scam near Grand Palace
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  1, 1, 'scam',
  'Gem Shop Scam - Grand Palace Area',
  'Tuk-tuk drivers tell you the palace is closed and take you to gem shops',
  'Common scam: Drivers claim Grand Palace/Wat Pho is closed for ceremony and offer to take you on a "special tour". They take you to gem shops with inflated prices. Always check temple opening hours yourself.',
  ST_GeomFromText('POINT(100.4925 13.7500)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Pin 2: Taxi meter refusal - Khao San Road
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  2, 1, 'overcharge',
  'Taxi Meter Refusal - Khao San Road',
  'Taxi drivers refuse to use meter and charge 300-500 baht for short trips',
  'Many taxis parked near Khao San Road refuse to turn on the meter and quote inflated prices (300-500 baht for trips that should cost 50-100 baht). Walk a block away to hail a moving taxi.',
  ST_GeomFromText('POINT(100.4960 13.7610)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Pin 3: Aggressive touts - Nana Plaza
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  3, 1, 'harassment',
  'Aggressive Touts - Sukhumvit Soi 4',
  'Persistent touts and harassment in this area, especially at night',
  'Sukhumvit Soi 4 (Nana) has very aggressive touts who follow you and may grab your arm. Best to avoid walking alone here at night. Ignore and keep walking.',
  ST_GeomFromText('POINT(100.5540 13.7400)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Pin 4: Overpriced tuk-tuk tour - Wat Pho area
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  4, 1, 'overcharge',
  'Tuk-tuk Tour Scam - Wat Pho',
  'Tuk-tuk drivers offer "cheap tours" but take you to expensive shops',
  'Drivers offer tours for 20-40 baht (too cheap to be true). They make money from commission at jewelry/gem/suit shops they take you to. Tours can take hours.',
  ST_GeomFromText('POINT(100.4940 13.7460)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Pin 5: Pickpocket hotspot - Chatuchak Market
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  5, 1, 'other',
  'Pickpocket Alert - Chatuchak Market',
  'High pickpocket activity in crowded market areas',
  'Chatuchak Weekend Market gets extremely crowded. Multiple reports of pickpocketing, especially in the narrow alleys. Keep bags in front, wallets in front pockets, be vigilant.',
  ST_GeomFromText('POINT(100.5570 13.8000)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Pin 6: Fake taxi - Airport to city
INSERT INTO public.pins (
  id, city_id, type, title, summary, details, location, status, source, verified_by, created_at
)
VALUES (
  6, 1, 'scam',
  'Fake Taxi Scam - Suvarnabhumi Airport',
  'Unauthorized taxis at airport charge 3-5x normal rates',
  'At Suvarnabhumi Airport, use only official taxi counters on level 1 (arrivals). Avoid people offering "cheap" rides in the terminal - they charge 1000-2000 baht vs 300-400 for metered taxi. Official taxis cost 250-400 baht to city center.',
  ST_GeomFromText('POINT(100.7520 13.6890)', 4326),
  'approved',
  'curated',
  NULL,
  NOW()
);

-- Reset pins sequence
SELECT setval('pins_id_seq', COALESCE((SELECT MAX(id) FROM public.pins), 1), true);

-- 4. Insert Tip Submissions (with locations where applicable)

-- Tip 1: ATM safety tip (with location)
INSERT INTO public.tip_submissions (
  id, user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  1, NULL, 1, 'scam',
  'Use ATMs Inside Banks for Safety',
  'Avoid standalone ATMs at night, especially in tourist areas',
  'ATMs inside banks (especially during banking hours) are safer. Skimming devices are less common. Avoid ATMs in dark alleys or tourist-only areas. Check for card skimmers before using.',
  ST_GeomFromText('POINT(100.5350 13.7450)', 4326),
  ST_GeomFromText('POINT(100.5350 13.7450)', 4326),
  'approved',
  NOW()
);

-- Tip 2: BTS/MRT is safest transport (no location needed, general tip)
INSERT INTO public.tip_submissions (
  id, user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  2, NULL, 1, 'stay',
  'BTS SkyTrain is Safest Transport Option',
  'Use BTS or MRT to avoid taxi/tuk-tuk scams',
  'BTS SkyTrain and MRT are the safest and most reliable transport. Fixed prices, no scams, air-conditioned. Much better than negotiating with taxis or tuk-tuks. Get a Rabbit card for convenience.',
  NULL,
  NULL,
  'approved',
  NOW()
);

-- Tip 3: Walking street food safety (with location)
INSERT INTO public.tip_submissions (
  id, user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  3, NULL, 1, 'stay',
  'Street Food Safety - Yaowarat (Chinatown)',
  'Best street food area, generally safe and clean',
  'Yaowarat Road (Chinatown) has excellent street food that locals eat. Generally very safe. Look for stalls with high turnover and locals eating there. Avoid raw seafood if you have sensitive stomach.',
  ST_GeomFromText('POINT(100.5100 13.7380)', 4326),
  ST_GeomFromText('POINT(100.5100 13.7380)', 4326),
  'approved',
  NOW()
);

-- Tip 4: Temple dress code (general tip)
INSERT INTO public.tip_submissions (
  id, user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  4, NULL, 1, 'do_dont',
  'Temple Dress Code - Cover Shoulders and Knees',
  'Respect temple dress codes to avoid being denied entry',
  'All temples require covered shoulders and knees (both men and women). You can rent/buy sarongs at temple entrances (usually 100-200 baht). Better to bring your own. Showing respect helps avoid issues with staff.',
  NULL,
  NULL,
  'approved',
  NOW()
);

-- Tip 5: Grab app is safer than hailing taxis (general tip)
INSERT INTO public.tip_submissions (
  id, user_id, city_id, category, title, summary, details, location, location_v2, status, created_at
)
VALUES (
  5, NULL, 1, 'scam',
  'Use Grab App Instead of Hailing Taxis',
  'Grab app shows fixed price, prevents meter refusal scams',
  'Grab (Thailand version of Uber) shows fixed prices before booking, preventing meter refusal and route scams. Usually cheaper than taxis. Download before arriving. Works better than Uber in Bangkok.',
  NULL,
  NULL,
  'approved',
  NOW()
);

-- Reset tip_submissions sequence
SELECT setval('tip_submissions_id_seq', COALESCE((SELECT MAX(id) FROM public.tip_submissions), 1), true);

-- 5. Insert Reports (User incident reports with locations)

-- Report 1: Taxi scam incident
INSERT INTO public.reports (
  id, reporter_user_id, city_id, category, title, summary, details, geom, occurred_at, source, status, confidence, severity, child_sensitivity, created_at
)
VALUES (
  1, NULL, 1, 'scam',
  'Taxi Driver Took Long Route - Extra 200 Baht',
  'Driver took circuitous route from airport despite giving address',
  'Driver from Suvarnabhumi to Sukhumvit took very long route via expressway loops. Journey took 90 minutes instead of 45. Charged 600 baht when should be 300-400. Refused to use meter from start.',
  ST_GeomFromText('POINT(100.5550 13.7420)', 4326),
  NOW() - INTERVAL '2 days',
  'user',
  'approved',
  'high',
  2,
  'none',
  NOW() - INTERVAL '2 days'
);

-- Report 2: Harassment incident
INSERT INTO public.reports (
  id, reporter_user_id, city_id, category, title, summary, details, geom, occurred_at, source, status, confidence, severity, child_sensitivity, created_at
)
VALUES (
  2, NULL, 1, 'harassment',
  'Aggressive Tout Followed Me - Nana Area',
  'Tout followed for 3 blocks trying to sell tour, got physical',
  'Aggressive tout near Nana Plaza followed me for several blocks. When I refused, he grabbed my arm and wouldn''t let go. Had to be forceful to leave. Felt unsafe.',
  ST_GeomFromText('POINT(100.5545 13.7405)', 4326),
  NOW() - INTERVAL '5 days',
  'user',
  'approved',
  'med',
  3,
  'low',
  NOW() - INTERVAL '5 days'
);

-- Report 3: Overcharge incident
INSERT INTO public.reports (
  id, reporter_user_id, city_id, category, title, summary, details, geom, occurred_at, source, status, confidence, severity, child_sensitivity, created_at
)
VALUES (
  3, NULL, 1, 'overcharge',
  'Tuk-tuk Overcharged for Short Trip - Khao San to Wat Pho',
  'Charged 300 baht for trip that should be 50-80 baht',
  'Tuk-tuk driver quoted 300 baht for 2km trip from Khao San Road to Wat Pho. Normal price is 50-80 baht. Refused to negotiate. Had to walk away and find another.',
  ST_GeomFromText('POINT(100.4950 13.7600)', 4326),
  NOW() - INTERVAL '1 week',
  'user',
  'approved',
  'high',
  1,
  'none',
  NOW() - INTERVAL '1 week'
);

-- Reset reports sequence
SELECT setval('reports_id_seq1', COALESCE((SELECT MAX(id) FROM public.reports), 1), true);

-- 6. Insert Incidents (Aggregated incidents from reports)

-- Incident 1: Taxi meter refusal pattern
INSERT INTO public.incidents (
  id, city_id, taxonomy, title, canonical_summary, geom, active, first_report_at, last_report_at, severity_avg, confidence_avg, child_sensitivity, evidence_count, status, updated_at
)
VALUES (
  1, 1, 'transportation_scam',
  'Persistent Taxi Meter Refusal in Tourist Areas',
  'Taxi drivers in Khao San Road, Sukhumvit, and Grand Palace areas frequently refuse to use meter and quote inflated fixed prices (3-5x normal fare).',
  ST_GeomFromText('POINT(100.4970 13.7550)', 4326),
  'yes',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '1 day',
  2.5,
  'high',
  'low',
  15,
  'live',
  NOW()
);

-- Incident 2: Gem shop scam
INSERT INTO public.incidents (
  id, city_id, taxonomy, title, canonical_summary, geom, active, first_report_at, last_report_at, severity_avg, confidence_avg, child_sensitivity, evidence_count, status, updated_at
)
VALUES (
  2, 1, 'shopping_scam',
  'Temple Closure Gem Shop Scam - Grand Palace Area',
  'Tuk-tuk drivers claim Grand Palace/Wat Pho are closed and redirect tourists to gem shops with inflated prices. Classic scam pattern.',
  ST_GeomFromText('POINT(100.4925 13.7490)', 4326),
  'yes',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '3 days',
  3.0,
  'high',
  'low',
  22,
  'live',
  NOW()
);

-- Reset incidents sequence
SELECT setval('incidents_id_seq', COALESCE((SELECT MAX(id) FROM public.incidents), 1), true);

-- 7. Insert Rules (Do/Don't guidelines for Bangkok)

INSERT INTO public.rules (id, city_id, kind, title, reason, created_at)
VALUES 
  (1, 1, 'do', 'Always Use Taxi Meter', 'Insist on meter or walk away. If driver refuses, get out. Never accept fixed prices from parked taxis.', NOW()),
  (2, 1, 'do', 'Use Grab App for Transport', 'Grab app shows fixed prices and prevents scams. More reliable than hailing taxis.', NOW()),
  (3, 1, 'do', 'Take BTS/MRT When Possible', 'Public transport is safest, cheapest, and most reliable. No negotiation needed.', NOW()),
  (4, 1, 'dont', 'Don''t Accept "Temple Closed" Claims', 'Always verify temple opening hours yourself. This is a common scam to take you to gem shops.', NOW()),
  (5, 1, 'dont', 'Don''t Follow Strangers to Shops', 'If someone offers to show you something or take you somewhere, it''s likely a commission scam.', NOW()),
  (6, 1, 'dont', 'Don''t Trust "Too Good to Be True" Deals', 'Tuk-tuk tours for 20 baht or "special" deals are scams. You''ll pay in time at commission shops.', NOW()),
  (7, 1, 'do', 'Keep Valuables Secure in Crowds', 'Pickpockets operate in crowded markets. Use front pockets, cross-body bags, and stay alert.', NOW()),
  (8, 1, 'do', 'Respect Temple Dress Codes', 'Cover shoulders and knees to show respect and avoid being denied entry or charged for rental.', NOW());

-- Reset rules sequence
SELECT setval('rules_id_seq', COALESCE((SELECT MAX(id) FROM public.rules), 1), true);

-- 8. Insert Places (POIs for context)

INSERT INTO public.places (id, city_id, kind, name, geom, verified_by, updated_at)
VALUES 
  (1, 1, 'attraction', 'Grand Palace', ST_GeomFromText('POINT(100.4925 13.7500)', 4326), NULL, NOW()),
  (2, 1, 'attraction', 'Wat Pho (Temple of Reclining Buddha)', ST_GeomFromText('POINT(100.4940 13.7460)', 4326), NULL, NOW()),
  (3, 1, 'market', 'Chatuchak Weekend Market', ST_GeomFromText('POINT(100.5570 13.8000)', 4326), NULL, NOW()),
  (4, 1, 'mall', 'MBK Center', ST_GeomFromText('POINT(100.5320 13.7440)', 4326), NULL, NOW()),
  (5, 1, 'street', 'Khao San Road', ST_GeomFromText('POINT(100.4960 13.7610)', 4326), NULL, NOW());

-- Reset places sequence
SELECT setval('places_id_seq', COALESCE((SELECT MAX(id) FROM public.places), 1), true);

COMMIT;

-- Verification queries
SELECT 
  'Cities' as table_name, COUNT(*) as count FROM public.cities
UNION ALL
SELECT 'Zones', COUNT(*) FROM public.zones
UNION ALL
SELECT 'Pins', COUNT(*) FROM public.pins
UNION ALL
SELECT 'Tip Submissions', COUNT(*) FROM public.tip_submissions
UNION ALL
SELECT 'Reports', COUNT(*) FROM public.reports
UNION ALL
SELECT 'Incidents', COUNT(*) FROM public.incidents
UNION ALL
SELECT 'Rules', COUNT(*) FROM public.rules
UNION ALL
SELECT 'Places', COUNT(*) FROM public.places;

