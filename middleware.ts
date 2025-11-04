import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

/**
 * Middleware to handle:
 * 1. Internationalization (locale routing without automatic detection)
 * 2. Webhook protection (no redirects on webhook URLs)
 *
 * Manual locale switching:
 * - Users can manually switch languages via LanguageSwitcher component
 * - Automatic detection is DISABLED to allow users to override their browser preference
 * - Default locale: FR (if no locale is specified in URL)
 * - Supported locales: FR, EN, PT
 */

// Create the intl middleware with locale detection disabled
// This allows users to manually switch languages without being auto-redirected
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Don't prefix default locale (fr)
  localeDetection: false // Disable auto-detection to allow manual language switching
});

export function middleware(request: NextRequest) {
  // NEVER redirect webhook URLs - they must respond directly
  // Webhooks need to bypass i18n middleware entirely
  if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Prevent redirects to production domain in development
  const hostname = request.headers.get('host') || '';
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // In development, don't allow redirects to production domain
    const response = intlMiddleware(request);

    // If the response is a redirect to production, block it
    if (response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      if (location && (location.includes('fetrabeauty.com') || location.includes('www.'))) {
        return NextResponse.next();
      }
    }

    return response;
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

