'use client'

import { useState, useEffect } from 'react';
import { getProductById, getRelatedProducts } from '@/data/mockProducts';
import { Product } from '@/types/Product';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import ProductSlider from '@/components/ProductSlider';
import ProductInfo from '@/components/ProductInfo';
import RelatedProducts from '@/components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params;
        
        // Simular un pequeño delay para mostrar loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const productData = getProductById(resolvedParams.id);
        if (productData) {
          setProduct(productData);
          const related = getRelatedProducts(resolvedParams.id);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            El producto que buscas no existe o ha sido removido.
          </p>
          <a 
            href="/" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: product.category, href: `/categoria/${product.category.toLowerCase()}` },
    { label: product.subCategory, href: `/categoria/${product.category.toLowerCase()}/${product.subCategory.toLowerCase()}` },
    { label: product.name, href: '', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Producto Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Slider de Imágenes - Lado Izquierdo */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductSlider images={product.images} productName={product.name} />
          </div>

          {/* Información del Producto - Lado Derecho */}
          <div className="lg:pl-8">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
             </main>

       <Footer />
     </div>
  );
} 