'use client';
import { products } from '@/data/staticData';
import ProductImageHover from '@/components/shared/ProductImageHover';

export default function ProductGrid() {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative h-48">
                <ProductImageHover 
                  product={{
                    image: product.image,
                    name: product.title,
                    // Los productos estáticos no tienen secondImage por defecto
                  }}
                  className="w-full h-full"
                  showIndicator={false}
                />
                <div className="absolute top-2 right-2">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors duration-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-bold text-text text-lg leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {product.category}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-xl">
                    S/. {product.price.toFixed(2)}
                  </span>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-accent transition-colors duration-200">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors duration-200">
            Ver Más Productos
          </button>
        </div>
      </div>
    </section>
  );
} 