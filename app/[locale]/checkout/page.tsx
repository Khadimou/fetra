"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCart, type Cart } from "../../../lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    const currentCart = getCart();
    if (currentCart.items.length === 0) {
      router.push("/cart");
    }
    setCart(currentCart);
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare checkout data
      const checkoutData = {
        items: cart.items.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
        })),
        customer: formData,
      };

      // Call Stripe checkout API
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!res.ok) throw new Error("Erreur lors du paiement");

      const data = await res.json();
      if (data?.url) {
        // Redirect to Stripe
        window.location.href = data.url as string;
      }
    } catch (error: any) {
      alert(error?.message || "Erreur lors du paiement");
      setIsLoading(false);
    }
  }

  if (cart.items.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 brand-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div>
                <h2 className="text-xl font-bold mb-4">Coordonnées</h2>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                  />
                </div>
              </div>

              {/* Shipping */}
              <div>
                <h2 className="text-xl font-bold mb-4">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="123 rue de la Beauté"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                        Code postal
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="75001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="06 12 34 56 78"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? "Redirection vers le paiement..." : `Payer ${cart.total.toFixed(2)} €`}
              </button>

              <p className="text-sm text-center text-gray-500">
                Paiement 100% sécurisé via Stripe
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 brand-shadow sticky top-24">
              <h2 className="text-xl font-bold mb-6">Récapitulatif</h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {cart.items.map((item) => (
                  <div key={item.sku} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-gray-600 text-sm">{item.price.toFixed(2)} €</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{cart.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-fetra-olive font-semibold">Gratuite</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{cart.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

