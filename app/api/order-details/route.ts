// app/api/order-details/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Configuration Stripe manquante' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details']
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 });
    }

    // Extraire les informations importantes
    const orderDetails = {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase(),
      paymentStatus: session.payment_status,
      orderDate: new Date(session.created * 1000).toISOString(),
      items: session.line_items?.data.map(item => ({
        name: item.description,
        quantity: item.quantity,
        amount: item.amount_total ? item.amount_total / 100 : 0
      })) || [],
      shippingAddress: session.customer_details?.address ? {
        line1: session.customer_details.address.line1,
        line2: session.customer_details.address.line2,
        city: session.customer_details.address.city,
        postal_code: session.customer_details.address.postal_code,
        country: session.customer_details.address.country
      } : null
    };

    return NextResponse.json({ 
      success: true, 
      order: orderDetails 
    });

  } catch (error) {
    console.error('Erreur récupération détails commande:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la récupération des détails' 
    }, { status: 500 });
  }
}
