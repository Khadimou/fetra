"use client";
import { useState } from "react";
import { Link } from '@/i18n/navigation';
import { useTranslations } from "next-intl";
import Logo from "../../../components/Logo";

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.forgotPassword');
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la demande');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fetra-olive/5 via-white to-fetra-pink/5 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl brand-shadow p-8">
          {!isSuccess ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-2">{t('title')}</h1>
              <p className="text-gray-600 text-center mb-8">{t('subtitle')}</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fetra-olive/30 transition-all"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('emailHint')}
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('sending') : t('sendButton')}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">{t('successTitle')}</h2>
              <p className="text-gray-600 mb-6">
                {t('successMessage')}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {t('checkSpam')}
              </p>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-fetra-olive hover:text-fetra-olive/80 font-medium">
              ← {t('backToLogin')}
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
