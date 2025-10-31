import { NextResponse } from 'next/server';
import { getOrder, markAsShipped } from '@/lib/db/orders';
import { sendShippingConfirmationEmail } from '@/lib/integrations/brevo';
import { upsertContactHubspot } from '@/lib/integrations/hubspot';

/**
 * POST /api/orders/[orderId]/ship
 * Mark an order as shipped with tracking number
 * Sends notification emails via Brevo and updates HubSpot
 */
export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const body = await request.json();
    const { trackingNumber, carrier = 'colissimo' } = body;

    // Validation
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Numéro de suivi requis' },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Check if already shipped
    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json(
        { error: 'Commande déjà expédiée' },
        { status: 400 }
      );
    }

    // Mark as shipped in database
    const success = markAsShipped(orderId, trackingNumber, carrier);
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la commande' },
        { status: 500 }
      );
    }

    // Get updated order
    const updatedOrder = getOrder(orderId);
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de la commande' },
        { status: 500 }
      );
    }

    // Send shipping confirmation email via Brevo (non-blocking)
    try {
      const orderNumber = `FETRA-${orderId.slice(-8).toUpperCase()}`;
      const trackingUrl = `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;

      await sendShippingConfirmationEmail(
        order.email,
        order.customerName || 'Client',
        {
          orderNumber,
          trackingUrl
        }
      );

      console.log('Shipping confirmation email sent:', order.email);
    } catch (emailError: any) {
      console.error('Error sending shipping email:', emailError.message);
      // Non-blocking - continue even if email fails
    }

    // Update HubSpot contact (non-blocking)
    try {
      await upsertContactHubspot(order.email, {
        email: order.email,
        last_order_status: 'shipped',
        last_tracking_number: trackingNumber
      });

      console.log('HubSpot contact updated with shipping info:', order.email);
    } catch (hubspotError: any) {
      console.error('Error updating HubSpot:', hubspotError.message);
      // Non-blocking - continue even if HubSpot fails
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Commande marquée comme expédiée'
    });
  } catch (error: any) {
    console.error('Ship order error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
