/**
 * Product Detail Page - CJ Products
 *
 * Page produit améliorée avec best practices UX e-commerce :
 * - Galerie avec zoom
 * - Sélecteur de variantes accessible
 * - Validation serveur avant ajout au panier
 * - Gestion avancée des erreurs (stock, prix)
 * - Analytics tracking
 * - Micro-interactions
 */

'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/cart';

// Components
import ImageGallery from '@/components/product/ImageGallery';
import VariantSwatches from '@/components/product/VariantSwatches';
import StockBanner from '@/components/product/StockBanner';
import AddToCartButton from '@/components/product/AddToCartButton';
import PriceChangeModal from '@/components/product/PriceChangeModal';
import TrustBadges from '@/components/product/TrustBadges';

// Analytics
import {
  trackProductView,
  trackVariantSelect,
  trackAddToCartAttempt,
  trackAddToCartSuccess,
  trackAddToCartFailure,
  trackPriceChangeModal,
  trackStockAdjustment,
} from '@/lib/analytics';

interface CJVariant {
  vid: string;
  variantNameEn: string;
  variantSku: string;
  variantImage?: string;
  variantImages?: string[];
  variantSellPrice: number;
  variantInventory?: number;
}

interface CJProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  cjPrice: number;
  price: number;
  stock: number;
  images: string[];
  variants: CJVariant[];
  category: string;
  cjProductId: string;
  cjVariantId?: string;
  imageUrl?: string;
}

interface ValidationError {
  type: 'stock_insufficient' | 'price_changed' | 'network_error';
  message: string;
  available?: number;
  newPrice?: number;
}

