"use client";

import { useRouter } from "next/navigation";
import { addToCart } from "../lib/cart";
import MobilePurchaseBar from "./MobilePurchaseBar";

type Props = { sku: string; price: number; title: string; image: string };

export default function MobileBarBridge({ sku, price, title, image }: Props) {
  const router = useRouter();
  
  function onBuy() {
    addToCart({
      sku,
      title,
      price,
      image,
    }, 1);
    
    router.push('/cart');
  }
  
  const priceStr = (Number(price).toFixed(2)).toString();
  return <MobilePurchaseBar price={priceStr} onBuy={onBuy} />;
}
