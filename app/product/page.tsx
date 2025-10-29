import Image from "next/image";
import { getProduct } from "../../lib/product";
import ProductCard from "../../components/ProductCard";
import ProductGallery from "../../components/ProductGallery";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  const product = await getProduct();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.descriptionShort,
    sku: product.sku,
    brand: { "@type": "Brand", name: "FETRA" },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/product`,
      priceCurrency: "EUR",
      price: Number(product.price.toFixed(2)),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
    </div>
  );
}
