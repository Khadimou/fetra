/**
 * Supabase Edge Function: create-cj-order
 * Creates an order in CJ Dropshipping from a Supabase order
 *
 * Usage:
 *   POST /create-cj-order
 *   Body: { orderId: "uuid" } // Supabase order ID
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createOrder, CJOrderRequest } from '../_shared/cj-api/index.ts';

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
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Creating CJ order for:', orderId);

    // Fetch order from Supabase
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      );
    }

    // Check if order already has a CJ order ID
    if (order.cj_order_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Order already submitted to CJ Dropshipping',
          cjOrderId: order.cj_order_id,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Map Supabase order to CJ order format
    const shippingAddress = order.shipping_address;
    const items = order.items;

    // Build CJ order request
    const cjOrderData: CJOrderRequest = {
      orderNumber: order.order_number,
      shippingCustomerName: shippingAddress.name,
      shippingAddress: shippingAddress.address,
      shippingAddress2: shippingAddress.address2 || '',
      shippingCity: shippingAddress.city,
      shippingProvince: shippingAddress.province || shippingAddress.state || '',
      shippingCountry: shippingAddress.country,
      shippingCountryCode: shippingAddress.countryCode,
      shippingZip: shippingAddress.zip,
      shippingPhone: shippingAddress.phone,
      email: shippingAddress.email,
      remark: order.notes || '',
      products: items.map((item: any) => ({
        vid: item.cj_variant_id || item.cj_product_id,
        quantity: item.quantity,
        storeLineItemId: item.id || String(Math.random()),
      })),
      shopAmount: Number(order.total_amount),
    };

    console.log('Submitting order to CJ:', cjOrderData);

    try {
      // Create order in CJ Dropshipping
      const cjOrderResponse = await createOrder(cjOrderData);

      console.log('CJ order created:', cjOrderResponse);

      // Update Supabase order with CJ order ID
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          cj_order_id: cjOrderResponse.orderId,
          status: 'processing',
          cj_order_created_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Failed to update order with CJ order ID:', updateError);
        // Don't fail the entire request, as order was created in CJ
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Order created in CJ Dropshipping',
          orderId: order.id,
          cjOrderId: cjOrderResponse.orderId,
          cjOrderNum: cjOrderResponse.orderNum,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (cjError) {
      console.error('CJ API error:', cjError);

      // Update order status to failed
      await supabase
        .from('orders')
        .update({
          status: 'failed',
          notes: `CJ API Error: ${cjError.message}`,
        })
        .eq('id', orderId);

      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to create order in CJ Dropshipping: ${cjError.message}`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('Error creating CJ order:', error);

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
