-- Script to clear all data except user accounts and profiles
-- Run this with caution! This will delete all content, submissions, and city data.

-- Disable triggers temporarily to avoid issues (optional, uncomment if needed)
-- SET session_replication_role = 'replica';

BEGIN;

-- Delete in order to respect foreign key constraints

-- 1. Clear link tables first
TRUNCATE TABLE public.incident_reports CASCADE;
TRUNCATE TABLE public.report_links CASCADE;

-- 2. Clear content and submissions
TRUNCATE TABLE public.content_flags CASCADE;
TRUNCATE TABLE public.incidents CASCADE;
TRUNCATE TABLE public.advisories CASCADE;
TRUNCATE TABLE public.pin_submissions CASCADE;
TRUNCATE TABLE public.tip_submissions CASCADE;
TRUNCATE TABLE public.zone_submissions CASCADE;

-- 3. Clear published content
TRUNCATE TABLE public.pins CASCADE;
TRUNCATE TABLE public.zones CASCADE;
TRUNCATE TABLE public.places CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.rules CASCADE;

-- 4. Clear user-related data (but keep user_profiles)
TRUNCATE TABLE public.saved_cities CASCADE;
TRUNCATE TABLE public.subscriptions CASCADE;
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.action_ledgers CASCADE;
TRUNCATE TABLE public.moderation_log CASCADE;

-- 5. Clear system tables
TRUNCATE TABLE public.message_outbox CASCADE;

-- 6. Clear city data
TRUNCATE TABLE public.cities CASCADE;

-- Note: user_profiles and auth.users are NOT deleted
-- If you also want to clear user_profiles (but keep auth.users), uncomment:
-- TRUNCATE TABLE public.user_profiles CASCADE;

COMMIT;

-- Re-enable triggers if you disabled them
-- SET session_replication_role = 'origin';

-- Verify what's left
SELECT 
  'user_profiles' as table_name, 
  COUNT(*) as row_count 
FROM public.user_profiles
UNION ALL
SELECT 
  'auth.users' as table_name, 
  COUNT(*) as row_count 
FROM auth.users;

