import ReactGA from 'react-ga4';

export function initAnalytics() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID);
  }
}

export function trackPageView(path) {
  ReactGA.send({ hitType: 'pageview', page: path });
}

export function trackEvent(category, action, label) {
  ReactGA.event({
    category,
    action,
    label,
  });
}
