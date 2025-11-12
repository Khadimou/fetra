"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getCart, updateQuantity, removeFromCart, applyPromoCode, removePromoCode, type Cart } from "../../../lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  useEffect(() => {
    const currentCart = getCart();
    setCart(currentCart);

    // Listen for cart updates
    function handleCartUpdate(e: CustomEvent) {
      setCart(e.detail);
    }

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
  }, []);

  function handleUpdateQuantity(sku: string, newQuantity: number) {
    updateQuantity(sku, newQuantity);
  }

  function handleRemove(sku: string) {
    removeFromCart(sku);
  }

  async function handleApplyPromo() {
    const result = await applyPromoCode(promoCode);
    if (result.success) {
      setPromoMessage(result.message || '');
      // Reload cart to reflect discount
      setCart(getCart());
    } else {
      alert(result.message);
    }
  }

  function handleRemovePromo() {
    removePromoCode();
    setPromoMessage('');
    setPromoCode('');
    setCart(getCart());
  }

  const subtotal = cart.total;
  const discount = cart.discount || 0;
  const discountAmount = subtotal * discount;
  const shipping = 0; // Free shipping
  const total = subtotal - discountAmount + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer votre rituel beauté</p>
          <Link
            href="/product"
            className="inline-block px-8 py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95"
          >
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Panier ({cart.itemCount})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.sku} className="bg-white rounded-2xl p-6 brand-shadow">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2 truncate">{item.title}</h3>
                    <p className="text-fetra-olive font-bold text-xl mb-4">{item.price.toFixed(2)} €</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.sku, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.sku, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.sku)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 brand-shadow sticky top-24">
              <h2 className="text-xl font-bold mb-6">Résumé</h2>

              {/* Promo code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Code promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="NEWS-ABC123"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {discount > 0 ? (
                  <p className="mt-2 text-sm text-green-600">✓ Code appliqué : -{(discount * 100).toFixed(0)}%</p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    💌 Pas encore de code ? <a href="#newsletter" className="text-fetra-olive hover:underline font-medium">Inscris-toi à la newsletter</a> pour recevoir ton code personnalisé <span className="font-semibold">-15%</span>
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction</span>
                    <span>-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-fetra-olive font-semibold">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="block w-full py-3 bg-fetra-olive text-white text-center rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 mb-4"
              >
                Procéder au paiement
              </Link>

              <Link
                href="/product"
                className="block w-full py-3 border-2 border-gray-300 text-gray-700 text-center rounded-xl font-semibold hover:border-fetra-olive hover:text-fetra-olive transition-all"
              >
                Continuer mes achats
              </Link>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Livraison gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Retour gratuit sous 14 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

