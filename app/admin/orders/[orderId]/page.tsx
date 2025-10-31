'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Order } from '@/lib/db/orders';
import TrackingStatus from '@/components/admin/TrackingStatus';

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Shipping form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipping, setShipping] = useState(false);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          loadOrder();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router, orderId]);

  // Load order
  async function loadOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) {
        throw new Error('Commande introuvable');
      }
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle ship order
  async function handleShip(e: React.FormEvent) {
    e.preventDefault();
    if (!trackingNumber) return;

    try {
      setShipping(true);
      const res = await fetch(`/api/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber, carrier: 'colissimo' })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }

      // Reload order
      await loadOrder();
      setTrackingNumber('');
      alert('Commande marquée comme expédiée. Email envoyé au client.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setShipping(false);
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'Commande introuvable'}</p>
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 text-sm text-red-600 hover:underline"
            >
              ← Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Retour au dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Commande #{order.id.slice(-8).toUpperCase()}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Order info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations commande</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Client</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.customerName || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{order.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Montant</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {order.amount.toFixed(2)} {order.currency.toUpperCase()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Statut</dt>
              <dd className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'delivered' ? 'Livrée' :
                   order.status === 'shipped' ? 'Expédiée' :
                   order.status === 'paid' ? 'Payée' :
                   order.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date de commande</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(order.createdAt).toLocaleString('fr-FR')}
              </dd>
            </div>
            {order.shipping?.shippedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Date d'expédition</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(order.shipping.shippedAt).toLocaleString('fr-FR')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Shipping section */}
        {order.status === 'paid' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Marquer comme expédiée</h2>
            <form onSubmit={handleShip} className="space-y-4">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700">
                  Numéro de suivi Colissimo
                </label>
                <input
                  id="tracking"
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Ex: 8K00009775862"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-fetra-olive focus:border-fetra-olive sm:text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format: 11-15 caractères alphanumériques
                </p>
              </div>
              <button
                type="submit"
                disabled={shipping || !trackingNumber}
                className="w-full md:w-auto px-6 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shipping ? 'Envoi en cours...' : 'Marquer comme expédiée'}
              </button>
            </form>
          </div>
        )}

        {/* Tracking section */}
        {order.shipping?.trackingNumber && (
          <TrackingStatus trackingNumber={order.shipping.trackingNumber} />
        )}

        {/* Metadata */}
        {order.metadata && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métadonnées</h2>
            <pre className="text-xs text-gray-600 bg-gray-50 p-4 rounded overflow-auto">
              {JSON.stringify(order.metadata, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
