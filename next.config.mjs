/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_FEATURE_SAFETY_PULSE: process.env.NEXT_PUBLIC_FEATURE_SAFETY_PULSE || 'false',
    NEXT_PUBLIC_FEATURE_ASK_SAFI: process.env.NEXT_PUBLIC_FEATURE_ASK_SAFI || 'false',
    NEXT_PUBLIC_SUPPORTED_COUNTRY: process.env.NEXT_PUBLIC_SUPPORTED_COUNTRY || 'TH',
  },
};

export default nextConfig;

