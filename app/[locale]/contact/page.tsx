'use client';
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-olive/10 text-fetra-olive rounded-full text-sm font-semibold mb-6">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
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
                <h2 className="text-2xl font-bold">{t('emailTitle')}</h2>
                <p className="text-gray-600">{t('emailResponse')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              {t('emailDescription')}
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
                <h2 className="text-2xl font-bold">{t('supportTitle')}</h2>
                <p className="text-gray-600">{t('supportSubtitle')}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              {t('supportDescription')}
            </p>
            <a
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-fetra-pink text-white rounded-xl font-semibold hover:bg-fetra-pink/90 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('supportButton')}
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 brand-shadow">
          <h2 className="text-3xl font-bold text-center mb-8">{t('faqTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">{t('faq1Question')}</h3>
                <p className="text-gray-600">
                  {t('faq1Answer')}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">{t('faq2Question')}</h3>
                <p className="text-gray-600">
                  {t('faq2Answer')}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">{t('faq3Question')}</h3>
                <p className="text-gray-600">
                  {t('faq3Answer')}
                </p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-lg mb-2">{t('faq4Question')}</h3>
                <p className="text-gray-600">
                  {t('faq4Answer')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-12 border border-fetra-olive/20">
          <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/product"
            className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
