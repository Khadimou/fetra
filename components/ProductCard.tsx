"use client";
import React, { useState } from "react";
import type { Product } from "../lib/product";
import Badges from "./Badges";
import Scarcity from "./Scarcity";
import SocialProof from "./SocialProof";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleCheckout() {
    if (!product || product.stock <= 0) return;
    const qty = Math.max(1, Math.min(quantity, product.stock));
    setQuantity(qty);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: product.sku, quantity: qty }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error((data as any)?.error || "No checkout URL");
      }
    } catch (e: any) {
      alert(e?.message || "Erreur lors du paiement");
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-24 bg-white rounded-2xl p-6 brand-shadow border border-gray-100">
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="mt-2 text-gray-600">{product.descriptionShort}</p>

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

        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm font-medium">Quantité</span>
          <div className="ml-auto flex items-center border rounded-md overflow-hidden">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1"></button>
            <div className="px-4 py-2">{quantity}</div>
            <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-1">+</button>
          </div>
        </div>

        <button onClick={handleCheckout} disabled={loading || product.stock <= 0} className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${product.stock > 0 ? "bg-fetra-olive hover:bg-fetra-olive/90" : "bg-gray-300"}`}>
          {loading ? "Redirection" : `Acheter  ${Number(product.price).toFixed(2)} €`}
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
