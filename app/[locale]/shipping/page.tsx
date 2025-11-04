import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison — FETRA BEAUTY",
  description: "Livraison offerte sur toutes les commandes FETRA. Expédition sous 24-48h, livraison standard 3-5 jours ouvrés en France métropolitaine.",
};

export default function ShippingPage() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-olive/10 text-fetra-olive rounded-full text-sm font-semibold mb-6">
            Livraison
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Livraison FETRA — Vos produits, en toute sérénité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chez FETRA, nous mettons tout en œuvre pour que votre rituel de bien-être vous parvienne dans les meilleures conditions et les meilleurs délais.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-12">
          {/* Offer Banner */}
          <div className="bg-gradient-to-r from-fetra-olive to-fetra-pink text-white rounded-3xl p-8 text-center brand-shadow">
            <h2 className="text-3xl font-bold mb-4">🎉 Offre de Lancement</h2>
            <p className="text-xl mb-2">
              <strong>La livraison est offerte sur TOUTES les commandes !</strong>
            </p>
            <p className="text-lg opacity-90">
              Valeur normale : 4,90 € — Actuellement gratuit
            </p>
          </div>

          {/* Processing Time */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Délais de Traitement des Commandes</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Toutes les commandes sont traitées et expédiées sous <strong>24h à 48h ouvrés</strong> après validation.
              </p>
              <p>
                Vous recevrez un e-mail de confirmation d'expédition avec votre numéro de suivi dès que votre colis quittera notre entrepôt.
              </p>
            </div>
          </div>

          {/* Shipping Methods */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-8">Modes et Délais de Livraison</h2>
            <p className="text-lg text-gray-600 mb-8">
              Nous proposons les modes de livraison suivants pour la France Métropolitaine :
            </p>

            <div className="space-y-6">
              {/* Standard Shipping */}
              <div className="border-l-4 border-fetra-olive pl-6 py-4 bg-gray-50 rounded-r-xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">Livraison Standard</h3>
                  <span className="px-4 py-1 bg-fetra-olive text-white rounded-full text-sm font-semibold">
                    OFFERTE
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Transporteur :</strong> Colissimo / Mondial Relay
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Délai :</strong> 3 à 5 jours ouvrés après expédition
                </p>
                <p className="text-gray-600 text-sm">
                  Valeur normale : 4,90 € — Actuellement gratuit pendant notre période de lancement
                </p>
              </div>

              {/* Express Shipping (Optional - comment if not available) */}
              {/* <div className="border-l-4 border-fetra-pink pl-6 py-4 bg-gray-50 rounded-r-xl">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">Livraison Express</h3>
                  <span className="px-4 py-1 bg-fetra-pink text-white rounded-full text-sm font-semibold">
                    Payante
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Transporteur :</strong> Chronopost
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Délai :</strong> 1 jour ouvré après expédition
                </p>
                <p className="text-gray-700">
                  <strong>Coût :</strong> 9,90 €
                </p>
              </div> */}
            </div>
          </div>

          {/* International Shipping */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">Livraison Internationale</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Nous livrons également en <strong>Belgique</strong> et <strong>Suisse</strong>. Les frais et délais de livraison sont calculés automatiquement lors de votre passage en caisse.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                <p className="text-sm text-gray-800">
                  <strong>⚠️ Attention :</strong> Des droits de douane ou taxes locales peuvent s'appliquer pour les livraisons hors Union Européenne. Ceux-ci sont à la charge du client.
                </p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Suivi de Votre Commande</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Un numéro de suivi vous sera communiqué par e-mail. Vous pourrez suivre l'acheminement de votre colis directement sur le site du transporteur :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <a href="https://www.laposte.fr/particulier/outils/suivre-vos-envois" target="_blank" rel="noopener noreferrer" className="text-fetra-olive hover:text-fetra-olive/80 underline">
                    Colissimo — La Poste
                  </a>
                </li>
                <li>
                  <a href="https://www.mondialrelay.fr/suivi-de-colis/" target="_blank" rel="noopener noreferrer" className="text-fetra-olive hover:text-fetra-olive/80 underline">
                    Mondial Relay
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Problem Resolution */}
          <div className="bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20">
            <h2 className="text-3xl font-bold mb-6">Que faire en cas de problème ?</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>
                Si vous rencontrez un problème avec la livraison de votre commande (retard anormal, colis endommagé, non-réception), veuillez contacter notre service client à{" "}
                <a href="mailto:contact@fetrabeauty.com" className="text-fetra-olive hover:text-fetra-olive/80 font-semibold underline">
                  contact@fetrabeauty.com
                </a>{" "}
                avec votre numéro de commande.
              </p>
              <p>
                Nous ferons le nécessaire pour résoudre la situation au plus vite.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-white rounded-3xl p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-4">Prêt à commander ?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez le rituel qui transformera votre routine beauté
            </p>
            <Link
              href="/product"
              className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
            >
              Découvrir le Rituel FETRA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

