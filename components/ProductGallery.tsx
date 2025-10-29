"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
};

// Placeholders LQIP basiques (en production, utiliser plaiceholder ou sharp pour générer des placeholders réels)
const placeholders: Record<string, string> = {
  "/main.webp": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+",
  "/plusvaluehuile.webp": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+",
};

export default function ProductGallery({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl-2 overflow-hidden bg-white p-4 brand-shadow">
        <Image
          src={images[selectedIndex]}
          alt={title}
          width={1200}
          height={900}
          className="object-contain w-full h-auto"
          priority={selectedIndex === 0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          placeholder="blur"
          blurDataURL={placeholders[images[selectedIndex]] || undefined}
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((src: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`Afficher l'image ${i + 1} de ${title}`}
              className={`rounded-lg overflow-hidden bg-white p-2 border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fetra-pink/30 focus-visible:ring-2 focus-visible:ring-fetra-pink/30 ${
                selectedIndex === i
                  ? "border-fetra-pink ring-2 ring-fetra-pink/20 scale-105"
                  : "border-transparent hover:border-gray-300 hover:scale-105"
              }`}
            >
              <Image
                src={src}
                alt={`${title} - Vue ${i + 1}`}
                width={400}
                height={300}
                className="object-cover w-full h-auto"
                loading="lazy"
                sizes="(max-width: 768px) 33vw, 150px"
                placeholder="blur"
                blurDataURL={placeholders[src] || undefined}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
