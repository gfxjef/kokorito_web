'use client';
import { useCategoriesWithProducts } from '@/hooks/useApiData';
import ProductImageHover from '@/components/shared/ProductImageHover';

export default function CategoriesGrid() {
  const { data: categories, loading, error } = useCategoriesWithProducts();

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-80 h-64 lg:h-auto bg-gray-300"></div>
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, productIndex) => (
                      <div key={productIndex} className="bg-gray-200 rounded-lg h-56"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Imagen Promocional Izquierda */}
              <div className={`lg:w-80 h-64 lg:h-auto bg-gradient-to-br ${category.bgColor} relative flex-shrink-0 overflow-hidden`}>
                {/* Imagen de fondo */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${category.image})`
                  }}
                ></div>
                
                {/* Degradado overlay para legibilidad */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.bgColor} opacity-85`}></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-center text-white z-10">
                  <div className="mb-4">
                    <span className="bg-warning text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Ofertas del día
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                    {category.name}
                  </h2>
                  <h3 className="text-lg font-medium mb-1 opacity-90 drop-shadow-md">
                    {category.title}
                  </h3>
                  <p className="text-sm opacity-80 mb-4 drop-shadow-md">
                    {category.subtitle}
                  </p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-fit shadow-lg">
                    Ver todos
                  </button>
                </div>
              </div>

              {/* Productos Derecha - Grid Horizontal */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.products.length > 0 ? (
                    category.products.map((product) => (
                      <div key={product.id} className="group cursor-pointer">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                          {/* Imagen del producto - REEMPLAZADO */}
                          <div className="relative">
                            <ProductImageHover product={product} />
                            {product.discount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {product.discount} OFF
                              </div>
                            )}
                            <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-colors">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>

                          {/* Info del producto */}
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {product.name || product.title}
                            </h4>
                            
                            {/* Rating */}
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400 text-xs">
                                {'★'.repeat(Math.min(5, Math.floor(product.rating || 0)))}
                                {'☆'.repeat(Math.max(0, 5 - Math.floor(product.rating || 0)))}
                              </div>
                              <span className="text-xs text-gray-600 ml-1">
                                ({product.reviews || 0})
                              </span>
                            </div>

                            {/* Precios */}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-primary">
                                  S/ {(Number(product.price) || 0).toFixed(2)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-1">
                                    S/ {(Number(product.originalPrice) || 0).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Envío gratis */}
                            <div className="text-xs text-green-600 mt-1">
                              🚚 Envío gratis
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No hay productos disponibles en esta categoría</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay categorías disponibles en este momento</p>
          </div>
        )}
      </div>
    </section>
  );
} 