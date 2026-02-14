import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
});

export function trackPageView(name: string, properties?: Record<string, any>) {
  analytics.page(name, properties);
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  analytics.track(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  analytics.identify(userId, traits);
}
