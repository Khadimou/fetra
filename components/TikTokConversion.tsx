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
        if (typeof window !== 'undefined' && (window as any).ttq && data.success && data.order) {
          const order = data.order as {
            amountTotal: number;
            currency?: string;
            items: Array<{
              sku?: string;
              name?: string;
              quantity?: number;
              amount?: number;
            }>;
          };

          const orderValue = order.amountTotal || 0;
          const currency = order.currency || 'EUR';
          const contents = order.items?.map((item) => ({
            content_id: item.sku || 'FETRA-RIT-001',
            content_name: item.name || 'Produit FETRA',
            content_type: 'product',
            quantity: item.quantity || 0,
            price: item.amount || 0,
          })) || [];
          const contentIds = contents.map((item) => item.content_id);
          const totalQuantity = contents.reduce((sum, item) => sum + (item.quantity || 0), 0);

          (window as any).ttq.track('CompletePayment', {
            contents,
            content_id: contentIds,
            content_type: 'product',
            value: orderValue,
            currency,
            description: `Order ${sessionId.slice(-8)}`,
            quantity: totalQuantity,
          });

          console.log('TikTok Pixel: CompletePayment tracked', {
            value: orderValue,
            currency,
            contentIds,
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

