"use client";
import { useState, useEffect } from "react";
import { getCart } from "../lib/cart";

export default function CartCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial load
    const cart = getCart();
    setCount(cart.itemCount);

    // Listen for cart updates
    function handleCartUpdate(e: CustomEvent) {
      setCount(e.detail.itemCount);
    }

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
  }, []);

  return count;
}

