import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Middleware to handle:
 * 1. Internationalization (locale routing with automatic detection)
 * 2. Webhook protection (no redirects on webhook URLs)
 *
 * Automatic locale detection:
 * - Detects user's preferred language from Accept-Language header
 * - Falls back to FR (default) if no match found
 * - US/GB visitors → EN
 * - BR/PT visitors → PT
 * - FR/BE/CH visitors → FR
 */

// Create the intl middleware with locale detection enabled
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't prefix default locale (fr)
  localeDetection: true // Automatically detect user's preferred locale
});

export function middleware(request: NextRequest) {
  // NEVER redirect webhook URLs - they must respond directly
  // Webhooks need to bypass i18n middleware entirely
  if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Apply internationalization middleware for all other routes
  // This will automatically detect and redirect to the appropriate locale
  // based on the Accept-Language header
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (*.svg, *.png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)',
  ],
};

