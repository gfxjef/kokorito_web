import { useState, useEffect } from 'react';

interface UseApiDataOptions<T> {
  fetchFunction: () => Promise<T[]>;
  fallbackData?: T[];
  dependencies?: any[];
}

interface UseApiDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiData<T>({
  fetchFunction,
  fallbackData = [],
  dependencies = []
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Usar datos de fallback si están disponibles
      if (fallbackData.length > 0) {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook específico para productos más vendidos
export function useBestSellers() {
  return useApiData({
    fetchFunction: async () => {
      const { productoService, transformers } = await import('@/services/api');
      
      // Intentar obtener productos destacados
      let productos = await productoService.getFeatured();
      
      // Si no hay suficientes, obtener todos los disponibles
      if (productos.length < 5) {
        const todosLosProductos = await productoService.getAll();
        productos = todosLosProductos
          .filter(p => p.is_disponible && p.stock_disponible > 0)
          .slice(0, 5);
      } else {
        productos = productos.slice(0, 5);
      }
      
      // Para cada producto, obtener sus imágenes de la tabla producto_imagen
      const productosConImagenes = await Promise.all(
        productos.map(async (producto) => {
          const baseProduct = transformers.productoToFrontend(producto);
          
          try {
            // Obtener imágenes de la tabla producto_imagen
            const response = await fetch(`/api/backend/v1/producto-imagenes/producto/${producto.id}`);
            const data = await response.json();
            
            if (data.success && data.data && data.data.length > 0) {
              // Ordenar por is_principal DESC, orden ASC
              const sortedImages = data.data.sort((a: any, b: any) => {
                if (a.is_principal !== b.is_principal) {
                  return b.is_principal ? 1 : -1; // Principal primero
                }
                return a.orden - b.orden; // Luego por orden
              });
              
              // PRIORIDAD: Usar SIEMPRE las imágenes de la tabla
              baseProduct.image = sortedImages[0].url; // Primera imagen como principal
              
              // Si hay segunda imagen, usarla para hover
              if (sortedImages.length > 1) {
                baseProduct.secondImage = sortedImages[1].url;
              }
            }
            // Si NO hay imágenes en la tabla, mantener imagen_principal como fallback
          } catch (error) {
            console.error(`Error cargando imágenes del producto ${producto.id}:`, error);
            // En caso de error, mantener imagen_principal del transformer
          }
          
          return baseProduct;
        })
      );
      
      return productosConImagenes;
    },
    fallbackData: []
  });
}

// Hook específico para categorías con productos
export function useCategoriesWithProducts() {
  return useApiData({
    fetchFunction: async () => {
      const { categoriaService, productoService, transformers } = await import('@/services/api');
      
      // Obtener categorías activas
      const categoriasDB = await categoriaService.getAll();
      
      // Tomar solo las primeras 4 categorías
      const categoriasPrincipales = categoriasDB.slice(0, 4);
      
      // Colores predefinidos para las categorías
      const bgColors = [
        "from-orange-400 to-orange-600",
        "from-pink-400 to-pink-600", 
        "from-purple-400 to-purple-600",
        "from-teal-400 to-teal-600"
      ];
      
      // Para cada categoría, obtener sus productos
      const categoriesWithProducts = await Promise.all(
        categoriasPrincipales.map(async (categoria, index) => {
          const productosDB = await productoService.getByCategory(categoria.id);
          
          // Filtrar productos disponibles y tomar máximo 4
          const productosDisponibles = productosDB
            .filter(p => p.is_disponible && p.stock_disponible > 0)
            .slice(0, 4);
          
          // Para cada producto, obtener sus imágenes de la tabla producto_imagen
          const productosConImagenes = await Promise.all(
            productosDisponibles.map(async (producto) => {
              const baseProduct = transformers.productoToFrontend(producto);
              
              try {
                // Obtener imágenes de la tabla producto_imagen
                const response = await fetch(`/api/backend/v1/producto-imagenes/producto/${producto.id}`);
                const data = await response.json();
                
                if (data.success && data.data && data.data.length > 0) {
                  // Ordenar por is_principal DESC, orden ASC
                  const sortedImages = data.data.sort((a: any, b: any) => {
                    if (a.is_principal !== b.is_principal) {
                      return b.is_principal ? 1 : -1; // Principal primero
                    }
                    return a.orden - b.orden; // Luego por orden
                  });
                  
                  // PRIORIDAD: Usar SIEMPRE las imágenes de la tabla
                  baseProduct.image = sortedImages[0].url; // Primera imagen como principal
                  
                  // Si hay segunda imagen, usarla para hover
                  if (sortedImages.length > 1) {
                    baseProduct.secondImage = sortedImages[1].url;
                  }
                }
                // Si NO hay imágenes en la tabla, mantener imagen_principal como fallback
                // (baseProduct.image ya tiene imagen_principal por el transformer)
              } catch (error) {
                console.error(`Error cargando imágenes del producto ${producto.id}:`, error);
                // En caso de error, mantener imagen_principal del transformer
              }
              
              return baseProduct;
            })
          );
          
          const productos = productosConImagenes;
          
          return {
            id: categoria.id,
            name: categoria.nombre,
            title: categoria.descripcion || `Los mejores ${categoria.nombre.toLowerCase()}`,
            subtitle: `Tradición y calidad en cada ${categoria.nombre.toLowerCase().slice(0, -1)}`,
            image: categoria.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=600&h=400&fit=crop`,
            bgColor: categoria.color_tema ? 
              `from-[${categoria.color_tema}] to-[${categoria.color_tema}]/80` : 
              bgColors[index % bgColors.length],
            products: productos
          };
        })
      );
      
      return categoriesWithProducts;
    },
    fallbackData: []
  });
}

// Hook específico para categorías del header
export function useHeaderCategories() {
  return useApiData({
    fetchFunction: async () => {
      const { categoriaService } = await import('@/services/api');
      
      const categoriasDB = await categoriaService.getAll();
      
             // Simplificamos los iconos para evitar problemas de JSX en hooks
       const getIconForCategory = (id: number) => {
         // Los iconos se crearán en el componente que use este hook
         return { categoryId: id };
       };

      // Subcategorías por defecto
      const defaultSubcategories = {
        1: { // Tortas
          "Ocasiones Especiales": {
            image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop",
            items: [
              { name: "Cumpleaños", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop" },
              { name: "Boda", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop" },
              { name: "Aniversarios", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop" },
              { name: "Graduaciones", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop" }
            ]
          },
          "Por Sabor": {
            image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
            items: [
              { name: "Red Velvet", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
              { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
              { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
              { name: "Tres Leches", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" }
            ]
          }
        },
        2: { // Cupcakes
          "Gourmet": {
            image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
            items: [
              { name: "Red Velvet", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" },
              { name: "Lemon", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
              { name: "Oreo", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
              { name: "Ferrero", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop" }
            ]
          },
          "Clásicos": {
            image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
            items: [
              { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
              { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
              { name: "Fresa", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
              { name: "Zanahoria", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" }
            ]
          }
        },
        3: { // Default para otras categorías
          "Tradicionales": {
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
            items: [
              { name: "Clásicos", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
              { name: "Especiales", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" }
            ]
          }
        }
      };
      
             // Tomar solo las primeras 4 categorías y transformarlas
       const categoriesData = categoriasDB.slice(0, 4).map((categoria) => ({
         id: categoria.id,
         name: categoria.nombre,
         icon: getIconForCategory(categoria.id),
         image: categoria.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=400&h=300&fit=crop`,
         subcategories: defaultSubcategories[Math.min(categoria.id, 3) as keyof typeof defaultSubcategories] || defaultSubcategories[3]
       }));
      
      return categoriesData;
    },
    fallbackData: []
  });
} 