// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

function tryInit() {
  try {
    // Only init if DSN present and not already initialized
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
    const w = window as unknown as { _fetra_sentry_initialized?: boolean };
    if (w._fetra_sentry_initialized) return;
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.02,
      environment: process.env.NODE_ENV || 'development',
      enableInExpoDevelopment: false,
    });
    w._fetra_sentry_initialized = true;
  } catch {
    // noop
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('consent-analytics', tryInit);
  // try immediate init if consent already present (readConsent via dynamic import)
  import('@/lib/cookies').then(({ readConsent }) => {
    const c = readConsent();
    if (c?.analytics) tryInit();
  }).catch(() => {
    // noop
  });
}


