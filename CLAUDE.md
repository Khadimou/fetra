# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FETRA is a French e-commerce platform built with Next.js 16 (App Router) selling beauty products. Originally focused on a single product ("Rituel Visage Liftant" - facial lifting kit with rose quartz tools and oil), it now features a full product catalog powered by CJ Dropshipping for K-Beauty products. The site includes Stripe payments, GDPR-compliant cookie consent, marketing automation via HubSpot and Brevo, customer support via Freshdesk, and automated order fulfillment through CJ Dropshipping.

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

### Database (Prisma)
```bash
npx prisma generate      # Generate Prisma Client types
npx prisma db push       # Push schema changes to database (user preference)
npx prisma migrate dev   # Create and apply migration (alternative)
npx prisma migrate deploy # Apply migrations in production
npx prisma db seed       # Seed database with initial admin user
npx prisma studio        # Open Prisma Studio (database GUI)
```

### Supabase Edge Functions (CJ Dropshipping)
```bash
supabase login           # Login to Supabase CLI
supabase link            # Link to Supabase project
supabase functions deploy sync-cj-products    # Deploy product sync function
supabase functions deploy create-cj-order     # Deploy order creation function
supabase functions deploy get-cj-tracking     # Deploy tracking function
supabase functions serve # Serve functions locally
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
- **Database**: PostgreSQL with Prisma ORM + Supabase (for CJ Dropshipping integration)
- **Authentication**: NextAuth v4 with Credentials Provider + Prisma Adapter
- **Styling**: Tailwind CSS with custom color tokens (`fetra-olive`, `fetra-pink`)
- **Payments**: Stripe Checkout (card payments only, EUR)
- **Analytics**: Google Analytics 4, Google Tag Manager (consent-gated)
- **CRM**: HubSpot (contact tracking, order sync)
- **Email**: Brevo (transactional emails, newsletter)
- **Support**: Freshdesk (ticket creation)
- **Shipping**: Colissimo API (La Poste Suivi v2 for tracking)
- **Dropshipping**: CJ Dropshipping API (K-Beauty products sync, order fulfillment)
- **Edge Functions**: Supabase Edge Functions (Deno runtime for CJ API integration)
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

#### 2. Product Data (Dual System)
- **FETRA Product**: `lib/product.ts` exports `getProduct()` for original product
  - Product images stored in `/public/*.webp` with LQIP placeholders
  - Images use base64-encoded LQIP for instant loading
  - Stock level is hardcoded (not dynamic inventory)
- **CJ Products**: Stored in Supabase database, retrieved via API
  - Accessed via `/api/products/cj` and `/api/products/cj/[sku]`
  - Dynamic stock from Supabase `products` table
  - Images hosted on CJ CDN (`oss-cf.cjdropshipping.com`)
  - Pricing markup applied server-side (2.5x default)

#### 3. Checkout Flow (Multi-Product)
1. User adds products to cart (FETRA + CJ products, stored in localStorage)
2. Clicks "Checkout" → POST to `/api/checkout`
3. API validates prices server-side (Supabase for CJ, hardcoded for FETRA)
4. API creates Stripe Checkout session with CJ metadata per line item
5. User redirected to Stripe hosted page
6. On success → redirected to `/success?session_id=...`
7. Stripe webhook (`/api/webhooks/stripe`) processes payment:
   - Creates order in Prisma with all items
   - Decrements stock in Supabase for CJ products
   - Creates CJ orders via Edge Function for items with `cjVariantId`
   - Updates order with `cjOrderId` and `cjOrderNum`
   - Syncs to HubSpot (contact + order properties)
   - Sends confirmation email via Brevo

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

#### 11. Authentication with NextAuth
- **Library**: NextAuth v4 with multiple providers
- **Providers**:
  - **Credentials**: Email/password authentication (bcrypt hashing, 10 rounds)
  - **Google OAuth**: Sign in with Google account
  - **Apple Sign In**: Sign in with Apple ID
- **Session Strategy**: JWT (works seamlessly with all providers)
- **Adapter**: Prisma Adapter for database sessions
- **Customer Creation**: Automatic Customer record created on first OAuth sign-in
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

#### 13. CJ Dropshipping Integration (Supabase Edge Functions)
- **Platform**: Supabase Edge Functions (Deno runtime)
- **API Version**: CJ Dropshipping API v2.0
- **Authentication**: OAuth2 with `client_id` and `client_secret`
- **Location**: `supabase/functions/`
- **Shared Modules**: `supabase/functions/_shared/cj-api/`
  - `auth.ts`: OAuth2 token management with automatic refresh
  - `client.ts`: API client with retry logic (3 attempts, exponential backoff)
  - `types.ts`: TypeScript definitions for CJ API
- **Edge Functions**:
  - `sync-cj-products`: Sync K-Beauty products from CJ to Supabase
  - `create-cj-order`: Submit orders to CJ for fulfillment
  - `get-cj-tracking`: Retrieve order tracking and status from CJ
- **Database Tables** (Supabase):
  - `products`: CJ products catalog with variants, pricing, stock
  - `orders`: Orders with CJ order IDs and tracking info
  - `cj_sync_logs`: Sync history and statistics
- **Workflow**:
  1. **Product Sync**: Cron job calls `sync-cj-products` → fetches K-Beauty products → upserts to Supabase
  2. **Order Creation**: Customer places order → stored in Supabase → `create-cj-order` submits to CJ
  3. **Tracking**: Customer views order → `get-cj-tracking` fetches status → updates Supabase
- **Features**:
  - Automatic token refresh (cached in-memory)
  - Pagination support (up to 100 products/page)
  - Batch product sync with error handling
  - Order status mapping (CJ status → internal status)
  - Comprehensive logging via `cj_sync_logs`
- **Deployment**: `supabase functions deploy [function-name]`
- **Documentation**: See `supabase/README.md` and `docs/cj-dropshipping-integration.md`

#### 14. CJ Product Catalog (Multi-Product E-commerce)
- **Overview**: Full-featured product catalog with CJ Dropshipping products alongside FETRA's original product
- **Frontend Pages**:
  - `/products` - Product catalog page with search, filters, pagination
  - `/products/[sku]` - Product detail page with variant selection, image gallery
- **Backend APIs**:
  - `GET /api/products/cj` - List all CJ products with pricing markup (2.5x default)
  - `GET /api/products/cj/[sku]` - Get single product details with variants
- **Admin Pages**:
  - `/admin/cj/products` - Sync and manage CJ products
  - `/admin/cj/products/[id]` - Individual product management
  - `/admin/cj/orders` - View CJ orders
  - `/admin/cj/dashboard` - CJ integration dashboard
  - `/admin/cj/mapping` - Product mapping tools
- **Pricing Strategy**:
  - Configurable markup in `app/api/products/cj/route.ts` and `app/api/products/cj/[sku]/route.ts`
  - Default: 2.5x coefficient (150% margin)
  - Options: coefficient-based or fixed amount markup
  - **CRITICAL**: Must update both route files when changing pricing
- **Multi-Product Cart**:
  - Extended `CartItem` type with CJ-specific fields: `cjProductId`, `cjVariantId`, `variantName`, `maxQuantity`
  - Smart cart matching by `cjVariantId` for CJ products
  - Mixed cart support (FETRA products + CJ products)
  - Stock limit enforcement at cart level
- **Checkout Flow (Multi-Product)**:
  1. Cart contains mixed products (FETRA + CJ)
  2. Server validates prices against Supabase for CJ products
  3. Stripe session created with CJ metadata per line item (`cjProductId`, `cjVariantId`, `variantName`)
  4. Webhook extracts CJ metadata and creates CJ orders only for items with `cjVariantId`
  5. Stock decremented in Supabase
  6. CJ order created via Edge Function, returns `cjOrderId` and `cjOrderNum`
- **Product Sync Workflow**:
  1. Admin triggers sync via `/admin/cj/products`
  2. Edge Function fetches products from CJ API
  3. Products stored in Supabase `products` table
  4. Next.js API routes apply pricing markup when serving to frontend
- **Image Handling**: CJ images hosted on `oss-cf.cjdropshipping.com`, configured in `next.config.ts`
- **Key Files**:
  - `app/[locale]/products/page.tsx` - Catalog UI
  - `app/[locale]/products/[sku]/page.tsx` - Product detail UI
  - `app/api/products/cj/route.ts` - List API with pricing
  - `app/api/products/cj/[sku]/route.ts` - Detail API with pricing
  - `lib/cart.ts` - Multi-product cart logic
  - `lib/db/products.ts` - Prisma product helpers
- **Documentation**: See `CATALOGUE-CJ-README.md` and `docs/cj-catalog-implementation.md`

#### 15. Environment Variables Architecture
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

# Google Ads (conversion tracking, consent-gated on marketing)
NEXT_PUBLIC_GOOGLE_ADS_ID                      # Google Ads Conversion ID (format: AW-XXXXXXXXXX)
NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL          # Conversion label for purchase events
NEXT_PUBLIC_GOOGLE_ADS_BEGIN_CHECKOUT_LABEL    # Conversion label for checkout initiation
NEXT_PUBLIC_GOOGLE_ADS_ADD_TO_CART_LABEL       # Conversion label for add to cart
NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL              # Conversion label for leads (newsletter, contact)

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
NEXTAUTH_URL                # Base URL (https://0fa5d0e0758d.ngrok-free.app/ in dev, https://... in prod)

# OAuth Providers (optional, for social login)
GOOGLE_CLIENT_ID            # Google OAuth Client ID (from Google Cloud Console)
GOOGLE_CLIENT_SECRET        # Google OAuth Client Secret
APPLE_CLIENT_ID             # Apple Sign In Service ID (e.g., com.fetrabeauty.web.service)
APPLE_CLIENT_SECRET         # Apple Sign In JWT (generate with private key, expires 6 months)

# CJ Dropshipping (for Edge Functions)
CJ_CLIENT_ID                # CJ Dropshipping OAuth2 Client ID
CJ_CLIENT_SECRET            # CJ Dropshipping OAuth2 Client Secret

# Supabase (for CJ integration)
SUPABASE_URL                # Supabase project URL (https://xxx.supabase.co)
SUPABASE_ANON_KEY           # Supabase anonymous key (public, client-side)
SUPABASE_SERVICE_ROLE_KEY   # Supabase service role key (private, server-side only)
NEXT_PUBLIC_SUPABASE_URL    # Public Supabase URL (for client-side access)
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Public Supabase anon key (for client-side access)
```

## Key Files & Their Purposes

### Core E-commerce
- `app/layout.tsx`: Root layout with Header, Footer, analytics scripts
- `app/product/page.tsx`: Main FETRA product page (Rituel Visage Liftant)
- `app/cart/page.tsx`: Shopping cart UI (supports mixed FETRA + CJ products)
- `app/checkout/page.tsx`: Checkout initiation with Stripe
- `app/success/page.tsx`: Post-purchase confirmation (clears cart)
- `app/api/checkout/route.ts`: Creates Stripe Checkout session with price validation
- `app/api/webhooks/stripe/route.ts`: Handles Stripe events, creates CJ orders (most critical API route)

### CJ Product Catalog
- `app/[locale]/products/page.tsx`: CJ products catalog page (search, filters, pagination)
- `app/[locale]/products/[sku]/page.tsx`: CJ product detail page (variants, gallery)
- `app/api/products/cj/route.ts`: CJ products list API with pricing markup
- `app/api/products/cj/[sku]/route.ts`: CJ product detail API with pricing markup

### Admin Dashboard
- `app/[locale]/admin/page.tsx`: Admin dashboard with order stats
- `app/[locale]/admin/login/page.tsx`: Admin login page
- `app/[locale]/admin/orders/page.tsx`: Orders list with filters
- `app/[locale]/admin/orders/[orderId]/page.tsx`: Order detail with tracking
- `app/[locale]/admin/products/page.tsx`: FETRA products management
- `app/[locale]/admin/cj/products/page.tsx`: CJ products sync and management
- `app/[locale]/admin/cj/products/[id]/page.tsx`: Individual CJ product detail
- `app/[locale]/admin/cj/orders/page.tsx`: CJ orders list
- `app/[locale]/admin/cj/dashboard/page.tsx`: CJ integration dashboard
- `app/[locale]/admin/cj/mapping/page.tsx`: Product mapping tools
- `app/api/admin/`: Admin API routes (auth, orders)

### Libraries and Utilities
- `lib/cart.ts`: Multi-product cart management (localStorage, CJ + FETRA support)
- `lib/product.ts`: FETRA product data model
- `lib/db/prisma.ts`: Prisma client singleton
- `lib/db/orders.ts`: Order management with Prisma
- `lib/db/products.ts`: Product management with Prisma
- `lib/integrations/`: HubSpot, Brevo, Colissimo integrations with retry logic
- `lib/types/colissimo.ts`: TypeScript types for Colissimo API
- `lib/auth/auth.config.ts`: NextAuth configuration
- `lib/cookies.ts`: GDPR consent helpers

### Database and Schema
- `prisma/schema.prisma`: Database schema (User, Customer, Product, Order, OrderItem, ShippingInfo)

### Supabase Edge Functions (CJ Dropshipping)
- `supabase/functions/_shared/cj-api/`: CJ API client modules (auth, client, types)
- `supabase/functions/sync-cj-products/`: Product sync from CJ to Supabase
- `supabase/functions/create-cj-order/`: Order creation in CJ
- `supabase/functions/get-cj-tracking/`: Tracking retrieval from CJ
- `supabase/migrations/`: SQL migrations for CJ tables in Supabase

### Components
- `components/CookieConsent.tsx`: GDPR cookie consent banner
- `components/Header.tsx`: Navigation header (includes Catalogue link)
- `components/admin/TrackingStatus.tsx`: Colissimo tracking widget

### Configuration
- `middleware.ts`: Request interceptor (webhook bypass critical)
- `tailwind.config.js`: Custom color tokens (fetra-olive, fetra-pink)
- `next.config.ts`: Next.js configuration (CJ image domains)
- `messages/fr.json`: French translations (includes Products.* and ProductDetail.*)

## Important Gotchas

1. **Webhook 307 Redirects**: Never redirect `/api/webhooks/*` routes. Stripe requires direct 200/400/500 responses. See `docs/fix-webhook-307-redirect.md`.

2. **Cart Clearing**: Cart is cleared on `/success` page via `ClearCartOnSuccess` component (client-side effect). If user doesn't visit success page, cart persists.

3. **Consent-Gated Scripts**: GA4, GTM, and client Sentry will NOT load until user accepts analytics consent. Always test consent flow.

4. **Brevo List ID**: Newsletter list ID is hardcoded in `app/api/newsletter/route.ts:27`. Update when changing Brevo lists.

5. **Image Optimization**: Product images use LQIP (Low Quality Image Placeholder) base64 strings. Generate new LQIPs using sharp or online tools if adding images.

6. **Dual Product System**: Site supports both FETRA's original product (`lib/product.ts`) AND CJ catalog products (Supabase). Checkout flow handles mixed carts automatically.

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

16. **OAuth Configuration**: Social login (Google/Apple) requires OAuth credentials in env vars. Follow `docs/oauth-setup.md` for setup instructions. Apple JWT expires every 6 months.

17. **Signup Route Location**: Signup route is at `/api/signup` (NOT `/api/auth/signup`) to avoid conflict with NextAuth's `[...nextauth]` catch-all route.

18. **CJ Pricing Configuration**: Pricing markup configured in TWO places: `app/api/products/cj/route.ts` AND `app/api/products/cj/[sku]/route.ts`. Must update BOTH when changing margin to maintain consistency.

19. **CJ Product Storage**: CJ products stored in Supabase (separate database), NOT in local Prisma. Prisma `Product` model only used for FETRA's original product and SKU references in orders.

20. **Multi-Product Cart**: Cart now supports both FETRA and CJ products. CJ products matched by `cjVariantId`, FETRA products by SKU. Do not assume single-product cart logic.

21. **CJ Metadata in Stripe**: CJ product metadata (`cjProductId`, `cjVariantId`, `variantName`) MUST be included in Stripe line items. Webhook relies on this to create CJ orders. Missing metadata means no CJ fulfillment.

22. **CJ Image Domains**: CJ product images hosted on `oss-cf.cjdropshipping.com`. This domain MUST be in `next.config.ts` `images.remotePatterns` or images won't load.

23. **Price Validation**: Checkout validates prices server-side against Supabase for CJ products. Client-submitted prices are NEVER trusted. Mismatches result in checkout failure.

24. **Stock Management**: CJ stock managed in Supabase `products` table. Stock decremented on successful payment. No automatic stock sync from CJ (manual sync required).

25. **Database Migrations (User Preference)**: Use `npx prisma db push` to apply schema changes (user's preferred method from global CLAUDE.md). Avoid `prisma migrate dev` unless creating versioned migrations for production.

## Development Workflow Tips

- **Stripe Testing**: Use test card `4242 4242 4242 4242` with any future date and CVC
- **Webhook Testing**: Use Stripe CLI to forward webhooks to localhost (see Commands section)
- **Consent Testing**: Test in incognito mode to reset consent state
- **Email Testing**: Check Brevo logs (API → Transactional → Logs) for email delivery status
- **Error Monitoring**: Server errors go to Sentry automatically. Client errors require analytics consent.
- **Colissimo Testing**: Use sandbox tracking numbers from `SANDBOX_TRACKING_NUMBERS` in `lib/integrations/colissimo.ts`
- **Admin Access**: Login at `/admin/login` with credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars
- **CJ Product Sync**: Test product sync at `/admin/cj/products` - requires Supabase Edge Functions deployed
- **CJ Catalog Testing**: Visit `/products` to see synced products, test search and filters
- **Multi-Product Cart**: Test mixed cart with both FETRA product and CJ products
- **CJ Edge Functions Logs**: Check Supabase Dashboard → Edge Functions → Logs for CJ API errors
- **Price Markup**: Default 2.5x coefficient means CJ price of €10 becomes €25 in catalog

## Deployment Notes

- **Platform**: Vercel (optimized for Next.js)
- **Domain**: www.fetrabeauty.com (canonical domain)
- **SSL**: Automatic via Vercel (Let's Encrypt)
- **Environment Variables**: Set in Vercel dashboard under Settings → Environment Variables
- **Important**: Always redeploy after changing environment variables

## Documentation

### Main Documentation
- `CATALOGUE-CJ-README.md`: Quick start guide for CJ catalog (French)
- `docs/cj-catalog-implementation.md`: Complete CJ catalog architecture
- `docs/cj-dropshipping-integration.md`: CJ Dropshipping integration guide
- `supabase/README.md`: Supabase Edge Functions documentation

### Additional Guides in `docs/`
- `webhook-troubleshooting.md`: Debug webhook 307/404 issues
- `fix-webhook-307-redirect.md`: Middleware configuration for webhooks
- `email-deliverability-guide.md`: Avoid spam folder
- `brevo-newsletter-setup.md`: Configure Brevo lists and templates
- `email-automation.md`: Email automation workflows
- `oauth-setup.md`: Google/Apple OAuth configuration
- `prisma-nextauth-migration-guide.md`: Prisma + NextAuth setup
- `apply-supabase-migrations.md`: Supabase migration instructions
- `configure-cj-secrets.md`: CJ API credentials setup
- `deploy-edge-functions.md`: Deploy Supabase Edge Functions
- `troubleshooting-cj-sync.md`: Debug CJ product sync issues
- `google-ads-setup-strategy.md`: Complete Google Ads setup and strategy guide
