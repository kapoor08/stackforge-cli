import LogRocket from 'logrocket';

export function initLogRocket() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID);
  }
}

export function identifyUser(userId, userInfo) {
  LogRocket.identify(userId, userInfo);
}

export function captureException(error, context) {
  LogRocket.captureException(error, { extra: context });
}
