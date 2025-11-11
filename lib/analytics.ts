import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  
  // Skip if no key or if it's a test key
  if (!posthogKey || posthogKey === 'phc_test' || posthogKey.includes('test')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] PostHog disabled - invalid or test key');
    }
    return;
  }

  try {
    posthog.init(posthogKey, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug();
        }
      },
      // Suppress errors for missing configs
      disable_session_recording: true,
      autocapture: false,
      capture_pageview: false,
      // Error handling
      request_batching: true,
      // Suppress remote config errors
      advanced_disable_decide: true,
    });
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics] Failed to initialize PostHog:', error);
    }
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  
  // Skip if no key or if it's a test key
  if (!posthogKey || posthogKey === 'phc_test' || posthogKey.includes('test')) {
    return;
  }

  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    // Silently fail - don't break the app if analytics fails
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics] Failed to track event:', eventName, error);
    }
  }
};

// Event types for type safety
export const Events = {
  CITY_VIEW: 'city_view',
  ZONE_POPOVER_OPEN: 'zone_popover_open',
  PIN_DETAILS_OPEN: 'pin_details_open',
  SAVE_CITY: 'save_city',
  SUBMIT_TIP: 'submit_tip',
  LIVE_MODE_ENABLED: 'live_mode_enabled',
  NEARBY_WARNING_OPEN: 'nearby_warning_open',
} as const;

