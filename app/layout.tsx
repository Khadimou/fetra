import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | FETRA Beauty',
    default: 'FETRA Beauty - Rituel Beauté Naturel',
  },
  description: 'Découvrez le rituel beauté FETRA avec notre Gua Sha et huile de Moringa bio. Beauté naturelle, made in France.',
  keywords: ['gua sha', 'huile moringa', 'beauté naturelle', 'rituel beauté', 'made in france', 'bio'],
  authors: [{ name: 'FETRA Beauty' }],
  creator: 'FETRA Beauty',
  publisher: 'FETRA Beauty',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://0fa5d0e0758d.ngrok-free.app/'
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fetrabeauty.com'
  ),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/',
      'en': '/en',
      'pt': '/pt',
    },
  },
  openGraph: {
    title: 'FETRA Beauty - Rituel Beauté Naturel',
    description: 'Découvrez le rituel beauté FETRA avec notre Gua Sha et huile de Moringa bio.',
    url: process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_BASE_URL || 'https://0fa5d0e0758d.ngrok-free.app/'
      : process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fetrabeauty.com',
    siteName: 'FETRA Beauty',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/main.webp',
        width: 1200,
        height: 630,
        alt: 'FETRA Beauty - Rituel Beauté Naturel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FETRA Beauty - Rituel Beauté Naturel',
    description: 'Découvrez le rituel beauté FETRA avec notre Gua Sha et huile de Moringa bio.',
    images: ['/main.webp'],
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
  other: {
    // Pinterest domain verification
    'p:domain_verify': '7c55d6b33f7710012a290c16834ce164',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
