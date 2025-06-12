import { ApiResponse, ApiError, SearchParams } from '@/types/admin/ApiResponse'

// Configuración base para desarrollo y producción
// Siempre usamos el proxy de Next.js cuando estamos en el cliente
const isClientSide = typeof window !== 'undefined'

// En el cliente, siempre usamos el proxy para evitar CORS
// En el servidor (SSR), usamos la URL directa del backend
const API_BASE_URL = isClientSide 
  ? '/api/backend/v1'  // Proxy de Next.js (cliente)
  : process.env.NEXT_PUBLIC_API_URL + '/api/v1'  // Directo (servidor)

const API_VERSION = ''  // Ya incluido en la base URL

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = `${API_BASE_URL}${API_VERSION}`
    console.log('🔗 ApiClient configurado para:', this.baseURL)
    console.log('🔧 Modo:', isClientSide ? 'CLIENTE (Proxy Next.js)' : 'SERVIDOR (Directo Backend)')
  }

  // Método para construir headers
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Método para construir URL con parámetros - CORREGIDO
  private buildURL(endpoint: string, params?: SearchParams): string {
    let url: string
    
    // Si la baseURL es relativa (proxy), construimos la URL manualmente
    if (this.baseURL.startsWith('/')) {
      url = `${this.baseURL}${endpoint}`
      
      if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        })
        const queryString = searchParams.toString()
        if (queryString) {
          url += `?${queryString}`
        }
      }
    } else {
      // Si la baseURL es absoluta, usamos el constructor URL
      const urlObject = new URL(`${this.baseURL}${endpoint}`)
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            urlObject.searchParams.append(key, String(value))
          }
        })
      }
      
      url = urlObject.toString()
    }
    
    return url
  }

  // Método para manejar respuestas
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('Content-Type')
    
    if (!contentType?.includes('application/json')) {
      throw new Error('La respuesta no es JSON válido')
    }

    const data = await response.json()

    if (!response.ok) {
      const error: ApiError = {
        success: false,
        message: data.message || 'Error en la petición',
        error: data.error,
        details: data.details
      }
      throw error
    }

    return data
  }

  // GET - Obtener datos del backend real usando proxy
  async get<T>(endpoint: string, params?: SearchParams): Promise<ApiResponse<T>> {
    try {
      const url = this.buildURL(endpoint, params)
      console.log('🔍 GET Request:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('❌ Error en GET:', error)
      throw error
    }
  }

  // POST - Crear datos en backend real usando proxy
  async post<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log('📤 POST Request:', url, data)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('❌ Error en POST:', error)
      throw error
    }
  }

  // PUT - Actualizar datos en backend real usando proxy
  async put<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log('🔄 PUT Request:', url, data)
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('❌ Error en PUT:', error)
      throw error
    }
  }

  // PATCH - Actualizar parcialmente en backend real usando proxy
  async patch<T, D = any>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log('🔧 PATCH Request:', url, data)
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('❌ Error en PATCH:', error)
      throw error
    }
  }

  // DELETE - Eliminar datos en backend real usando proxy
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log('🗑️ DELETE Request:', url)
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      console.error('❌ Error en DELETE:', error)
      throw error
    }
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()
export default apiClient 