'use client';
import { useState } from 'react';

interface ProductImageHoverProps {
  product: {
    image: string;
    secondImage?: string;
    name?: string;
    title?: string;
  };
  className?: string;
  showIndicator?: boolean;
}

export default function ProductImageHover({ 
  product, 
  className = "h-40", 
  showIndicator = true 
}: ProductImageHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Imagen a mostrar: segunda imagen en hover si existe, sino la principal
  const currentImage = isHovered && product.secondImage ? product.secondImage : product.image;

  return (
    <div 
      className={`${className} bg-cover bg-center`}
      style={{
        backgroundImage: `url(${currentImage})`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicador sutil cuando hay segunda imagen */}
      {showIndicator && product.secondImage && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            📷 +1
          </div>
        </div>
      )}
    </div>
  );
} 