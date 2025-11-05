import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NewsletterPopup from '../../components/NewsletterPopup';
import HubspotSnippet from '../../components/HubspotSnippet';
import ClientProviders from '../../components/ClientProviders';
import GoogleAnalyticsScript from '../google-analytics-script';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 16
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            <GoogleAnalyticsScript />
            <HubspotSnippet />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fetra-olive focus:text-white focus:rounded-md"
            >
              Aller au contenu principal
            </a>
            <Header />
            <main id="main-content" className="bg-gray-50 min-h-screen">
              {children}
            </main>
            <Footer />
            <NewsletterPopup />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
