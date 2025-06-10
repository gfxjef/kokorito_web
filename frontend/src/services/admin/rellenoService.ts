import apiClient from './apiClient'
import { Relleno, RellenoForm, RellenoFilters } from '@/types/admin/Relleno'
import { ApiResponse, SearchParams } from '@/types/admin/ApiResponse'

class RellenoService {
  private endpoint = '/rellenos'

  async getAll(filters?: RellenoFilters): Promise<ApiResponse<Relleno[]>> {
    const params: SearchParams = {
      activos_solo: filters?.is_active,
      search: filters?.search,
    }
    return apiClient.get<Relleno[]>(this.endpoint, params)
  }

  async getById(id: number): Promise<ApiResponse<Relleno>> {
    return apiClient.get<Relleno>(`${this.endpoint}/${id}`)
  }

  async getAvailable(): Promise<ApiResponse<Relleno[]>> {
    return apiClient.get<Relleno[]>(`${this.endpoint}/disponibles/list`)
  }

  async getByProduct(productoId: number): Promise<ApiResponse<Relleno[]>> {
    return apiClient.get<Relleno[]>(`${this.endpoint}/producto/${productoId}`)
  }

  async create(data: RellenoForm): Promise<ApiResponse<Relleno>> {
    return apiClient.post<Relleno, RellenoForm>(this.endpoint, data)
  }

  async update(id: number, data: RellenoForm): Promise<ApiResponse<Relleno>> {
    return apiClient.put<Relleno, RellenoForm>(`${this.endpoint}/${id}`, data)
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
}

export const rellenoService = new RellenoService()
export default rellenoService 