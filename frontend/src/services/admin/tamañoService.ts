import apiClient from './apiClient'
import { Tamaño, TamañoForm, TamañoFilters } from '@/types/admin/Tamaño'
import { ApiResponse, SearchParams } from '@/types/admin/ApiResponse'

class TamañoService {
  private endpoint = '/tamaños'

  async getAll(filters?: TamañoFilters): Promise<ApiResponse<Tamaño[]>> {
    const params: SearchParams = {
      activos_solo: filters?.is_active,
      search: filters?.search,
    }
    return apiClient.get<Tamaño[]>(this.endpoint, params)
  }

  async getById(id: number): Promise<ApiResponse<Tamaño>> {
    return apiClient.get<Tamaño>(`${this.endpoint}/${id}`)
  }

  async getAvailable(): Promise<ApiResponse<Tamaño[]>> {
    return apiClient.get<Tamaño[]>(`${this.endpoint}/disponibles/list`)
  }

  async getByProduct(productoId: number): Promise<ApiResponse<Tamaño[]>> {
    return apiClient.get<Tamaño[]>(`${this.endpoint}/producto/${productoId}`)
  }

  async create(data: TamañoForm): Promise<ApiResponse<Tamaño>> {
    return apiClient.post<Tamaño, TamañoForm>(this.endpoint, data)
  }

  async update(id: number, data: TamañoForm): Promise<ApiResponse<Tamaño>> {
    return apiClient.put<Tamaño, TamañoForm>(`${this.endpoint}/${id}`, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Calcular precio final con tamaño (solo precio_adicional según PRD)
  calculatePriceWithSize(precioBase: number, tamaño: Tamaño): number {
    return precioBase + tamaño.precio_adicional
  }
}

export const tamañoService = new TamañoService()
export default tamañoService 