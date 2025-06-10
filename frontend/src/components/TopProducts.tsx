'use client';
import { topProducts } from '@/data/staticData';
import ProductImageHover from '@/components/shared/ProductImageHover';

export default function TopProducts() {
  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-text mb-6">Productos Top</h2>
        
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <ProductImageHover 
                    product={{
                      image: product.image,
                      name: product.title,
                      // Los productos top estáticos no tienen secondImage
                    }}
                    className="w-full h-full rounded-lg"
                    showIndicator={false}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text text-sm leading-tight">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {product.category}
                  </p>
                  <p className="text-primary font-bold text-lg mt-2">
                    S/. {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200">
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </div>
  );
} 