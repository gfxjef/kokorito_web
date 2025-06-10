export interface Relleno {
  id: number
  nombre: string
  slug: string
  descripcion?: string
  precio_adicional: number
  color_hex?: string
  icono?: string
  imagen_url?: string
  orden_display: number
  is_premium: boolean
  is_active: boolean
  is_disponible: boolean
  requiere_stock: boolean
  stock_disponible?: number
  contiene_gluten: boolean
  contiene_lactosa: boolean
  es_vegano: boolean
  created_at: string
  updated_at: string
}

export interface RellenoForm {
  nombre: string
  descripcion?: string
  precio_adicional: number
  color_hex?: string
  icono?: string
  imagen_url?: string
  orden_display: number
  is_premium: boolean
  is_active: boolean
  is_disponible: boolean
  requiere_stock: boolean
  stock_disponible?: number
  contiene_gluten: boolean
  contiene_lactosa: boolean
  es_vegano: boolean
}

export interface RellenoFilters {
  is_premium?: boolean
  is_active?: boolean
  is_disponible?: boolean
  requiere_stock?: boolean
  contiene_gluten?: boolean
  contiene_lactosa?: boolean
  es_vegano?: boolean
  search?: string
} 