/**
 * AddToCartButton Component
 *
 * Bouton d'ajout au panier avec états et gestion d'erreurs.
 * États : normal, loading, disabled, success.
 * Accessibilité : aria-live pour les changements d'état.
 */

'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  onAddToCart: () => Promise<void>;
  disabled?: boolean;
  price: number;
  quantity: number;
  loading?: boolean;
  className?: string;
}

export default function AddToCartButton({
  onAddToCart,
  disabled = false,
  price,
  quantity,
  loading = false,
  className = '',
}: AddToCartButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loading || internalLoading;
  const totalPrice = (price * quantity).toFixed(2);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setInternalLoading(true);
    setError(null);

    try {
      await onAddToCart();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live="polite"
        className={`
          w-full py-4 px-6
          bg-gradient-to-r from-fetra-olive to-fetra-pink
          text-white font-bold text-lg rounded-xl
          shadow-lg hover:shadow-xl
          transition-all duration-200
          hover:scale-[1.02] active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100
          flex items-center justify-center gap-3
          focus:outline-none focus:ring-4 focus:ring-fetra-olive/30
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <div
              className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
              aria-hidden="true"
            />
            <span>Ajout en cours...</span>
          </>
        ) : disabled ? (
          <span>Rupture de stock</span>
        ) : (
          <>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Ajouter au panier • {totalPrice} €</span>
          </>
        )}
      </button>

      {/* Error message */}
      {error && (
        <div
          className="p-3 bg-red-50 border-l-4 border-red-500 rounded text-sm"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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
            <div>
              <p className="font-medium text-red-800">Erreur</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
