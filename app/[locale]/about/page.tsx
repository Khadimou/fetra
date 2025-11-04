import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Histoire — FETRA",
  description: "Du scepticisme au rituel quotidien. Découvrez comment FETRA est né d'une découverte personnelle pour créer un rituel beauté universel, sans distinction de genre.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-olive/10 text-fetra-olive rounded-full text-sm font-semibold mb-6">
            Notre Histoire
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Du Scepticisme au Rituel Quotidien
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comment une découverte personnelle a donné naissance à FETRA, une marque de beauté universelle et authentique.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-16">
          {/* Chapter 1: Le Point de Départ */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-fetra-olive to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <h2 className="text-3xl font-bold">Le Point de Départ</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                En tant qu'homme, je n'avais jamais vraiment prêté attention aux "outils de beauté". 
                Pour moi, c'était un monde complexe et un peu... intimidant. Des dizaines de produits, 
                des routines à rallonge, un vocabulaire que je ne comprenais pas.
              </p>
              <p>
                Pourtant, comme beaucoup, je ressentais les effets du stress : longues journées devant 
                les écrans, nuits courtes, traits tirés le matin. Je cherchais juste un moyen simple 
                d'avoir l'air plus frais et moins fatigué. Rien de compliqué.
              </p>
            </div>
          </div>

          {/* Chapter 2: La Découverte */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-fetra-pink to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <h2 className="text-3xl font-bold">La Découverte</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                J'ai découvert le Gua Sha et le Quartz Rose un peu par hasard. Au début, j'étais 
                sceptique. "Des pierres pour le visage ? Vraiment ?" Mais j'ai décidé d'essayer.
              </p>
              <p>
                Pas pour la "beauté" dans le sens conventionnel du terme, mais pour le bien-être. 
                Pour le massage, la sensation de froid sur la peau, la détente de 5 minutes le soir 
                avant de dormir. Un moment rien qu'à moi.
              </p>
              <div className="bg-fetra-olive/5 border-l-4 border-fetra-olive p-6 rounded-r-xl italic">
                "Ce n'était pas une routine beauté. C'était mon moment de déconnexion."
              </div>
            </div>
          </div>

          {/* Chapter 3: La Révélation */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <h2 className="text-3xl font-bold">La Révélation</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                En quelques jours, j'ai non seulement ressenti un bienfait relaxant, mais j'ai 
                <strong> vu une différence</strong>. Moins de poches sous les yeux au réveil. 
                Des traits plus définis. Une peau qui paraissait plus saine, plus lumineuse.
              </p>
              <p>
                Et surtout, j'ai réalisé quelque chose d'important : ce rituel simple n'avait rien 
                de "féminin" ou de "masculin". C'était juste... humain. Prendre soin de soi, c'est 
                universel. Pourquoi en ferait-on un secret ou une exclusivité ?
              </p>
            </div>
          </div>

          {/* Chapter 4: La Mission */}
          <div className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-8 md:p-12 border-2 border-fetra-olive/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-fetra-olive to-fetra-pink rounded-full flex items-center justify-center text-white font-bold text-xl">
                ✨
              </div>
              <h2 className="text-3xl font-bold">La Naissance de FETRA</h2>
            </div>
            <div className="space-y-4 text-gray-800 text-lg leading-relaxed">
              <p className="text-xl font-semibold">
                J'ai créé FETRA pour une raison simple :
              </p>
              <p>
                Partager un rituel universel, efficace et honnête, pour tous les visages. Pour tous 
                ceux qui veulent prendre 5 minutes pour eux, et se sentir bien. Sans artifice, sans 
                promesses irréalistes, sans barrières de genre.
              </p>
              <p>
                FETRA, ce n'est pas juste un kit de beauté. C'est un moment de pause dans votre journée. 
                C'est une invitation à prendre soin de vous, simplement et naturellement.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl brand-shadow text-center">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Universel</h3>
              <p className="text-gray-600 text-sm">Pour tous les visages, tous les genres, toutes les peaux</p>
            </div>

            <div className="bg-white p-6 rounded-2xl brand-shadow text-center">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Authentique</h3>
              <p className="text-gray-600 text-sm">Des produits naturels, des promesses tenues</p>
            </div>

            <div className="bg-white p-6 rounded-2xl brand-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Simple</h3>
              <p className="text-gray-600 text-sm">5 minutes par jour pour un rituel efficace</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Une question ?</h2>
              <p className="text-gray-600 mb-6">
                Notre équipe est là pour vous accompagner dans votre découverte du rituel FETRA.
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
            <h2 className="text-3xl font-bold mb-4">Bienvenue dans notre univers</h2>
            <p className="text-xl text-gray-600 mb-8">Bienvenue dans votre nouveau rituel</p>
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

