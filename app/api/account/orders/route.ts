import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/account/orders
 * Get current user's orders
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Get user with customer relation
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { customer: true }
    });

    if (!user?.customer) {
      return NextResponse.json({
        orders: [],
        total: 0
      });
    }

    // Get customer's orders
    const orders = await prisma.order.findMany({
      where: {
        customerId: user.customer.id
      },
      include: {
        items: true,
        shipping: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      orders,
      total: orders.length
    });
  } catch (error: any) {
    console.error('Get user orders error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
