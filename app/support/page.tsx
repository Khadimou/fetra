// app/support/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & Aide — FETRA BEAUTY",
  description: "Centre d'aide FETRA : FAQ, contact support, guides d'utilisation et assistance client pour votre rituel visage liftant.",
};

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Centre d&apos;Aide</h1>
        <p className="text-xl text-gray-600">
          Trouvez rapidement les réponses à vos questions ou contactez notre équipe.
        </p>
      </div>

      {/* Contact rapide */}
      <div className="mb-12 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white p-6 rounded-2xl text-center brand-shadow">
        <h2 className="text-2xl font-semibold mb-2">Besoin d&apos;aide immédiate ?</h2>
        <p className="mb-4">Utilisez notre widget de support pour obtenir une réponse rapide</p>
        <p className="text-sm opacity-90">
          Cliquez sur le bouton 💬 en bas à droite de votre écran
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ Rapide */}
        <div className="bg-white rounded-3xl p-8 brand-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-fetra-olive/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Questions Fréquentes</h2>
          </div>
          
          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                Comment utiliser le rouleau de jade ?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                Utilisez le rouleau de jade avec des mouvements ascendants, du centre vers l&apos;extérieur, pendant 3-5 minutes après avoir appliqué l&apos;huile.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                À quelle fréquence utiliser le produit ?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                Utilisez le rituel 2 fois par jour : matin et soir. Pour des résultats optimaux, maintenez cette routine pendant au moins 4-6 semaines.
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                Le produit convient-il aux peaux sensibles ?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                Oui, notre formulation est douce et adaptée à tous types de peau. Cependant, nous recommandons un test cutané sur une petite zone avant la première utilisation.
              </div>
            </details>
          </div>

          <div className="mt-6 pt-6 border-t">
            <a 
              href="/faq" 
              className="text-fetra-olive hover:text-fetra-olive/80 font-medium"
            >
              Voir toutes les FAQ →
            </a>
          </div>
        </div>

        {/* Guides & Ressources */}
        <div className="bg-white rounded-3xl p-8 brand-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-fetra-pink/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Guides & Ressources</h2>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/blog" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">Guide des Rituels</h3>
              <p className="text-sm text-gray-600">Apprenez les techniques de massage et routines matin/soir</p>
            </a>

            <a 
              href="/shipping" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">Livraison & Expédition</h3>
              <p className="text-sm text-gray-600">Délais, frais de port et suivi de commande</p>
            </a>

            <a 
              href="/returns" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">Retours & Remboursements</h3>
              <p className="text-sm text-gray-600">Politique de retour et procédure de remboursement</p>
            </a>

            <a 
              href="/about" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">À Propos de FETRA</h3>
              <p className="text-sm text-gray-600">Notre histoire, mission et engagement qualité</p>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20 text-center">
        <h2 className="text-3xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Notre équipe support est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Page Contact
          </a>
          
          <a
            href="mailto:contact@fetrabeauty.com"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-fetra-olive text-fetra-olive rounded-xl font-semibold hover:bg-fetra-olive hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contact@fetrabeauty.com
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            💬 Pensez aussi à utiliser notre <strong>widget de support</strong> (bouton en bas à droite) 
            pour obtenir une aide immédiate !
          </p>
        </div>
      </div>
    </div>
  );
}
