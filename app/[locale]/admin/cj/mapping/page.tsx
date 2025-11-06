'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';

export default function AdminCjMapping() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cjVariantId, setCjVariantId] = useState('');
  const [cjProductId, setCjProductId] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Load local products
  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Open modal
  function openModal(product: Product) {
    setSelectedProduct(product);
    setCjVariantId(product.cjVariantId || '');
    setCjProductId(product.cjProductId || '');
  }

  // Close modal
  function closeModal() {
    setSelectedProduct(null);
    setCjVariantId('');
    setCjProductId('');
  }

  // Save mapping
  async function handleSaveMapping() {
    if (!selectedProduct || !cjVariantId) {
      alert('Veuillez saisir au moins le Variant ID CJ');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `/api/admin/cj/products/${cjProductId || 'temp'}/link`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct.id,
            cjVariantId,
            cjProductId: cjProductId || null,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }

      alert('Mapping sauvegardé avec succès');
      closeModal();
      await loadProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
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
                Mapping Produits CJ
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
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            Cette page vous permet de lier vos produits locaux aux produits CJ
            Dropshipping. Configurez le <strong>CJ Variant ID</strong> pour
            chaque produit afin d'activer le dropshipping automatique.
          </p>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Produits locaux
            </h2>
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
              Aucun produit
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CJ Product ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CJ Variant ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.cjProductId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.cjVariantId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.cjVariantId ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Mappé
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Non mappé
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal(product)}
                          className="text-fetra-olive hover:text-fetra-olive/80"
                        >
                          {product.cjVariantId ? 'Modifier' : 'Configurer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configuration CJ pour {selectedProduct.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CJ Product ID (optionnel)
                </label>
                <input
                  type="text"
                  value={cjProductId}
                  onChange={(e) => setCjProductId(e.target.value)}
                  placeholder="Ex: 12345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CJ Variant ID *
                </label>
                <input
                  type="text"
                  value={cjVariantId}
                  onChange={(e) => setCjVariantId(e.target.value)}
                  placeholder="Ex: 987654321"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Identifiant du variant CJ à utiliser pour ce produit
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleSaveMapping}
                disabled={saving || !cjVariantId}
                className="flex-1 px-4 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={closeModal}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
