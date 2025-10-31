import { NextResponse } from 'next/server';
import { getActiveProducts } from '@/lib/db/products';

/**
 * GET /api/products
 * Get all active products (public)
 */
export async function GET(request: Request) {
  try {
    const products = await getActiveProducts();

    return NextResponse.json({
      products,
      total: products.length
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
