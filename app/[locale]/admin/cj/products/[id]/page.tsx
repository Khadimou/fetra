'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';

interface SupabaseProduct {
  id: string;
  cj_product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  variants: CJVariantDetail[];
  category: string;
  category_id: string;
  sku: string;
  created_at: string;
  updated_at: string;
}

interface CJVariantDetail {
  vid: string;
  variantNameEn: string;
  variantSku: string;
  variantImage?: string;
  variantSellPrice: number;
  variantInventory?: number;
  variantWeight?: number;
  variantLength?: number;
  variantWidth?: number;
  variantHeight?: number;
}

export default function AdminCjProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modal state for mapping
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<CJVariantDetail | null>(null);
  const [selectedLocalProduct, setSelectedLocalProduct] = useState<string>('');
  const [savingMapping, setSavingMapping] = useState(false);

  // Image viewer state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Check authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me');
        if (res.ok) {
          setIsAuthenticated(true);
          loadProduct();
          loadLocalProducts();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router, params.id]);

  // Load product details
  async function loadProduct() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/cj/products/${params.id}`);

      if (!res.ok) {
        throw new Error('Erreur lors du chargement du produit');
      }

      const data = await res.json();
      setProduct(data.product);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load local products for mapping
  async function loadLocalProducts() {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setLocalProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load local products:', err);
    }
  }

  // Open mapping modal
  function openMappingModal(variant: CJVariantDetail) {
    setSelectedVariant(variant);
    setSelectedLocalProduct('');
    setShowMappingModal(true);
  }

  // Close mapping modal
  function closeMappingModal() {
    setShowMappingModal(false);
    setSelectedVariant(null);
    setSelectedLocalProduct('');
  }

  // Save mapping
  async function handleSaveMapping() {
    if (!selectedVariant || !selectedLocalProduct || !product) {
      alert('Veuillez sélectionner un produit local');
      return;
    }

    try {
      setSavingMapping(true);

      const res = await fetch(`/api/admin/cj/products/${product.cj_product_id}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedLocalProduct,
          cjVariantId: selectedVariant.vid,
          cjProductId: product.cj_product_id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur');
      }

      alert('Mapping sauvegardé avec succès');
      closeMappingModal();
      await loadLocalProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingMapping(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.push('/admin/cj/products')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Retour aux produits CJ
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error || 'Produit non trouvé'}
          </div>
        </main>
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
                onClick={() => router.push('/admin/cj/products')}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2"
              >
                ← Retour aux produits CJ
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Détails du Produit CJ
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
        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
              <div className="aspect-square bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image
                  </div>
                )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-fetra-olive'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">SKU CJ</p>
                <p className="text-lg font-medium text-gray-900">{product.sku}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Product ID</p>
                <p className="text-lg font-medium text-gray-900">
                  {product.cj_product_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Catégorie</p>
                <p className="text-lg font-medium text-gray-900">
                  {product.category || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Prix</p>
                <p className="text-3xl font-bold text-fetra-olive">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Stock disponible</p>
                <p className="text-lg font-medium text-gray-900">
                  {product.stock} unités
                </p>
              </div>

              {product.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Créé le {new Date(product.created_at).toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-gray-500">
                  Mis à jour le {new Date(product.updated_at).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Variants ({product.variants.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variant ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {product.variants.map((variant) => {
                    const isLinked = localProducts.some(
                      (p) => p.cjVariantId === variant.vid
                    );
                    const linkedProduct = localProducts.find(
                      (p) => p.cjVariantId === variant.vid
                    );

                    return (
                      <tr key={variant.vid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {variant.variantImage ? (
                            <img
                              src={variant.variantImage}
                              alt={variant.variantNameEn}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {variant.variantNameEn}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.variantSku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                          {variant.vid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${variant.variantSellPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.variantInventory !== undefined
                            ? variant.variantInventory
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {variant.variantLength &&
                          variant.variantWidth &&
                          variant.variantHeight ? (
                            <div>
                              {variant.variantLength} × {variant.variantWidth} ×{' '}
                              {variant.variantHeight} cm
                              {variant.variantWeight && (
                                <div className="mt-1">{variant.variantWeight} kg</div>
                              )}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {isLinked ? (
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
                                Mappé
                              </span>
                              <p className="text-xs text-gray-500">
                                {linkedProduct?.name}
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => openMappingModal(variant)}
                              className="text-fetra-olive hover:text-fetra-olive/80 font-medium"
                            >
                              Lier au produit local
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Mapping Modal */}
      {showMappingModal && selectedVariant && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lier le variant au produit local
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Variant CJ sélectionné:</p>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-900">
                  {selectedVariant.variantNameEn}
                </p>
                <p className="text-sm text-gray-600">
                  SKU: {selectedVariant.variantSku}
                </p>
                <p className="text-sm text-gray-600">
                  Variant ID: {selectedVariant.vid}
                </p>
                <p className="text-sm font-medium text-fetra-olive">
                  ${selectedVariant.variantSellPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un produit local *
              </label>
              <select
                value={selectedLocalProduct}
                onChange={(e) => setSelectedLocalProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fetra-olive focus:border-fetra-olive"
              >
                <option value="">-- Choisir un produit --</option>
                {localProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - {Number(product.price).toFixed(2)}€
                    {product.cjVariantId && ' - Déjà mappé'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveMapping}
                disabled={savingMapping || !selectedLocalProduct}
                className="flex-1 px-4 py-2 bg-fetra-olive text-white rounded-md hover:bg-fetra-olive/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingMapping ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={closeMappingModal}
                disabled={savingMapping}
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
