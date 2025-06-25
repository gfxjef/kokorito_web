// Tipos básicos para el frontend
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Precio en soles
  quantity: number;
  rating: number; // 0-6 para el sistema de círculos
  images: string[];
  category: string;
  subCategory: string;
  tags: string[];
  inStock: boolean;
  relatedProducts?: string[]; // IDs de productos relacionados
  fillings?: string[]; // Rellenos disponibles
  sizes?: string[]; // Tamaños disponibles
}

// Nuevos tipos para productos dinámicos
export interface ProductoCompleto {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcionCorta?: string;
  precioBase: number;
  precioOferta?: number;
  categoriaId: number;
  stockDisponible: number;
  permitPersonalizacion: boolean;
  rating: number;
  totalReviews: number;
  isDisponible: boolean;
  isFeatured: boolean;
  imagenPrincipal?: string;
  tiempoPreparacion: number;
  porciones?: number;
}

export interface RellenoOpcion {
  id: number;
  name: string;
  description: string;
  image?: string;
  precioAdicional: number;
  isPremium: boolean;
  isVegan: boolean;
  containsLactose: boolean;
  containsGluten: boolean;
  color?: string;
}

export interface TamañoOpcion {
  id: number;
  name: string;
  description: string;
  porciones?: number;
  diametro?: number;
  peso?: number;
  multiplicadorPrecio: number;
  precioAdicional: number;
  icono?: string;
  color: string;
  orden: number;
}

export interface ImagenProducto {
  id: number;
  url: string;
  alt: string;
  title?: string;
  orden: number;
  isPrincipal: boolean;
  width?: number;
  height?: number;
}

export interface TestimonioProducto {
  id: number;
  customerName: string;
  title?: string;
  comment: string;
  rating: number;
  isHighlighted: boolean;
  isVerified: boolean;
  productId: number;
  date: string;
}

export interface ProductoConOpciones {
  producto: ProductoCompleto;
  rellenos: RellenoOpcion[];
  tamaños: TamañoOpcion[];
  imagenes: ImagenProducto[];
  testimonios: TestimonioProducto[];
  hasOptions: boolean;
}

export interface SeleccionPersonalizacion {
  relleno?: RellenoOpcion;
  tamaño?: TamañoOpcion;
  cantidad: number;
  precioFinal: number;
  precioBase: number;
}

// Tipos existentes mantenidos para compatibilidad
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
} 