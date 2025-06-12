'use client';
import { useCategoriesWithProductsOptimized } from '@/context/GlobalDataContext';
import ProductImageHover from '@/components/shared/ProductImageHover';
import { useRef, useState, useEffect } from 'react';

export default function CategoriesGrid() {
  const { data: categories, loading, error } = useCategoriesWithProductsOptimized();

  // Colores para las líneas de categorías (intercalados)
  const lineColors = [
    'bg-orange-400',
    'bg-pink-400', 
    'bg-purple-400',
    'bg-teal-400'
  ];

  // Colores de texto correspondientes a las líneas
  const textColors = [
    'text-orange-400',
    'text-pink-400',
    'text-purple-400', 
    'text-teal-400'
  ];

  // Colores de degradado correspondientes (30% opacidad)
  const gradientColors = [
    'from-orange-400/30 to-orange-600/30',
    'from-pink-400/30 to-pink-600/30',
    'from-purple-400/30 to-purple-600/30',
    'from-teal-400/30 to-teal-600/30'
  ];

  if (loading) {
    return (
      <section className="py-6 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 space-y-4 lg:space-y-8">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="space-y-4 animate-pulse">
              {/* Título centrado con líneas a ambos lados */}
              <div className="flex items-center gap-4">
                <div className="h-0.5 bg-gray-300 rounded flex-1"></div>
                <div className="bg-gray-300 rounded w-40" style={{ height: '2.8rem' }}></div>
                <div className="h-0.5 bg-gray-300 rounded flex-1"></div>
              </div>
              {/* Descripción */}
              <div className="text-center">
                <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
              </div>
              {/* Grid de productos + cuadro promocional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array(5).fill(0).map((_, productIndex) => (
                  <div key={productIndex} className="bg-gray-200 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 lg:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-4 lg:space-y-8">
        {categories.map((category, categoryIndex) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            categoryIndex={categoryIndex}
            lineColors={lineColors}
            textColors={textColors}
            gradientColors={gradientColors}
          />
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

// Componente separado para cada categoría con navegación
function CategorySection({ category, categoryIndex, lineColors, textColors, gradientColors }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Función para verificar si se puede hacer scroll
  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Efectos para verificar scroll al cargar y redimensionar
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [category.products]);

  // Funciones de navegación
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Título centrado con líneas a ambos lados */}
      <div className="flex items-center gap-4">
        <div className={`h-0.5 ${lineColors[categoryIndex % lineColors.length]} rounded-full flex-1`}></div>
        <h2 className={`${textColors[categoryIndex % textColors.length]} whitespace-nowrap font-pacifico`} style={{ fontSize: '2.2rem' }}>
          {category.name}
        </h2>
        <div className={`h-0.5 ${lineColors[categoryIndex % lineColors.length]} rounded-full flex-1`}></div>
      </div>

      {/* Descripción de la categoría - Sin padding vertical */}
      <div className="text-center">
        <p className="text-2xl italic font-light" style={{ color: '#878787' }}>
          "{category.title || `Aquí irá el texto de la descripcion de la categoria que esta en su base de datos`}"
        </p>
      </div>

      {/* Layout Desktop: Grid horizontal 4 productos + 1 cuadro promocional */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        {/* Productos (primeros 4) */}
        {category.products.length > 0 ? (
          category.products.slice(0, 4).map((product: any) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                {/* Imagen del producto */}
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
                <div className="p-3 relative">
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

                  {/* Botón de Agregar en hover - En la sección de textos, parte derecha inferior */}
                  <button 
                    className={`absolute bottom-3 right-3 px-3 py-1 rounded-lg font-semibold text-xs text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 shadow-lg ${
                      lineColors[categoryIndex % lineColors.length]
                    }`}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Placeholders si no hay suficientes productos
          Array(4).fill(0).map((_, index) => (
            <div key={`placeholder-${index}`} className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin productos</span>
            </div>
          ))
        )}

        {/* Cuadro promocional (mismo tamaño que las tarjetas) */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
          <div className="relative h-full flex flex-col justify-center items-center text-white">
            {/* Imagen de fondo */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${category.image})`
              }}
            ></div>
            
            {/* Degradado overlay con color de línea (30% opacidad) */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[categoryIndex % gradientColors.length]}`}></div>
            
            {/* Contenido centrado */}
            <div className="relative z-10 text-center p-4">
              <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm">
                Ver todos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Mobile: Scroll horizontal con 2 productos por fila y flechas */}
      <div className="lg:hidden relative">
        {/* Flecha izquierda */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-primary p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Flecha derecha */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-primary p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div 
          ref={scrollRef}
          className="overflow-x-auto hide-scrollbar"
          onScroll={checkScrollability}
        >
          <div className="flex gap-3 pb-4" style={{ width: 'max-content' }}>
            {/* Productos en pares (2x2 grid por cada elemento) */}
            {category.products.length > 0 ? (
              (() => {
                // Agrupamos productos en pares y agregamos el botón "Ver todos" al final
                const productPairs = [];
                for (let i = 0; i < category.products.length; i += 2) {
                  productPairs.push(category.products.slice(i, i + 2));
                }
                
                return (
                  <>
                    {productPairs.map((pair, pairIndex) => (
                      <div key={pairIndex} className={`flex-shrink-0 w-72 ${pairIndex === 0 ? 'ml-4' : ''}`}>
                        <div className="grid grid-cols-2 gap-3">
                          {pair.map((product: any) => (
                            <div key={product.id} className="group cursor-pointer">
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                                {/* Imagen del producto */}
                                <div className="relative">
                                  <ProductImageHover product={product} className="h-32" />
                                  {product.discount && (
                                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-bold">
                                      {product.discount} OFF
                                    </div>
                                  )}
                                  <button className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-colors">
                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Info del producto */}
                                <div className="p-2 relative">
                                  <h4 className="font-medium text-xs text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                    {product.name || product.title}
                                  </h4>
                                  
                                  {/* Rating */}
                                  <div className="flex items-center mb-1">
                                    <div className="flex text-yellow-400 text-xs">
                                      {'★'.repeat(Math.min(5, Math.floor(product.rating || 0)))}
                                    </div>
                                    <span className="text-xs text-gray-600 ml-1">
                                      ({product.reviews || 0})
                                    </span>
                                  </div>

                                  {/* Precios */}
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-sm font-bold text-primary">
                                        S/ {(Number(product.price) || 0).toFixed(2)}
                                      </span>
                                      {product.originalPrice && (
                                        <span className="text-xs text-gray-500 line-through ml-1">
                                          S/ {(Number(product.originalPrice) || 0).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Envío gratis */}
                                  <div className="text-xs text-green-600 mt-1">
                                    🚚 Envío gratis
                                  </div>

                                  {/* Botón de Agregar en hover */}
                                  <button 
                                    className={`absolute bottom-2 right-2 px-2 py-1 rounded-lg font-semibold text-xs text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 shadow-lg ${
                                      lineColors[categoryIndex % lineColors.length]
                                    }`}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Si el par solo tiene un producto, agregar placeholder */}
                          {pair.length === 1 && (
                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Sin más productos</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Cuadro promocional "Ver todos" - Solo mostrar si hay productos */}
                    {category.products.length > 0 && (
                      <div className="flex-shrink-0 w-36 mr-4">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-64">
                          <div className="relative h-full flex flex-col justify-center items-center text-white">
                            {/* Imagen de fondo */}
                            <div 
                              className="absolute inset-0 bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${category.image})`
                              }}
                            ></div>
                            
                            {/* Degradado overlay con color de línea (30% opacidad) */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[categoryIndex % gradientColors.length]}`}></div>
                            
                            {/* Contenido centrado */}
                            <div className="relative z-10 text-center p-4">
                              <button className="bg-white text-gray-900 px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-xs">
                                Ver todos
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              // Estado cuando no hay productos
              <div className="flex-shrink-0 w-72 ml-4">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No hay productos disponibles</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 