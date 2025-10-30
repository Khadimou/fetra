import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — FETRA BEAUTY",
  description: "Contactez notre équipe pour toute question sur le rituel FETRA. Nous sommes là pour vous accompagner.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-olive/10 text-fetra-olive rounded-full text-sm font-semibold mb-6">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nous sommes là pour vous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question sur le rituel FETRA ? Besoin d'aide avec votre commande ? 
            Notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Contact */}
          <div className="bg-white rounded-3xl p-8 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Email</h2>
                <p className="text-gray-600">Réponse sous 24h</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Pour toute question générale, conseils d'utilisation, ou informations sur nos produits.
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

          {/* Support Form */}
          <div className="bg-white rounded-3xl p-8 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Support Client</h2>
                <p className="text-gray-600">Assistance technique</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Pour les problèmes de commande, retours, ou questions techniques.
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-fetra-pink text-white rounded-xl font-semibold hover:bg-fetra-pink/90 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Formulaire de support
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 brand-shadow">
          <h2 className="text-3xl font-bold text-center mb-8">Questions Fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">Comment utiliser le rituel FETRA ?</h3>
                <p className="text-gray-600">
                  Le rituel se fait en 5 minutes : nettoyez votre visage, appliquez 3-4 gouttes d'huile, 
                  drainez avec le rouleau du centre vers l'extérieur, puis sculptez avec le Gua Sha.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">Le rituel est-il adapté aux hommes ?</h3>
                <p className="text-gray-600">
                  Absolument ! FETRA est conçu pour tous les visages, sans distinction de genre. 
                  C'est un rituel universel de bien-être.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">Quels sont les délais de livraison ?</h3>
                <p className="text-gray-600">
                  Livraison gratuite sous 2-3 jours ouvrés en France métropolitaine. 
                  Nous expédions depuis notre entrepôt français.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">Puis-je retourner ma commande ?</h3>
                <p className="text-gray-600">
                  Oui, vous avez 14 jours pour retourner votre commande si elle ne vous convient pas. 
                  Les frais de retour sont à notre charge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-12 border border-fetra-olive/20">
          <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez le rituel qui transformera votre routine beauté
          </p>
          <a
            href="/product"
            className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
          >
            Découvrir le Rituel FETRA
          </a>
        </div>
      </section>
    </div>
  );
}
