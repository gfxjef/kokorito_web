'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductoConOpciones, RellenoOpcion, TamañoOpcion, SeleccionPersonalizacion } from '@/types/Product';
import { productoCompletoService, productoService, rellenoService, tamañoService, imagenService, testimonioService, transformers } from '@/services/api';
import { useGlobalData } from '@/context/GlobalDataContext';
import QuantityControls from './QuantityControls';
import AddToOrderButton from './AddToOrderButton';
import FillingSelector from './FillingSelector';
import SizeSelector from './SizeSelector';
import Breadcrumb from './Breadcrumb';
import ProductGallery from './ProductGallery';

interface ProductInfoDynamicProps {
  productId: number;
  renderMode?: 'widget' | 'full-page';
  onProductLoaded?: (data: ProductoConOpciones) => void;
}

// Caché mejorado con TTL
interface CacheEntry {
  data: ProductoConOpciones;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const productosCompletosCache = new Map<number, CacheEntry>();

// Limpiar caché viejo
const cleanOldCache = () => {
  const now = Date.now();
  for (const [key, entry] of productosCompletosCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      productosCompletosCache.delete(key);
    }
  }
};

export default function ProductInfoDynamic({ 
  productId, 
  renderMode = 'widget',
  onProductLoaded 
}: ProductInfoDynamicProps) {
  // Estados principales - con datos parciales para carga progresiva
  const [producto, setProducto] = useState<any>(null);
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [rellenos, setRellenos] = useState<RellenoOpcion[]>([]);
  const [tamaños, setTamaños] = useState<TamañoOpcion[]>([]);
  const [testimonios, setTestimonios] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    producto: true,
    imagenes: true,
    rellenos: true,
    tamaños: true,
    testimonios: true
  });
  
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  
  // Obtener datos del contexto global
  const { productos, categorias, imagenes: imagenesGlobal } = useGlobalData();
  
  // Estados para personalización
  const [seleccion, setSeleccion] = useState<SeleccionPersonalizacion>({
    cantidad: 1,
    precioFinal: 0,
    precioBase: 0
  });

  // Cargar datos con estrategia progresiva
  useEffect(() => {
    const loadProductoProgresivo = async () => {
      // Evitar cargas múltiples
      if (loadingRef.current) return;
      
      // Limpiar caché viejo
      cleanOldCache();
      
      // Verificar caché primero
      const cached = productosCompletosCache.get(productId);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('✅ Producto cargado desde caché');
        const { data } = cached;
        
        // Cargar todo de una vez desde caché
        setProducto(data.producto);
        setImagenes(data.imagenes);
        setRellenos(data.rellenos);
        setTamaños(data.tamaños);
        setTestimonios(data.testimonios);
        
        setLoading({
          producto: false,
          imagenes: false,
          rellenos: false,
          tamaños: false,
          testimonios: false
        });
        
        // Inicializar selección
        inicializarSeleccion(data);
        
        onProductLoaded?.(data);
        return;
      }

      try {
        loadingRef.current = true;
        setError(null);
        
        console.log(`📡 Iniciando carga progresiva del producto ${productId}`);
        
        // PASO 1: Cargar info básica del producto (más importante)
        const productoBasico = productos.find(p => p.id === productId);
        
        if (productoBasico) {
          // Si tenemos el producto en caché global, usarlo inmediatamente
          console.log('✅ Producto básico desde caché global');
          const productoTransformado = transformarProducto(productoBasico);
          setProducto(productoTransformado);
          setLoading(prev => ({ ...prev, producto: false }));
        } else {
          // Si no, cargarlo de la API
          try {
            const prod = await productoService.getById(productId);
            if (prod) {
              const productoTransformado = transformarProducto(prod);
              setProducto(productoTransformado);
              setLoading(prev => ({ ...prev, producto: false }));
            } else {
              throw new Error('Producto no encontrado');
            }
          } catch (err) {
            setError('Producto no encontrado');
            return;
          }
        }
        
        // PASO 2: Cargar imágenes (segundo más importante para UX)
        const imagenesPromise = (async () => {
          try {
            // Primero verificar caché global
            const imagenesCache = imagenesGlobal.filter(img => img.producto_id === productId);
            if (imagenesCache.length > 0) {
              console.log('✅ Imágenes desde caché global');
              const imgs = imagenesCache.map((i: any) => transformers.imagenToFrontend(i));
              setImagenes(imgs);
            } else {
              const imgs = await imagenService.getByProducto(productId);
              setImagenes(imgs.map((i: any) => transformers.imagenToFrontend(i)));
            }
          } catch (err) {
            console.error('Error cargando imágenes:', err);
          } finally {
            setLoading(prev => ({ ...prev, imagenes: false }));
          }
        })();
        
        // PASO 3: Cargar opciones de personalización en paralelo
        const opcionesPromise = Promise.all([
          // Rellenos
          (async () => {
            try {
              const rell = await rellenoService.getByProducto(productId);
              const rellenosTransformados = rell.map((r: any) => transformers.rellenoToFrontend(r));
              setRellenos(rellenosTransformados);
            } catch (err) {
              console.error('Error cargando rellenos:', err);
            } finally {
              setLoading(prev => ({ ...prev, rellenos: false }));
            }
          })(),
          
          // Tamaños
          (async () => {
            try {
              const tam = await tamañoService.getByProducto(productId);
              const tamañosTransformados = tam.map((t: any) => transformers.tamañoToFrontend(t));
              setTamaños(tamañosTransformados);
            } catch (err) {
              console.error('Error cargando tamaños:', err);
            } finally {
              setLoading(prev => ({ ...prev, tamaños: false }));
            }
          })()
        ]);
        
        // PASO 4: Cargar testimonios (menos prioritario)
        const testimoniosPromise = (async () => {
          try {
            const test = await testimonioService.getByProducto(productId);
            setTestimonios(test.map((t: any) => transformers.testimonioToFrontend(t)));
          } catch (err) {
            console.error('Error cargando testimonios:', err);
          } finally {
            setLoading(prev => ({ ...prev, testimonios: false }));
          }
        })();
        
        // Esperar todo para guardar en caché
        await Promise.all([imagenesPromise, opcionesPromise, testimoniosPromise]);
        
        // Guardar en caché cuando todo esté listo
        if (producto) {
          const productoCompleto: ProductoConOpciones = {
            producto,
            rellenos,
            tamaños,
            imagenes,
            testimonios,
            hasOptions: (rellenos.length > 0 || tamaños.length > 0) && producto.permitPersonalizacion
          };
          
          productosCompletosCache.set(productId, {
            data: productoCompleto,
            timestamp: Date.now()
          });
          
          console.log(`💾 Producto ${productId} guardado en caché con TTL`);
          
          onProductLoaded?.(productoCompleto);
        }
        
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('Error al cargar el producto');
      } finally {
        loadingRef.current = false;
      }
    };

    loadProductoProgresivo();
  }, [productId, productos, imagenesGlobal]);

  // Función auxiliar para transformar producto
  const transformarProducto = (prod: any) => {
    return {
      id: prod.id,
      nombre: prod.nombre,
      slug: prod.slug,
      sku: prod.sku,
      descripcion: prod.descripcion || '',
      descripcionCorta: prod.descripcion_corta || '',
      precioBase: parseFloat(prod.precio_base) || 0,
      precioOferta: prod.precio_oferta ? parseFloat(prod.precio_oferta) : undefined,
      categoriaId: prod.categoria_id,
      stockDisponible: prod.stock_disponible,
      permitPersonalizacion: prod.permite_personalizacion,
      rating: prod.rating_promedio,
      totalReviews: prod.total_reviews,
      isDisponible: prod.is_disponible,
      isFeatured: prod.is_featured,
      imagenPrincipal: prod.imagen_principal || undefined,
      tiempoPreparacion: prod.tiempo_preparacion_hrs,
      porciones: prod.porciones || undefined
    };
  };

  // Inicializar selección cuando tengamos los datos necesarios
  useEffect(() => {
    if (producto && !loading.producto && !loading.tamaños && !loading.rellenos) {
      inicializarSeleccion({
        producto,
        tamaños,
        rellenos,
        imagenes,
        testimonios,
        hasOptions: (rellenos.length > 0 || tamaños.length > 0) && producto.permitPersonalizacion
      });
    }
  }, [producto, tamaños, rellenos, loading.producto, loading.tamaños, loading.rellenos]);

  const inicializarSeleccion = (data: ProductoConOpciones) => {
    const tamañoDefault = data.tamaños.length > 0 ? data.tamaños[0] : undefined;
    const rellenoDefault = data.rellenos.length > 0 ? data.rellenos[0] : undefined;
    
    let precioCalculado = data.producto.precioBase || 0;
    if (tamañoDefault) {
      precioCalculado = ((data.producto.precioBase || 0) * (tamañoDefault.multiplicadorPrecio || 1)) + (tamañoDefault.precioAdicional || 0);
    }
    if (rellenoDefault) {
      precioCalculado += (rellenoDefault.precioAdicional || 0);
    }

    setSeleccion({
      tamaño: tamañoDefault,
      relleno: rellenoDefault,
      cantidad: 1,
      precioFinal: precioCalculado,
      precioBase: data.producto.precioBase || 0
    });
  };

  // Handlers optimizados
  const handleSizeChange = useCallback((tamaño: TamañoOpcion) => {
    if (!producto) return;
    
    setSeleccion(prev => {
      const precioBase = producto.precioBase || 0;
      let nuevoPrecio = (precioBase * (tamaño.multiplicadorPrecio || 1)) + (tamaño.precioAdicional || 0);
      if (prev.relleno) {
        nuevoPrecio += (prev.relleno.precioAdicional || 0);
      }
      return { ...prev, tamaño, precioFinal: nuevoPrecio };
    });
  }, [producto]);

  const handleFillingChange = useCallback((relleno: RellenoOpcion) => {
    if (!producto) return;
    
    setSeleccion(prev => {
      const precioBase = producto.precioBase || 0;
      let nuevoPrecio = precioBase;
      if (prev.tamaño) {
        nuevoPrecio = (precioBase * (prev.tamaño.multiplicadorPrecio || 1)) + (prev.tamaño.precioAdicional || 0);
      }
      nuevoPrecio += (relleno.precioAdicional || 0);
      return { ...prev, relleno, precioFinal: nuevoPrecio };
    });
  }, [producto]);

  const handleQuantityChange = useCallback((cantidad: number) => {
    setSeleccion(prev => ({ ...prev, cantidad }));
  }, []);

  const handleAddToOrder = useCallback(async () => {
    if (!producto) return;
    
    console.log('Agregando al pedido:', {
      productId: producto.id,
      productName: producto.nombre,
      quantity: seleccion.cantidad,
      size: seleccion.tamaño?.name,
      filling: seleccion.relleno?.name,
      finalPrice: seleccion.precioFinal,
      totalPrice: seleccion.precioFinal * seleccion.cantidad
    });
  }, [producto, seleccion]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(price || 0);
  }, []);

  // Obtener el nombre de la categoría
  const getCategoriaNombre = () => {
    if (!producto || !categorias) return 'Sin categoría';
    const categoria = categorias.find(c => c.id === producto.categoriaId);
    return categoria?.nombre || 'Sin categoría';
  };

  // Determinar si tenemos opciones de personalización
  const hasOptions = (rellenos.length > 0 || tamaños.length > 0) && producto?.permitPersonalizacion;

  // Renderizar según el modo
  if (renderMode === 'full-page') {
    return (
      <>
        {/* Breadcrumb */}
        {producto && (
          <Breadcrumb items={[
            { label: 'Inicio', href: '/' },
            { label: getCategoriaNombre(), href: `/categoria/${producto.categoriaId}` },
            { label: producto.nombre, href: '', isActive: true }
          ]} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Galería de Imágenes */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {loading.imagenes ? (
              <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <ProductGallery 
                images={imagenes.length > 0 
                  ? imagenes.sort((a, b) => {
                      if (a.isPrincipal && !b.isPrincipal) return -1;
                      if (!a.isPrincipal && b.isPrincipal) return 1;
                      return a.orden - b.orden;
                    }).map(img => img.url)
                  : [producto?.imagenPrincipal || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop']
                } 
                productName={producto?.nombre || 'Producto'} 
              />
            )}
          </div>

          {/* Información del Producto */}
          <div className="lg:pl-8">
            {renderProductInfo()}
          </div>
        </div>
      </>
    );
  }

  // Modo widget (por defecto)
  return renderProductInfo();

  // Función auxiliar para renderizar la info del producto
  function renderProductInfo() {
    // Error state
    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-pink-600 hover:text-pink-800 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    // Loading mínimo - solo mostrar skeleton si no tenemos producto
    if (loading.producto || !producto) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      );
    }

    // Renderizar progresivamente con los datos disponibles
    return (
      <div className="space-y-6">
        {/* Información básica del producto (siempre disponible primero) */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold" style={{ color: '#FF6B9D' }}>
              {formatPrice(seleccion.precioFinal)}
            </span>
            
            {seleccion.precioFinal !== producto.precioBase && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(producto.precioBase)}
              </span>
            )}
            
            {producto.isDisponible ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Disponible
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                No disponible
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">
            {producto.descripcionCorta || producto.descripcion}
          </p>
        </div>

        {/* Opciones de personalización - Se muestran cuando cargan */}
        {hasOptions && (
          <div className="space-y-6 py-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Personaliza tu producto</h3>
            
            {/* Tamaños */}
            {loading.tamaños ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : (
              tamaños.length > 0 && (
                <SizeSelector
                  tamaños={tamaños}
                  onSizeChange={handleSizeChange}
                  selectedSize={seleccion.tamaño}
                  precioBase={producto.precioBase || 0}
                />
              )
            )}

            {/* Rellenos */}
            {loading.rellenos ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : (
              rellenos.length > 0 && (
                <FillingSelector
                  rellenos={rellenos}
                  onFillingChange={handleFillingChange}
                  selectedFilling={seleccion.relleno}
                />
              )
            )}
          </div>
        )}

                  {/* Cantidad y botón de compra */}
          <div className="space-y-4 py-6 border-t border-gray-200">
            <QuantityControls
              initialQuantity={seleccion.cantidad}
              onQuantityChange={handleQuantityChange}
              minQuantity={1}
              maxQuantity={producto.stockDisponible}
              disabled={!producto.isDisponible}
            />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total a pagar:</p>
                <p className="text-2xl font-bold" style={{ color: '#FF6B9D' }}>
                  {formatPrice(seleccion.precioFinal * seleccion.cantidad)}
                </p>
              </div>
              
              <AddToOrderButton
                onAddToOrder={handleAddToOrder}
                disabled={!producto.isDisponible || producto.stockDisponible === 0}
              />
            </div>
          </div>

        {/* Información adicional del producto */}
        <div className="text-sm text-gray-500 space-y-1 pt-4 border-t border-gray-200">
          <p><span className="font-medium">Categoría:</span> {getCategoriaNombre()}</p>
          {producto.sku && (
            <p><span className="font-medium">SKU:</span> {producto.sku}</p>
          )}
          {producto.isFeatured && (
            <p><span className="font-medium text-pink-600">⭐ Producto destacado</span></p>
          )}
        </div>
      </div>
    );
  }
} 