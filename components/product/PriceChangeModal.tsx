/**
 * PriceChangeModal Component
 *
 * Modal affiché lorsque le prix d'un produit a changé.
 * Permet à l'utilisateur de confirmer ou annuler l'ajout au panier.
 * Animation d'apparition douce avec backdrop blur.
 */

'use client';

import { useEffect } from 'react';

interface PriceChangeModalProps {
  isOpen: boolean;
  oldPrice: number;
  newPrice: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PriceChangeModal({
  isOpen,
  oldPrice,
  newPrice,
  onConfirm,
  onCancel,
}: PriceChangeModalProps) {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const priceDifference = newPrice - oldPrice;
  const priceIncreased = priceDifference > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="text-center mb-4">
          <div
            className="text-5xl mb-3"
            role="img"
            aria-label={priceIncreased ? 'Prix augmenté' : 'Prix réduit'}
          >
            {priceIncreased ? '💰' : '🎉'}
          </div>
          <h3
            id="modal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {priceIncreased ? 'Prix modifié' : 'Bonne nouvelle !'}
          </h3>
          <p className="text-gray-600">
            {priceIncreased
              ? 'Le prix a légèrement augmenté depuis votre dernière visite.'
              : 'Le prix a baissé depuis votre dernière visite !'}
          </p>
        </div>

        {/* Price Comparison */}
        <div className="bg-fetra-olive/5 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">
              Prix précédent :
            </span>
            <span className="text-gray-400 line-through text-lg font-semibold">
              {oldPrice.toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">Nouveau prix :</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`font-extrabold text-2xl ${
                  priceIncreased ? 'text-fetra-olive' : 'text-green-600'
                }`}
              >
                {newPrice.toFixed(2)} €
              </span>
              <span
                className={`text-sm font-medium ${
                  priceIncreased ? 'text-orange-600' : 'text-green-600'
                }`}
              >
                {priceIncreased ? '+' : ''}
                {priceDifference.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white rounded-lg font-bold hover:shadow-lg transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-fetra-olive/30"
          >
            Mettre à jour & ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
