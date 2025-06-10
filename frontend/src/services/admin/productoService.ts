import apiClient from './apiClient'
import { Producto, ProductoForm, ProductoFilters } from '@/types/admin/Producto'
import { ProductoConRelaciones } from '@/types/admin/Relations'
import { ApiResponse, SearchParams } from '@/types/admin/ApiResponse'

class ProductoService {
  private endpoint = '/productos'

  // Obtener todos los productos
  async getAll(filters?: ProductoFilters): Promise<ApiResponse<Producto[]>> {
    const params: SearchParams = {
      activos_solo: filters?.is_active,
      search: filters?.search,
    }
    
    return apiClient.get<Producto[]>(this.endpoint, params)
  }

  // Obtener producto por ID
  async getById(id: number): Promise<ApiResponse<Producto>> {
    return apiClient.get<Producto>(`${this.endpoint}/${id}`)
  }

  // Obtener producto por slug
  async getBySlug(slug: string): Promise<ApiResponse<Producto>> {
    return apiClient.get<Producto>(`${this.endpoint}/slug/${slug}`)
  }

  // Obtener productos por categoría
  async getByCategory(categoriaId: number): Promise<ApiResponse<Producto[]>> {
    return apiClient.get<Producto[]>(`${this.endpoint}/categoria/${categoriaId}`)
  }

  // Obtener productos destacados
  async getFeatured(): Promise<ApiResponse<Producto[]>> {
    return apiClient.get<Producto[]>(`${this.endpoint}/destacados/list`)
  }

  // Obtener producto con relaciones completas
  async getWithRelations(id: number): Promise<ApiResponse<ProductoConRelaciones>> {
    return apiClient.get<ProductoConRelaciones>(`${this.endpoint}/${id}/relations`)
  }

  // Crear nuevo producto
  async create(data: ProductoForm): Promise<ApiResponse<Producto>> {
    return apiClient.post<Producto, ProductoForm>(this.endpoint, data)
  }

  // Actualizar producto existente
  async update(id: number, data: ProductoForm): Promise<ApiResponse<Producto>> {
    return apiClient.put<Producto, ProductoForm>(`${this.endpoint}/${id}`, data)
  }

  // Eliminar producto
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Validar SKU único
  async validateSKU(sku: string, excludeId?: number): Promise<boolean> {
    try {
      const response = await apiClient.get<Producto[]>(`${this.endpoint}?sku=${sku}`)
      const existing = response.data.find(p => p.sku === sku)
      return excludeId ? existing?.id === excludeId : !existing
    } catch {
      return true
    }
  }

  // Generar slug desde nombre
  generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Calcular precio final con ofertas
  calculateFinalPrice(producto: Producto): number {
    if (producto.precio_oferta && producto.precio_oferta > 0) {
      const now = new Date()
      const inicioOferta = producto.fecha_inicio_oferta ? new Date(producto.fecha_inicio_oferta) : null
      const finOferta = producto.fecha_fin_oferta ? new Date(producto.fecha_fin_oferta) : null

      const dentroDelPeriodo = (!inicioOferta || now >= inicioOferta) && 
                              (!finOferta || now <= finOferta)

      if (dentroDelPeriodo) {
        return producto.precio_oferta
      }
    }
    return producto.precio_base
  }

  // Verificar si la oferta está activa
  isOfferActive(producto: Producto): boolean {
    if (!producto.precio_oferta || producto.precio_oferta <= 0) return false

    const now = new Date()
    const inicioOferta = producto.fecha_inicio_oferta ? new Date(producto.fecha_inicio_oferta) : null
    const finOferta = producto.fecha_fin_oferta ? new Date(producto.fecha_fin_oferta) : null

    return (!inicioOferta || now >= inicioOferta) && (!finOferta || now <= finOferta)
  }

  // Obtener rellenos asociados a un producto
  async getProductoRellenos(id: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`${this.endpoint}/${id}/rellenos`)
  }

  // Obtener tamaños asociados a un producto
  async getProductoTamaños(id: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`${this.endpoint}/${id}/tamaños`)
  }
}

export const productoService = new ProductoService()
export default productoService 