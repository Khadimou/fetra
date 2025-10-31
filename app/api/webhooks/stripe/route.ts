import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { upsertContactHubspot } from '../../../../lib/integrations/hubspot';
import { addContactBrevo, sendOrderConfirmationEmail } from '../../../../lib/integrations/brevo';
import { upsertCustomer, createOrder, updateOrderStatus } from '../../../../lib/db/orders';
import { getProductBySku, decrementStock } from '../../../../lib/db/products';
import { OrderStatus } from '@prisma/client';

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
        }> = [];
        if (process.env.STRIPE_SECRET_KEY) {
          try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ['line_items']
            });

            if (fullSession.line_items?.data) {
              orderItems = fullSession.line_items.data.map((item) => ({
                productSku: item.price?.product as string || 'FETRA-RIT-001',
                productName: item.description || 'Rituel Visage Liftant',
                quantity: item.quantity || 1,
                unitPrice: (item.price?.unit_amount || 0) / 100
              }));
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

