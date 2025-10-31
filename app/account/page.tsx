'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import type { OrderWithRelations } from '@/lib/db/orders';
import { Suspense } from 'react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const welcome = searchParams.get('welcome');

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Load orders
  useEffect(() => {
    if (session) {
      loadOrders();
    }
  }, [session]);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch('/api/account/orders');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err: any) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/');
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Compte</h1>
              <p className="text-sm text-gray-600 mt-1">{session?.user?.email}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Accueil
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome message */}
        {welcome && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Bienvenue ! Votre compte a été créé avec succès.
            </p>
          </div>
        )}

        {/* User info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Nom : </span>
              <span className="text-sm text-gray-900 font-medium">{session?.user?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm text-gray-600">Email : </span>
              <span className="text-sm text-gray-900 font-medium">{session?.user?.email}</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mes Commandes</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fetra-olive mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore de commandes</p>
              <button
                onClick={() => router.push('/product')}
                className="px-6 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90"
              >
                Découvrir nos produits
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Commande #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                      order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-800' :
                      order.status === OrderStatus.PAID ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === OrderStatus.DELIVERED ? 'Livrée' :
                       order.status === OrderStatus.SHIPPED ? 'Expédiée' :
                       order.status === OrderStatus.PAID ? 'En préparation' :
                       order.status}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {Number(item.totalPrice).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-gray-600">Total : </span>
                      <span className="text-lg font-bold text-gray-900">
                        {Number(order.amount).toFixed(2)} €
                      </span>
                    </div>

                    {order.shipping?.trackingNumber && (
                      <a
                        href={`https://www.laposte.fr/outils/suivre-vos-envois?code=${order.shipping.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-fetra-olive hover:text-fetra-olive/80 font-medium"
                      >
                        Suivre ma commande →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <AccountContent />
    </Suspense>
  );
}
