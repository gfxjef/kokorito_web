import apiClient from './apiClient'
import { Testimonio, TestimonioForm, TestimonioFilters } from '@/types/admin/Testimonio'
import { ApiResponse, SearchParams } from '@/types/admin/ApiResponse'

class TestimonioService {
  private endpoint = '/testimonios'

  async getAll(filters?: TestimonioFilters): Promise<ApiResponse<Testimonio[]>> {
    const params: SearchParams = {
      activos_solo: filters?.is_active,
      search: filters?.search,
    }
    return apiClient.get<Testimonio[]>(this.endpoint, params)
  }

  async getById(id: number): Promise<ApiResponse<Testimonio>> {
    return apiClient.get<Testimonio>(`${this.endpoint}/${id}`)
  }

  async getPublic(): Promise<ApiResponse<Testimonio[]>> {
    return apiClient.get<Testimonio[]>(`${this.endpoint}/publicos/list`)
  }

  async getByProduct(productoId: number): Promise<ApiResponse<Testimonio[]>> {
    return apiClient.get<Testimonio[]>(`${this.endpoint}/producto/${productoId}`)
  }

  async create(data: TestimonioForm): Promise<ApiResponse<Testimonio>> {
    return apiClient.post<Testimonio, TestimonioForm>(this.endpoint, data)
  }

  async update(id: number, data: TestimonioForm): Promise<ApiResponse<Testimonio>> {
    return apiClient.put<Testimonio, TestimonioForm>(`${this.endpoint}/${id}`, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Calcular promedio de rating para un producto
  calculateAverageRating(testimonios: Testimonio[]): number {
    if (testimonios.length === 0) return 0
    const total = testimonios.reduce((sum, t) => sum + t.rating, 0)
    return Math.round((total / testimonios.length) * 10) / 10
  }

  // Validar rating (0-6 según el sistema actual)
  validateRating(rating: number): boolean {
    return rating >= 0 && rating <= 6
  }
}

export const testimonioService = new TestimonioService()
export default testimonioService 