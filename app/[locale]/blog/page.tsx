'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import VideoEmbed from '@/components/VideoEmbed';

export default function BlogPage() {
  const t = useTranslations('Blog');

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white text-fetra-olive rounded-full text-sm font-semibold mb-6 brand-shadow">
            {t('heroBadge')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Les Fondamentaux */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('fundamentalsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-fetra-olive/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('fundamental1Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('fundamental1Text')}
            </p>
            <div className="bg-fetra-olive/5 p-3 rounded-lg text-sm text-fetra-olive font-medium">
              {t('fundamental1Tip')}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-fetra-pink/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('fundamental2Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('fundamental2Text')}
            </p>
            <div className="bg-fetra-pink/5 p-3 rounded-lg text-sm text-fetra-pink font-medium">
              {t('fundamental2Tip')}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 brand-shadow hover:scale-[1.02] transition-transform">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('fundamental3Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('fundamental3Text')}
            </p>
            <div className="bg-purple-50 p-3 rounded-lg text-sm text-purple-700 font-medium">
              {t('fundamental3Tip')}
            </div>
          </div>
        </div>
      </section>

      {/* Tutoriels Vidéo */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('tutorialsTitle')}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('tutorialsSubtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden brand-shadow">
              <div className="bg-black">
                <VideoEmbed
                  src="https://www.youtube.com/shorts/dWZTqQgb8lA"
                  title="Rituel Visage Liftant FETRA"
                  aspect="9:16"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-fetra-olive/10 text-fetra-olive text-xs font-semibold rounded-full mb-3">
                  {t('tutorial1Badge')}
                </span>
                <h3 className="text-xl font-bold mb-2">{t('tutorial1Title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('tutorial1Description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial1Point1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial1Point2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial1Point3')}
                  </li>
                </ul>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden brand-shadow">
              <div className="bg-black">
                <VideoEmbed
                  src="https://youtu.be/YOain9w9UX8"
                  title="Routine Gua Sha Homme FETRA"
                  aspect="9:16"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-fetra-pink/10 text-fetra-pink text-xs font-semibold rounded-full mb-3">
                  {t('tutorial2Badge')}
                </span>
                <h3 className="text-xl font-bold mb-2">{t('tutorial2Title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('tutorial2Description')}
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial2Point1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial2Point2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-fetra-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('tutorial2Point3')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Visuel */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('anatomyTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tool 1 */}
          <div className="bg-white rounded-2xl p-8 brand-shadow text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-fetra-olive/10 to-fetra-olive/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-fetra-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('tool1Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('tool1Description')}
            </p>
            <div className="bg-fetra-olive/5 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-fetra-olive">{t('tool1IdealFor')}</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>{t('tool1Point1')}</li>
                <li>{t('tool1Point2')}</li>
                <li>{t('tool1Point3')}</li>
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
            <h3 className="text-xl font-bold mb-3">{t('tool2Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('tool2Description')}
            </p>
            <div className="bg-fetra-pink/5 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-fetra-pink">{t('tool2IdealFor')}</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>{t('tool2Point1')}</li>
                <li>{t('tool2Point2')}</li>
                <li>{t('tool2Point3')}</li>
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
            <h3 className="text-xl font-bold mb-3">{t('tool3Title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('tool3Description')}
            </p>
            <div className="bg-purple-50 p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-purple-700">{t('tool3IdealFor')}</p>
              <ul className="text-gray-700 space-y-1 ml-2">
                <li>{t('tool3Point1')}</li>
                <li>{t('tool3Point2')}</li>
                <li>{t('tool3Point3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('faqTitle')}</h2>
          <div className="space-y-4">
            {/* Q1 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq1Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq1Answer')}
              </p>
            </details>

            {/* Q2 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq2Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq2Answer')}
              </p>
            </details>

            {/* Q3 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq3Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq3Answer')}
              </p>
            </details>

            {/* Q4 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq4Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq4Answer')}
              </p>
            </details>

            {/* Q5 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq5Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq5Answer')}
              </p>
            </details>

            {/* Q6 */}
            <details className="bg-gray-50 rounded-xl p-6 brand-shadow group">
              <summary className="font-bold text-lg cursor-pointer flex items-center justify-between">
                {t('faq6Question')}
                <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-700">
                {t('faq6Answer')}
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-12 brand-shadow">
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

