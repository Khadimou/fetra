import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';

/**
 * DELETE /api/admin/promo-codes/[codeId]
 * Delete a promo code (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ codeId: string }> }
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
    const { codeId } = await params;

    await prisma.promoCode.delete({
      where: { id: codeId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete promo code error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
