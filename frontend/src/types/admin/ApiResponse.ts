// Respuesta estándar de la API según el README
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  count?: number
}

// Para respuestas con paginación
export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Para errores de la API
export interface ApiError {
  success: false
  message: string
  error?: string
  details?: string[]
}

// Para validaciones de formularios
export interface ValidationError {
  field: string
  message: string
}

export interface FormValidationResponse {
  success: boolean
  errors?: ValidationError[]
}

// Estados de carga para UI
export interface LoadingState {
  loading: boolean
  error: string | null
  success: boolean
}

// Para filtros de búsqueda y paginación
export interface SearchParams {
  page?: number
  limit?: number
  search?: string
  activos_solo?: boolean
}

// Para operaciones CRUD
export type CrudOperation = 'create' | 'read' | 'update' | 'delete'

export interface CrudState<T> {
  items: T[]
  currentItem: T | null
  loading: boolean
  error: string | null
  operation: CrudOperation | null
} 