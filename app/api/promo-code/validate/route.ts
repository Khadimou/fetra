import { NextResponse } from 'next/server';
import { validatePromoCode } from '@/lib/promo-codes';

/**
 * POST /api/promo-code/validate
 * Validate a promo code
 */
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code promo requis' },
        { status: 400 }
      );
    }

    const result = await validatePromoCode(code);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      promoCode: result.promoCode
    });
  } catch (error: any) {
    console.error('Promo code validation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation du code promo' },
      { status: 500 }
    );
  }
}
