import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsletterPopup from "../components/NewsletterPopup";
import HubspotSnippet from "../components/HubspotSnippet";
import GoogleAnalyticsClientWrapper from "../components/GoogleAnalyticsClientWrapper";

export const metadata: Metadata = {
  title: 'FETRA BEAUTY — Rituel Visage Liftant',
  description: 'Rituel Visage Liftant : Kit Quartz Rose 3-en-1 & Huile RedMoringa — Livraison offerte',
  metadataBase: new URL('https://www.fetrabeauty.com'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'FETRA BEAUTY — Rituel Visage Liftant',
    description: 'Rituel Visage Liftant : Kit Quartz Rose 3-en-1 & Huile RedMoringa — Livraison offerte',
    url: 'https://www.fetrabeauty.com',
    siteName: 'FETRA BEAUTY',
    images: [
      {
        url: 'https://www.fetrabeauty.com/main.webp',
        width: 1200,
        height: 900,
        alt: 'Rituel Visage Liftant — FETRA BEAUTY'
      }
    ],
    type: 'website',
    locale: 'fr_FR'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FETRA BEAUTY — Rituel Visage Liftant',
    description: 'Kit Quartz Rose 3-en-1 + Huile RedMoringa — Livraison offerte',
    images: ['https://www.fetrabeauty.com/main.webp']
  }
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {GA_ID && process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <HubspotSnippet />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fetra-olive focus:text-white focus:rounded-md">
          Aller au contenu principal
        </a>
        <Header />
        <GoogleAnalyticsClientWrapper />
        <main id="main-content" className="bg-gray-50 min-h-screen">{children}</main>
        <Footer />
        <NewsletterPopup />
      </body>
    </html>
  );
}
