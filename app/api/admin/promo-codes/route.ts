import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { prisma } from '@/lib/db/prisma';
import { createCustomPromoCode } from '@/lib/promo-codes';
import { PromoCodeType, DiscountType } from '@prisma/client';

/**
 * GET /api/admin/promo-codes
 * Get all promo codes with stats (admin only)
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
    // Get all promo codes
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get stats
    const stats = {
      total: await prisma.promoCode.count(),
      active: await prisma.promoCode.count({ where: { isActive: true } }),
      used: await prisma.promoCode.count({ where: { currentUses: { gt: 0 } } }),
      newsletter: await prisma.promoCode.count({ where: { type: 'NEWSLETTER' } })
    };

    return NextResponse.json({
      promoCodes,
      stats
    });
  } catch (error: any) {
    console.error('Get promo codes error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/promo-codes
 * Create a new promo code (admin only)
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
    const { code, type, discountType, discountValue, maxUses, validDays } = body;

    // Validation
    if (!code || !type || !discountType || !discountValue) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // Calculate expiration date
    const validUntil = validDays
      ? new Date(Date.now() + validDays * 24 * 60 * 60 * 1000)
      : null;

    // Create promo code
    const promoCode = await createCustomPromoCode({
      code: code.toUpperCase().trim(),
      type: type as PromoCodeType,
      discountType: discountType as DiscountType,
      discountValue: parseFloat(discountValue),
      maxUses: maxUses ? parseInt(maxUses) : undefined,
      validUntil: validUntil || undefined
    });

    return NextResponse.json({ promoCode });
  } catch (error: any) {
    console.error('Create promo code error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
