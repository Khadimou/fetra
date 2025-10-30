// app/success/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import OrderDetails from '../../components/OrderDetails';
import ClearCartOnSuccess from '../../components/ClearCartOnSuccess';

export const metadata: Metadata = {
  title: 'Commande confirmée — FETRA BEAUTY',
  description: 'Votre commande FETRA a été confirmée. Découvrez les prochaines étapes et le suivi de votre livraison.',
};

function SuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fetra-olive/5 via-white to-fetra-pink/5 py-12 px-4">
      {/* Clear cart on success */}
      <ClearCartOnSuccess />
      
      <div className="max-w-4xl mx-auto">
        {/* Header Success */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 Commande confirmée !
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Félicitations ! Votre Rituel Visage Liftant FETRA est en préparation. 
            Vous allez recevoir un email de confirmation dans les prochaines minutes.
          </p>
        </div>

        {/* Étapes de traitement */}
        <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Prochaines étapes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-fetra-olive text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-fetra-olive/20"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Préparation</h3>
              <p className="text-sm text-gray-600">
                <strong>Maintenant - 24h</strong><br/>
                Votre commande est préparée avec soin dans notre atelier.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-fetra-pink text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-fetra-olive/20"></div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expédition</h3>
              <p className="text-sm text-gray-600">
                <strong>24-48h</strong><br/>
                Votre colis part avec un numéro de suivi par email.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Livraison</h3>
              <p className="text-sm text-gray-600">
                <strong>3-5 jours ouvrés</strong><br/>
                Réception chez vous, livraison 100% gratuite !
              </p>
            </div>
          </div>
        </div>

        {/* Détails de la commande (avec données Stripe) */}
        <OrderDetails />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Informations de livraison */}
          <div className="bg-white rounded-3xl p-8 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Livraison Express</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Gratuite</strong> - Offre de lancement</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Rapide</strong> - 3 à 5 jours ouvrés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Suivie</strong> - Numéro de tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Sécurisée</strong> - Emballage protégé</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-fetra-olive/5 rounded-lg">
              <p className="text-sm text-fetra-olive font-medium">
                📦 Votre produit est en stock - Expédition garantie sous 48h
              </p>
            </div>
          </div>

          {/* Support & Contact */}
          <div className="bg-white rounded-3xl p-8 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Besoin d&apos;aide ?</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Support Client</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Notre équipe répond sous 24h pour toute question.
                </p>
                <a 
                  href="mailto:contact@fetrabeauty.com"
                  className="inline-flex items-center gap-2 text-fetra-olive hover:text-fetra-olive/80 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@fetrabeauty.com
                </a>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Widget de Support</h4>
                <p className="text-sm text-gray-600">
                  Utilisez le bouton 💬 en bas à droite pour une aide immédiate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emails de confirmation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Vos emails de confirmation</h3>
              <div className="space-y-2 text-sm">
                <p>✅ <strong>Confirmation de commande</strong> - Reçu dans les 5 minutes</p>
                <p>📦 <strong>Confirmation d&apos;expédition</strong> - Avec numéro de suivi (24-48h)</p>
                <p>🚚 <strong>Avis de livraison</strong> - Le jour de réception</p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Vérifiez vos spams si vous ne recevez rien sous 10 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Guide d'utilisation */}
        <div className="bg-white rounded-3xl p-8 brand-shadow mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🎯 Préparez-vous au rituel !</h3>
            <p className="text-gray-600 mb-6">
              En attendant votre colis, découvrez comment optimiser votre rituel visage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/blog"
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-fetra-olive hover:bg-fetra-olive/5 transition-colors"
              >
                <div className="w-12 h-12 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Tutoriels Vidéo</h4>
                  <p className="text-sm text-gray-600">Techniques de massage</p>
                </div>
              </Link>

              <Link 
                href="/about"
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
              >
                <div className="w-12 h-12 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Notre Histoire</h4>
                  <p className="text-sm text-gray-600">Découvrez FETRA</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Rejoignez la communauté */}
        <div className="bg-gradient-to-r from-fetra-pink to-fetra-olive text-white rounded-3xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">🌟 Rejoignez la communauté FETRA !</h3>
          <p className="mb-6 opacity-90">
            Suivez-nous pour des conseils beauté exclusifs, des avant/après inspirants et soyez les premiers informés de nos nouveautés.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="https://instagram.com/fetra_beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @fetra_beauty
            </a>

            <a
              href="https://tiktok.com/@fetra_beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              @fetra_beauty
            </a>
          </div>

          <p className="text-sm opacity-75">
            💡 <strong>Astuce :</strong> Tagguez-nous dans vos stories avec #FetraRituel pour être repartagé !
          </p>
        </div>

        {/* Satisfaction garantie */}
        <div className="bg-gradient-to-r from-fetra-olive to-fetra-pink text-white rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Satisfaction garantie ✨</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">📦</div>
              <div className="font-semibold">Livraison gratuite</div>
              <div className="text-sm opacity-90">Partout en France</div>
            </div>
            <div>
              <div className="text-3xl mb-2">↩️</div>
              <div className="font-semibold">Retour 14 jours</div>
              <div className="text-sm opacity-90">Remboursé si pas satisfait</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold">Résultats visibles</div>
              <div className="text-sm opacity-90">Dès les premières utilisations</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fetra-olive/20 border-t-fetra-olive rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre confirmation...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
