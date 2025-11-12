"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ShippingInfo {
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  recipientName: string;
  city: string;
  country: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: OrderItem[];
  shipping: ShippingInfo | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "text-yellow-700", bg: "bg-yellow-100" },
  paid: { label: "Payée", color: "text-blue-700", bg: "bg-blue-100" },
  processing: { label: "En préparation", color: "text-purple-700", bg: "bg-purple-100" },
  shipped: { label: "Expédiée", color: "text-indigo-700", bg: "bg-indigo-100" },
  delivered: { label: "Livrée", color: "text-green-700", bg: "bg-green-100" },
  cancelled: { label: "Annulée", color: "text-red-700", bg: "bg-red-100" },
};

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login?redirect=/account/orders");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/customer/orders");

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des commandes");
      }

      const data = await response.json();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatPrice(amount: number, currency: string) {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fetra-olive/20 border-t-fetra-olive rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes commandes</h1>
            <p className="text-gray-600">
              Bienvenue {session?.user?.name} ({session?.user?.email})
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors"
            >
              Accueil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center brand-shadow">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-6">Vous n&apos;avez pas encore passé de commande.</p>
            <Link
              href="/product"
              className="inline-block px-6 py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-colors"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;

              return (
                <div key={order.id} className="bg-white rounded-2xl p-6 brand-shadow">
                  {/* Order header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Commande #{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Passée le {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                      <p className="text-2xl font-bold text-fetra-olive">
                        {formatPrice(order.amount, order.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            Quantité: {item.quantity} × {formatPrice(item.unitPrice, order.currency)}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.totalPrice, order.currency)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info */}
                  {order.shipping && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 mb-1">Informations de livraison</p>
                          <p className="text-sm text-blue-700">
                            {order.shipping.recipientName} • {order.shipping.city}, {order.shipping.country}
                          </p>
                          {order.shipping.trackingNumber && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-blue-900 mb-1">
                                Numéro de suivi: {order.shipping.trackingNumber}
                              </p>
                              {order.shipping.trackingUrl && (
                                <a
                                  href={order.shipping.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Suivre mon colis
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
