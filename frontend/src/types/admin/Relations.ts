// Relación Many-to-Many: Producto ↔ Relleno
export interface ProductoRelleno {
  producto_id: number
  relleno_id: number
}

// Relación Many-to-Many: Producto ↔ Tamaño
export interface ProductoTamaño {
  producto_id: number
  tamaño_id: number
}

// Para formularios de relaciones
export interface ProductoRellenosForm {
  producto_id: number
  relleno_ids: number[]
}

export interface ProductoTamañosForm {
  producto_id: number
  tamaño_ids: number[]
}

// Para mostrar información completa en las listas
export interface ProductoConRelaciones {
  id: number
  nombre: string
  categoria_nombre: string
  rellenos: Array<{
    id: number
    nombre: string
    precio_adicional: number
  }>
  tamaños: Array<{
    id: number
    nombre: string
    precio_adicional: number
  }>
  imagenes: Array<{
    id: number
    url: string
    is_principal: boolean
  }>
} 