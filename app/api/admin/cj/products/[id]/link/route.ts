/**
 * API Route: Link CJ product to local product
 * POST /api/admin/cj/products/[id]/link
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: cjProductId } = params;

    // Parse request body
    const body = await request.json();
    const { productId, cjVariantId } = body;

    if (!productId || !cjVariantId) {
      return NextResponse.json(
        { error: 'productId and cjVariantId are required' },
        { status: 400 }
      );
    }

    // Update the local product with CJ variant ID
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        cjVariantId,
        cjProductId,
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error linking CJ product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to link product',
      },
      { status: 500 }
    );
  }
}
