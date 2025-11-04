import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FETRA — Rituel Visage Liftant & Beauté Naturelle",
  description: "Découvrez le rituel visage FETRA : Kit Quartz Rose 3-en-1 & Huile Régénérante. Un moment de bien-être pour révéler l'éclat naturel de votre peau.",
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-fetra-olive/5 via-white to-fetra-pink/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-fetra-olive/10 text-fetra-olive rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Offre de Lancement
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block text-gray-900">Révélez l'éclat</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fetra-olive to-fetra-pink">
                  naturel de votre peau
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Un rituel de 5 minutes pour drainer, sculpter et illuminer votre visage. 
                Adapté à tous les types de peau et tous les genres.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/product"
                  className="inline-flex items-center justify-center px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold text-lg hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Découvrir le Rituel
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="#benefits"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg hover:border-fetra-olive hover:text-fetra-olive transition-all hover:scale-[1.02] active:scale-95"
                >
                  En savoir plus
                </a>
              </div>

              <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Livraison gratuite</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Retour 14 jours</span>
                </div>
              </div>
            </div>

            {/* Right: Product Image */}
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden brand-shadow">
                <Image
                  src="/main.webp"
                  alt="Rituel Visage FETRA - Kit Quartz Rose"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 brand-shadow animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fetra-olive to-green-400 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fetra-pink to-pink-400 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Note client</div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">4.8</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-fetra-pink/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-fetra-olive/10 rounded-full blur-3xl"></div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Un Rituel Unique</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez les bienfaits du Quartz Rose et de notre huile régénérante pour une peau visiblement transformée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Drainage Lymphatique</h3>
              <p className="text-gray-600">
                Réduit les poches et les cernes, stimule la circulation sanguine pour un visage reposé et frais.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Effet Liftant</h3>
              <p className="text-gray-600">
                Sculpte et raffermit les contours du visage pour un effet liftant visible dès les premières utilisations.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Éclat Naturel</h3>
              <p className="text-gray-600">
                Illumine et unifie le teint grâce aux propriétés régénérantes de l'huile et du Quartz Rose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à transformer votre routine beauté ?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Rejoignez les centaines de personnes qui ont déjà adopté le rituel FETRA
          </p>
          <Link
            href="/product"
            className="inline-flex items-center justify-center px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold text-lg hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl"
          >
            Commander maintenant • 49,90 €
          </Link>
          <p className="mt-4 text-sm text-gray-500">Livraison gratuite • Retour sous 14 jours</p>
        </div>
      </section>
    </>
  );
}
