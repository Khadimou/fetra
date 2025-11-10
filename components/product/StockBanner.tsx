/**
 * StockBanner Component
 *
 * Affiche les alertes liées au stock du produit.
 * - Stock insuffisant : message + bouton d'ajustement
 * - Stock faible : alerte urgence
 * - En stock : badge de confirmation
 */

'use client';

interface StockBannerProps {
  stock: number;
  requestedQuantity?: number;
  onAdjustQuantity?: (newQuantity: number) => void;
  showInsufficientError?: boolean;
}

export default function StockBanner({
  stock,
  requestedQuantity,
  onAdjustQuantity,
  showInsufficientError = false,
}: StockBannerProps) {
  // Stock insuffisant (erreur suite à validation)
  if (showInsufficientError && requestedQuantity && requestedQuantity > stock) {
    return (
      <div
        className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg"
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0" aria-hidden="true">
            ⚠️
          </div>
          <div className="flex-1">
            <p className="font-bold text-orange-800 mb-1">
              Stock insuffisant
            </p>
            <p className="text-orange-700 text-sm mb-3">
              Seulement {stock} unité{stock > 1 ? 's' : ''} disponible
              {stock > 1 ? 's' : ''} pour ce produit.
            </p>
            {stock > 0 && onAdjustQuantity && (
              <button
                onClick={() => onAdjustQuantity(stock)}
                className="text-sm text-orange-800 font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-1"
              >
                Ajuster la quantité à {stock}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rupture de stock
  if (stock === 0) {
    return (
      <div
        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600"
        role="status"
        aria-live="polite"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
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
        <span className="font-medium">Rupture de stock</span>
      </div>
    );
  }

  // Stock faible (≤ 10 unités)
  if (stock <= 10) {
    return (
      <div
        className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg"
        role="status"
        aria-live="polite"
      >
        <svg
          className="w-5 h-5 flex-shrink-0 text-orange-600"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          <span className="font-medium text-orange-800">
            Plus que {stock} disponible{stock > 1 ? 's' : ''} !
          </span>
          <span className="text-orange-700 text-sm ml-2">
            Commandez vite
          </span>
        </div>
      </div>
    );
  }

  // En stock (> 10 unités)
  return (
    <div
      className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600"
      role="status"
      aria-live="polite"
    >
      <svg
        className="w-5 h-5 flex-shrink-0"
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
      <span className="font-medium">En stock</span>
    </div>
  );
}
