"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "../lib/product";
import { addToCart } from "../lib/cart";
import Badges from "./Badges";
import Scarcity from "./Scarcity";
import SocialProof from "./SocialProof";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const clamped = Math.max(1, Math.min(quantity, product.stock));
    if (clamped !== quantity) {
      setQuantity(clamped);
    }
  }, [product.stock, quantity]);

  function handleDecrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleIncrease() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: 'increase' | 'decrease'
  ) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'increase') handleIncrease();
      else handleDecrease();
    } else if (e.key === 'ArrowUp' && action === 'increase') {
      e.preventDefault();
      handleIncrease();
    } else if (e.key === 'ArrowDown' && action === 'decrease') {
      e.preventDefault();
      handleDecrease();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setQuantity(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      setQuantity(Math.max(1, product.stock));
    }
  }

  async function handleAddToCart() {
    if (!product || product.stock <= 0) return;
    const qty = Math.max(1, Math.min(quantity, product.stock));
    setQuantity(qty);
    setLoading(true);

    try {
      // Track begin_checkout event
      try {
        // Push to dataLayer for Google Analytics
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
              items: [{
                item_id: product.sku,
                item_name: product.title,
                price: product.price,
                quantity: qty
              }]
            }
          });
        }

        // Send to backend for HubSpot tracking
        await fetch('/api/events/begin_checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sku: product.sku,
            price: product.price,
            quantity: qty
          })
        });
      } catch (analyticsError) {
        // Non-blocking - continue even if analytics fail
        console.error('Analytics tracking error:', analyticsError);
      }

      // Get first image for cart display
      const firstImage = Array.isArray(product.images) && product.images.length > 0
        ? (typeof product.images[0] === 'object' && 'src' in product.images[0]
            ? product.images[0].src
            : product.images[0])
        : '/main.webp';

      // Add to cart
      addToCart({
        sku: product.sku,
        title: product.title,
        price: product.price,
        image: firstImage as string,
      }, qty);

      // Brief loading state for visual feedback
      setTimeout(() => {
        setLoading(false);
        router.push('/cart');
      }, 500);
    } catch (e: any) {
      alert(e?.message || "Erreur lors de l'ajout au panier");
      setLoading(false);
    }
  }

  const isOutOfStock = product.stock <= 0;
  const isValidQuantity = quantity >= 1 && quantity <= product.stock;

  return (
    <div className="sticky top-24 bg-white rounded-2xl p-6 brand-shadow border border-gray-100">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="mt-2 text-gray-600">{product.descriptionShort}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-fetra-olive/10 text-fetra-olive">Livraison off.</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-fetra-pink/10 text-fetra-pink">Retour 14j</span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">Paiement 3x</span>
      </div>

      <Badges />

      <div className="mt-6">
        <div className="text-sm text-gray-500">Valeur produit</div>
        <div className="flex items-baseline gap-3 mt-1">
          <div className="text-sm line-through text-gray-400">{Number(product.value).toFixed(2)} €</div>
          <div className="text-3xl font-extrabold">{Number(product.price).toFixed(2)} €</div>
          <div className="ml-auto text-sm text-fetra-olive font-semibold">Vous économisez {Math.round((1 - product.price / product.value) * 100)}%</div>
        </div>

        <div className="mt-3 text-sm text-gray-500">Stock: {product.stock} disponibles</div>

        <Scarcity stock={product.stock} />

        <SocialProof />

        <div className="mt-6">
          <label htmlFor="quantity" className="text-sm font-medium block mb-2">
            Quantité
          </label>
          <div className="flex items-center gap-2">
            <button
              id="quantity-decrease"
              onClick={handleDecrease}
              onKeyDown={(e) => handleKeyDown(e, 'decrease')}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Diminuer la quantité"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <div className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center font-medium">
              {quantity}
            </div>
            <button
              id="quantity-increase"
              onClick={handleIncrease}
              onKeyDown={(e) => handleKeyDown(e, 'increase')}
              disabled={quantity >= product.stock || isOutOfStock}
              aria-label="Augmenter la quantité"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock || !isValidQuantity}
          className="mt-6 w-full py-3 rounded-2xl px-6 font-semibold shadow-sm transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-md bg-fetra-olive hover:bg-fetra-olive/90 text-white"
        >
          {loading ? "Ajout au panier..." : isOutOfStock ? "Rupture de stock" : `Ajouter au panier • ${Number(product.price * quantity).toFixed(2)} €`}
        </button>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Paiement sécurisé
          </span>
          <span>•</span>
          <span>Livraison offerte</span>
        </div>
      </div>
    </div>
  );
}
