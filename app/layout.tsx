import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsletterPopup from "../components/NewsletterPopup";
import HubspotSnippet from "../components/HubspotSnippet";
import ClientProviders from "../components/ClientProviders";
import GoogleAnalyticsScript from "./google-analytics-script";

export const metadata: Metadata = {
  title: 'FETRA BEAUTY — Rituel Visage Liftant',
  description: 'Rituel Visage Liftant : Kit Quartz Rose 3-en-1 & Huile RedMoringa — Livraison offerte',
  metadataBase: process.env.NODE_ENV === 'production' 
    ? new URL('https://www.fetrabeauty.com') 
    : new URL('http://localhost:3000'),
  other: {
    'google-analytics': 'G-LK1VT2ZLFN'
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <GoogleAnalyticsScript />
        <HubspotSnippet />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-fetra-olive focus:text-white focus:rounded-md">
          Aller au contenu principal
        </a>
        <Header />
        <main id="main-content" className="bg-gray-50 min-h-screen">{children}</main>
        <Footer />
        <NewsletterPopup />
        <ClientProviders />
      </body>
    </html>
  );
}
