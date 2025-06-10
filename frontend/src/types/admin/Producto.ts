export interface Producto {
  id: number
  nombre: string
  slug: string
  sku?: string
  descripcion?: string
  descripcion_corta?: string
  categoria_id: number
  precio_base: number
  precio_oferta?: number
  fecha_inicio_oferta?: string
  fecha_fin_oferta?: string
  stock_disponible: number
  stock_minimo: number
  peso_gramos?: number
  tiempo_preparacion_hrs: number
  ingredientes?: string
  informacion_nutricional?: string
  imagen_principal?: string
  orden_display: number
  is_active: boolean
  is_disponible: boolean
  is_featured: boolean
  requiere_refrigeracion: boolean
  apto_veganos: boolean
  contiene_gluten: boolean
  contiene_lactosa: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface ProductoForm {
  nombre: string
  descripcion?: string
  descripcion_corta?: string
  sku?: string
  categoria_id: number
  precio_base: number
  precio_oferta?: number
  fecha_inicio_oferta?: string
  fecha_fin_oferta?: string
  stock_disponible: number
  stock_minimo: number
  peso_gramos?: number
  tiempo_preparacion_hrs: number
  ingredientes?: string
  informacion_nutricional?: string
  imagen_principal?: string
  orden_display: number
  is_active: boolean
  is_disponible: boolean
  is_featured: boolean
  requiere_refrigeracion: boolean
  apto_veganos: boolean
  contiene_gluten: boolean
  contiene_lactosa: boolean
  meta_title?: string
  meta_description?: string
}

export interface ProductoFilters {
  categoria_id?: number
  is_active?: boolean
  is_disponible?: boolean
  is_featured?: boolean
  search?: string
} 