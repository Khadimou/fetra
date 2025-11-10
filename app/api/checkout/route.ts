import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

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

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key not configured" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { items } = body as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate prices against database and build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
    for (const item of items) {
      // Fetch product from database to verify price
      const product = await prisma.product.findUnique({
        where: { sku: item.sku },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.sku}` },
          { status: 400 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product not available: ${item.title}` },
          { status: 400 }
        );
      }

      // Verify stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for: ${item.title}` },
          { status: 400 }
        );
      }

      // Calculate price with margin (same logic as API)
      const basePrice = parseFloat(product.price.toString());
      const sellingPrice = Math.round(basePrice * 2.5 * 100) / 100;

      // Verify client-side price matches server-side calculation
      if (Math.abs(item.price - sellingPrice) > 0.01) {
        return NextResponse.json(
          { error: `Price mismatch for: ${item.title}` },
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

      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: item.image ? [item.image] : undefined,
            metadata,
          },
          unit_amount: Math.round(sellingPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fetrabeauty.com')
      : 'http://localhost:3000';

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
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err?.message || "Stripe error" }, { status: 500 });
  }
}
