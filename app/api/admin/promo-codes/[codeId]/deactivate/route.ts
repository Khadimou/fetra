import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { deactivatePromoCode } from '@/lib/promo-codes';

/**
 * POST /api/admin/promo-codes/[codeId]/deactivate
 * Deactivate a promo code (admin only)
 */
export async function POST(
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

    const promoCode = await deactivatePromoCode(codeId);

    return NextResponse.json({ promoCode });
  } catch (error: any) {
    console.error('Deactivate promo code error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la désactivation' },
      { status: 500 }
    );
  }
}
