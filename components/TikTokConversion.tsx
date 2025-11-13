'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * TikTok Conversion Tracking Component
 * Tracks purchase completion when user lands on success page
 */
export default function TikTokConversion() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) return;

    // Fetch order details to get accurate conversion data
    const trackConversion = async () => {
      try {
        const response = await fetch(`/api/order-details?session_id=${sessionId}`);
        if (!response.ok) return;

        const data = await response.json();
        
        // Track TikTok CompletePayment event
        if (typeof window !== 'undefined' && (window as any).ttq && data.session) {
          const orderValue = data.session.amount_total ? data.session.amount_total / 100 : 0;
          
          (window as any).ttq.track('CompletePayment', {
            content_type: 'product',
            value: orderValue,
            currency: data.session.currency?.toUpperCase() || 'EUR',
            description: `Order ${sessionId.slice(-8)}`
          });

          console.log('TikTok Pixel: CompletePayment tracked', {
            value: orderValue,
            currency: data.session.currency?.toUpperCase() || 'EUR'
          });
        }
      } catch (error) {
        console.error('TikTok Conversion tracking error:', error);
      }
    };

    // Wait a bit to ensure TikTok Pixel is loaded
    const timer = setTimeout(trackConversion, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return null;
}

