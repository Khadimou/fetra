import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';

/**
 * PATCH /api/admin/reviews/[reviewId]
 * Approve or reject a review (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
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
    const { reviewId } = await params;
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'isApproved must be a boolean' },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { isApproved }
    });

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[reviewId]
 * Delete a review (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
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
    const { reviewId } = await params;

    await prisma.review.delete({
      where: { id: reviewId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
