import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db/products';

/**
 * GET /api/admin/products/[productId]
 * Get a specific product (admin only)
 */
export async function GET(
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
    const product = await getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/products/[productId]
 * Update a product (admin only)
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

    // Check if product exists
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(body.lowStockThreshold);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const product = await updateProduct(productId, updateData);

    return NextResponse.json({
      product,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/[productId]
 * Soft delete a product (admin only)
 */
export async function DELETE(
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

    // Check if product exists
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      );
    }

    await deleteProduct(productId);

    return NextResponse.json({
      message: 'Produit désactivé avec succès'
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
