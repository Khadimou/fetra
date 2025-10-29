"use client";
import { useState } from "react";

type Props = {
  stock: number;
};

export default function Scarcity({ stock }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || stock > 5) return null;

  return (
    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3 animate-fade-in">
      <div className="flex-1">
        <p className="text-sm font-semibold text-orange-900">
          ⚠️ Plus que {stock} disponible{stock > 1 ? 's' : ''} !
        </p>
        <p className="text-xs text-orange-700 mt-1">Commandez maintenant pour réserver le vôtre</p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer l'alerte"
        className="text-orange-700 hover:text-orange-900 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

