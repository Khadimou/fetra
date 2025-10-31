# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FETRA is a French e-commerce site built with Next.js 16 (App Router) selling a beauty product: "Rituel Visage Liftant" (facial lifting kit with rose quartz tools and oil). The site features Stripe payments, GDPR-compliant cookie consent, marketing automation via HubSpot and Brevo, and customer support via Freshdesk.

## Commands

### Development
```bash
npm run dev           # Start development server on localhost:3000
npm run build         # Production build
npm run start         # Start production server
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
```

### Testing
```bash
npm run test          # Run all tests with Vitest
# Run single test file:
npm run test -- <filename>.test.ts
```

### Stripe Webhook Testing (Local Development)
```bash
# Install Stripe CLI first (https://stripe.com/docs/stripe-cli)
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the webhook secret (whsec_...) and add to .env.local as STRIPE_WEBHOOK_SECRET
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v4 with Credentials Provider + Prisma Adapter
- **Styling**: Tailwind CSS with custom color tokens (`fetra-olive`, `fetra-pink`)
- **Payments**: Stripe Checkout (card payments only, EUR)
- **Analytics**: Google Analytics 4, Google Tag Manager (consent-gated)
- **CRM**: HubSpot (contact tracking, order sync)
- **Email**: Brevo (transactional emails, newsletter)
- **Support**: Freshdesk (ticket creation)
- **Shipping**: Colissimo API (La Poste Suivi v2 for tracking)
- **Admin**: NextAuth-powered dashboard with JWT sessions
- **Monitoring**: Sentry (server-side always on, client-side consent-gated)
- **Testing**: Vitest + Testing Library

### Key Architectural Patterns

#### 1. Cart Management (Client-Side Only)
- **Location**: `lib/cart.ts`
- **Storage**: `localStorage` with key `fetra_cart`
- Cart state is managed entirely client-side, NO server-side cart
- Custom event `cartUpdated` dispatched on changes
- Components listen via `useEffect` + `addEventListener`

#### 2. Product Data
- **Single product model**: `lib/product.ts` exports `getProduct()`
- Product images stored in `/public/*.webp` with LQIP placeholders
- Images use base64-encoded LQIP for instant loading
- Stock level is hardcoded (not dynamic inventory)

#### 3. Checkout Flow
1. User adds product to cart (stored in localStorage)
2. Clicks "Checkout" → POST to `/api/checkout`
3. API creates Stripe Checkout session
4. User redirected to Stripe hosted page
5. On success → redirected to `/success?session_id=...`
6. Stripe webhook (`/api/webhooks/stripe`) processes payment and syncs to:
   - HubSpot (contact + order properties)
   - Brevo (contact + transactional email)
   - Local JSON file (`data/orders.json`)

#### 4. Webhook Architecture
- **CRITICAL**: `/api/webhooks/*` routes MUST NOT redirect (middleware bypass)
- Webhook signature verification via `STRIPE_WEBHOOK_SECRET`
- Retry logic with exponential backoff for HubSpot/Brevo API calls
- Non-blocking failures (errors logged but webhook still returns 200)
- See `docs/webhook-troubleshooting.md` for debugging

#### 5. GDPR Cookie Consent System
- **Component**: `components/CookieConsent.tsx`
- **Storage**: Cookie `fetra_consent` (365 days, SameSite=Lax, Secure on HTTPS)
- Three consent categories:
  - **Necessary**: Always enabled (functional cookies)
  - **Analytics**: Gates GA4, GTM, client-side Sentry
  - **Marketing**: Gates GTM marketing tags
- Scripts load conditionally via custom events:
  - `consent-analytics` → loads GA4 + Sentry client
  - `consent-marketing` → loads GTM marketing tags
- See `lib/cookies.ts` for consent helpers

#### 6. Analytics Integration
- **GA4**: `lib/ga/index.ts` + `GoogleAnalyticsScript` component
- **GTM**: `lib/gtm/index.ts` + script injection after consent
- **HubSpot**: `components/HubspotSnippet.tsx` (tracking code)
- Analytics only initialize after user grants consent
- Server-side Sentry (`sentry.server.config.js`) always active

#### 7. Third-Party Integrations
All integrations have retry logic (3 attempts, exponential backoff):

**HubSpot** (`lib/integrations/hubspot.ts`):
- Upsert contacts via Contacts API v1
- Track custom events
- Syncs order data: `last_order_id`, `last_order_amount`, `last_order_date`

**Brevo** (`lib/integrations/brevo.ts`):
- Add/update contacts with attributes
- Send transactional emails via templates:
  - Order confirmation: `BREVO_TEMPLATE_ORDER_CONFIRM`
  - Newsletter welcome: `BREVO_TEMPLATE_NEWSLETTER_WELCOME`
  - Shipping: `BREVO_TEMPLATE_SHIPPED`
- Newsletter list ID: Hardcoded in `/api/newsletter/route.ts` (line 27)

**Freshdesk** (`/api/freshdesk/create-ticket/route.ts`):
- Creates support tickets via API
- Widget: `components/CustomerSupportWidget.tsx`

#### 8. Data Persistence with Prisma
- **Database**: PostgreSQL with Prisma ORM
- **Models**: User, Customer, Order, OrderItem, ShippingInfo (see `prisma/schema.prisma`)
- **Client**: Singleton pattern in `lib/db/prisma.ts`
- **Functions**: `createOrder()`, `getOrder()`, `getAllOrders()`, `markAsShipped()`, `getOrderStats()`
- **Relations**: Orders linked to Customers, OrderItems, and ShippingInfo via foreign keys
- **Type Safety**: Full TypeScript types generated from Prisma schema

#### 9. Middleware & Redirects
- **File**: `middleware.ts`
- Webhooks MUST bypass redirects (307 breaks Stripe)
- All `/api/webhooks/*` routes return `NextResponse.next()` immediately
- Optional www → non-www redirect (currently commented out)

#### 10. Colissimo Shipping Integration
- **API**: La Poste Suivi v2 (tracking only, no label generation yet)
- **Integration**: `lib/integrations/colissimo.ts`
- **Types**: `lib/types/colissimo.ts` (full TypeScript definitions)
- **Features**:
  - Track shipments via tracking number (11-15 alphanumeric)
  - Timeline visualization (5 steps)
  - Event history (anti-chronological)
  - Simplified status mapping (in_transit, delivered, etc.)
  - Support for multiple tracking numbers (max 10)
- **Endpoints**:
  - `GET /api/colissimo/tracking/[trackingNumber]` - Get tracking info
  - `POST /api/orders/[orderId]/ship` - Mark order as shipped
- **Workflow**:
  1. Admin marks order as shipped with tracking number
  2. System updates order status to 'shipped'
  3. Sends shipping confirmation email via Brevo
  4. Updates HubSpot contact with tracking info
  5. Tracking widget displays live status from Colissimo API
- **Sandbox**: Test tracking numbers available in `SANDBOX_TRACKING_NUMBERS`
- **Rate limiting**: 10 second timeout per request, max 10 IDs per multi-query

#### 11. Admin Dashboard with NextAuth
- **Authentication**: NextAuth v4 with Credentials Provider
- **Session Strategy**: JWT (works seamlessly with credentials)
- **Password**: Hashed with bcrypt (10 rounds)
- **Protected Routes**: Use `useSession()` hook or `getServerSession()` in API routes
- **Routes**:
  - `/admin/login` - Login page
  - `/admin` - Dashboard with order list and stats
  - `/admin/orders/[orderId]` - Order detail with tracking
  - `POST /api/admin/login` - Login endpoint
  - `POST /api/admin/logout` - Logout endpoint
  - `GET /api/admin/me` - Get current admin user
  - `GET /api/admin/orders` - List all orders (admin only)
  - `GET /api/admin/orders/[orderId]` - Get order detail (admin only)
- **Features**:
  - Order list with filters by status
  - Stats dashboard (total, pending, shipped, delivered)
  - Mark orders as shipped with Colissimo tracking
  - Live tracking widget
  - Automatic email notifications
- **Component**: `components/admin/TrackingStatus.tsx` - Visual tracking timeline

#### 12. Prisma + NextAuth Setup
- **Schema**: `prisma/schema.prisma` - Defines all models and relations
- **Migrations**: Run `npx prisma migrate dev` to apply schema changes
- **Seed**: Run `npx prisma db seed` to create initial admin user
- **Studio**: Run `npx prisma studio` to view/edit database with web UI
- **Client Generation**: Auto-generated on `npx prisma generate` and `npm install`

#### 13. Environment Variables Architecture
```
# Base
NEXT_PUBLIC_BASE_URL        # Used for Stripe redirect URLs

# Stripe
STRIPE_SECRET_KEY           # Server-side Stripe API
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # Client-side Stripe.js
STRIPE_WEBHOOK_SECRET       # Webhook signature verification

# Analytics (consent-gated on client)
NEXT_PUBLIC_GA_MEASUREMENT_ID   # GA4 tracking ID
NEXT_PUBLIC_GTM_ID              # Google Tag Manager ID
NEXT_PUBLIC_SENTRY_DSN          # Client-side Sentry (consent required)

# Monitoring (server-side, always active)
SENTRY_DSN                  # Server-side Sentry

# CRM/Email
HUBSPOT_API_KEY             # HubSpot API (server-side)
NEXT_PUBLIC_HUBSPOT_ID      # HubSpot Portal ID (client tracking)
BREVO_API_KEY               # Brevo API (server-side)
BREVO_TEMPLATE_ORDER_CONFIRM    # Template ID for order emails
BREVO_TEMPLATE_NEWSLETTER_WELCOME  # Template ID for newsletter
BREVO_TEMPLATE_SHIPPED      # Template ID for shipping confirmation
BREVO_SENDER_EMAIL          # Default: contact@fetrabeauty.com
BREVO_SENDER_NAME           # Default: FETRA BEAUTY

# Support
FRESHDESK_API_KEY           # Freshdesk API key
FRESHDESK_DOMAIN            # e.g., yourcompany.freshdesk.com
FRESHDESK_API_BASE          # Optional override

# Shipping (Colissimo)
COLISSIMO_API_KEY           # La Poste Okapi key (get from developer.laposte.fr)

# Database (PostgreSQL)
DATABASE_URL                # PostgreSQL connection string
                            # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
                            # Options: Local Docker, Vercel Postgres, Supabase

# NextAuth
NEXTAUTH_SECRET             # Secret for JWT signing (generate with: openssl rand -base64 32)
NEXTAUTH_URL                # Base URL (http://localhost:3000 in dev, https://... in prod)
```

## Key Files & Their Purposes

- `app/layout.tsx`: Root layout with Header, Footer, analytics scripts
- `app/product/page.tsx`: Main product page (landing page)
- `app/cart/page.tsx`: Shopping cart UI
- `app/checkout/page.tsx`: Checkout initiation
- `app/success/page.tsx`: Post-purchase confirmation (clears cart)
- `app/api/checkout/route.ts`: Creates Stripe Checkout session
- `app/api/webhooks/stripe/route.ts`: Handles Stripe events (most important API route)
- `lib/cart.ts`: Client-side cart management (localStorage)
- `lib/product.ts`: Product data model
- `lib/db/prisma.ts`: Prisma client singleton
- `lib/db/orders.ts`: Order management with Prisma
- `lib/integrations/`: HubSpot, Brevo, Colissimo integrations with retry logic
- `lib/types/colissimo.ts`: TypeScript types for Colissimo API
- `lib/auth/auth.config.ts`: NextAuth configuration
- `lib/cookies.ts`: GDPR consent helpers
- `prisma/schema.prisma`: Database schema (models, relations, enums)
- `components/CookieConsent.tsx`: Cookie banner UI
- `components/admin/TrackingStatus.tsx`: Colissimo tracking widget
- `app/admin/`: Admin dashboard pages (login, orders list, order detail)
- `app/api/admin/`: Admin API routes (auth, orders)
- `app/api/colissimo/`: Colissimo tracking API
- `middleware.ts`: Request interceptor (webhook bypass)
- `tailwind.config.js`: Custom color tokens (fetra-olive, fetra-pink)

## Important Gotchas

1. **Webhook 307 Redirects**: Never redirect `/api/webhooks/*` routes. Stripe requires direct 200/400/500 responses. See `docs/fix-webhook-307-redirect.md`.

2. **Cart Clearing**: Cart is cleared on `/success` page via `ClearCartOnSuccess` component (client-side effect). If user doesn't visit success page, cart persists.

3. **Consent-Gated Scripts**: GA4, GTM, and client Sentry will NOT load until user accepts analytics consent. Always test consent flow.

4. **Brevo List ID**: Newsletter list ID is hardcoded in `app/api/newsletter/route.ts:27`. Update when changing Brevo lists.

5. **Image Optimization**: Product images use LQIP (Low Quality Image Placeholder) base64 strings. Generate new LQIPs using sharp or online tools if adding images.

6. **Single Product Model**: Site designed for one product. Adding multi-product requires refactoring `lib/product.ts` and checkout flow.

7. **Database Migrations**: Always test migrations in development before applying to production. Use `npx prisma migrate dev` in dev, `npx prisma migrate deploy` in prod.

8. **Retry Logic**: All third-party API calls (HubSpot, Brevo) have 3-attempt retry with exponential backoff. Failures are logged but non-blocking.

9. **Price Hardcoded**: Product price (49.90 EUR) is hardcoded in both `lib/product.ts` and `/api/checkout/route.ts:19`. Update both when changing price.

10. **Email Templates**: Transactional emails require Brevo template IDs in env vars. Templates must be created in Brevo dashboard first.

11. **Admin First Login**: After running seed, default credentials are `admin@fetrabeauty.com` / `admin123`. Change in production!

12. **Prisma Client**: Auto-generated TypeScript client. If types are missing, run `npx prisma generate`.

13. **Colissimo API Key**: Get from https://developer.laposte.fr. Create an app, subscribe to "Suivi v2" API, and copy your Okapi key. Use sandbox key for development.

13. **Tracking Numbers**: Colissimo tracking numbers are 11-15 alphanumeric characters. Invalid formats return 400 error.

14. **Shipping Workflow**: When marking order as shipped, system automatically sends email to customer and updates HubSpot. Ensure Brevo template ID `BREVO_TEMPLATE_SHIPPED` is configured.

15. **Session Strategy**: Uses JWT (not database sessions) for better performance with credentials provider.

## Development Workflow Tips

- **Stripe Testing**: Use test card `4242 4242 4242 4242` with any future date and CVC
- **Webhook Testing**: Use Stripe CLI to forward webhooks to localhost (see Commands section)
- **Consent Testing**: Test in incognito mode to reset consent state
- **Email Testing**: Check Brevo logs (API → Transactional → Logs) for email delivery status
- **Error Monitoring**: Server errors go to Sentry automatically. Client errors require analytics consent.
- **Colissimo Testing**: Use sandbox tracking numbers from `SANDBOX_TRACKING_NUMBERS` in `lib/integrations/colissimo.ts`
- **Admin Access**: Login at `/admin/login` with credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars

## Deployment Notes

- **Platform**: Vercel (optimized for Next.js)
- **Domain**: www.fetrabeauty.com (canonical domain)
- **SSL**: Automatic via Vercel (Let's Encrypt)
- **Environment Variables**: Set in Vercel dashboard under Settings → Environment Variables
- **Important**: Always redeploy after changing environment variables

## Documentation

Additional guides in `docs/`:
- `webhook-troubleshooting.md`: Debug webhook 307/404 issues
- `fix-webhook-307-redirect.md`: Middleware configuration for webhooks
- `email-deliverability-guide.md`: Avoid spam folder
- `brevo-newsletter-setup.md`: Configure Brevo lists and templates
- `email-automation.md`: Email automation workflows
