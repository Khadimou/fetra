import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getProduct, updateStock } from '@/lib/db/products';

/**
 * PATCH /api/admin/products/[productId]/stock
 * Update product stock quantity (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  // Check admin authentication
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    );
  }

  try {
    const { productId } = await params;
    const body = await request.json();
    const { stock } = body;

    // Validation
    if (stock === undefined || stock < 0) {
      return NextResponse.json(
        { error: 'Quantité de stock invalide' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      );
    }

    const product = await updateStock(productId, parseInt(stock));

    return NextResponse.json({
      product,
      message: 'Stock mis à jour avec succès'
    });
  } catch (error: any) {
    console.error('Update stock error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
