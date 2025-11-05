"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from '@/i18n/navigation';
import Logo from "../../../components/Logo";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const errorParam = searchParams.get('error');

    // Map NextAuth errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'Configuration': 'Erreur de configuration OAuth. Veuillez contacter le support.',
      'AccessDenied': 'Accès refusé. Vous avez annulé la connexion.',
      'Verification': 'Le lien de vérification a expiré ou a déjà été utilisé.',
      'OAuthSignin': 'Erreur lors de la connexion avec le fournisseur OAuth.',
      'OAuthCallback': 'Erreur lors du retour du fournisseur OAuth.',
      'OAuthCreateAccount': 'Impossible de créer un compte avec ce fournisseur.',
      'EmailCreateAccount': 'Impossible de créer un compte avec cet email.',
      'Callback': 'Erreur lors de l\'authentification.',
      'OAuthAccountNotLinked': 'Cet email est déjà utilisé avec un autre mode de connexion.',
      'EmailSignin': 'L\'email n\'a pas pu être envoyé.',
      'CredentialsSignin': 'Identifiants invalides.',
      'SessionRequired': 'Veuillez vous connecter pour accéder à cette page.',
      'Default': 'Une erreur est survenue lors de l\'authentification.'
    };

    setError(errorMessages[errorParam || 'Default'] || errorMessages['Default']);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fetra-olive/5 via-white to-fetra-pink/5 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl brand-shadow p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-center mb-4">Erreur de connexion</h1>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 text-center">
              {error}
            </p>
          </div>

          <p className="text-gray-600 text-center mb-8">
            Si le problème persiste, veuillez essayer une autre méthode de connexion ou contacter notre support.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 text-center"
            >
              Réessayer la connexion
            </Link>

            <Link
              href="/signup"
              className="block w-full py-3 border-2 border-fetra-olive text-fetra-olive rounded-xl font-semibold hover:bg-fetra-olive/5 transition-all text-center"
            >
              Créer un compte
            </Link>

            <Link
              href="/contact"
              className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4"
            >
              Contacter le support
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
