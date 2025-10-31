import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getAllOrders } from '@/lib/db/orders';

/**
 * GET /api/admin/orders
 * Get all orders (admin only)
 */
export async function GET(request: Request) {
  // Check admin authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const orders = getAllOrders();

    return NextResponse.json({
      orders,
      total: orders.length
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
