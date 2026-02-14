import LogRocket from 'logrocket';

export function initLogRocket() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);
  }
}

export function identifyUser(userId: string, userInfo?: Record<string, any>) {
  LogRocket.identify(userId, userInfo);
}

export function captureException(error: Error, context?: Record<string, any>) {
  LogRocket.captureException(error, { extra: context });
}
