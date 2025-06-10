export interface ProductoImagen {
  id: number
  producto_id: number
  url: string
  titulo?: string
  alt_text?: string
  orden: number
  is_principal: boolean
  is_active: boolean
  formato?: string
  width?: number
  height?: number
  tamaño_bytes?: number
  created_at: string
  updated_at: string
}

export interface ProductoImagenForm {
  producto_id: number
  url: string
  titulo?: string
  alt_text?: string
  orden: number
  is_principal: boolean
  is_active: boolean
  formato?: string
  width?: number
  height?: number
  tamaño_bytes?: number
}

export interface ProductoImagenFilters {
  producto_id?: number
  is_principal?: boolean
  is_active?: boolean
  formato?: string
} 