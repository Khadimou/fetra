import Image from "next/image";
import type { Metadata } from "next";
import { getProduct } from "../../lib/product";
import ProductCard from "../../components/ProductCard";
import Gallery from "../../components/Gallery";
import Reviews from "../../components/Reviews";
import MobileBarBridge from "../../components/MobileBarBridge";
import FAQ from "../../components/FAQ";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProduct();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const imageUrl = Array.isArray(product.images) && typeof product.images[0] === 'object'
    ? `${baseUrl}${(product.images[0] as any).src}`
    : `${baseUrl}${product.images[0]}`;

  return {
    title: 'Rituel Visage Liftant — FETRA',
    description: 'Kit Quartz Rose 3-en-1 + Huile RedMoringa — Livraison offerte',
    openGraph: {
      title: 'FETRA — Rituel Visage',
      description: product.descriptionShort,
      url: `${baseUrl}/product`,
      siteName: "FETRA",
      images: [
        {
          url: imageUrl.includes('/optimized_images/') ? imageUrl : '/optimized_images/main_1200.webp',
          width: 1200,
          height: 900,
          alt: product.title,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: 'Rituel Visage Liftant — FETRA',
      description: 'Kit Quartz Rose 3-en-1 + Huile RedMoringa — Livraison offerte',
      images: [imageUrl.includes('/optimized_images/') ? imageUrl : '/optimized_images/main_1200.webp'],
    },
    alternates: {
      canonical: `${baseUrl}/product`,
    },
  };
}

export default async function ProductPage() {
  const product = await getProduct();

  const averageRating = 4.7;
  const reviewCount = 128;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'object' 
      ? product.images.map((img: any) => `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${img.src || img}`)
      : (product.images as string[]).map((img: string) => `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${img}`),
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
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/product`,
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
      
      {/* Offre de lancement */}
      <div className="mb-6 bg-gradient-to-r from-fetra-olive to-fetra-pink text-white p-4 rounded-xl text-center brand-shadow">
        <p className="text-lg font-semibold">🎉 Offre de Lancement : Livraison Gratuite sur toute commande !</p>
        <p className="text-sm mt-1">Inscrivez-vous à notre newsletter et recevez -10% sur votre première commande</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="order-2 md:order-1">
          <Gallery 
            images={product.images} 
            lqips={product.images.map((img: any) => typeof img === 'object' ? img.lqip : undefined)}
          />
          
          {/* Description longue */}
          {product.descriptionLong && (
            <div className="mt-6 bg-white p-6 rounded-xl brand-shadow">
              <h3 className="font-semibold text-lg mb-3">Un Rituel Universel</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.descriptionLong}</p>
            </div>
          )}
          
          <div className="mt-6 bg-white p-6 rounded-xl brand-shadow">
            <h3 className="font-semibold text-lg mb-3">Guide d'utilisation</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {product.howTo && product.howTo.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="order-1 md:order-2 hidden md:block">
          <ProductCard product={product} />
        </div>
      </div>

      <div className="mt-12">
        <Reviews averageRating={4.7} reviewCount={128} />
      </div>

      <FAQ />

      <MobileBarBridge 
        sku={product.sku} 
        price={product.price}
        title={product.title}
        image={typeof product.images[0] === 'object' && 'src' in product.images[0] ? product.images[0].src : (product.images[0] as string)}
      />
    </div>
  );
}
