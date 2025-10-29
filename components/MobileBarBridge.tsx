"use client";

import { beginCheckout } from "../lib/analytics";

type Props = { sku: string; price: number };

export default function MobileBarBridge({ sku, price }: Props) {
  async function onBuy() {
    beginCheckout(sku, 1, price);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, quantity: 1 }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url as string;
  }
  const priceStr = (Number(price).toFixed(2)).toString();
  const MobilePurchaseBar = require('./MobilePurchaseBar').default;
  return <MobilePurchaseBar price={priceStr} onBuy={onBuy} />;
}
