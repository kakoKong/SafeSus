import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] PostHog disabled - NEXT_PUBLIC_POSTHOG_KEY not found');
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, properties);
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

