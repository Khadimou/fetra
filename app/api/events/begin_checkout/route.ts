import { NextResponse } from 'next/server';
import { trackEventHubspot } from '../../../../lib/integrations/hubspot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, price, quantity, email } = body;

    // Validate input
    if (!sku || !price || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: sku, price, quantity' },
        { status: 400 }
      );
    }

    // Log the event
    console.log('begin_checkout event:', {
      sku,
      price,
      quantity,
      total: price * quantity,
      timestamp: new Date().toISOString()
    });

    // Track event in HubSpot (if email is provided)
    if (email && process.env.HUBSPOT_API_KEY) {
      try {
        await trackEventHubspot(email, 'pe_begin_checkout_event', {
          sku,
          price,
          quantity,
          total: price * quantity
        });
        console.log('HubSpot event tracked for:', email);
      } catch (err: any) {
        // Non-blocking
        console.error('HubSpot event tracking error:', err.message);
      }
    }

    // You can also:
    // - Send event to Google Analytics
    // - Track in Brevo
    // - Log to your analytics system

    return NextResponse.json({
      ok: true,
      event: 'begin_checkout',
      data: { sku, price, quantity }
    });
  } catch (error: any) {
    console.error('Begin checkout event error:', error);
    return NextResponse.json(
      { error: error?.message || 'Event tracking failed' },
      { status: 500 }
    );
  }
}

