/**
 * CJ Product Card Component
 * Displays a CJ product with image, name, price, stock
 */

import { CJProduct } from '@/lib/types/cj';

interface CjProductCardProps {
  product: CJProduct;
  onAction?: (product: CJProduct) => void;
  actionLabel?: string;
  showVariants?: boolean;
}

export default function CjProductCard({
  product,
  onAction,
  actionLabel = 'Sélectionner',
  showVariants = false,
}: CjProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 relative">
        {product.productImage ? (
          <img
            src={product.productImage}
            alt={product.productNameEn}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}
        {product.warehouseInventoryNum !== undefined && (
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
            Stock: {product.warehouseInventoryNum}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
          {product.productNameEn}
        </h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>SKU: {product.productSku}</p>
          <p>PID: {product.pid}</p>
          {product.categoryName && (
            <p className="text-xs text-gray-500">{product.categoryName}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-fetra-olive">
            ${product.sellPrice.toFixed(2)}
          </div>

          {onAction && (
            <button
              onClick={() => onAction(product)}
              className="px-4 py-2 bg-fetra-olive text-white text-sm rounded hover:bg-fetra-olive/90 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>

        {/* Variants */}
        {showVariants && product.variants && product.variants.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Variants ({product.variants.length})
            </p>
            <div className="space-y-1">
              {product.variants.slice(0, 3).map((variant) => (
                <div
                  key={variant.vid}
                  className="text-xs text-gray-600 flex justify-between"
                >
                  <span className="truncate">{variant.variantNameEn}</span>
                  <span className="font-medium ml-2">
                    ${variant.variantSellPrice.toFixed(2)}
                  </span>
                </div>
              ))}
              {product.variants.length > 3 && (
                <p className="text-xs text-gray-500 italic">
                  +{product.variants.length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
