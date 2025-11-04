'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for editing stock
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});
  const [savingStock, setSavingStock] = useState<{ [key: string]: boolean }>({});

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

  // Load products
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

  // Update stock
  async function handleUpdateStock(productId: string) {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;

    try {
      setSavingStock({ ...savingStock, [productId]: true });

      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }

      // Reload products
      await loadProducts();

      // Clear editing state
      const newEditingStock = { ...editingStock };
      delete newEditingStock[productId];
      setEditingStock(newEditingStock);

      alert('Stock mis à jour avec succès');
    } catch (err: any) {
      alert(err.message);
    } finally {
      const newSavingStock = { ...savingStock };
      delete newSavingStock[productId];
      setSavingStock(newSavingStock);
    }
  }

  // Get stock status color
  function getStockStatusColor(stock: number, lowThreshold: number): string {
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock <= lowThreshold) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  }

  // Get stock message
  function getStockMessage(stock: number, lowThreshold: number): string {
    if (stock === 0) return 'Stock épuisé';
    if (stock <= lowThreshold) return `Il ne reste que ${stock} produit${stock > 1 ? 's' : ''}`;
    return `En stock (${stock})`;
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
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
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
        {/* Products table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Tous les produits</h2>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="px-4 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90"
            >
              Nouveau produit
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
            <div className="p-8 text-center text-gray-500">Aucun produit</div>
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
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut Stock
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
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {!product.isActive && (
                              <div className="text-xs text-red-600">Inactif</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Number(product.price).toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editingStock[product.id] !== undefined ? editingStock[product.id] : product.stock}
                            onChange={(e) => setEditingStock({
                              ...editingStock,
                              [product.id]: parseInt(e.target.value) || 0
                            })}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-fetra-olive focus:border-fetra-olive"
                          />
                          {editingStock[product.id] !== undefined && editingStock[product.id] !== product.stock && (
                            <button
                              onClick={() => handleUpdateStock(product.id)}
                              disabled={savingStock[product.id]}
                              className="px-3 py-1 text-xs bg-fetra-olive text-white rounded hover:bg-fetra-olive/90 disabled:opacity-50"
                            >
                              {savingStock[product.id] ? '...' : 'Sauver'}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(product.stock, product.lowStockThreshold)}`}>
                          {getStockMessage(product.stock, product.lowStockThreshold)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="text-fetra-olive hover:text-fetra-olive/80"
                        >
                          Modifier
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
    </div>
  );
}
