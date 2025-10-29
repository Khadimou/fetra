"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
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
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((src: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`Afficher l'image ${i + 1} de ${title}`}
              className={`rounded-lg overflow-hidden bg-white p-2 border-2 transition-all focus:outline-none focus:ring-2 focus:ring-fetra-pink/30 ${
                selectedIndex === i
                  ? "border-fetra-pink ring-2 ring-fetra-pink/20"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                width={400}
                height={300}
                className="object-cover w-full h-auto"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

