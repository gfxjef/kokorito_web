'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces para los datos de la BD
interface CategoriaDB {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  parent_id: number | null;
  imagen_url: string | null;
  color_tema: string | null;
  orden_display: number;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductoDB {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  descripcion_corta: string | null;
  precio_base: number;
  precio_oferta: number | null;
  categoria_id: number;
  sku: string | null;
  stock_disponible: number;
  stock_minimo: number;
  requiere_stock: boolean;
  tiempo_preparacion_hrs: number;
  peso_gramos: number | null;
  porciones: number | null;
  imagen_principal: string | null;
  is_featured: boolean;
  is_disponible: boolean;
  permite_personalizacion: boolean;
  rating_promedio: number;
  total_reviews: number;
  total_ventas: number;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductoImagenDB {
  id: number;
  producto_id: number;
  url: string;
  alt_text: string | null;
  orden: number;
  is_principal: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaces para datos procesados/frontend
interface ProductoFrontend {
  id: number;
  title: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  image: string;
  secondImage?: string;
  description: string;
  rating: number;
  reviews: number;
  featured: boolean;
  inStock: boolean;
  stock: number;
  categoria_id: number;
}

interface CategoriaFrontend {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  bgColor: string;
  is_featured: boolean;
}

// Datos globales en el contexto
interface GlobalData {
  categorias: CategoriaDB[];
  productos: ProductoDB[];
  imagenes: ProductoImagenDB[];
  
  // Datos procesados para frontend
  categoriasProcessed: CategoriaFrontend[];
  productosProcessed: ProductoFrontend[];
  
  // Estados
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Acciones del contexto
interface GlobalDataActions {
  refreshData: () => Promise<void>;
  getProductosPorCategoria: (categoriaId: number) => ProductoFrontend[];
  getProductosDestacados: (limit?: number) => ProductoFrontend[];
  getCategoriasDestacadas: (limit?: number) => CategoriaFrontend[];
  getProductoConImagenes: (productoId: number) => ProductoFrontend | null;
}

type GlobalDataContextType = GlobalData & GlobalDataActions;

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

// Cache configuration
const CACHE_KEY = 'kokorito_global_data';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos en millisegundos

// Funciones de transformación
const transformers = {
  categoriaToFrontend(categoria: CategoriaDB): CategoriaFrontend {
    const bgColors = [
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600", 
      "from-purple-400 to-purple-600",
      "from-teal-400 to-teal-600"
    ];
    
    return {
      id: categoria.id,
      name: categoria.nombre,
      slug: categoria.slug,
      description: categoria.descripcion || '',
      image: categoria.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=600&h=400&fit=crop`,
      bgColor: categoria.color_tema ? 
        `from-[${categoria.color_tema}] to-[${categoria.color_tema}]/80` : 
        bgColors[categoria.id % bgColors.length],
      is_featured: categoria.is_featured
    };
  },

  productoToFrontend(producto: ProductoDB, imagenes: ProductoImagenDB[]): ProductoFrontend {
    const precioBase = Number(producto.precio_base) || 0;
    const precioOferta = producto.precio_oferta ? Number(producto.precio_oferta) : null;
    const precioFinal = precioOferta || precioBase;
    
    // Buscar imágenes de este producto
    const imagenesProducto = imagenes
      .filter(img => img.producto_id === producto.id && img.is_active)
      .sort((a, b) => {
        if (a.is_principal !== b.is_principal) {
          return b.is_principal ? 1 : -1; // Principal primero
        }
        return a.orden - b.orden; // Luego por orden
      });

    // Imagen principal: prioridad a tabla imagenes, fallback a imagen_principal
    const imagenPrincipal = imagenesProducto.length > 0 
      ? imagenesProducto[0].url 
      : producto.imagen_principal || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=300&h=200&fit=crop`;
    
    // Segunda imagen para hover
    const segundaImagen = imagenesProducto.length > 1 ? imagenesProducto[1].url : undefined;
    
    return {
      id: producto.id,
      title: producto.nombre,
      name: producto.nombre,
      category: `Categoría ${producto.categoria_id}`,
      price: precioFinal,
      originalPrice: precioOferta ? precioBase : null,
      discount: precioOferta && precioBase > 0
        ? `${Math.round((1 - precioOferta / precioBase) * 100)}%`
        : null,
      image: imagenPrincipal,
      secondImage: segundaImagen,
      description: producto.descripcion_corta || producto.descripcion || '',
      rating: Number(producto.rating_promedio) || 0,
      reviews: Number(producto.total_reviews) || 0,
      featured: producto.is_featured,
      inStock: producto.is_disponible && producto.stock_disponible > 0,
      stock: Number(producto.stock_disponible) || 0,
      categoria_id: producto.categoria_id
    };
  }
};

// Funciones de cache
const cacheUtils = {
  save(data: GlobalData): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error guardando cache:', error);
    }
  },

  load(): GlobalData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Verificar si el cache no ha expirado
      if (Date.now() - timestamp > CACHE_TTL) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      // Convertir lastUpdated de string a Date object
      if (data.lastUpdated) {
        data.lastUpdated = new Date(data.lastUpdated);
      }

      return data;
    } catch (error) {
      console.warn('Error cargando cache:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  },

  clear(): void {
    localStorage.removeItem(CACHE_KEY);
  }
};

// API calls - SOLO 3 CONSULTAS GLOBALES
const apiService = {
  async fetchAllData(): Promise<{ categorias: CategoriaDB[], productos: ProductoDB[], imagenes: ProductoImagenDB[] }> {
    const API_BASE_URL = 'http://localhost:8000/api/v1';
    
    try {
      // Las 3 consultas principales EN PARALELO
      const [categoriasRes, productosRes, imagenesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categorias`),
        fetch(`${API_BASE_URL}/productos`),
        fetch(`${API_BASE_URL}/producto-imagenes`)
      ]);

      if (!categoriasRes.ok || !productosRes.ok || !imagenesRes.ok) {
        throw new Error('Error en una o más consultas a la API');
      }

      const [categoriasData, productosData, imagenesData] = await Promise.all([
        categoriasRes.json(),
        productosRes.json(),
        imagenesRes.json()
      ]);

      return {
        categorias: categoriasData.data || [],
        productos: productosData.data || [],
        imagenes: imagenesData.data || []
      };
    } catch (error) {
      console.error('Error fetching global data:', error);
      throw error;
    }
  }
};

// Función utilitaria para truncar texto
const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Provider Component
export function GlobalDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GlobalData>({
    categorias: [],
    productos: [],
    imagenes: [],
    categoriasProcessed: [],
    productosProcessed: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  // Función para cargar datos
  const loadData = async (useCache: boolean = true) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Intentar cargar desde cache primero
      if (useCache) {
        const cachedData = cacheUtils.load();
        if (cachedData) {
          console.log('📦 Datos cargados desde cache');
          setData(cachedData);
          return;
        }
      }

      console.log('🌐 Cargando datos desde API...');
      
      // Cargar desde API
      const { categorias, productos, imagenes } = await apiService.fetchAllData();
      
      // Procesar datos para frontend
      const categoriasProcessed = categorias.map(cat => transformers.categoriaToFrontend(cat));
      const productosProcessed = productos.map(prod => transformers.productoToFrontend(prod, imagenes));

      const newData: GlobalData = {
        categorias,
        productos, 
        imagenes,
        categoriasProcessed,
        productosProcessed,
        loading: false,
        error: null,
        lastUpdated: new Date()
      };

      setData(newData);
      
      // Guardar en cache
      cacheUtils.save(newData);
      
      console.log('✅ Datos cargados y guardados en cache');
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Funciones selector para obtener subconjuntos de datos
  const getProductosPorCategoria = (categoriaId: number): ProductoFrontend[] => {
    return data.productosProcessed.filter(producto => 
      producto.categoria_id === categoriaId && producto.inStock
    );
  };

  const getProductosDestacados = (limit: number = 5): ProductoFrontend[] => {
    return data.productosProcessed
      .filter(producto => producto.featured && producto.inStock)
      .slice(0, limit);
  };

  const getCategoriasDestacadas = (limit: number = 4): CategoriaFrontend[] => {
    return data.categoriasProcessed
      .filter(categoria => categoria.is_featured)
      .slice(0, limit);
  };

  const getProductoConImagenes = (productoId: number): ProductoFrontend | null => {
    return data.productosProcessed.find(producto => producto.id === productoId) || null;
  };

  const refreshData = async (): Promise<void> => {
    cacheUtils.clear();
    await loadData(false);
  };

  const contextValue: GlobalDataContextType = {
    ...data,
    refreshData,
    getProductosPorCategoria,
    getProductosDestacados,
    getCategoriasDestacadas,
    getProductoConImagenes
  };

  return (
    <GlobalDataContext.Provider value={contextValue}>
      {children}
    </GlobalDataContext.Provider>
  );
}

// Hook para usar el contexto
export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData debe ser usado dentro de GlobalDataProvider');
  }
  return context;
}

// Hook específico para productos más vendidos
export function useBestSellersOptimized() {
  const { getProductosDestacados, loading, error } = useGlobalData();
  return {
    data: getProductosDestacados(5),
    loading,
    error
  };
}

// Hook específico para categorías con productos  
export function useCategoriesWithProductsOptimized() {
  const { 
    getCategoriasDestacadas, 
    getProductosPorCategoria, 
    loading, 
    error 
  } = useGlobalData();

  const categoriesWithProducts = getCategoriasDestacadas(4).map(categoria => ({
    ...categoria,
    title: categoria.description && categoria.description.length <= 50 
      ? categoria.description 
      : categoria.description 
        ? truncateText(categoria.description, 50)
        : `Los mejores ${categoria.name.toLowerCase()}`,
    subtitle: `Tradición y calidad en cada ${categoria.name.toLowerCase().slice(0, -1)}`,
    products: getProductosPorCategoria(categoria.id).slice(0, 4)
  }));

  return {
    data: categoriesWithProducts,
    loading,
    error
  };
}

// Hook específico para categorías del header
export function useHeaderCategoriesOptimized() {
  const { categoriasProcessed, loading, error } = useGlobalData();

  // Tomar solo las primeras 4 categorías para el header
  const headerCategories = categoriasProcessed.slice(0, 4).map(categoria => ({
    id: categoria.id,
    name: categoria.name,
    slug: categoria.slug,
    image: categoria.image,
    description: categoria.description
  }));

  return {
    data: headerCategories,
    loading,
    error
  };
} 