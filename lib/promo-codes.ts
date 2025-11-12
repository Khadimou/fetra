/**
 * Promo Code Management Utilities
 * Handles generation, validation, and usage tracking of promotional codes
 */

import { prisma } from './db/prisma';
import { PromoCodeType, DiscountType } from '@prisma/client';

/**
 * Generate a unique promo code
 * Format: PREFIX-RANDOM (e.g., NEWSLETTER-A7B3X9)
 */
export function generatePromoCode(prefix: string = 'NEWS'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${code}`;
}

/**
 * Create a newsletter promo code for a subscriber
 */
export async function createNewsletterPromoCode(
  email: string,
  discountPercentage: number = 15,
  validityDays: number = 30
) {
  // Check if subscriber already has an active code
  const existing = await prisma.promoCode.findFirst({
    where: {
      subscriberEmail: email.toLowerCase(),
      type: PromoCodeType.NEWSLETTER,
      isActive: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } }
      ]
    }
  });

  if (existing) {
    return existing;
  }

  // Generate unique code
  let code = generatePromoCode('NEWS');
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const exists = await prisma.promoCode.findUnique({
      where: { code }
    });

    if (!exists) break;

    code = generatePromoCode('NEWS');
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique promo code');
  }

  // Create promo code
  const validUntil = validityDays ? new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000) : null;

  return prisma.promoCode.create({
    data: {
      code,
      type: PromoCodeType.NEWSLETTER,
      discountType: DiscountType.PERCENTAGE,
      discountValue: discountPercentage,
      maxUses: 1, // One-time use per subscriber
      subscriberEmail: email.toLowerCase(),
      validUntil
    }
  });
}

/**
 * Validate and apply a promo code
 * Returns discount info if valid, throws error if invalid
 */
export async function validatePromoCode(code: string) {
  const upperCode = code.toUpperCase().trim();

  const promoCode = await prisma.promoCode.findUnique({
    where: { code: upperCode }
  });

  if (!promoCode) {
    return {
      valid: false,
      error: 'Code promo invalide'
    };
  }

  // Check if active
  if (!promoCode.isActive) {
    return {
      valid: false,
      error: 'Ce code promo n\'est plus actif'
    };
  }

  // Check validity period
  const now = new Date();
  if (promoCode.validFrom > now) {
    return {
      valid: false,
      error: 'Ce code promo n\'est pas encore valide'
    };
  }

  if (promoCode.validUntil && promoCode.validUntil < now) {
    return {
      valid: false,
      error: 'Ce code promo a expiré'
    };
  }

  // Check usage limit
  if (promoCode.maxUses !== null && promoCode.currentUses >= promoCode.maxUses) {
    return {
      valid: false,
      error: 'Ce code promo a atteint sa limite d\'utilisation'
    };
  }

  return {
    valid: true,
    promoCode: {
      id: promoCode.id,
      code: promoCode.code,
      type: promoCode.type,
      discountType: promoCode.discountType,
      discountValue: Number(promoCode.discountValue),
      subscriberEmail: promoCode.subscriberEmail
    }
  };
}

/**
 * Mark promo code as used (increment usage counter)
 */
export async function markPromoCodeAsUsed(codeId: string) {
  return prisma.promoCode.update({
    where: { id: codeId },
    data: {
      currentUses: {
        increment: 1
      }
    }
  });
}

/**
 * Calculate discount amount based on promo code
 */
export function calculateDiscount(
  subtotal: number,
  discountType: DiscountType,
  discountValue: number
): number {
  if (discountType === DiscountType.PERCENTAGE) {
    return subtotal * (discountValue / 100);
  } else if (discountType === DiscountType.FIXED_AMOUNT) {
    return Math.min(discountValue, subtotal);
  }
  // FREE_SHIPPING is handled separately in shipping logic
  return 0;
}

/**
 * Create a custom promo code (admin)
 */
export async function createCustomPromoCode(data: {
  code: string;
  type: PromoCodeType;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number;
  validUntil?: Date;
}) {
  const upperCode = data.code.toUpperCase().trim();

  // Check if code already exists
  const existing = await prisma.promoCode.findUnique({
    where: { code: upperCode }
  });

  if (existing) {
    throw new Error('Ce code promo existe déjà');
  }

  return prisma.promoCode.create({
    data: {
      code: upperCode,
      type: data.type,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses,
      validUntil: data.validUntil
    }
  });
}

/**
 * Get all active promo codes (admin)
 */
export async function getActivePromoCodes() {
  return prisma.promoCode.findMany({
    where: {
      isActive: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Deactivate a promo code (admin)
 */
export async function deactivatePromoCode(codeId: string) {
  return prisma.promoCode.update({
    where: { id: codeId },
    data: { isActive: false }
  });
}
