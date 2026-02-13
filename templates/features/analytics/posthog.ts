import posthog from 'posthog-js';

export function initPosthog() {
  if (typeof window === 'undefined') return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  if (!key) return;
  posthog.init(key, { api_host: host });
}
