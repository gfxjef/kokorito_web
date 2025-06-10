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