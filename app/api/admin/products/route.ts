import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getAllProducts, createProduct } from '@/lib/db/products';

/**
 * GET /api/admin/products
 * Get all products (admin only)
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
    const products = await getAllProducts();

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

/**
 * POST /api/admin/products
 * Create a new product (admin only)
 */
export async function POST(request: Request) {
  // Check admin authentication
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { sku, name, description, price, stock, lowStockThreshold, imageUrl, isActive } = body;

    // Validation
    if (!sku || !name || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const product = await createProduct({
      sku,
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : undefined,
      imageUrl,
      isActive
    });

    return NextResponse.json({
      product,
      message: 'Produit créé avec succès'
    });
  } catch (error: any) {
    console.error('Create product error:', error);

    // Handle unique constraint violation (duplicate SKU)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ce SKU existe déjà' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
