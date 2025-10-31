import { NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
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
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
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
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      );
    }

    // Check if already shipped
    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      return NextResponse.json(
        { error: 'Commande déjà expédiée' },
        { status: 400 }
      );
    }

    // Extract shipping details from order metadata
    const metadata = order.metadata as any;
    const shippingDetails = metadata?.shippingDetails || {};

    // Mark as shipped in database
    const updatedOrder = await markAsShipped(orderId, {
      trackingNumber,
      carrier: carrier?.toUpperCase() as any || 'COLISSIMO',
      recipientName: shippingDetails.name || `${order.customer.firstName} ${order.customer.lastName}`.trim() || 'Client',
      recipientEmail: order.customer.email,
      recipientPhone: shippingDetails.phone,
      street: shippingDetails.address?.line1 || 'N/A',
      street2: shippingDetails.address?.line2,
      city: shippingDetails.address?.city || 'N/A',
      postalCode: shippingDetails.address?.postal_code || '00000',
      country: shippingDetails.address?.country || 'FR'
    });
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la commande' },
        { status: 500 }
      );
    }

    // Send shipping confirmation email via Brevo (non-blocking)
    try {
      const orderNumber = `FETRA-${orderId.slice(-8).toUpperCase()}`;
      const trackingUrl = `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;

      await sendShippingConfirmationEmail(
        updatedOrder.customer.email,
        updatedOrder.customer.firstName || 'Client',
        {
          orderNumber,
          trackingUrl
        }
      );

      console.log('Shipping confirmation email sent:', updatedOrder.customer.email);
    } catch (emailError: any) {
      console.error('Error sending shipping email:', emailError.message);
      // Non-blocking - continue even if email fails
    }

    // Update HubSpot contact (non-blocking)
    try {
      await upsertContactHubspot(updatedOrder.customer.email, {
        email: updatedOrder.customer.email,
        last_order_status: 'shipped',
        last_tracking_number: trackingNumber
      });

      console.log('HubSpot contact updated with shipping info:', updatedOrder.customer.email);
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
