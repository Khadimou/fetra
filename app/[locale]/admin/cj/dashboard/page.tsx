'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CJStatsResponse } from '@/lib/types/cj';

export default function AdminCjDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<CJStatsResponse | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          loadStats();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  // Load stats
  async function loadStats() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cj/stats');

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const data = await res.json();
      setStats(data.stats || null);
      setRecentLogs(data.stats?.recentLogs || []);
    } catch (err: any) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  // Logout
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  // Get status color
  function getStatusColor(status: string): string {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'started':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
                Dashboard CJ Dropshipping
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fetra-olive"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <button
                onClick={() => router.push('/admin/cj/products')}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-sm text-gray-600 mb-2">Produits</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalProducts || 0}
                </div>
                <div className="text-xs text-fetra-olive mt-2">
                  Voir tous →
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/cj/orders')}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-sm text-gray-600 mb-2">Commandes</div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats?.totalOrders || 0}
                </div>
                <div className="text-xs text-fetra-olive mt-2">
                  Voir toutes →
                </div>
              </button>

              <button
                onClick={() => router.push('/admin/cj/mapping')}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
              >
                <div className="text-sm text-gray-600 mb-2">
                  Taux de succès
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.orderSuccessRate || 0}%
                </div>
                <div className="text-xs text-fetra-olive mt-2">
                  Configurer →
                </div>
              </button>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 mb-2">
                  Dernière sync
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {stats?.lastSync
                    ? new Date(stats.lastSync).toLocaleString('fr-FR')
                    : 'Jamais'}
                </div>
                <button
                  onClick={loadStats}
                  className="text-xs text-fetra-olive mt-2"
                >
                  Actualiser
                </button>
              </div>
            </div>

            {/* Recent Sync Logs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Historique des synchronisations
                </h2>
              </div>

              {recentLogs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucun log de synchronisation
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Traités
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Créés
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mis à jour
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Échecs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durée
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(log.created_at).toLocaleString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.sync_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.items_processed || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.items_created || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.items_updated || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {log.items_failed || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.duration_ms
                              ? `${(log.duration_ms / 1000).toFixed(1)}s`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
