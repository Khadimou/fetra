import Image from "next/image";
import type { Metadata } from "next";
import { getProduct } from "../../lib/product";
import ProductCard from "../../components/ProductCard";
import ProductGallery from "../../components/ProductGallery";
import Reviews from "../../components/Reviews";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProduct();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const imageUrl = `${baseUrl}${product.images[0]}`;

  return {
    title: `${product.title} | FETRA`,
    description: product.descriptionShort,
    openGraph: {
      title: product.title,
      description: product.descriptionShort,
      url: `${baseUrl}/product`,
      siteName: "FETRA",
      images: [
        {
          url: imageUrl,
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
      title: product.title,
      description: product.descriptionShort,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/product`,
    },
  };
}

export default async function ProductPage() {
  const product = await getProduct();

  const averageRating = 4.8;
  const reviewCount = 124;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${img}`),
    description: product.descriptionShort,
    sku: product.sku,
    brand: { "@type": "Brand", name: "FETRA" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Sophie M.",
        },
        datePublished: "2024-01-15",
        reviewBody: "Produit incroyable ! Ma peau est beaucoup plus ferme après seulement 2 semaines d'utilisation.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="order-2 md:order-1">
          <ProductGallery images={product.images} title={product.title} />
          
          <div className="mt-6 bg-white p-6 rounded-xl brand-shadow">
            <h3 className="font-semibold text-lg mb-3">Guide d'utilisation</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {product.howTo && product.howTo.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <ProductCard product={product} />
        </div>
      </div>

      <div className="mt-12">
        <Reviews averageRating={averageRating} reviewCount={reviewCount} />
      </div>
    </div>
  );
}
