export default function ValueComparison() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 brand-shadow">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-3">
        Pourquoi FETRA = Meilleur Rapport Qualité-Prix
      </h3>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Nous avons comparé avec les kits similaires du marché. Le résultat est sans appel.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Concurrent */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
            CONCURRENT
          </div>

          <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">
            Kit similaire du marché
          </h4>

          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-400 line-through">89,90€</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-600">Seulement 2 outils (pas de champignon)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-600">Pas d'huile incluse (à acheter séparément)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-600">Livraison payante (+4,90€)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">✗</span>
              <span className="text-gray-600">Pas de guide d'utilisation</span>
            </li>
          </ul>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">Total réel avec frais :</p>
            <p className="text-2xl font-bold text-gray-700">94,80€</p>
          </div>
        </div>

        {/* FETRA */}
        <div className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-xl p-6 border-2 border-fetra-olive relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white px-4 py-1 rounded-full text-xs font-semibold">
            FETRA - MEILLEURE OFFRE
          </div>

          <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-3">
            Kit Complet FETRA
          </h4>

          <div className="mb-4">
            <p className="text-4xl font-bold text-fetra-olive">49,90€</p>
            <p className="text-sm text-gray-600">Tout inclus, livraison offerte</p>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">3 outils Quartz Rose authentique</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Huile régénérante bio (30ml)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Livraison GRATUITE (valeur 4,90€)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Guide d'utilisation illustré</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700 font-medium">Pochette de rangement premium</span>
            </li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 font-semibold">
              🎉 Vous économisez 44,90€ par rapport à la concurrence
            </p>
          </div>
        </div>
      </div>

      {/* Cost per use */}
      <div className="bg-white rounded-xl p-6 border-2 border-fetra-olive/20">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Calculé sur une utilisation quotidienne pendant 4 mois :</p>
          <p className="text-3xl font-bold text-fetra-olive mb-2">0,41€ par utilisation</p>
          <p className="text-gray-600">
            Contre <span className="line-through text-red-500">2,00€</span> pour une crème anti-âge jetable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-fetra-olive">100%</p>
            <p className="text-sm text-gray-600">Naturel & Réutilisable</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-fetra-olive">0€</p>
            <p className="text-sm text-gray-600">Frais cachés</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-fetra-olive">14 jours</p>
            <p className="text-sm text-gray-600">Satisfait ou remboursé</p>
          </div>
        </div>
      </div>

      {/* Social proof badge */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          ⭐ Déjà <span className="font-semibold text-fetra-olive">500+ clients satisfaits</span> qui ont fait le choix FETRA
        </p>
      </div>
    </div>
  );
}
