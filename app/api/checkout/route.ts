import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface CartItem {
  sku: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  cjProductId?: string;
  cjVariantId?: string;
  maxQuantity?: number;
  variantName?: string;
}

// Valid promo codes
const PROMO_CODES: Record<string, number> = {
  'BIENVENUE10': 0.1, // 10% discount
};

// Helper to convert relative URLs to absolute URLs for Stripe
function toAbsoluteUrl(url: string, baseUrl: string): string {
  try {
    // If already absolute, return as-is
    new URL(url);
    return url;
  } catch {
    // Relative URL, convert to absolute
    return `${baseUrl.replace(/\/$/, '')}${url.startsWith('/') ? url : '/' + url}`;
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key not configured" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { items, promoCode } = body as { items: CartItem[]; promoCode?: string };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Base URL for converting relative URLs
    const baseUrl = process.env.NODE_ENV === 'production'
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fetrabeauty.com')
      : 'https://0fa5d0e0758d.ngrok-free.app';

    // Validate promo code server-side
    let discountRate = 0;
    if (promoCode) {
      const upperCode = promoCode.toUpperCase();
      if (PROMO_CODES[upperCode] !== undefined) {
        discountRate = PROMO_CODES[upperCode];
      } else {
        return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
      }
    }

    // Validate prices against database and build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      let basePrice: number;
      let stock: number;
      let isActive: boolean;

      // Check if this is a CJ product or FETRA product
      if (item.cjProductId || item.cjVariantId) {
        // CJ Product - fetch from Supabase
        if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
          return NextResponse.json(
            { error: 'CJ integration not configured' },
            { status: 503 }
          );
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
        const { data: cjProduct, error } = await supabase
          .from('products')
          .select('price, stock, is_active')
          .eq('sku', item.sku)
          .single();

        if (error || !cjProduct) {
          console.error('[Checkout] CJ Product not found:', item.sku, error);
          return NextResponse.json(
            { error: `Product not found: ${item.sku}` },
            { status: 400 }
          );
        }

        basePrice = parseFloat(cjProduct.price);
        stock = cjProduct.stock;
        isActive = cjProduct.is_active;
      } else {
        // FETRA Product - fetch from Prisma
        const product = await prisma.product.findUnique({
          where: { sku: item.sku },
        });

        if (!product) {
          console.error('[Checkout] FETRA Product not found:', item.sku);
          return NextResponse.json(
            { error: `Product not found: ${item.sku}` },
            { status: 400 }
          );
        }

        basePrice = parseFloat(product.price.toString());
        stock = product.stock;
        isActive = product.isActive;
      }

      // Validate product availability
      if (!isActive) {
        return NextResponse.json(
          { error: `Product not available: ${item.title}` },
          { status: 400 }
        );
      }

      // Verify stock
      if (stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${item.title}` },
          { status: 400 }
        );
      }

      // Calculate selling price: Apply 2.5x markup only to CJ products
      // FETRA products use database price directly (no markup)
      const sellingPrice = (item.cjProductId || item.cjVariantId)
        ? Math.round(basePrice * 2.5 * 100) / 100  // CJ products: 2.5x markup
        : Math.round(basePrice * 100) / 100;       // FETRA products: no markup

      // Verify client-side price matches server-side calculation
      if (Math.abs(item.price - sellingPrice) > 0.01) {
        console.error('[Checkout] Price mismatch:', {
          item: item.title,
          clientPrice: item.price,
          serverPrice: sellingPrice,
          basePrice,
          isCjProduct: !!(item.cjProductId || item.cjVariantId),
        });
        return NextResponse.json(
          { error: `Price mismatch for: ${item.title}. Expected ${sellingPrice}€, got ${item.price}€` },
          { status: 400 }
        );
      }

      // Build line item with metadata for CJ fulfillment
      const metadata: Record<string, string> = {
        sku: item.sku,
      };

      if (item.cjProductId) {
        metadata.cjProductId = item.cjProductId;
      }

      if (item.cjVariantId) {
        metadata.cjVariantId = item.cjVariantId;
      }

      if (item.variantName) {
        metadata.variantName = item.variantName;
      }

      // Apply discount to price if promo code is valid
      const finalPrice = discountRate > 0
        ? sellingPrice * (1 - discountRate)
        : sellingPrice;

      // Convert image URL to absolute if needed (Stripe requires absolute URLs)
      const imageUrl = item.image ? toAbsoluteUrl(item.image, baseUrl) : undefined;

      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: imageUrl ? [imageUrl] : undefined,
            metadata,
          },
          unit_amount: Math.round(finalPrice * 100), // Convert to cents, with discount applied
        },
        quantity: item.quantity,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      shipping_address_collection: { 
        allowed_countries: ["FR", "BE", "LU", "ES", "IT", "DE", "NL", "PT"] 
      },
      // Store cart data in metadata for webhook processing
      metadata: {
        cartItemCount: items.length.toString(),
        hasCjProducts: items.some(i => i.cjProductId || i.cjVariantId).toString(),
        promoCode: promoCode || '',
        discountRate: discountRate.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err?.message || "Stripe error" }, { status: 500 });
  }
}
