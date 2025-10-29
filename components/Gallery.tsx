import Image from 'next/image';
'use client';
import { useState } from 'react';

export default function Gallery({ images, lqips }: { images: string[]; lqips?: string[] }) {
  const [index, setIndex] = useState(0);
  return (
    <div>
      <div className="bg-white rounded-2xl overflow-hidden brand-shadow">
        <Image
          src={images[index]}
          alt={`Image ${index + 1}`}
          width={1200}
          height={900}
          className="object-contain"
          priority
          placeholder={lqips?.[index] ? 'blur' : undefined}
          blurDataURL={lqips?.[index]}
        />
      </div>
      <div className="mt-3 flex gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Voir image ${i + 1}`}
            className={`w-20 h-20 rounded-md overflow-hidden border ${
              i === index ? 'ring-2 ring-fetra-pink/30' : 'ring-0'
            }`}
          >
            <Image src={src} alt={`Thumb ${i + 1}`} width={80} height={80} className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
