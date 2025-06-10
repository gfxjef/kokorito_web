'use client';
import Link from 'next/link';
import { Product } from '@/types/Product';
import ProductImageHover from '@/components/shared/ProductImageHover';

interface RelatedProductsProps {
  products: Product[];
  title?: string;
}

export default function RelatedProducts({ products, title = "Productos Relacionados" }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 5);
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3Mjg4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdG88L3RleHQ+Cjwvc3ZnPgo=';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">Otros productos que te podrían interesar</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/producto/${product.id}`}
            className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-square w-full relative bg-gray-50">
              <ProductImageHover 
                product={{
                  image: placeholderImage,
                  name: product.name,
                  // Note: RelatedProducts usa datos de BD que no tienen secondImage
                  // Para implementar completamente, necesitarías cargar imágenes adicionales aquí también
                }}
                className="w-full h-full"
                showIndicator={false}
              />
              
              {!product.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Agotado
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                
                {product.inStock && (
                  <span className="text-xs text-gray-500">
                    {product.quantity} disponibles
                  </span>
                )}
              </div>

              <div className="flex items-center mt-2 space-x-1">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index < product.rating ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  ({product.rating}/6)
                </span>
              </div>

              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-green-600 text-white text-center py-2 px-3 rounded text-sm font-medium">
                  Ver producto
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 