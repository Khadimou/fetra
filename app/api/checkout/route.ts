import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe secret key not configured" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const body = await request.json();
    const { sku, quantity } = body || {};
    const qty = Math.max(1, Number(quantity) || 1);

    const line_item = {
      price_data: {
        currency: "eur",
        product_data: { name: "Rituel Visage Liftant  Bundle FETRA" },
        unit_amount: 4990,
      },
      quantity: qty,
    } as const;

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fetrabeauty.com')
      : 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      mode: "payment",
      line_items: [line_item],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/product`,
      shipping_address_collection: { allowed_countries: ["FR", "BE", "LU"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Stripe error" }, { status: 500 });
  }
}
