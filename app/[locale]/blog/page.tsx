import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conseils & Tutoriels — FETRA",
  description: "Découvrez comment utiliser votre Kit Quartz Rose 3-en-1. Tutoriels vidéo, guides d'utilisation et conseils d'experts pour un rituel visage parfait.",
};

export default function BlogPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white text-fetra-olive rounded-full text-sm font-semibold mb-6 brand-shadow">
            Conseils & Tutoriels
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Maîtrisez Votre Rituel FETRA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour profiter pleinement de votre Kit Quartz Rose 3-en-1
          </p>
        </div>
      </section>

      {/* Les Fondamentaux */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Les Fondamentaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Nettoyer vos Outils</h3>
            <p className="text-gray-600 mb-4">
              Avant et après chaque utilisation, nettoyez vos outils avec de l'eau tiède et un savon doux. 
              Séchez-les délicatement avec un chiffon propre.
            </p>
            <div className="bg-fetra-olive/5 p-3 rounded-lg text-sm text-fetra-olive font-medium">
              ✓ Hygiène = Peau saine
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">L'Huile est Obligatoire</h3>
            <p className="text-gray-600 mb-4">
              Ne JAMAIS utiliser vos outils sur peau sèche ! L'huile permet aux pierres de glisser 
              en douceur et multiplie les bienfaits du massage.
            </p>
            <div className="bg-fetra-pink/5 p-3 rounded-lg text-sm text-fetra-pink font-medium">
              ✓ 3-4 gouttes suffisent
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Le Mouvement de Base</h3>
            <p className="text-gray-600 mb-4">
              Toujours masser de l'intérieur vers l'extérieur, et vers le haut. Suivez les lignes 
              naturelles de drainage lymphatique.
            </p>
            <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-700 font-medium">
              ✓ Pression douce et ferme
            </div>
          </div>
        </div>
      </section>

      {/* Tutoriels Vidéo */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Tutoriels Vidéo</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Suivez nos guides pas à pas pour maîtriser votre rituel FETRA
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden brand-shadow">
              <div className="aspect-video bg-black">
                <video 
                  controls 
                  className="w-full h-full"
                  poster="/application.webp"
                >
                  <source src="/Routine_Matinale_Visage_Rouleau_Jade.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-fetra-olive/10 text-fetra-olive text-xs font-semibold rounded-full mb-3">
                  MATIN · 5 MIN
                </span>
                <h3 className="text-xl font-bold mb-2">Le Rituel du Matin</h3>
                <p className="text-gray-600 mb-4">
                  Dégonfler et réveiller le visage avec le rouleau et l'outil champignon. 
                  Focus sur les cernes et les poches.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Rouleau au frigo pour effet frais
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Drainage des poches et cernes
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Réveil de la circulation
                  </li>
                </ul>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden brand-shadow">
              <div className="aspect-video bg-black">
                <video 
                  controls 
                  className="w-full h-full"
                  poster="/main.webp"
                >
                  <source src="/Gua_Sha_Homme_Noir.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-fetra-pink/10 text-fetra-pink text-xs font-semibold rounded-full mb-3">
                  SOIR · 10 MIN
                </span>
                <h3 className="text-xl font-bold mb-2">Le Rituel du Soir</h3>
                <p className="text-gray-600 mb-4">
                  Sculpter et lifter avec le Gua Sha cœur. Focus sur la mâchoire, 
                  les pommettes et l'ovale du visage.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Définition de la mâchoire
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lift des pommettes
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Relaxation profonde
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Visuel */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">L'Anatomie de votre Kit 3-en-1</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tool 1 */}
          <div className="bg-white rounded-2xl p-8 brand-shadow text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-fetra-olive/10 to-fetra-olive/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Le Rouleau</h3>
            <p className="text-gray-600 mb-4">
              Votre allié du matin. Placez-le au frigo pour un effet décongestionnant instantané.
            </p>
            <div className="bg-fetra-olive/5 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-fetra-olive">✓ Idéal pour :</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>• Réduire les poches</li>
                <li>• Activer la circulation</li>
                <li>• Réveiller le visage</li>
              </ul>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="bg-white rounded-2xl p-8 brand-shadow text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-fetra-pink/10 to-fetra-pink/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Le Gua Sha Cœur</h3>
            <p className="text-gray-600 mb-4">
              Votre sculpteur. Parfait pour lifter l'ovale du visage et les pommettes.
            </p>
            <div className="bg-fetra-pink/5 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-fetra-pink">✓ Idéal pour :</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>• Sculpter la mâchoire</li>
                <li>• Lifter les pommettes</li>
                <li>• Définir l'ovale</li>
              </ul>
            </div>
          </div>

          {/* Tool 3 */}
          <div className="bg-white rounded-2xl p-8 brand-shadow text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Le Gua Sha Champignon</h3>
            <p className="text-gray-600 mb-4">
              Votre expert anti-cernes. Conçu pour le contour délicat des yeux.
            </p>
            <div className="bg-purple-50 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-purple-700">✓ Idéal pour :</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>• Drainer les cernes</li>
                <li>• Détendre le contour</li>
                <li>• Points de pression</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Foire aux Questions</h2>
          <div className="space-y-4">
            {/* Q1 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                À quelle fréquence dois-je utiliser mon kit ?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                Idéalement <strong>5 minutes par jour</strong> pour des résultats visibles rapidement. 
                Si vous manquez de temps, utilisez-le <strong>10-15 minutes, 3 fois par semaine</strong>. 
                La régularité est plus importante que la durée !
              </p>
            </details>

            {/* Q2 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                J'ai de l'acné, puis-je utiliser le kit ?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                Oui ! Le drainage lymphatique aide même à réduire l'inflammation. 
                Cependant, <strong>évitez les zones d'inflammation active</strong> (boutons rouges ou douloureux). 
                Massez les zones saines pour stimuler la circulation et l'élimination des toxines.
              </p>
            </details>

            {/* Q3 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                Conseil spécial pour les hommes
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                <strong>Utilisez le rouleau froid après le rasage</strong> pour apaiser le feu du rasoir ! 
                Le quartz rose refroidi calme instantanément les irritations et réduit les rougeurs. 
                Un game-changer pour votre routine post-rasage.
              </p>
            </details>

            {/* Q4 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                Vais-je avoir des bleus ?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                Non ! Si vous utilisez la bonne pression. <strong>La pression doit être douce mais ferme</strong>, 
                comme si vous étaliez une crème épaisse. Jamais de douleur. Si vous voyez des rougeurs qui durent, 
                c'est que vous appuyez trop fort.
              </p>
            </details>

            {/* Q5 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                Puis-je partager mes outils avec mon/ma partenaire ?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                Pour des raisons d'hygiène, il est préférable que chacun ait son propre kit. 
                Cependant, si vous nettoyez soigneusement les outils après chaque utilisation 
                (savon doux + eau tiède + désinfection alcool à 70°), c'est possible !
              </p>
            </details>

            {/* Q6 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                Quand vais-je voir des résultats ?
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                <strong>Immédiatement</strong> pour le dégonflement et l'éclat (effet frais). 
                <strong>Après 1 semaine</strong> pour la réduction des poches et cernes. 
                <strong>Après 2-3 semaines</strong> pour le lissage des rides et la définition des traits. 
                <strong>Après 1 mois</strong> pour l'effet lift visible et durable.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-12 brand-shadow">
          <h2 className="text-3xl font-bold mb-4">Prêt à Commencer ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez le Kit Quartz Rose 3-en-1 et transformez votre routine beauté
          </p>
          <Link
            href="/product"
            className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
          >
            Voir le Rituel FETRA • 49,90 €
          </Link>
        </div>
      </section>
    </div>
  );
}

