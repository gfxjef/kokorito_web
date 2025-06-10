'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductSliderProps {
  images: string[];
  productName: string;
}

export default function ProductSlider({ images, productName }: ProductSliderProps) {
  const [activeImage, setActiveImage] = useState(0);

  // Placeholder para imágenes que no cargan
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y0ZjRmNCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VuIGRlIFByb2R1Y3RvPC90ZXh0Pgo8L3N2Zz4K';

  const handleImageChange = (index: number) => {
    setActiveImage(index);
  };

  const handlePrevious = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full">
      {/* Imagen Principal */}
      <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
        <div className="aspect-square w-full relative group">
          <Image
            src={placeholderImage} // Por ahora uso placeholder
            alt={`${productName} - imagen ${activeImage + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Botones de navegación */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Imagen anterior"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Imagen siguiente"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicador de imagen actual */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Navegación por Círculos con Mini-Fotografías */}
      <div className="flex justify-center items-center space-x-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            className={`w-16 h-16 rounded-full border-3 transition-all duration-200 overflow-hidden ${
              activeImage === index
                ? 'border-pink-500 shadow-lg scale-110'
                : 'border-gray-300 hover:border-teal-400 opacity-70 hover:opacity-100'
            }`}
            style={{
              borderColor: activeImage === index ? '#FF6B9D' : '#d1d5db'
            }}
            aria-label={`Ver fotografía ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${productName} - miniatura ${index + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Haz clic en las fotografías para navegar por las imágenes</p>
      </div>
    </div>
  );
} 