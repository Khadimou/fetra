/**
 * TrustBadges Component
 *
 * Section de réassurance affichée sous le bouton d'ajout au panier.
 * Affiche les garanties et services pour rassurer l'acheteur.
 */

'use client';

interface Badge {
  icon: string;
  title: string;
  description: string;
}

interface TrustBadgesProps {
  className?: string;
}

const defaultBadges: Badge[] = [
  {
    icon: '🚚',
    title: 'Livraison 3-7 jours',
    description: 'Expédition rapide depuis nos entrepôts',
  },
  {
    icon: '↩️',
    title: 'Retours 30 jours',
    description: 'Satisfait ou remboursé',
  },
  {
    icon: '🔒',
    title: 'Paiement sécurisé',
    description: 'Vos données sont protégées',
  },
];

export default function TrustBadges({
  className = '',
}: TrustBadgesProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {defaultBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-150"
          >
            <div
              className="text-2xl flex-shrink-0"
              role="img"
              aria-label={badge.title}
            >
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight mb-0.5">
                {badge.title}
              </p>
              <p className="text-xs text-gray-600 leading-tight">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional trust indicators */}
      <div className="flex items-center justify-center gap-4 pt-2 pb-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg
            className="w-4 h-4 text-green-600"
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
          <span className="font-medium">Paiement SSL</span>
        </div>
        <div className="w-px h-4 bg-gray-300" aria-hidden="true" />
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="font-medium">Support 24/7</span>
        </div>
      </div>
    </div>
  );
}
