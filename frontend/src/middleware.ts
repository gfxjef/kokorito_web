import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Solo procesar rutas que empiecen con /api/backend/
  if (request.nextUrl.pathname.startsWith('/api/backend/')) {
    // Extraer la ruta después de /api/backend/
    const apiPath = request.nextUrl.pathname.replace('/api/backend/', '/api/')
    
    // Construir la URL del backend
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
    
    // Validar que la variable de entorno esté configurada
    if (!BACKEND_URL) {
      console.error('❌ NEXT_PUBLIC_API_URL no está configurada en .env')
      return new NextResponse('Backend URL not configured', { status: 500 })
    }
    
    const backendUrl = `${BACKEND_URL}${apiPath}${request.nextUrl.search}`
    
    console.log('🔄 Proxy middleware:', {
      method: request.method,
      originalUrl: request.nextUrl.pathname,
      backendUrl,
      search: request.nextUrl.search
    })

    // Crear headers para el backend
    const headers = new Headers(request.headers)
    const backendHost = BACKEND_URL.replace(/^https?:\/\//, '') // Remover protocolo
    headers.set('host', backendHost)
    
    // Crear la petición al backend
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    })

    // Hacer la petición al backend y devolver la respuesta
    return fetch(backendRequest)
      .then(response => {
        // Crear la respuesta con headers CORS
        const newResponse = new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        })

        console.log('✅ Proxy response:', response.status, response.statusText)
        return newResponse
      })
      .catch(error => {
        console.error('❌ Proxy error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
      })
  }

  // Para todas las demás rutas, continuar normalmente
  return NextResponse.next()
}

export const config = {
  matcher: '/api/backend/:path*',
} 