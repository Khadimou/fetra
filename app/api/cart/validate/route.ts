/**
 * Cart Validation API Route
 * POST /api/cart/validate - Validate product price and stock before adding to cart
 *
 * This endpoint ensures:
 * - Stock availability is verified server-side
 * - Prices match current database values (prevents client manipulation)
 * - Proper margin application from CJ prices
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Pricing configuration - MUST match the one in product routes
const PRICE_MULTIPLIER = parseFloat(process.env.PRICE_MULTIPLIER || '2.5');

function applyMargin(cjPrice: number): number {
  return Math.round(cjPrice * PRICE_MULTIPLIER * 100) / 100;
}

interface ValidateRequest {
  sku: string;
  cjVariantId?: string;
  qty: number;
  expectedPrice?: number; // Optional: client-side price for comparison
}

interface ValidateResponse {
  ok: boolean;
  reason?: 'stock_insufficient' | 'price_changed' | 'product_not_found' | 'invalid_variant';
  available?: number;
  newPrice?: number;
  message?: string;
  item?: {
    sku: string;
    cjVariantId?: string;
    qty: number;
    displayPrice: number;
    maxQuantity: number;
    title: string;
    image: string;
    cjProductId?: string;
    variantName?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<ValidateResponse>> {
  try {
    // Parse request body
    const body: ValidateRequest = await request.json();
    const { sku, cjVariantId, qty, expectedPrice } = body;

    // Validate input
    if (!sku || !qty || qty <= 0) {
      return NextResponse.json(
        {
          ok: false,
          reason: 'product_not_found',
          message: 'Invalid request: SKU and quantity are required',
        },
        { status: 400 }
      );
    }

    // Check Supabase configuration
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('[Cart Validate] Supabase not configured');
      return NextResponse.json(
        {
          ok: false,
          message: 'Service temporarily unavailable',
        },
        { status: 503 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch product from database
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .eq('is_active', true)
      .not('cj_product_id', 'is', null)
      .single();

    if (error || !product) {
      console.error('[Cart Validate] Product not found:', sku, error);
      return NextResponse.json(
        {
          ok: false,
          reason: 'product_not_found',
          message: 'Product not found',
        },
        { status: 404 }
      );
    }

    // Determine which variant to validate (if applicable)
    let currentStock = product.stock;
    let basePrice = parseFloat(product.price);
    let variantName: string | undefined;
    let finalSku = sku;

    if (cjVariantId && product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v: any) => v.vid === cjVariantId);

      if (!variant) {
        console.error('[Cart Validate] Variant not found:', cjVariantId);
        return NextResponse.json(
          {
            ok: false,
            reason: 'invalid_variant',
            message: 'Selected variant not found',
          },
          { status: 404 }
        );
      }

      // Use variant-specific data
      currentStock = variant.variantInventory || 0;
      basePrice = variant.variantSellPrice || basePrice;
      variantName = variant.variantNameEn;
      finalSku = variant.variantSku || sku;
    }

    // Calculate display price with margin
    const displayPrice = applyMargin(basePrice);

    // VALIDATION 1: Check stock availability
    if (qty > currentStock) {
      console.warn('[Cart Validate] Stock insufficient:', {
        sku,
        cjVariantId,
        requested: qty,
        available: currentStock,
      });

      return NextResponse.json(
        {
          ok: false,
          reason: 'stock_insufficient',
          available: currentStock,
          message: `Stock insuffisant : ${currentStock} unité${currentStock > 1 ? 's' : ''} disponible${currentStock > 1 ? 's' : ''}.`,
        },
        { status: 409 }
      );
    }

    // VALIDATION 2: Check price changes (if client provided expected price)
    if (expectedPrice !== undefined) {
      const priceDiff = Math.abs(displayPrice - expectedPrice);
      const priceChangeThreshold = displayPrice * 0.01; // 1% threshold

      if (priceDiff > priceChangeThreshold) {
        console.warn('[Cart Validate] Price changed:', {
          sku,
          cjVariantId,
          expected: expectedPrice,
          actual: displayPrice,
          diff: priceDiff,
        });

        return NextResponse.json(
          {
            ok: false,
            reason: 'price_changed',
            newPrice: displayPrice,
            message: 'Le prix a changé depuis votre dernière visite.',
          },
          { status: 409 }
        );
      }
    }

    // SUCCESS: Return validated item data
    const images = product.images || (product.image_url ? [product.image_url] : ['/main.webp']);
    const title = variantName ? `${product.name} - ${variantName}` : product.name;

    const validatedItem = {
      sku: finalSku,
      cjVariantId,
      qty,
      displayPrice,
      maxQuantity: currentStock,
      title,
      image: images[0],
      cjProductId: product.cj_product_id,
      variantName,
    };

    console.log('[Cart Validate] Success:', {
      sku,
      cjVariantId,
      qty,
      price: displayPrice,
      stock: currentStock,
    });

    return NextResponse.json(
      {
        ok: true,
        item: validatedItem,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Cart Validate] Server error:', error);

    return NextResponse.json(
      {
        ok: false,
        message: 'Une erreur est survenue lors de la validation',
      },
      { status: 500 }
    );
  }
}
