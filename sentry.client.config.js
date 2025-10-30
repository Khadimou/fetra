// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || "",
  tracesSampleRate: 0.02,
  environment: process.env.NODE_ENV || "development",
  // Do not capture PII by default
  sendClientReports: false,
});


