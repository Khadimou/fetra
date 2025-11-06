'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CjProductCard from '@/components/admin/CjProductCard';
import CjSyncButton from '@/components/admin/CjSyncButton';
import type { CJProduct } from '@/lib/types/cj';

interface SupabaseProduct {
  id: string;
  cj_product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[]; // Optional - may be undefined
  variants?: any[]; // Optional - may be undefined
  category: string;
  category_id: string;
  sku: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCjProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync state
  const [syncKeyword, setSyncKeyword] = useState('K-Beauty');
  const [syncPages, setSyncPages] = useState(1);
  const [syncResult, setSyncResult] = useState<any>(null);

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
          loadProducts();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  // Load products from Supabase
  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/cj/products?page=${page}&pageSize=${pageSize}`
      );

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }

      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Reload when page changes
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [page]);

  // Handle sync
  async function handleSync() {
    try {
      setSyncResult(null);
      setError(null);
      const res = await fetch('/api/admin/cj/sync-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyWord: syncKeyword,
          maxPages: syncPages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Get detailed error message from API response
        const errorMessage = data.error || data.message || 'Erreur lors de la synchronisation';
        setSyncResult({
          success: false,
          error: errorMessage,
          details: data.details,
        });
        setError(errorMessage);
        return;
      }

      setSyncResult(data);
      setError(null);

      // Reload products
      await loadProducts();
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la synchronisation';
      setSyncResult({
        success: false,
        error: errorMessage,
      });
      setError(errorMessage);
      console.error('Sync error:', err);
    }
  }

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
                Produits CJ Dropshipping
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
        {/* Sync Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Synchroniser des produits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot-clé de recherche
              </label>
              <input
                type="text"
                value={syncKeyword}
                onChange={(e) => setSyncKeyword(e.target.value)}
                placeholder="K-Beauty, Gua Sha..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de pages
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={syncPages}
                onChange={(e) => setSyncPages(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
              />
            </div>
            <div className="flex items-end">
              <CjSyncButton onSync={handleSync} className="w-full" />
            </div>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <div
              className={`p-4 rounded-md ${
                syncResult.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <p
                className={`font-medium ${
                  syncResult.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {syncResult.success
                  ? syncResult.message || 'Synchronisation terminée'
                  : syncResult.error || 'Erreur lors de la synchronisation'}
              </p>
              {syncResult.success && syncResult.stats && (
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>Traités: {syncResult.stats.processed}</p>
                  <p>Créés: {syncResult.stats.created}</p>
                  <p>Mis à jour: {syncResult.stats.updated}</p>
                  {syncResult.stats.failed > 0 && (
                    <p className="text-red-600">
                      Échecs: {syncResult.stats.failed}
                    </p>
                  )}
                </div>
              )}
              {!syncResult.success && syncResult.details && (
                <details className="mt-2 text-sm text-red-700">
                  <summary className="cursor-pointer font-medium">
                    Détails de l'erreur (développement)
                  </summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                    {syncResult.details}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {total} produit{total > 1 ? 's' : ''} synchronisé{total > 1 ? 's' : ''}
            </h2>
            <button
              onClick={loadProducts}
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
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun produit synchronisé. Utilisez le formulaire ci-dessus pour
              synchroniser des produits depuis CJ.
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                {products.map((product) => (
                  <CjProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      pid: product.cj_product_id,
                      productNameEn: product.name,
                      productSku: product.sku,
                      productImage: (product.images && Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : '',
                      productImageList: product.images || [],
                      sellPrice: product.price,
                      categoryName: product.category,
                      categoryId: product.category_id,
                      warehouseInventoryNum: product.stock,
                      variants: product.variants || [],
                    }}
                    actionLabel="Voir détails"
                    onAction={(p) =>
                      router.push(`/admin/cj/products/${product.id}`)
                    }
                  />
                ))}
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
