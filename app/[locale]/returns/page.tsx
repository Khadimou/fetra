'use client';
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function ReturnsPage() {
  const t = useTranslations('Returns');

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-fetra-pink/10 text-fetra-pink rounded-full text-sm font-semibold mb-6">
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

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-12">
          {/* Return Policy Banner */}
          <div className="bg-gradient-to-r from-fetra-pink to-fetra-olive text-white rounded-3xl p-8 text-center brand-shadow">
            <h2 className="text-3xl font-bold mb-4">{t('bannerTitle')}</h2>
            <p className="text-xl">{t('bannerText')}</p>
          </div>

          {/* Withdrawal Period */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">{t('periodTitle')}</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>{t('periodText')}</p>
            </div>
          </div>

          {/* Return Conditions */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">{t('conditionsTitle')}</h2>
            <p className="text-lg text-gray-600 mb-6">{t('conditionsSubtitle')}</p>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span dangerouslySetInnerHTML={{ __html: t('conditionUnused') }} />
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span dangerouslySetInnerHTML={{ __html: t('conditionPackaging') }} />
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-fetra-olive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span dangerouslySetInnerHTML={{ __html: t('conditionProof') }} />
              </li>
            </ul>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
              <p className="text-sm text-gray-800">{t('conditionsWarning')}</p>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-8">{t('processTitle')}</h2>
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-fetra-olive text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{t('step1Title')}</h3>
                  <p className="text-gray-700 text-lg mb-2">{t('step1Text')}</p>
                  <p className="text-gray-700 text-lg">{t('step1Extra')}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-fetra-pink text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{t('step2Title')}</h3>
                  <p className="text-gray-700 text-lg">{t('step2Text')}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">{t('step3Title')}</h3>
                  <p className="text-gray-700 text-lg">{t('step3Text')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">{t('refundsTitle')}</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>{t('refundsText1')}</p>
              <p>{t('refundsText2')}</p>
              <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r-xl mt-4">
                <p className="text-sm text-gray-800">{t('refundsNote')}</p>
              </div>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-white rounded-3xl p-8 md:p-12 brand-shadow">
            <h2 className="text-3xl font-bold mb-6">{t('exchangesTitle')}</h2>
            <div className="space-y-4 text-gray-700 text-lg">
              <p>{t('exchangesText')}</p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-fetra-olive/5 to-fetra-pink/5 rounded-3xl p-8 md:p-12 border border-fetra-olive/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{t('questionTitle')}</h2>
              <p className="text-gray-600 mb-6">{t('questionText')}</p>
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
            <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
            <p className="text-xl text-gray-600 mb-8">{t('ctaSubtitle')}</p>
            <Link
              href="/product"
              className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
            >
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
