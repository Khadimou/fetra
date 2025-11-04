'use client';
import Image from 'next/image';
import { useState } from 'react';

type MediaData = { 
  src: string; 
  lqip?: string; 
  type?: 'image' | 'video';
  poster?: string;
} | string;

export default function Gallery({ images, lqips }: { images: MediaData[]; lqips?: string[] }) {
  const [index, setIndex] = useState(0);
  
  const getMediaSrc = (img: MediaData): string => {
    return typeof img === 'string' ? img : img.src;
  };
  
  const getMediaType = (img: MediaData): 'image' | 'video' => {
    if (typeof img === 'object' && img.type) return img.type;
    const src = getMediaSrc(img);
    return src.endsWith('.mp4') || src.endsWith('.MP4') ? 'video' : 'image';
  };
  
  const getMediaPoster = (img: MediaData): string | undefined => {
    if (typeof img === 'object' && img.poster) return img.poster;
    return undefined;
  };
  
  const getImageLqip = (img: MediaData, i: number): string | undefined => {
    if (typeof img === 'object' && img.lqip) return img.lqip;
    if (lqips && lqips[i]) return lqips[i];
    return undefined;
  };

  return (
    <div>
      <div className="bg-white rounded-2xl overflow-hidden brand-shadow">
        {/* Render ALL items but only show the active one */}
        {images.map((img, i) => {
          const mediaSrc = getMediaSrc(img);
          const mediaType = getMediaType(img);
          const mediaPoster = getMediaPoster(img);
          const imageLqip = getImageLqip(img, i);

          return (
            <div
              key={i}
              className={i === index ? 'block' : 'hidden'}
              style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}
            >
              {mediaType === 'video' ? (
                <div className="aspect-video bg-black rounded-2xl overflow-hidden" style={{ position: 'relative', zIndex: 10 }}>
                  <video
                    controls
                    controlsList="nodownload"
                    playsInline
                    className="w-full h-full object-cover"
                    poster={mediaPoster}
                    preload="metadata"
                    style={{ position: 'relative', zIndex: 20, pointerEvents: 'auto' }}
                  >
                    <source src={mediaSrc} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
              ) : (
                <Image
                  src={mediaSrc}
                  alt={`Image ${i + 1}`}
                  width={1200}
                  height={900}
                  className="object-contain rounded-2xl"
                  priority={i === 0}
                  placeholder={imageLqip ? 'blur' : undefined}
                  blurDataURL={imageLqip}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => {
          const src = getMediaSrc(img);
          const type = getMediaType(img);
          const poster = getMediaPoster(img);
          const lqip = getImageLqip(img, i);
          const thumbSrc = type === 'video' ? (poster || src) : src;
          
          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={type === 'video' ? `Voir vidéo ${i + 1}` : `Voir image ${i + 1}`}
              className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
                i === index ? 'ring-2 ring-fetra-pink' : 'ring-0'
              }`}
            >
              {type === 'video' ? (
                <div className="relative w-full h-full bg-black">
                  <Image
                    src={poster || '/main.webp'}
                    alt={`Vidéo ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              ) : (
                <Image
                  src={thumbSrc}
                  alt={`Thumb ${i + 1}`}
                  width={80}
                  height={80}
                  className="object-cover"
                  loading="lazy"
                  placeholder={lqip ? 'blur' : undefined}
                  blurDataURL={lqip}
                  sizes="80px"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
