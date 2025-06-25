'use client'

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductSlider from '@/components/ProductSlider';
import ProductInfoDynamic from '@/components/ProductInfoDynamic';
import RelatedProducts from '@/components/RelatedProducts';
import { productoCompletoService, transformers } from '@/services/api';
import { Product } from '@/types/Product';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [productId, setProductId] = useState<number | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductId = async () => {
      try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);
        
        if (isNaN(id)) {
          setError('ID de producto inválido');
          return;
        }

        setProductId(id);
        
        // TODO: Cargar productos relacionados basados en categoría
        const mockRelated = [
          {
            id: '2',
            name: 'Torta Red Velvet',
            description: 'Clásica torta red velvet con cream cheese frosting.',
            price: 85,
            quantity: 15,
            rating: 6,
            images: ['https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop'],
            category: 'Tortas',
            subCategory: 'Ocasiones Especiales',
            tags: ['Red Velvet', 'Premium'],
            inStock: true
          },
          {
            id: '3',
            name: 'Cupcakes de Vainilla',
            description: 'Set de 6 cupcakes de vainilla gourmet.',
            price: 42,
            quantity: 30,
            rating: 5,
            images: ['https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop'],
            category: 'Cupcakes',
            subCategory: 'Clásicos',
            tags: ['Vainilla', 'Set'],
            inStock: true
          }
        ];
        setRelatedProducts(mockRelated);

      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar la página');
      }
    };

    loadProductId();
  }, [params]);

  // Error en el ID
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
            <a 
              href="/" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Esperando ID
  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* El componente ProductInfoDynamic manejará toda la carga y visualización */}
        <ProductInfoDynamic 
          productId={productId} 
          renderMode="full-page"
          onProductLoaded={(data) => {
            // Callback cuando el producto se carga para actualizar breadcrumb, etc.
            console.log('Producto cargado:', data);
          }}
        />

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16 mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 