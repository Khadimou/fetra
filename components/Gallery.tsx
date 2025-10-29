'use client';
import Image from 'next/image';
import { useState } from 'react';

type ImageData = { src: string; lqip?: string } | string;

export default function Gallery({ images, lqips }: { images: ImageData[]; lqips?: string[] }) {
  const [index, setIndex] = useState(0);
  
  const getImageSrc = (img: ImageData): string => {
    return typeof img === 'string' ? img : img.src;
  };
  
  const getImageLqip = (img: ImageData, i: number): string | undefined => {
    if (typeof img === 'object' && img.lqip) return img.lqip;
    if (lqips && lqips[i]) return lqips[i];
    return undefined;
  };

  const imageSrc = getImageSrc(images[index]);
  const imageLqip = getImageLqip(images[index], index);

  return (
    <div>
      <div className="bg-white rounded-2xl overflow-hidden brand-shadow">
        <Image
          src={imageSrc}
          alt={`Image ${index + 1}`}
          width={1200}
          height={900}
          className="object-contain"
          priority
          placeholder={imageLqip ? 'blur' : undefined}
          blurDataURL={imageLqip}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />
      </div>
      <div className="mt-3 flex gap-3">
        {images.map((img, i) => {
          const src = getImageSrc(img);
          const lqip = getImageLqip(img, i);
          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Voir image ${i + 1}`}
              className={`w-20 h-20 rounded-md overflow-hidden border ${
                i === index ? 'ring-2 ring-fetra-pink/30' : 'ring-0'
              }`}
            >
              <Image
                src={src}
                alt={`Thumb ${i + 1}`}
                width={80}
                height={80}
                className="object-cover"
                loading="lazy"
                placeholder={lqip ? 'blur' : undefined}
                blurDataURL={lqip}
                sizes="80px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
