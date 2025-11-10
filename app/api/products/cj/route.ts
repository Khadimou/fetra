/**
 * Public API Route: CJ Products for Customer View
 * GET /api/products/cj - List active CJ products with margin pricing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Pricing configuration - adjust margin here
const PRICING_CONFIG = {
  coefficient: 2.5, // 150% margin (CJ price * 2.5)
};

function applyMargin(cjPrice: number): number {
  return Math.round(cjPrice * PRICING_CONFIG.coefficient * 100) / 100;
}

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'CJ integration not configured' },
        { status: 503 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Build query - only active products with CJ data
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .not('cj_product_id', 'is', null)
      .order('updated_at', { ascending: false });

    // Add search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    // Add pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Execute query
    const { data: products, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Transform products: apply margin and format for frontend
    const transformedProducts = (products || []).map((product: any) => {
      const basePrice = parseFloat(product.price);
      const sellingPrice = applyMargin(basePrice);

      return {
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
    });

    // Get unique categories for filtering
    const { data: categoriesData } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('cj_product_id', 'is', null)
      .not('category', 'is', null);

    const categories = Array.from(
      new Set((categoriesData || []).map((p: any) => p.category).filter(Boolean))
    );

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: count || 0,
      page,
      pageSize,
      categories,
      pricingInfo: {
        margin: `${((PRICING_CONFIG.coefficient - 1) * 100).toFixed(0)}%`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching CJ products:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}


