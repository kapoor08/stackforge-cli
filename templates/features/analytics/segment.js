import { AnalyticsBrowser } from '@segment/analytics-next';

export const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
});

export function trackPageView(name, properties) {
  analytics.page(name, properties);
}

export function trackEvent(event, properties) {
  analytics.track(event, properties);
}

export function identifyUser(userId, traits) {
  analytics.identify(userId, traits);
}
