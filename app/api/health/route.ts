import { NextResponse } from 'next/server';

/**
 * Health check endpoint to verify environment variables configuration
 * Does NOT expose actual values, only checks if they exist
 */
export async function GET() {
  const checks = {
    stripe_secret: !!process.env.STRIPE_SECRET_KEY,
    stripe_public: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    stripe_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    brevo_api_key: !!process.env.BREVO_API_KEY,
    brevo_template_confirm: !!process.env.BREVO_TEMPLATE_ORDER_CONFIRM,
    brevo_template_shipped: !!process.env.BREVO_TEMPLATE_SHIPPED,
    base_url: process.env.NEXT_PUBLIC_BASE_URL || 'not set',
    node_env: process.env.NODE_ENV || 'not set',
  };

  const allStripeKeysPresent = checks.stripe_secret && checks.stripe_public;
  
  return NextResponse.json({
    status: allStripeKeysPresent ? 'healthy' : 'missing_stripe_keys',
    timestamp: new Date().toISOString(),
    checks,
    message: allStripeKeysPresent 
      ? 'All critical environment variables are configured' 
      : '⚠️ Missing Stripe keys - Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel Dashboard'
  });
}
