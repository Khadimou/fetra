'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CjOrderStatusBadge from '@/components/admin/CjOrderStatusBadge';
import type { CJOrderStatus } from '@/lib/types/cj';

interface CjOrder {
  id: string;
  order_number: string;
  cj_order_id?: string;
  cj_order_number?: string;
  cj_order_status?: CJOrderStatus;
  cj_tracking_number?: string;
  amount: number;
  currency: string;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCjOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<CjOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CjOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          loadOrders();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  // Load orders
  async function loadOrders() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/cj/orders?page=${page}&pageSize=${pageSize}${
          statusFilter !== 'all' ? `&status=${statusFilter}` : ''
        }`
      );

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }

      const data = await res.json();
      const ordersList = data.orders || [];
      setOrders(ordersList);
      setTotal(data.total || 0);
      setFilteredOrders(ordersList);
    } catch (err: any) {
      setError(err.message);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // Reload when page or filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [page, statusFilter]);

  // Apply search filter
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.order_number?.toLowerCase().includes(term) ||
            order.cj_order_number?.toLowerCase().includes(term) ||
            order.customer_email?.toLowerCase().includes(term) ||
            order.cj_tracking_number?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, searchTerm]);

  // Logout
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification...</p>
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
              <button
                onClick={() => router.push('/admin')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                ← Retour au dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Commandes CJ Dropshipping
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rechercher
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Numéro de commande, email, tracking..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
              />
            </div>

            {/* Status filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filtrer par statut CJ
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiées</option>
                <option value="delivered">Livrées</option>
                <option value="cancelled">Annulées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {total} commande{total > 1 ? 's' : ''}
            </h2>
            <button
              onClick={loadOrders}
              className="text-sm text-fetra-olive hover:text-fetra-olive/80"
            >
              Actualiser
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fetra-olive mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune commande ne correspond aux filtres'
                : 'Aucune commande CJ'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande locale
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande CJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut CJ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.cj_order_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customer_email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount?.toFixed(2)} {order.currency?.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.cj_order_status ? (
                            <CjOrderStatusBadge
                              status={order.cj_order_status}
                            />
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.cj_tracking_number || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString(
                            'fr-FR'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              router.push(`/admin/cj/orders/${order.id}`)
                            }
                            className="text-fetra-olive hover:text-fetra-olive/80"
                          >
                            Voir détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {total > pageSize && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} sur {Math.ceil(total / pageSize)}
                  </span>
                  <button
                    onClick={() =>
                      setPage(Math.min(Math.ceil(total / pageSize), page + 1))
                    }
                    disabled={page >= Math.ceil(total / pageSize)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
