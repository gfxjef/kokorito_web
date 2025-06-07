'use client';
import { products } from '@/data/staticData';

export default function BestSellers() {
  const bestSellers = products.slice(0, 6);

  return (
    <section className="py-12 bg-white">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {bestSellers.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="relative">
                <div 
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${product.image})`
                  }}
                >
                </div>
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                  #1 Vendido
                </div>
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-text text-sm leading-tight mb-1">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-xs mb-3">
                  {product.category}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-bold text-lg">
                      S/. {product.price.toFixed(2)}
                    </span>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-gray-500 text-xs ml-1">(124)</span>
                    </div>
                  </div>
                  <button className="bg-accent text-white px-3 py-1 rounded text-xs font-semibold hover:bg-teal-600 transition-colors">
                    Agregar
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-accent font-semibold">
                  🚚 Envío gratis
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 