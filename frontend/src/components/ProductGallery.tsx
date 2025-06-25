'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Si no hay imágenes, mostrar placeholder
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop'
  ];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={displayImages[selectedImage]}
          alt={`${productName} - Imagen ${selectedImage + 1}`}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
          onLoadStart={() => setIsLoading(true)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
        />
        
        {/* Indicador de carga */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        )}

        {/* Navegación con flechas */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Imagen anterior"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Siguiente imagen"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Contador de imágenes */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === index
                  ? 'ring-2 ring-pink-500 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Texto informativo si hay varias imágenes */}
      {displayImages.length > 1 && (
        <p className="text-sm text-gray-500 text-center">
          Haz clic en las miniaturas para navegar por las imágenes
        </p>
      )}
    </div>
  );
} 