'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CjProductCard from '@/components/admin/CjProductCard';

interface SupabaseProduct {
  id: string;
  cj_product_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  variants: any[];
  category: string;
  category_id: string;
  sku: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCjProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
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
          loadProduct();
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [router]);

  // Load product
  async function loadProduct() {
    try {
      setLoading(true);

      // For now, we'll redirect back to products list since we don't have
      // a specific API endpoint for individual CJ product details yet
      // This is a placeholder page
      router.push('/admin/cj/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">
              Page de détails du produit (ID: {params.id})
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Cette page redirige automatiquement vers la liste des produits CJ.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
