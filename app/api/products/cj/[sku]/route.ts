/**
 * Public API Route: Get single CJ Product by SKU
 * GET /api/products/cj/[sku] - Get product details with margin pricing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Pricing configuration - must match the one in parent route
const PRICING_CONFIG = {
  coefficient: 2.5, // 150% margin (CJ price * 2.5)
};

function applyMargin(cjPrice: number): number {
  return Math.round(cjPrice * PRICING_CONFIG.coefficient * 100) / 100;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params;

    // Check if Supabase is configured
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'CJ integration not configured' },
        { status: 503 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch product by SKU
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .eq('is_active', true)
      .not('cj_product_id', 'is', null)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product: apply margin and format for frontend
    const basePrice = parseFloat(product.price);
    const sellingPrice = applyMargin(basePrice);

    const transformedProduct = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      description: product.description,
      cjPrice: basePrice, // Original CJ price
      price: sellingPrice, // Price with margin
      stock: product.stock,
      images: product.images || [],
      variants: product.variants || [],
      category: product.category,
      categoryId: product.category_id,
      cjProductId: product.cj_product_id,
      cjVariantId: product.cj_variant_id,
      imageUrl: product.image_url,
    };

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    });
  } catch (error: any) {
    console.error('Error fetching CJ product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch product',
      },
      { status: 500 }
    );
  }
}