/**
 * Fetch with exponential backoff retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 2,
  backoff: number = 300
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error: any) {
      lastError = error;
    }

    if (attempt < retries) {
      const delay = backoff * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Fetch failed after retries');
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ sku: string; locale: string }>;
}) {
  const resolvedParams = use(params);
  const t = useTranslations('ProductDetail');
  const router = useRouter();

  // Product state
  const [product, setProduct] = useState<CJProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedVariant, setSelectedVariant] = useState<CJVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const [adding, setAdding] = useState(false);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false);

  // Load product on mount and SKU change
  useEffect(() => {
    loadProduct();
  }, [resolvedParams.sku]);

  // Track product view after product loads
  useEffect(() => {
    if (product && !loading) {
      trackProductView({
        sku: product.sku,
        name: product.name,
        price: getCurrentPrice(),
        category: product.category,
        variant: selectedVariant?.variantNameEn,
      });
    }
  }, [product, loading]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchWithRetry(
        `/api/products/cj/${resolvedParams.sku}`,
        {},
        2,
        300
      );

      if (!res.ok) {
        throw new Error(
          res.status === 404 ? 'Product not found' : 'Failed to load product'
        );
      }

      const data = await res.json();

      if (!data.product) throw new Error('Product not found');

      setProduct(data.product);

      // Auto-select first available variant
      if (data.product.variants && data.product.variants.length > 0) {
        const firstAvailable = data.product.variants.find(
          (v: CJVariant) => (v.variantInventory || 0) > 0
        );
        if (firstAvailable) {
          setSelectedVariant(firstAvailable);
        } else {
          // Fallback to first variant even if out of stock
          setSelectedVariant(data.product.variants[0]);
        }
      }
    } catch (err: any) {
      setError(
        err.message || 'Une erreur est survenue lors du chargement du produit'
      );
    } finally {
      setLoading(false);
    }
  }

  function getProductImages(): string[] {
    // Priority: variant images > product images > fallback
    if (
      selectedVariant?.variantImages &&
      selectedVariant.variantImages.length > 0
    ) {
      return selectedVariant.variantImages;
    }

    if (selectedVariant?.variantImage) {
      return [selectedVariant.variantImage];
    }

    if (product?.images && product.images.length > 0) {
      return product.images;
    }

    if (product?.imageUrl) {
      return [product.imageUrl];
    }

    return ['/main.webp'];
  }

  function getCurrentPrice(): number {
    if (selectedVariant) {
      return selectedVariant.variantSellPrice * 2.5; // Match server margin
    }
    return product?.price || 0;
  }

  function getCurrentStock(): number {
    if (selectedVariant) {
      return selectedVariant.variantInventory || 0;
    }
    return product?.stock || 0;
  }

  function handleVariantSelect(variant: CJVariant) {
    setSelectedVariant(variant);
    setValidationError(null);

    // Track variant selection
    if (product) {
      trackVariantSelect(
        {
          sku: product.sku,
          name: product.name,
          price: variant.variantSellPrice * 2.5,
          category: product.category,
        },
        variant.variantNameEn
      );
    }
  }

  async function handleAddToCart() {
    if (!product) return;

    const currentStock = getCurrentStock();
    if (currentStock <= 0) {
      setValidationError({
        type: 'stock_insufficient',
        message: t('outOfStock'),
        available: 0,
      });
      return;
    }

    if (!selectedVariant && product.variants && product.variants.length > 0) {
      alert(t('selectVariant'));
      return;
    }

    setAdding(true);
    setValidationError(null);

    // Track add to cart attempt
    trackAddToCartAttempt(
      {
        sku: product.sku,
        name: product.name,
        price: getCurrentPrice(),
        category: product.category,
        variant: selectedVariant?.variantNameEn,
      },
      quantity
    );

    try {
      // Validate with server
      const currentPrice = getCurrentPrice();
      const validateRes = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: product.sku,
          cjVariantId: selectedVariant?.vid || product.cjVariantId,
          qty: quantity,
          expectedPrice: currentPrice,
        }),
      });

      const validationData = await validateRes.json();

      // Handle validation errors
      if (!validationData.ok) {
        if (validationData.reason === 'stock_insufficient') {
          setValidationError({
            type: 'stock_insufficient',
            message:
              validationData.message ||
              `Stock disponible : ${validationData.available || 0}`,
            available: validationData.available || 0,
          });

          trackAddToCartFailure(
            {
              sku: product.sku,
              name: product.name,
              price: currentPrice,
              category: product.category,
              variant: selectedVariant?.variantNameEn,
            },
            'stock_insufficient',
            { available: validationData.available, requested: quantity }
          );
          return;
        }

        if (validationData.reason === 'price_changed') {
          setValidationError({
            type: 'price_changed',
            message: validationData.message || 'Le prix a changé',
            newPrice: validationData.newPrice,
          });
          setShowPriceChangeModal(true);

          trackPriceChangeModal(
            'shown',
            currentPrice,
            validationData.newPrice
          );

          trackAddToCartFailure(
            {
              sku: product.sku,
              name: product.name,
              price: currentPrice,
              category: product.category,
              variant: selectedVariant?.variantNameEn,
            },
            'price_changed',
            { old_price: currentPrice, new_price: validationData.newPrice }
          );
          return;
        }

        throw new Error(validationData.message || 'Validation failed');
      }

      // Validation successful - add to cart
      const validatedItem = validationData.item;

      addToCart(
        {
          sku: validatedItem.sku,
          title: validatedItem.title,
          price: validatedItem.displayPrice,
          image: validatedItem.image,
          cjProductId: validatedItem.cjProductId,
          cjVariantId: validatedItem.cjVariantId,
          maxQuantity: validatedItem.maxQuantity,
          variantName: validatedItem.variantName,
        },
        validatedItem.qty
      );

      // Track successful add to cart
      trackAddToCartSuccess(
        {
          sku: product.sku,
          name: product.name,
          price: validatedItem.displayPrice,
          category: product.category,
          variant: selectedVariant?.variantNameEn,
        },
        validatedItem.qty
      );

      // Redirect to cart
      setTimeout(() => {
        router.push(`/${resolvedParams.locale}/cart`);
      }, 300);
    } catch (err: any) {
      console.error('Add to cart error:', err);
      setValidationError({
        type: 'network_error',
        message: err.message || 'Une erreur est survenue. Veuillez réessayer.',
      });

      trackAddToCartFailure(
        {
          sku: product.sku,
          name: product.name,
          price: getCurrentPrice(),
          category: product.category,
          variant: selectedVariant?.variantNameEn,
        },
        'network_error'
      );
    } finally {
      setAdding(false);
    }
  }

  function handlePriceChangeConfirm() {
    if (!validationError?.newPrice) return;

    trackPriceChangeModal(
      'confirmed',
      getCurrentPrice(),
      validationError.newPrice
    );

    setShowPriceChangeModal(false);
    loadProduct().then(() => {
      handleAddToCart();
    });
  }

  function handlePriceChangeCancel() {
    if (validationError?.newPrice) {
      trackPriceChangeModal(
        'cancelled',
        getCurrentPrice(),
        validationError.newPrice
      );
    }

    setShowPriceChangeModal(false);
    setValidationError(null);
    loadProduct();
  }

  function handleStockAdjustment(newQuantity: number) {
    if (product) {
      trackStockAdjustment(
        {
          sku: product.sku,
          name: product.name,
          price: getCurrentPrice(),
          category: product.category,
          variant: selectedVariant?.variantNameEn,
        },
        quantity,
        newQuantity
      );
    }

    setQuantity(newQuantity);
    setValidationError(null);
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fetra-olive mx-auto" />
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4 font-medium">
            {error || t('notFound')}
          </p>
          <p className="text-gray-600 mb-6">
            Le produit est peut-être indisponible ou l'URL est incorrecte.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/${resolvedParams.locale}/products`)}
              className="px-6 py-3 bg-fetra-olive text-white rounded-lg hover:bg-fetra-olive/90 font-medium shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-fetra-olive/30"
            >
              {t('backToCatalog')}
            </button>
            <button
              onClick={loadProduct}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-all focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = getProductImages();
  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <button
            onClick={() => router.push(`/${resolvedParams.locale}/products`)}
            className="text-fetra-olive hover:underline focus:outline-none focus:ring-2 focus:ring-fetra-olive rounded px-1"
          >
            {t('products')}
          </button>
          <span className="mx-2 text-gray-400" aria-hidden="true">
            /
          </span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Left: Image Gallery */}
          <div>
            <ImageGallery images={images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <p className="text-sm text-fetra-olive font-medium uppercase tracking-wide">
                {product.category}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              <span className="text-4xl font-extrabold text-fetra-olive">
                {currentPrice.toFixed(2)} €
              </span>
            </div>

            {/* Stock Banner */}
            <StockBanner
              stock={currentStock}
              requestedQuantity={quantity}
              onAdjustQuantity={handleStockAdjustment}
              showInsufficientError={
                validationError?.type === 'stock_insufficient'
              }
            />

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {t('description')}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <VariantSwatches
                variants={product.variants}
                selectedVariantId={selectedVariant?.vid || null}
                onVariantSelect={handleVariantSelect}
              />
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-2">
                {t('quantity')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  −
                </button>
                <span
                  className="w-16 text-center text-xl font-bold"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(currentStock, quantity + 1))
                  }
                  disabled={quantity >= currentStock}
                  aria-label="Augmenter la quantité"
                  className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all focus:outline-none focus:ring-4 focus:ring-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton
              onAddToCart={handleAddToCart}
              disabled={currentStock === 0}
              price={currentPrice}
              quantity={quantity}
              loading={adding}
            />

            {/* Trust Badges */}
            <TrustBadges className="pt-4" />
          </div>
        </div>
      </div>

      {/* Price Change Modal */}
      <PriceChangeModal
        isOpen={showPriceChangeModal}
        oldPrice={getCurrentPrice()}
        newPrice={validationError?.newPrice || 0}
        onConfirm={handlePriceChangeConfirm}
        onCancel={handlePriceChangeCancel}
      />
    </div>
  );
}
