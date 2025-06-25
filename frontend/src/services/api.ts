// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + '/api/v1';

// Interfaz para respuestas de la API
interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  count: number;
}

// Interfaz para datos de categoría de la BD
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

// Interfaz para datos de producto de la BD
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

// Interfaz para rellenos
interface RellenoDB {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  color_hex: string | null;
  icono: string | null;
  precio_adicional: number;
  is_disponible: boolean;
  is_premium: boolean;
  contiene_lactosa: boolean;
  contiene_gluten: boolean;
  es_vegano: boolean;
  requiere_stock: boolean;
  stock_disponible: number | null;
  orden_display: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaz para testimonios
interface TestimonioDB {
  id: number;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono_cliente: string | null;
  producto_id: number;
  titulo: string | null;
  comentario: string;
  rating: number;
  is_publico: boolean;
  is_verificado: boolean;
  is_destacado: boolean;
  moderado_por: string | null;
  fecha_moderacion: string | null;
  notas_moderacion: string | null;
  ip_origen: string | null;
  user_agent: string | null;
  orden_display: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaz para tamaños
interface TamañoDB {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  porciones_aproximadas: number | null;
  diametro_cm: number | null;
  peso_gramos: number | null;
  multiplicador_precio: number;
  precio_adicional: number;
  is_disponible: boolean;
  icono: string | null;
  color_hex: string | null;
  orden_display: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Interfaz para imágenes de producto
interface ProductoImagenDB {
  id: number;
  producto_id: number;
  url: string;
  alt_text: string | null;
  titulo: string | null;
  orden: number;
  is_principal: boolean;
  width: number | null;
  height: number | null;
  tamaño_bytes: number | null;
  formato: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Función auxiliar para fetch con manejo de errores
async function apiRequest<T>(endpoint: string): Promise<APIResponse<T> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la conexión con la API:', error);
    return null;
  }
}

// === SERVICIOS DE CATEGORÍAS ===
export const categoriaService = {
  // Obtener todas las categorías activas
  async getAll(): Promise<CategoriaDB[]> {
    const response = await apiRequest<CategoriaDB>('/categorias');
    return response?.data || [];
  },

  // Obtener categorías destacadas
  async getFeatured(): Promise<CategoriaDB[]> {
    const response = await apiRequest<CategoriaDB>('/categorias/destacadas/list');
    return response?.data || [];
  },

  // Obtener categoría por ID
  async getById(id: number): Promise<CategoriaDB | null> {
    const response = await apiRequest<CategoriaDB>(`/categorias/${id}`);
    return response?.data?.[0] || null;
  }
};

// === SERVICIOS DE PRODUCTOS ===
export const productoService = {
  // Obtener todos los productos
  async getAll(): Promise<ProductoDB[]> {
    const response = await apiRequest<ProductoDB>('/productos');
    return response?.data || [];
  },

  // Obtener productos destacados
  async getFeatured(): Promise<ProductoDB[]> {
    const response = await apiRequest<ProductoDB>('/productos/destacados/list');
    return response?.data || [];
  },

  // Obtener productos por categoría
  async getByCategory(categoriaId: number): Promise<ProductoDB[]> {
    const response = await apiRequest<ProductoDB>(`/productos/categoria/${categoriaId}`);
    return response?.data || [];
  },

  // Obtener producto por ID
  async getById(id: number): Promise<ProductoDB | null> {
    const response = await apiRequest<ProductoDB>(`/productos/${id}`);
    return response?.data?.[0] || null;
  }
};

// === SERVICIOS DE RELLENOS ===
export const rellenoService = {
  // Obtener rellenos disponibles
  async getDisponibles(): Promise<RellenoDB[]> {
    const response = await apiRequest<RellenoDB>('/rellenos/disponibles/list');
    return response?.data || [];
  },

  // Obtener rellenos para un producto específico
  async getByProducto(productoId: number): Promise<RellenoDB[]> {
    const response = await apiRequest<RellenoDB>(`/rellenos/producto/${productoId}`);
    return response?.data || [];
  }
};

// === SERVICIOS DE TESTIMONIOS ===
export const testimonioService = {
  // Obtener testimonios públicos
  async getPublicos(): Promise<TestimonioDB[]> {
    const response = await apiRequest<TestimonioDB>('/testimonios/publicos/list');
    return response?.data || [];
  },

  // Obtener testimonios de un producto
  async getByProducto(productoId: number): Promise<TestimonioDB[]> {
    const response = await apiRequest<TestimonioDB>(`/testimonios/producto/${productoId}`);
    return response?.data || [];
  }
};

// === SERVICIOS DE TAMAÑOS ===
export const tamañoService = {
  // Obtener tamaños disponibles
  async getDisponibles(): Promise<TamañoDB[]> {
    const response = await apiRequest<TamañoDB>('/tamaños/disponibles/list');
    return response?.data || [];
  },

  // Obtener tamaños para un producto específico
  async getByProducto(productoId: number): Promise<TamañoDB[]> {
    const response = await apiRequest<TamañoDB>(`/tamaños/producto/${productoId}`);
    return response?.data || [];
  }
};

// === SERVICIOS DE IMÁGENES ===
export const imagenService = {
  // Obtener imágenes de un producto
  async getByProducto(productoId: number): Promise<ProductoImagenDB[]> {
    const response = await apiRequest<ProductoImagenDB>(`/producto-imagenes/producto/${productoId}`);
    return response?.data || [];
  }
};

// === SERVICIOS COMPLETOS DE PRODUCTO ===
export const productoCompletoService = {
  // Obtener producto con todas sus opciones
  async getProductoCompleto(productoId: number) {
    try {
      const [producto, rellenos, tamaños, imagenes, testimonios] = await Promise.all([
        productoService.getById(productoId),
        rellenoService.getByProducto(productoId),
        tamañoService.getByProducto(productoId),
        imagenService.getByProducto(productoId),
        testimonioService.getByProducto(productoId)
      ]);

      return {
        producto,
        rellenos,
        tamaños,
        imagenes,
        testimonios,
        hasOptions: (rellenos.length > 0 || tamaños.length > 0) && producto?.permite_personalizacion
      };
    } catch (error) {
      console.error('Error obteniendo producto completo:', error);
      return null;
    }
  },

  // Versión optimizada que usa datos del contexto cuando es posible
  async getProductoCompletoOptimizado(
    productoId: number, 
    productoFromCache?: ProductoDB | null,
    imagenesFromCache?: ProductoImagenDB[]
  ) {
    try {
      // Si tenemos el producto en caché, no lo pedimos de nuevo
      const productoPromise = productoFromCache 
        ? Promise.resolve(productoFromCache)
        : productoService.getById(productoId);

      // Si tenemos imágenes en caché, las filtramos por producto
      const imagenesPromise = imagenesFromCache
        ? Promise.resolve(imagenesFromCache.filter(img => img.producto_id === productoId))
        : imagenService.getByProducto(productoId);

      // Estos siempre los necesitamos de la API
      const [producto, rellenos, tamaños, imagenes, testimonios] = await Promise.all([
        productoPromise,
        rellenoService.getByProducto(productoId),
        tamañoService.getByProducto(productoId),
        imagenesPromise,
        testimonioService.getByProducto(productoId)
      ]);

      return {
        producto,
        rellenos,
        tamaños,
        imagenes,
        testimonios,
        hasOptions: (rellenos.length > 0 || tamaños.length > 0) && producto?.permite_personalizacion
      };
    } catch (error) {
      console.error('Error obteniendo producto completo optimizado:', error);
      return null;
    }
  },

  // Calcular precio dinámico basado en selecciones
  calcularPrecio(precioBase: number, tamaño?: TamañoDB, relleno?: RellenoDB): number {
    let precioFinal = precioBase;
    
    // Aplicar multiplicador y precio adicional del tamaño
    if (tamaño) {
      precioFinal = (precioBase * tamaño.multiplicador_precio) + tamaño.precio_adicional;
    }
    
    // Agregar precio adicional del relleno
    if (relleno) {
      precioFinal += relleno.precio_adicional;
    }
    
    return Math.round(precioFinal * 100) / 100; // Redondear a 2 decimales
  }
};

// === FUNCIONES DE TRANSFORMACIÓN ===
// Convierte datos de la BD al formato que espera el frontend
export const transformers = {
  // Transforma categoría de BD a formato frontend
  categoriaToFrontend(categoria: CategoriaDB) {
    return {
      id: categoria.id,
      name: categoria.nombre,
      slug: categoria.slug,
      description: categoria.descripcion || '',
      image: categoria.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=600&h=400&fit=crop`,
      bgColor: categoria.color_tema || 'from-pink-400 to-pink-600',
      is_featured: categoria.is_featured
    };
  },

  // Transforma producto de BD a formato frontend
  productoToFrontend(producto: ProductoDB) {
    // Convertir precios a números para evitar errores
    const precioBase = Number(producto.precio_base) || 0;
    const precioOferta = producto.precio_oferta ? Number(producto.precio_oferta) : null;
    const precioFinal = precioOferta || precioBase;
    
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
      image: producto.imagen_principal || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=300&h=200&fit=crop`,
      secondImage: undefined as string | undefined, // Se asignará dinámicamente
      description: producto.descripcion_corta || producto.descripcion || '',
      rating: Number(producto.rating_promedio) || 0,
      reviews: Number(producto.total_reviews) || 0,
      featured: producto.is_featured,
      inStock: producto.is_disponible && producto.stock_disponible > 0,
      stock: Number(producto.stock_disponible) || 0
    };
  },

  // Transforma relleno de BD a formato frontend
  rellenoToFrontend(relleno: RellenoDB) {
    return {
      id: relleno.id,
      name: relleno.nombre,
      description: relleno.descripcion || `${relleno.nombre} premium`,
      image: relleno.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=100&h=100&fit=crop`,
      precioAdicional: relleno.precio_adicional,
      isPremium: relleno.is_premium,
      isVegan: relleno.es_vegano,
      containsLactose: relleno.contiene_lactosa,
      containsGluten: relleno.contiene_gluten,
      color: relleno.color_hex || '#FF6B9D'
    };
  },

  // Transforma testimonio de BD a formato frontend
  testimonioToFrontend(testimonio: TestimonioDB) {
    return {
      id: testimonio.id,
      customerName: testimonio.nombre_cliente,
      title: testimonio.titulo || '',
      comment: testimonio.comentario,
      rating: testimonio.rating,
      isHighlighted: testimonio.is_destacado,
      isVerified: testimonio.is_verificado,
      productId: testimonio.producto_id,
      date: testimonio.created_at
    };
  },

  // Transforma tamaño de BD a formato frontend
  tamañoToFrontend(tamaño: TamañoDB) {
    return {
      id: tamaño.id,
      name: tamaño.nombre,
      description: tamaño.descripcion || `${tamaño.nombre} - ${tamaño.porciones_aproximadas || 'N/A'} porciones`,
      porciones: tamaño.porciones_aproximadas || undefined,
      diametro: tamaño.diametro_cm || undefined,
      peso: tamaño.peso_gramos || undefined,
      multiplicadorPrecio: tamaño.multiplicador_precio,
      precioAdicional: tamaño.precio_adicional,
      icono: tamaño.icono || undefined,
      color: tamaño.color_hex || '#FF6B9D',
      orden: tamaño.orden_display
    };
  },

  // Transforma imagen de BD a formato frontend
  imagenToFrontend(imagen: ProductoImagenDB) {
    return {
      id: imagen.id,
      url: imagen.url,
      alt: imagen.alt_text || 'Imagen del producto',
      title: imagen.titulo || '',
      orden: imagen.orden,
      isPrincipal: imagen.is_principal,
      width: imagen.width || undefined,
      height: imagen.height || undefined
    };
  }
};

// === FUNCIONES DE UTILIDAD ===
export const apiUtils = {
  // Obtiene imagen por defecto si no hay imagen
  getDefaultImage(type: 'producto' | 'categoria' | 'relleno'): string {
    const imageMap = {
      producto: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      categoria: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=400&fit=crop',
      relleno: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=100&h=100&fit=crop'
    };
    return imageMap[type];
  },

  // Formatea precio a formato peruano
  formatPrice(price: number): string {
    return `S/ ${price.toFixed(2)}`;
  },

  // Calcula porcentaje de descuento
  calculateDiscount(originalPrice: number, salePrice: number): number {
    return Math.round((1 - salePrice / originalPrice) * 100);
  }
}; 