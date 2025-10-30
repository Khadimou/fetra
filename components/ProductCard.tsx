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
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700">Stripe & PayPal</span>
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

        {/* Moyens de paiement acceptés */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="text-xs font-medium text-gray-700 mb-2 text-center">Moyens de paiement acceptés</div>
          <div className="flex items-center justify-center gap-3">
            {/* Stripe */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.328 22.746 8.328 24 12.581 24c2.81 0 5.006-.654 6.456-1.872 1.663-1.356 2.455-3.287 2.455-5.746 0-3.978-2.609-5.71-7.516-7.212z" fill="#635bff"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">Stripe</span>
            </div>

            {/* PayPal */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a2.028 2.028 0 0 0-.077-.437c.292-1.867-.002-3.136-1.012-4.287C19.022.543 17.014 0 14.444 0H6.984C6.46 0 6.012.382 5.93.901L2.823 21.337a.641.641 0 0 0 .633.74h4.606l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797z" fill="#003087"/>
                <path d="M8.153 6.917c.506-.484 1.18-.484 2.022-.484h6.06c.68 0 1.31.042 1.835.127.506.082.925.205 1.253.37.077.037.154.077.226.118-.292 1.867.002 3.136 1.012 4.287 1.112 1.267 3.12 1.81 5.69 1.81-.23 1.17-.506 2.204-.925 3.136-.717 1.615-1.835 2.76-3.325 3.424-1.253.563-2.734.847-4.423.847H9.178c-.524 0-.968.382-1.05.9L7.007 27.43a.641.641 0 0 1-.633.74H1.77a.383.383 0 0 1-.38-.44L4.497 7.357c.082-.518.526-.9 1.05-.9h2.606z" fill="#009cde"/>
              </svg>
              <span className="text-xs font-medium text-gray-700">PayPal</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Paiement 100% sécurisé
          </span>
          <span>•</span>
          <span>Livraison offerte</span>
        </div>
      </div>
    </div>
  );
}
