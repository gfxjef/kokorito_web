'use client';
import { useBestSellersOptimized } from '@/context/GlobalDataContext';
import ProductImageHover from '@/components/shared/ProductImageHover';

export default function BestSellers() {
  const { data: bestSellers, loading, error } = useBestSellersOptimized();

  return (
    <section className="pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text">Más vendidos de la semana</h2>
            <p className="text-gray-600 mt-2">Los productos favoritos de nuestros clientes</p>
          </div>
          <a href="#" className="text-primary font-semibold hover:text-pink-600 transition-colors">
            Ver todos →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            // Estado de carga
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-3 w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product, index) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="relative">
                  <ProductImageHover product={product} className="h-48" />
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                    #{index + 1} Vendido
                  </div>
                  {product.discount && (
                    <div className="absolute top-2 right-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {product.discount} OFF
                    </div>
                  )}
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4 relative">
                  <h3 className="font-semibold text-text text-sm leading-tight mb-1">
                    {product.title || product.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-3">
                    {product.category}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold text-lg">
                          S/. {(Number(product.price) || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-sm line-through">
                            S/. {(Number(product.originalPrice) || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400 text-xs">
                          {'★'.repeat(Math.min(5, Math.round(product.rating || 0)))}
                          {'☆'.repeat(Math.max(0, 5 - Math.round(product.rating || 0)))}
                        </div>
                        <span className="text-gray-500 text-xs ml-1">({product.reviews || 0})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-accent font-semibold">
                    🚚 Envío gratis
                  </div>

                  {/* Botón de Agregar en hover - En la sección de textos, parte derecha inferior */}
                  <button className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1 rounded-lg font-semibold text-xs transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                    Agregar
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Estado cuando no hay productos
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No hay productos disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 