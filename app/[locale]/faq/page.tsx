'use client';
import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';
import FAQ from '@/components/FAQ';

export default function FAQPage() {
  const t = useTranslations('FAQPage');

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

      {/* FAQ Component */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <FAQ />

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 rounded-3xl p-12 border border-fetra-olive/20">
          <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('ctaSubtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-fetra-olive text-white rounded-2xl font-semibold hover:bg-fetra-olive/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg text-lg"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
