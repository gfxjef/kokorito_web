export interface Testimonio {
  id: number
  nombre_cliente: string
  email_cliente?: string
  telefono_cliente?: string
  titulo?: string
  comentario: string
  rating: number
  producto_id: number
  is_active: boolean
  is_publico: boolean
  is_destacado: boolean
  is_verificado: boolean
  orden_display: number
  moderado_por?: string
  fecha_moderacion?: string
  notas_moderacion?: string
  ip_origen?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

export interface TestimonioForm {
  nombre_cliente: string
  email_cliente?: string
  telefono_cliente?: string
  titulo?: string
  comentario: string
  rating: number
  producto_id: number
  is_active: boolean
  is_publico: boolean
  is_destacado: boolean
  is_verificado: boolean
  orden_display: number
  notas_moderacion?: string
}

export interface TestimonioFilters {
  producto_id?: number
  is_active?: boolean
  is_publico?: boolean
  is_destacado?: boolean
  is_verificado?: boolean
  rating_min?: number
  rating_max?: number
  search?: string
} 