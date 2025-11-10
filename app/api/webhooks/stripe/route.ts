import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { upsertContactHubspot } from '../../../../lib/integrations/hubspot';
import { addContactBrevo, sendOrderConfirmationEmail } from '../../../../lib/integrations/brevo';
import { upsertCustomer, createOrder, updateOrderStatus } from '../../../../lib/db/orders';
import { getProductBySku, decrementStock } from '../../../../lib/db/products';
import { createCjOrder } from '../../../../lib/integrations/cj-dropshipping';
import type { CJOrderRequest, CJOrderResponse } from '../../../../lib/types/cj';
import { OrderStatus } from '@prisma/client';
import prisma from '../../../../lib/db/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } else {
      // Parse event without verification (development only)
      try {
        event = JSON.parse(payload);
      } catch (e) {
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
      }
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerName = session.customer_details?.name || '';
      const orderId = session.id;
      const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

      if (!customerEmail) {
        console.warn('No customer email in checkout session');
        return NextResponse.json({ received: true });
      }

      // 0) Save order to database with Prisma
      try {
        // Split customer name
        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Create or get customer
        const customer = await upsertCustomer(customerEmail, {
          firstName,
          lastName
        });

        // Get line items from Stripe to save order items
        let orderItems: Array<{
          productSku: string;
          productName: string;
          quantity: number;
          unitPrice: number;
          cjVariantId?: string;
          cjProductId?: string;
        }> = [];
        if (process.env.STRIPE_SECRET_KEY) {
          try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ['line_items', 'line_items.data.price.product']
            });

            if (fullSession.line_items?.data) {
              orderItems = fullSession.line_items.data.map((item) => {
                // Extract metadata from product
                const product = item.price?.product;
                const metadata = typeof product === 'object' && product !== null 
                  ? (product as any).metadata 
                  : {};

                return {
                  productSku: metadata.sku || item.price?.product as string || 'FETRA-RIT-001',
                  productName: item.description || 'Rituel Visage Liftant',
                  quantity: item.quantity || 1,
                  unitPrice: (item.price?.unit_amount || 0) / 100,
                  cjVariantId: metadata.cjVariantId,
                  cjProductId: metadata.cjProductId,
                };
              });
            }
          } catch (err: any) {
            console.error('Error fetching line items:', err.message);
          }
        }

        // Fallback: if no line items, use default product
        if (orderItems.length === 0) {
          orderItems = [{
            productSku: 'FETRA-RIT-001',
            productName: 'Rituel Visage Liftant',
            quantity: 1,
            unitPrice: amountTotal
          }];
        }

        // Create order
        const order = await createOrder({
          customerId: customer.id,
          amount: amountTotal,
          currency: session.currency || 'EUR',
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent as string || undefined,
          items: orderItems,
          metadata: {
            paymentStatus: session.payment_status,
            shippingDetails: (session as any).shipping_details
          }
        });

        // Decrement stock for each order item
        for (const item of orderItems) {
          try {
            const product = await getProductBySku(item.productSku);
            if (product) {
              const result = await decrementStock(product.id, item.quantity);
              if (result) {
                console.log(`Stock decremented for ${item.productSku}: ${item.quantity} units`);
              } else {
                console.warn(`Insufficient stock for ${item.productSku}, but order was already paid`);
              }
            } else {
              console.warn(`Product not found in database: ${item.productSku}`);
            }
          } catch (stockErr: any) {
            console.error(`Error decrementing stock for ${item.productSku}:`, stockErr.message);
            // Non-blocking - order is already created and paid
          }
        }

        // Mark as paid
        await updateOrderStatus(order.id, OrderStatus.PAID);

        console.log('Order created in database:', order.orderNumber);

        // 4) Create order in CJ Dropshipping (if configured)
        // Check if Supabase is configured (for Edge Functions) or direct API
        const isCjConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const isCjDirectApi = process.env.CJ_CLIENT_ID && process.env.CJ_CLIENT_SECRET;
        
        if (isCjConfigured || isCjDirectApi) {
          try {
            // Get shipping details from Stripe session
            const shippingDetails = (session as any).shipping_details;
            const shippingAddress = shippingDetails?.address;

            if (!shippingAddress) {
              console.warn('No shipping address found in Stripe session, skipping CJ order creation');
            } else {
              // Map order items to CJ products
              // NOTE: You need to configure CJ variant IDs (vid) in your product metadata or database
              // For now, we'll use a default mapping or store vid in order item metadata
              // Fetch order with items to get order item IDs
              const orderWithItems = await prisma.order.findUnique({
                where: { id: order.id },
                include: { items: true },
              });

              const cjProducts = await Promise.all(
                orderItems.map(async (item, index) => {
                  // Priority 1: Use cjVariantId from line item metadata (from checkout)
                  let cjVariantId: string | null = item.cjVariantId || null;
                  
                  // Priority 2: Try to get CJ variant ID from product in database
                  if (!cjVariantId) {
                    try {
                      const product = await getProductBySku(item.productSku);
                      if (product?.cjVariantId) {
                        cjVariantId = product.cjVariantId;
                      }
                    } catch (err) {
                      console.warn(`Could not fetch product ${item.productSku}:`, err);
                    }
                  }
                  
                  // Priority 3: Fallback to environment variable
                  if (!cjVariantId) {
                    cjVariantId = process.env.CJ_DEFAULT_VARIANT_ID || null;
                  }
                  
                  // Skip CJ order creation for products without CJ variant ID
                  if (!cjVariantId) {
                    console.warn(`No CJ variant ID for product ${item.productSku}, skipping CJ fulfillment`);
                    return null;
                  }

                  return {
                    vid: cjVariantId,
                    quantity: item.quantity,
                    storeLineItemId: orderWithItems?.items[index]?.id || String(index + 1),
                  };
                })
              );

              // Filter out null products (non-CJ products)
              const validCjProducts = cjProducts.filter((p): p is NonNullable<typeof p> => p !== null);

              // Only create CJ order if there are CJ products
              if (validCjProducts.length === 0) {
                console.log('No CJ products in order, skipping CJ order creation');
              } else {
                // Build CJ order request
                const cjOrderData: CJOrderRequest = {
                  orderNumber: order.orderNumber,
                  shippingCustomerName: customerName || `${firstName} ${lastName}`.trim(),
                  shippingAddress: shippingAddress.line1 || '',
                  shippingAddress2: shippingAddress.line2 || '',
                  shippingCity: shippingAddress.city || '',
                  shippingProvince: shippingAddress.state || '',
                  shippingCountry: shippingAddress.country || 'FR',
                  shippingCountryCode: shippingAddress.country || 'FR',
                  shippingZip: shippingAddress.postal_code || '',
                  shippingPhone: customer.phone || '',
                  email: customerEmail,
                  remark: `Order from Stripe: ${order.orderNumber}`,
                  products: validCjProducts,
                  shopAmount: amountTotal,
                };

                console.log('Creating CJ order for:', order.orderNumber);
                const cjOrderResponse: CJOrderResponse = await createCjOrder(cjOrderData);

                console.log('CJ order created successfully:', {
                  orderId: order.id,
                  cjOrderId: cjOrderResponse.orderId,
                  cjOrderNum: cjOrderResponse.orderNum,
                });

                // Update order with CJ order ID
                await prisma.order.update({
                  where: { id: order.id },
                  data: {
                    cjOrderId: cjOrderResponse.orderId,
                    cjOrderNum: cjOrderResponse.orderNum,
                  },
                });

                console.log('Order updated with CJ order ID');
              }
            }
          } catch (cjError: any) {
            // Non-blocking - log error but don't fail the webhook
            console.error('Error creating CJ order:', cjError.message);
            console.error('CJ order creation failed, but order was already created and paid');
            // Optionally, you could store the error in order metadata for later retry
          }
        } else {
          console.log('CJ Dropshipping not configured. Please configure either Supabase (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY) or direct API (CJ_CLIENT_ID + CJ_CLIENT_SECRET)');
        }
      } catch (err: any) {
        console.error('Error saving order:', err.message);
      }

      // 1) Upsert contact in HubSpot
      try {
        const nameParts = customerName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        await upsertContactHubspot(customerEmail, {
          email: customerEmail,
          firstname: firstName,
          lastname: lastName,
          last_order_id: orderId,
          last_order_amount: amountTotal,
          last_order_date: new Date().toISOString()
        });

        console.log('HubSpot contact updated:', customerEmail);
      } catch (err: any) {
        // Non-blocking - log error but continue
        console.error('HubSpot upsert error:', err.message);
      }

      // 2) Add contact to Brevo
      try {
        await addContactBrevo(customerEmail, {
          FIRSTNAME: customerName.split(' ')[0] || '',
          LASTNAME: customerName.split(' ').slice(1).join(' ') || '',
          LAST_ORDER_ID: orderId,
          LAST_ORDER_AMOUNT: amountTotal,
          LAST_ORDER_DATE: new Date().toISOString()
        });

        console.log('Brevo contact added:', customerEmail);
      } catch (err: any) {
        // Non-blocking
        console.error('Brevo upsert error:', err.message);
      }

      // 3) Send order confirmation email via Brevo (do this regardless of fetching line items)
      try {
        const orderDate = new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        await sendOrderConfirmationEmail(
          customerEmail,
          customerName,
          {
            orderNumber: `FETRA-${orderId.slice(-8).toUpperCase()}`,
            orderDate: orderDate,
            orderTotal: amountTotal.toFixed(2).replace('.', ','),
            currency: '€'
          }
        );

        console.log('Order confirmation email sent:', customerEmail);
      } catch (err: any) {
        // Non-blocking - log error but continue
        console.error('Order confirmation email error:', err.message);
      }

    }

    // Handle payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      console.log('Payment succeeded:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      });

      // Additional logic for successful payments
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

