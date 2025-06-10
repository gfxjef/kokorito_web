export interface Tamaño {
  id: number
  nombre: string
  slug: string
  descripcion?: string
  precio_adicional: number
  multiplicador_precio: number
  diametro_cm?: number
  peso_gramos?: number
  porciones_aproximadas?: number
  color_hex?: string
  icono?: string
  orden_display: number
  is_active: boolean
  is_disponible: boolean
  created_at: string
  updated_at: string
}

export interface TamañoForm {
  nombre: string
  descripcion?: string
  precio_adicional: number
  multiplicador_precio: number
  diametro_cm?: number
  peso_gramos?: number
  porciones_aproximadas?: number
  color_hex?: string
  icono?: string
  orden_display: number
  is_active: boolean
  is_disponible: boolean
}

export interface TamañoFilters {
  is_active?: boolean
  is_disponible?: boolean
  search?: string
} 