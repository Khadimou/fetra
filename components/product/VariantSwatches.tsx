/**
 * VariantSwatches Component
 *
 * Sélecteur de variantes pour produits CJ.
 * - Affiche les variantes avec nom, prix et stock
 * - Gestion du stock (désactivé si rupture)
 * - Navigation clavier (Enter, Space, Arrow keys)
 * - Focus et hover states accessibles
 */

'use client';

import { useRef, useEffect } from 'react';

interface Variant {
  vid: string;
  variantNameEn: string;
  variantSku: string;
  variantSellPrice: number;
  variantInventory?: number;
}

interface VariantSwatchesProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onVariantSelect: (variant: Variant) => void;
  priceMultiplier?: number;
}

export default function VariantSwatches({
  variants,
  selectedVariantId,
  onVariantSelect,
  priceMultiplier = 2.5,
}: VariantSwatchesProps) {
  const variantRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Auto-select first variant if none selected
  useEffect(() => {
    if (!selectedVariantId && variants.length > 0) {
      const firstAvailable = variants.find((v) => (v.variantInventory || 0) > 0);
      if (firstAvailable) {
        onVariantSelect(firstAvailable);
      }
    }
  }, [variants, selectedVariantId, onVariantSelect]);

  const handleKeyDown = (
    e: React.KeyboardEvent,
    variant: Variant,
    index: number
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if ((variant.variantInventory || 0) > 0) {
        onVariantSelect(variant);
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, variants.length - 1);
      const nextVariant = variants[nextIndex];
      variantRefs.current.get(nextVariant.vid)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      const prevVariant = variants[prevIndex];
      variantRefs.current.get(prevVariant.vid)?.focus();
    }
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900">
        Sélectionner une variante
      </h2>

      <div
        className="grid grid-cols-2 gap-3"
        role="radiogroup"
        aria-label="Variantes disponibles"
      >
        {variants.map((variant, idx) => {
          const isSelected = selectedVariantId === variant.vid;
          const isInStock = (variant.variantInventory || 0) > 0;
          const displayPrice = (variant.variantSellPrice * priceMultiplier).toFixed(2);

          return (
            <button
              key={variant.vid}
              ref={(el) => {
                if (el) {
                  variantRefs.current.set(variant.vid, el);
                } else {
                  variantRefs.current.delete(variant.vid);
                }
              }}
              onClick={() => isInStock && onVariantSelect(variant)}
              onKeyDown={(e) => handleKeyDown(e, variant, idx)}
              disabled={!isInStock}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${variant.variantNameEn}, ${displayPrice} euros, ${
                isInStock ? 'en stock' : 'rupture de stock'
              }`}
              className={`
                relative p-4 rounded-xl border-2 text-left
                transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-fetra-olive/30
                ${
                  isSelected
                    ? 'border-fetra-olive bg-fetra-olive/5 shadow-md'
                    : isInStock
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-fetra-olive"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Variant name */}
              <div
                className={`font-medium mb-1 pr-6 ${
                  isSelected ? 'text-fetra-olive' : 'text-gray-900'
                }`}
              >
                {variant.variantNameEn}
              </div>

              {/* Price */}
              <div className="text-sm font-semibold text-gray-700">
                {displayPrice} €
              </div>

              {/* Stock status */}
              <div className="mt-2">
                {isInStock ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Rupture de stock
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection hint */}
      {!selectedVariantId && (
        <p className="text-sm text-orange-600 font-medium" role="alert">
          ⚠️ Veuillez sélectionner une variante pour continuer
        </p>
      )}
    </div>
  );
}
