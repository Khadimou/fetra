/**
 * Supabase Edge Function: get-cj-tracking
 * Retrieves tracking information for an order from CJ Dropshipping
 *
 * Usage:
 *   POST /get-cj-tracking
 *   Body: { orderId: "uuid" } // Supabase order ID
 *   OR
 *   Body: { cjOrderId: "string" } // CJ order ID
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getOrderTracking } from '../_shared/cj-api/index.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const { orderId, cjOrderId, orderNumber } = await req.json();

    let order: any = null;
    let cjOrderNum: string | null = null;

    // Get order from Supabase if orderId provided
    if (orderId) {
      console.log('Fetching order by ID:', orderId);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Order not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      order = data;
      cjOrderNum = order.cj_order_id || order.order_number;
    } else if (cjOrderId) {
      cjOrderNum = cjOrderId;
    } else if (orderNumber) {
      console.log('Fetching order by order number:', orderNumber);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: 'Order not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      order = data;
      cjOrderNum = order.cj_order_id || order.order_number;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId, cjOrderId, or orderNumber is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!cjOrderNum) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order has not been submitted to CJ Dropshipping yet' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Fetching tracking info from CJ for:', cjOrderNum);

    try {
      // Get tracking info from CJ Dropshipping
      const trackingInfo = await getOrderTracking(cjOrderNum);

      console.log('Tracking info received:', trackingInfo);

      // Update Supabase order with latest tracking info (if we have the order)
      if (order) {
        const updateData: any = {
          status: mapCjStatusToOurStatus(trackingInfo.orderStatus),
        };

        if (trackingInfo.trackingNumber) {
          updateData.tracking_number = trackingInfo.trackingNumber;
        }

        if (trackingInfo.logisticName) {
          updateData.logistic_name = trackingInfo.logisticName;
        }

        if (trackingInfo.shippingTime) {
          updateData.cj_shipped_at = trackingInfo.shippingTime;
        }

        if (trackingInfo.deliveredTime) {
          updateData.cj_delivered_at = trackingInfo.deliveredTime;
        }

        const { error: updateError } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', order.id);

        if (updateError) {
          console.error('Failed to update order with tracking info:', updateError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          tracking: trackingInfo,
          orderStatus: mapCjStatusToOurStatus(trackingInfo.orderStatus),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (cjError) {
      console.error('CJ API error:', cjError);

      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to get tracking info from CJ Dropshipping: ${cjError.message}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('Error getting tracking info:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

/**
 * Map CJ order status to our internal status
 */
function mapCjStatusToOurStatus(cjStatus: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'processing': 'processing',
    'payment_confirmed': 'payment_confirmed',
    'in_production': 'processing',
    'shipped': 'shipped',
    'in_transit': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
    'failed': 'failed',
  };

  return statusMap[cjStatus.toLowerCase()] || 'processing';
}
