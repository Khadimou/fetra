import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    // Get the authenticated user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      );
    }

    // Fetch all orders for this customer
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        items: true,
        shippingInfo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        amount: parseFloat(order.amount.toString()),
        currency: order.currency,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        items: order.items.map((item) => ({
          productSku: item.productSku,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice.toString()),
          totalPrice: parseFloat(item.totalPrice.toString()),
        })),
        shipping: order.shippingInfo
          ? {
              trackingNumber: order.shippingInfo.trackingNumber,
              carrier: order.shippingInfo.carrier,
              trackingUrl: order.shippingInfo.trackingUrl,
              recipientName: order.shippingInfo.recipientName,
              city: order.shippingInfo.city,
              country: order.shippingInfo.country,
              shippedAt: order.shippingInfo.shippedAt,
              deliveredAt: order.shippingInfo.deliveredAt,
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error("Customer orders fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}
