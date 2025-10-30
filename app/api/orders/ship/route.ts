import { NextResponse } from 'next/server';
import { sendShippingConfirmationEmail } from '../../../../lib/integrations/brevo';
import { captureException } from '../../../../lib/sentry';

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail, customerName, trackingNumber, carrier } = await request.json();

    // Validation
    if (!orderId || !customerEmail || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, customerEmail, trackingNumber' },
        { status: 400 }
      );
    }

    // Generate tracking URL based on carrier
    let trackingUrl = '';
    const carrierLower = (carrier || '').toLowerCase();

    if (carrierLower.includes('colissimo') || carrierLower.includes('laposte')) {
      trackingUrl = `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
    } else if (carrierLower.includes('mondial') || carrierLower.includes('relay')) {
      trackingUrl = `https://www.mondialrelay.fr/suivi-de-colis/${trackingNumber}`;
    } else if (carrierLower.includes('ups')) {
      trackingUrl = `https://www.ups.com/track?tracknum=${trackingNumber}`;
    } else if (carrierLower.includes('dhl')) {
      trackingUrl = `https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`;
    } else {
      // Generic tracking URL or fallback
      trackingUrl = `https://track.aftership.com/${trackingNumber}`;
    }

    // Send shipping confirmation email via Brevo
    try {
      await sendShippingConfirmationEmail(
        customerEmail,
        customerName || 'Client',
        {
          orderNumber: `FETRA-${orderId.slice(-8).toUpperCase()}`,
          trackingUrl: trackingUrl
        }
      );

      console.log('Shipping confirmation email sent:', {
        email: customerEmail,
        orderId: orderId,
        trackingNumber: trackingNumber,
        carrier: carrier || 'unknown'
      });

      return NextResponse.json({
        success: true,
        message: 'Shipping confirmation email sent',
        trackingUrl: trackingUrl
      });
    } catch (emailError: any) {
      console.error('Shipping confirmation email error:', emailError.message);
      
      // Log to Sentry but don't fail the request
      captureException(emailError, {
        orderId,
        customerEmail,
        trackingNumber,
        carrier
      });

      return NextResponse.json(
        { error: 'Failed to send shipping confirmation email', details: emailError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Ship notification error:', error);
    captureException(error);
    
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
