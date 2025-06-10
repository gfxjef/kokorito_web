import apiClient from './apiClient'
import { Categoria, CategoriaForm, CategoriaFilters } from '@/types/admin/Categoria'
import { ApiResponse, SearchParams } from '@/types/admin/ApiResponse'

class CategoriaService {
  private endpoint = '/categorias'

  // Obtener todas las categorías
  async getAll(filters?: CategoriaFilters): Promise<ApiResponse<Categoria[]>> {
    const params: SearchParams = {
      activos_solo: filters?.is_active,
      search: filters?.search,
    }
    
    return apiClient.get<Categoria[]>(this.endpoint, params)
  }

  // Obtener categoría por ID
  async getById(id: number): Promise<ApiResponse<Categoria>> {
    return apiClient.get<Categoria>(`${this.endpoint}/${id}`)
  }

  // Obtener categoría por slug
  async getBySlug(slug: string): Promise<ApiResponse<Categoria>> {
    return apiClient.get<Categoria>(`${this.endpoint}/slug/${slug}`)
  }

  // Obtener categorías destacadas
  async getFeatured(): Promise<ApiResponse<Categoria[]>> {
    return apiClient.get<Categoria[]>(`${this.endpoint}/destacadas/list`)
  }

  // Crear nueva categoría
  async create(data: CategoriaForm): Promise<ApiResponse<Categoria>> {
    return apiClient.post<Categoria, CategoriaForm>(this.endpoint, data)
  }

  // Actualizar categoría existente
  async update(id: number, data: CategoriaForm): Promise<ApiResponse<Categoria>> {
    return apiClient.put<Categoria, CategoriaForm>(`${this.endpoint}/${id}`, data)
  }

  // Eliminar categoría
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }

  // Validar slug único
  async validateSlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const response = await this.getBySlug(slug)
      // Si existe y no es el mismo ID que estamos excluyendo, no es único
      return excludeId ? response.data.id === excludeId : false
    } catch {
      // Si no se encuentra, el slug es único
      return true
    }
  }

  // Generar slug desde nombre
  generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones por un solo guión
      .replace(/^-+|-+$/g, '') // Remover guiones al inicio y final
  }
}

export const categoriaService = new CategoriaService()
export default categoriaService 