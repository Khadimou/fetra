/**
 * ImageGallery Component
 *
 * Galerie d'images produit avec :
 * - Image principale avec zoom au hover (desktop)
 * - Miniatures cliquables avec navigation clavier
 * - Lazy loading des miniatures
 * - Support tactile pour mobile
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  onImageChange?: (index: number) => void;
}

export default function ImageGallery({
  images,
  productName,
  onImageChange,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Reset to first image when images array changes (e.g., variant change)
  useEffect(() => {
    setSelectedIndex(0);
    if (onImageChange) onImageChange(0);
  }, [images]);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    if (onImageChange) onImageChange(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThumbnailClick(index);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, images.length - 1);
      handleThumbnailClick(nextIndex);
      // Focus next thumbnail
      const nextButton = document.querySelector(
        `[data-thumbnail-index="${nextIndex}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      handleThumbnailClick(prevIndex);
      // Focus previous thumbnail
      const prevButton = document.querySelector(
        `[data-thumbnail-index="${prevIndex}"]`
      ) as HTMLButtonElement;
      prevButton?.focus();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        ref={mainImageRef}
        className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selectedIndex]}
          alt={`${productName} - Image principale`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }
              : undefined
          }
          loading="eager"
        />

        {/* Zoom indicator (desktop only) */}
        <div
          className={`absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity duration-200 hidden md:block ${
            isZoomed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <svg
            className="w-4 h-4 inline-block mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
          Survolez pour zoomer
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="grid grid-cols-4 gap-2"
          role="list"
          aria-label="Miniatures des images du produit"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              data-thumbnail-index={idx}
              onClick={() => handleThumbnailClick(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`
                aspect-square rounded-lg overflow-hidden
                border-2 transition-all duration-150
                focus:outline-none focus:ring-4 focus:ring-fetra-olive/30
                ${
                  selectedIndex === idx
                    ? 'border-fetra-olive scale-105 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                }
              `}
              aria-label={`Afficher l'image ${idx + 1} sur ${images.length}`}
              aria-current={selectedIndex === idx ? 'true' : 'false'}
              role="listitem"
            >
              <img
                src={img}
                alt={`${productName} - Image ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <p className="text-center text-sm text-gray-500" aria-live="polite">
          Image {selectedIndex + 1} sur {images.length}
        </p>
      )}
    </div>
  );
}
