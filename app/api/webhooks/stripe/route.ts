import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { upsertContactHubspot } from '../../../../lib/integrations/hubspot';
import { addContactBrevo } from '../../../../lib/integrations/brevo';

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-09-30.clover'
      });

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

      // Optionally: retrieve full session with line items
      if (process.env.STRIPE_SECRET_KEY) {
        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-09-30.clover'
          });
          
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items']
          });

          console.log('Order details:', {
            orderId: fullSession.id,
            email: customerEmail,
            amount: amountTotal,
            items: fullSession.line_items?.data.length || 0
          });

          // Here you could:
          // - Create a ticket in Freshdesk for order confirmation
          // - Send order confirmation email via Brevo
          // - Log order in a database
        } catch (err: any) {
          console.error('Error retrieving full session:', err.message);
        }
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

