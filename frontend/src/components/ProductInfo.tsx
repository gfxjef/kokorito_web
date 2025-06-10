'use client';

import { useState } from 'react';
import { Product } from '@/types/Product';
import ProductRating from './ProductRating';
import QuantityControls from './QuantityControls';
import AddToOrderButton from './AddToOrderButton';
import ProductTags from './ProductTags';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleAddToOrder = async () => {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Agregando al pedido:', {
      productId: product.id,
      quantity: selectedQuantity,
      productName: product.name
    });

    // Aquí iría la lógica real para agregar al carrito/pedido
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Nombre del Producto */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
                 <div className="flex items-center space-x-4">
           <span className="text-2xl font-bold" style={{ color: '#FF6B9D' }}>
             {formatPrice(product.price)}
           </span>
          {product.inStock ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              En stock
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Cantidad Disponible */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Cantidad disponible:</span>
          <span className="text-lg font-bold text-gray-900">{product.quantity} unidades</span>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Sistema de Relleno (Rating) */}
      <div className="py-4 border-t border-b border-gray-200">
        <ProductRating rating={product.rating} />
      </div>

      {/* Controles de Cantidad */}
      <div className="space-y-4">
        <QuantityControls
          initialQuantity={selectedQuantity}
          maxQuantity={Math.min(product.quantity, 20)}
          onQuantityChange={setSelectedQuantity}
          disabled={!product.inStock}
        />
      </div>

      {/* Botón Agregar a Pedido */}
      <div className="pt-4">
        <AddToOrderButton
          onAddToOrder={handleAddToOrder}
          disabled={!product.inStock}
        />
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Producto fresco de primera calidad</li>
              <li>• Entrega el mismo día si pides antes de las 2:00 PM</li>
              <li>• Garantía de frescura por 7 días</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Etiquetas */}
      {product.tags && product.tags.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <ProductTags 
            tags={product.tags} 
            linkPattern="/productos?tag={tag}"
          />
        </div>
      )}

      {/* Información de categoría */}
      <div className="text-sm text-gray-500 space-y-1">
        <p><span className="font-medium">Categoría:</span> {product.category}</p>
        <p><span className="font-medium">Subcategoría:</span> {product.subCategory}</p>
        <p><span className="font-medium">ID del producto:</span> {product.id}</p>
      </div>
    </div>
  );
} 