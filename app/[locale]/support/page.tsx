'use client';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
  const t = useTranslations('Support');

  return (
    <div className="max-w-4xl mx-auto p-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Contact rapide */}
      <div className="mb-12 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white p-6 rounded-2xl text-center brand-shadow">
        <h2 className="text-2xl font-semibold mb-2">{t('quickHelpTitle')}</h2>
        <p className="mb-4">{t('quickHelpFAQ')}</p>
        <p className="text-sm opacity-90">
          {t('quickHelpContact')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ Rapide */}
        <div className="bg-white rounded-3xl p-8 brand-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-fetra-olive/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{t('faqTitle')}</h2>
          </div>

          <div className="space-y-4">
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                {t('faq1Question')}
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                {t('faq1Answer')}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                {t('faq2Question')}
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                {t('faq2Answer')}
              </div>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer py-2">
                {t('faq3Question')}
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-600 mt-2 text-sm">
                {t('faq3Answer')}
              </div>
            </details>
          </div>

          <div className="mt-6 pt-6 border-t">
            <a
              href="/faq"
              className="text-fetra-olive hover:text-fetra-olive/80 font-medium"
            >
              {t('faqViewAll')} →
            </a>
          </div>
        </div>

        {/* Guides & Ressources */}
        <div className="bg-white rounded-3xl p-8 brand-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-fetra-pink/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{t('guidesTitle')}</h2>
          </div>

          <div className="space-y-4">
            <a
              href="/blog"
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">{t('guide1Title')}</h3>
              <p className="text-sm text-gray-600">{t('guide1Description')}</p>
            </a>

            <a
              href="/shipping"
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">{t('guide2Title')}</h3>
              <p className="text-sm text-gray-600">{t('guide2Description')}</p>
            </a>

            <a
              href="/returns"
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">{t('guide3Title')}</h3>
              <p className="text-sm text-gray-600">{t('guide3Description')}</p>
            </a>

            <a
              href="/about"
              className="block p-4 border border-gray-200 rounded-lg hover:border-fetra-pink hover:bg-fetra-pink/5 transition-colors"
            >
              <h3 className="font-semibold mb-1">{t('guide4Title')}</h3>
              <p className="text-sm text-gray-600">{t('guide4Description')}</p>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('contactTitle')}</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('contactSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-fetra-olive text-white rounded-xl font-semibold hover:bg-fetra-olive/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('contactButton')}
          </a>

          <a
            href={`mailto:${t('contactEmail')}`}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-fetra-olive text-fetra-olive rounded-xl font-semibold hover:bg-fetra-olive hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('contactEmail')}
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            {t('contactResponse')}
          </p>
        </div>
      </div>
    </div>
  );
}
