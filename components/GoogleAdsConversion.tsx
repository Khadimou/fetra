'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPurchaseEnhanced } from '@/lib/google-ads';

/**
 * Google Ads Conversion Tracking Component with Enhanced Conversions
 *
 * Tracks purchase conversion on the success page after a successful order.
 * Uses Enhanced Conversions with hashed customer data for better tracking.
 *
 * ✅ Works WITHOUT marketing consent (uses first-party data)
 * ✅ Higher conversion match rate (~70% vs ~50% with cookies only)
 * ✅ GDPR compliant (data is hashed client-side)
 *
 * Usage:
 * Add to success page: <GoogleAdsConversion />
 */
export default function GoogleAdsConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackConversion = async () => {
      try {
        // Get order details from URL params
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          console.warn('[Google Ads] No session_id in URL');
          return;
        }

        // Fetch order details from API
        const response = await fetch(`/api/order-details?session_id=${sessionId}`);
        if (!response.ok) {
          console.error('[Google Ads] Failed to fetch order details');
          return;
        }

        const data = await response.json();

        if (data.success && data.order) {
          const { sessionId, amountTotal, currency, customerEmail, customerName, shippingAddress } = data.order;

          // Parse customer name
          const nameParts = customerName?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Track purchase with Enhanced Conversions
          await trackPurchaseEnhanced(
            sessionId,
            amountTotal,
            currency || 'EUR',
            {
              email: customerEmail,
              firstName: firstName,
              lastName: lastName,
              street: shippingAddress?.line1,
              city: shippingAddress?.city,
              postalCode: shippingAddress?.postal_code,
              country: shippingAddress?.country,
            }
          );

          console.log('[Google Ads] Enhanced purchase conversion tracked:', {
            transactionId: sessionId,
            amount: amountTotal,
            currency,
            hasCustomerData: !!customerEmail,
          });
        }
      } catch (error) {
        console.error('[Google Ads] Error tracking conversion:', error);
      }
    };

    // Small delay to ensure Google Ads script is loaded
    const timer = setTimeout(() => {
      trackConversion();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return null;
}
