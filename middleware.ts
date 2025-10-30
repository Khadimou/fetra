import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle redirects intelligently
 * 
 * Important: Webhooks should NEVER redirect (Stripe requires 200/400/500, not 307)
 * Other pages can redirect from www to non-www as needed
 */
export function middleware(request: NextRequest) {
  // NEVER redirect webhook URLs - they must respond directly
  if (request.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  // Optional: Redirect www to non-www for other pages
  // Uncomment if you want this behavior for non-webhook URLs
  /*
  const hostname = request.headers.get('host');
  if (hostname?.startsWith('www.')) {
    const newUrl = request.nextUrl.clone();
    newUrl.host = hostname.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }
  */

  return NextResponse.next();
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

