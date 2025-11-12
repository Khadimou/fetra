import Image from "next/image";
import type { Metadata } from "next";
import { getProduct } from "../../../lib/product";
import ProductCard from "../../../components/ProductCard";
import Gallery from "../../../components/Gallery";
import Reviews from "../../../components/Reviews";
import ValueComparison from "../../../components/ValueComparison";
import MobileBarBridge from "../../../components/MobileBarBridge";
import FAQ from "../../../components/FAQ";
import { getTranslations } from 'next-intl/server';

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProduct();
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.fetrabeauty.com' 
    : 'https://0fa5d0e0758d.ngrok-free.app/';
  const canonicalUrl = `${baseUrl}/product`;
  
  // Get first image for Open Graph
  const firstImageSrc = Array.isArray(product.images) && typeof product.images[0] === 'object'
    ? (product.images[0] as any).src
    : product.images[0];
  const imageUrl = `${baseUrl}${firstImageSrc}`;

  return {
    title: product.title,
    description: product.descriptionShort,
    openGraph: {
      title: product.title,
      description: product.descriptionShort,
      url: canonicalUrl,
      siteName: "FETRA",
      images: product.images.map((img: any) => ({
        url: `${baseUrl}${typeof img === 'object' ? img.src : img}`,
        width: 1200,
        height: 900,
        alt: product.title
      })),
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.descriptionShort,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ProductPage() {
  const product = await getProduct();
  const t = await getTranslations('Product');

  const averageRating = 4.7;
  const reviewCount = 128;

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.fetrabeauty.com' 
    : 'https://0fa5d0e0758d.ngrok-free.app/';

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'object' 
      ? product.images.map((img: any) => `${baseUrl}${img.src || img}`)
      : (product.images as string[]).map((img: string) => `${baseUrl}${img}`),
    description: product.descriptionShort,
    sku: product.sku,
    brand: { "@type": "Brand", name: "FETRA" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "128",
    },
    review: [
      {
        "@type": "Review",
        author: "Alice",
        datePublished: "2025-05-01",
        reviewBody: "Produit incroyable ! Ma peau est beaucoup plus ferme après seulement 2 semaines d'utilisation. Le rouleau en quartz est très agréable à utiliser.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
      },
      {
        "@type": "Review",
        author: "Sophie M.",
        datePublished: "2024-01-15",
        reviewBody: "Excellent rapport qualité-prix. L'huile est très nourrissante et le kit complet permet un rituel vraiment relaxant.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
      },
      {
        "@type": "Review",
        author: "Claire D.",
        datePublished: "2024-01-05",
        reviewBody: "Très satisfaite, même si je trouve que le rouleau pourrait être un peu plus grand. Le résultat est visible rapidement.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
        },
      },
    ],
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product`,
      priceCurrency: "EUR",
      price: Number(product.price.toFixed(2)),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: "FETRA",
      },
    },
  } as const;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      
      {/* Offre de lancement avec urgence */}
      <div className="mb-6 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white p-4 rounded-xl text-center brand-shadow">
        <p className="text-lg font-semibold">{t('limitedOffer')} {t('launchOfferTitle').replace('🎉 ', '')}</p>
        <p className="text-sm mt-1">{t('launchOfferSubtitle')}</p>
      </div>

      {/* Hero Section - Above the fold */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <div className="order-2 md:order-1">
          {/* Galerie d'images */}
          <Gallery
            images={product.images}
            lqips={product.images.map((img: any) => typeof img === 'object' ? img.lqip : undefined)}
          />
        </div>

        <div className="order-1 md:order-2">
          <div className="md:sticky md:top-24">
            {/* Hero Title */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{t('heroTitle')}</h1>
              <p className="text-lg text-gray-700 leading-relaxed">{t('heroSubtitle')}</p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                ✅ {t('trustBadge1')}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                🔒 {t('trustBadge3')}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                💝 {t('trustBadge2')}
              </span>
            </div>

            {/* Stock urgency */}
            {product.stock <= 20 && (
              <div className="mb-6 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                <p className="text-sm font-semibold text-orange-800">
                  {t('urgencyBanner', { stock: product.stock })}
                </p>
            </div>
          )}
          
            <ProductCard product={product} />
          </div>
        </div>
      </div>

      {/* Section Problème */}
      <div className="mt-16 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl brand-shadow">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{t('problemTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="flex gap-3 items-start">
            <span className="text-2xl">😓</span>
            <p className="text-gray-700">{t('problem1')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">😔</span>
            <p className="text-gray-700">{t('problem2')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">😤</span>
            <p className="text-gray-700">{t('problem3')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">⏰</span>
            <p className="text-gray-700">{t('problem4')}</p>
          </div>
        </div>
      </div>

      {/* Section Promesse */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('promiseTitle')}</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">{t('promiseText')}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <div className="text-4xl mb-3">✨</div>
            <p className="font-semibold">{t('promiseResult1')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <div className="text-4xl mb-3">💎</div>
            <p className="font-semibold">{t('promiseResult2')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <div className="text-4xl mb-3">🌸</div>
            <p className="font-semibold">{t('promiseResult3')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <div className="text-4xl mb-3">😌</div>
            <p className="font-semibold">{t('promiseResult4')}</p>
          </div>
        </div>
      </div>

      {/* Section Bénéfices */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('benefitsTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <h3 className="text-xl font-bold mb-3 text-fetra-pink">{t('benefit1Title')}</h3>
            <p className="text-gray-700">{t('benefit1Text')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <h3 className="text-xl font-bold mb-3 text-fetra-olive">{t('benefit2Title')}</h3>
            <p className="text-gray-700">{t('benefit2Text')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <h3 className="text-xl font-bold mb-3 text-fetra-pink">{t('benefit3Title')}</h3>
            <p className="text-gray-700">{t('benefit3Text')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl brand-shadow">
            <h3 className="text-xl font-bold mb-3 text-fetra-olive">{t('benefit4Title')}</h3>
            <p className="text-gray-700">{t('benefit4Text')}</p>
          </div>
        </div>
      </div>

      {/* Section Ce que vous recevez */}
      <div className="mt-16 bg-white p-8 rounded-2xl brand-shadow">
        <h2 className="text-3xl font-bold mb-4 text-center">{t('technicalTitle')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('technicalIntro')}</p>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical1')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical2')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical3')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical4')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical5')}</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-fetra-pink font-bold">✓</span>
            <p className="text-gray-700">{t('technical6')}</p>
          </div>
        </div>
      </div>

      {/* Guide d'utilisation */}
      <div className="mt-12 bg-white p-8 rounded-xl brand-shadow">
        <h3 className="text-2xl font-bold mb-2 text-center">{t('usageGuide')}</h3>
        <p className="text-center text-gray-600 mb-6">{t('usageGuideSubtitle')}</p>
        <p className="text-center text-gray-700 mb-6">{t('howToIntro')}</p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 max-w-2xl mx-auto">
          {product.howTo && product.howTo.map((s: string, i: number) => (
            <li key={i} className="text-lg">{s}</li>
          ))}
        </ol>
      </div>

      {/* Section Valeurs */}
      <div className="mt-16 bg-gradient-to-br from-fetra-olive/10 to-fetra-pink/10 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">{t('valuePropsTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp1')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp2')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp3')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp4')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp5')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <p className="font-semibold">{t('valueProp6')}</p>
          </div>
        </div>
      </div>

      {/* Garantie */}
      <div className="mt-12 bg-green-50 border-2 border-green-200 p-6 rounded-xl text-center">
        <h3 className="text-2xl font-bold mb-2 text-green-800">✅ {t('guaranteeTitle')}</h3>
        <p className="text-green-700">{t('guaranteeText')}</p>
      </div>

      {/* Value Comparison */}
      <div className="mt-16">
        <ValueComparison />
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <Reviews productSku={product.sku} />
      </div>

      {/* FAQ */}
      <FAQ />

      {/* CTA Final */}
      <div className="mt-16 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white p-10 rounded-2xl text-center brand-shadow">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('ctaBottomTitle')}</h2>
        <p className="text-lg mb-6 opacity-90">{t('ctaBottomSubtitle')}</p>
        <a 
          href="#top" 
          className="inline-block bg-white text-fetra-olive px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
        >
          {t('ctaBottomButton')}
        </a>
        <p className="mt-4 text-sm opacity-80">{t('trustIndicator')}</p>
      </div>

      <MobileBarBridge 
        sku={product.sku} 
        price={product.price}
        title={product.title}
        image={typeof product.images[0] === 'object' && 'src' in product.images[0] ? product.images[0].src : (product.images[0] as string)}
      />
    </div>
  );
}
