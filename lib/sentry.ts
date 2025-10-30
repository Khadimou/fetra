// lib/sentry.ts
import * as Sentry from "@sentry/node";

export function captureException(error: any, context?: Record<string, any>) {
  try {
    Sentry.withScope((scope) => {
      if (context) {
        Object.keys(context).forEach((k) => scope.setExtra(k, context[k]));
      }
      Sentry.captureException(error);
    });
  } catch (e) {
    // noop
  }
}


