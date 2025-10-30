import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retours & Remboursements — FETRA BEAUTY",
  description: "Droit de rétractation de 14 jours. Retour gratuit et facile. Remboursement sous 5-10 jours ouvrés après réception.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-pink/10 text-fetra-pink rounded-full text-sm font-semibold mb-6">
            Retours & Remboursements
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Retours & Remboursements FETRA — Votre Satisfaction, Notre Priorité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chez FETRA, nous souhaitons que vous soyez entièrement satisfait de votre Rituel Visage Liftant. Si, pour une raison quelconque, vous n'êtes pas pleinement conquis, vous disposez d'un délai pour nous retourner votre commande.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-12">
          {/* Return Policy Banner */}
          <div className="bg-gradient-to-r from-fetra-pink to-fetra-olive text-white rounded-3xl p-8 text-center brand-shadow">
            <h2 className="text-3xl font-bold mb-4">✨ Retour Gratuit et Facile</h2>
            <p className="text-xl">
              Nous nous engageons à rendre le processus de retour aussi simple que possible pour vous.
            </p>
          </div>

          {/* Withdrawal Period */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Délai de Rétractation</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Conformément à la législation européenne, vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter de la date de réception de votre commande pour exercer votre droit de rétractation et nous retourner le(s) produit(s).
              </p>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">Conditions de Retour</h2>
            <p className="text-lg text-gray-600 mb-6">
              Pour être éligible à un retour, votre article doit être :
            </p>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Inutilisé</strong> et dans le même état où vous l'avez reçu</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dans son <strong>emballage d'origine complet et intact</strong> (boîte, pochette, notice, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Accompagné de la <strong>preuve d'achat</strong> (facture ou confirmation de commande)</span>
              </li>
            </ul>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
              <p className="text-sm text-gray-800">
                <strong>⚠️ Important :</strong> Nous nous réservons le droit de refuser un retour si ces conditions ne sont pas respectées.
              </p>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-8">Processus de Retour</h2>
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-fetra-olive text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Contactez-nous</h3>
                  <p className="text-gray-700 text-lg mb-2">
                    Envoyez un e-mail à{" "}
                    <a href="mailto:contact@fetrabeauty.com" className="text-fetra-olive hover:text-fetra-olive/80 font-semibold underline">
                      contact@fetrabeauty.com
                    </a>{" "}
                    en précisant votre numéro de commande et le motif de votre retour.
                  </p>
                  <p className="text-gray-700 text-lg">
                    Notre service client vous enverra un bon de retour prépayé.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-fetra-pink text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Préparez votre colis</h3>
                  <p className="text-gray-700 text-lg">
                    Emballez soigneusement le(s) produit(s) dans son/leur emballage d'origine.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Expédiez</h3>
                  <p className="text-gray-700 text-lg">
                    Déposez votre colis au point de collecte le plus proche de <strong>Mondial Relay</strong> ou <strong>La Poste</strong> (selon le transporteur indiqué dans votre bon de retour).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Remboursements</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Une fois votre retour reçu et inspecté, nous vous enverrons un e-mail pour vous informer de l'approbation ou du rejet de votre remboursement.
              </p>
              <p>
                En cas d'approbation, votre remboursement sera traité et un crédit sera automatiquement appliqué à votre carte de crédit ou à votre mode de paiement original, dans un délai de <strong>5 à 10 jours ouvrés</strong>.
              </p>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-xl mt-4">
                <p className="text-sm text-gray-800">
                  <strong>Note :</strong> Les frais de livraison initiaux ne sont pas remboursables (sauf erreur de notre part ou produit défectueux).
                </p>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">Échanges</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Nous ne proposons pas d'échanges directs. Si vous souhaitez échanger un article, veuillez le retourner pour un remboursement et passer une nouvelle commande.
              </p>
            </div>
          </div>

          {/* Non-Returnable Items */}
          {/* <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">Articles Non Retournables</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Certains types de produits ne peuvent être retournés : cartes cadeaux, produits personnalisés, etc.
              </p>
            </div>
          </div> */}

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Une question sur les retours ?</h2>
              <p className="text-gray-600 mb-6">
                Notre équipe est là pour vous accompagner à chaque étape.
              </p>
              <a
                href="mailto:contact@fetrabeauty.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@fetrabeauty.com
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-white rounded-3xl p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-4">Découvrez le Rituel FETRA</h2>
            <p className="text-xl text-gray-600 mb-8">
              Retrouvez l'éclat naturel de votre peau en 5 minutes par jour
            </p>
            <Link
              href="/product"
              className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
            >
              Voir le Produit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

