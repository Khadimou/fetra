'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trackPurchase } from '@/lib/google-ads';
import { readConsent } from '@/lib/cookies';

/**
 * Google Ads Conversion Tracking Component
 *
 * Tracks purchase conversion on the success page after a successful order.
 * Only fires if user has given marketing consent.
 *
 * Usage:
 * Add to success page: <GoogleAdsConversion />
 */
export default function GoogleAdsConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if Google Ads should track (marketing consent required)
    const checkConsentAndTrack = async () => {
      try {
        // Check consent
        const consent = readConsent();
        if (!consent?.marketing) {
          console.log('[Google Ads] No marketing consent - skipping conversion tracking');
          return;
        }

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

        if (data.order) {
          const { orderNumber, amount, currency } = data.order;

          // Track purchase conversion
          trackPurchase(orderNumber, amount, currency || 'EUR');

          console.log('[Google Ads] Purchase conversion tracked:', {
            orderNumber,
            amount,
            currency,
          });
        }
      } catch (error) {
        console.error('[Google Ads] Error tracking conversion:', error);
      }
    };

    // Small delay to ensure Google Ads script is loaded
    const timer = setTimeout(() => {
      checkConsentAndTrack();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return null;
}
