/**
 * Order Management with Prisma
 * Replaces the file-based system with PostgreSQL database
 */

import prisma from './prisma';
import { Order, OrderStatus, ShippingCarrier, Prisma } from '@prisma/client';

// Extended types with relations
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    items: true;
    shipping: true;
  };
}>;

export type CreateOrderInput = {
  customerId: string;
  amount: number;
  currency?: string;
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  items: {
    productSku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  metadata?: any;
};

/**
 * Create or get customer by email
 */
export async function upsertCustomer(email: string, data?: {
  firstName?: string;
  lastName?: string;
  phone?: string;
}) {
  return prisma.customer.upsert({
    where: { email },
    create: {
      email,
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone: data?.phone
    },
    update: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone: data?.phone
    }
  });
}

/**
 * Create a new order
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderWithRelations> {
  // Generate unique order number
  const orderNumber = `FETRA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: input.customerId,
      amount: input.amount,
      currency: input.currency || 'EUR',
      stripeSessionId: input.stripeSessionId,
      stripePaymentIntent: input.stripePaymentIntent,
      status: OrderStatus.PENDING,
      metadata: input.metadata || {},
      items: {
        create: input.items.map(item => ({
          productSku: item.productSku,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity
        }))
      }
    },
    include: {
      customer: true,
      items: true,
      shipping: true
    }
  });

  return order;
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<OrderWithRelations | null> {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: true,
      shipping: true
    }
  });
}

/**
 * Get order by Stripe session ID
 */
export async function getOrderByStripeSession(sessionId: string): Promise<OrderWithRelations | null> {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      customer: true,
      items: true,
      shipping: true
    }
  });
}

/**
 * Get all orders with filters
 */
export async function getAllOrders(filters?: {
  status?: OrderStatus;
  customerId?: string;
  limit?: number;
  offset?: number;
}): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: {
      status: filters?.status,
      customerId: filters?.customerId
    },
    include: {
      customer: true,
      items: true,
      shipping: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: filters?.limit,
    skip: filters?.offset
  });
}

/**
 * Get orders by customer email
 */
export async function getOrdersByEmail(email: string): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: {
      customer: {
        email
      }
    },
    include: {
      customer: true,
      items: true,
      shipping: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 10): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    include: {
      customer: true,
      items: true,
      shipping: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order> {
  const updates: any = { status };

  // Update timestamp based on status
  if (status === OrderStatus.PAID) {
    updates.paidAt = new Date();
  } else if (status === OrderStatus.SHIPPED) {
    updates.shippedAt = new Date();
  } else if (status === OrderStatus.DELIVERED) {
    updates.deliveredAt = new Date();
  } else if (status === OrderStatus.CANCELLED) {
    updates.cancelledAt = new Date();
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updates
  });
}

/**
 * Mark order as shipped with tracking info
 */
export async function markAsShipped(
  orderId: string,
  trackingData: {
    trackingNumber: string;
    carrier?: ShippingCarrier;
    recipientName: string;
    recipientEmail: string;
    recipientPhone?: string;
    street: string;
    street2?: string;
    city: string;
    postalCode: string;
    country?: string;
  }
): Promise<OrderWithRelations> {
  const trackingUrl = trackingData.carrier === ShippingCarrier.COLISSIMO
    ? `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingData.trackingNumber}`
    : undefined;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.SHIPPED,
      shippedAt: new Date(),
      shipping: {
        upsert: {
          create: {
            trackingNumber: trackingData.trackingNumber,
            carrier: trackingData.carrier || ShippingCarrier.COLISSIMO,
            trackingUrl,
            recipientName: trackingData.recipientName,
            recipientEmail: trackingData.recipientEmail,
            recipientPhone: trackingData.recipientPhone,
            street: trackingData.street,
            street2: trackingData.street2,
            city: trackingData.city,
            postalCode: trackingData.postalCode,
            country: trackingData.country || 'FR',
            shippedAt: new Date()
          },
          update: {
            trackingNumber: trackingData.trackingNumber,
            carrier: trackingData.carrier || ShippingCarrier.COLISSIMO,
            trackingUrl,
            shippedAt: new Date()
          }
        }
      }
    },
    include: {
      customer: true,
      items: true,
      shipping: true
    }
  });

  return order;
}

/**
 * Mark order as delivered
 */
export async function markAsDelivered(orderId: string): Promise<Order> {
  // Update both order and shipping info
  await prisma.shippingInfo.updateMany({
    where: { orderId },
    data: {
      deliveredAt: new Date()
    }
  });

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.DELIVERED,
      deliveredAt: new Date()
    }
  });
}

/**
 * Get order statistics
 */
export async function getOrderStats() {
  const [
    total,
    pending,
    paid,
    shipped,
    delivered,
    cancelled,
    totalRevenue
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.PAID } }),
    prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    prisma.order.aggregate({
      where: {
        status: {
          in: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
        }
      },
      _sum: {
        amount: true
      }
    })
  ]);

  return {
    total,
    byStatus: {
      pending,
      paid,
      shipped,
      delivered,
      cancelled
    },
    totalRevenue: totalRevenue._sum.amount?.toNumber() || 0
  };
}

// Re-export Prisma types for convenience
export { OrderStatus, ShippingCarrier };
export type { Order };
