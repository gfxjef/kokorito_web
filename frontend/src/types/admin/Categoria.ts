export interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion?: string
  parent_id?: number
  color_tema?: string
  imagen_url?: string
  orden_display: number
  is_active: boolean
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface CategoriaForm {
  nombre: string
  descripcion?: string
  parent_id?: number
  color_tema?: string
  imagen_url?: string
  orden_display: number
  is_active: boolean
  is_featured: boolean
  meta_title?: string
  meta_description?: string
}

export interface CategoriaFilters {
  is_active?: boolean
  is_featured?: boolean
  parent_id?: number
  search?: string
} 