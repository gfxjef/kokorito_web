/** @type {import('next').NextConfig} */

// Obtener la URL de la API desde las variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL

// Validar que la variable esté configurada
if (!API_URL) {
  throw new Error('❌ NEXT_PUBLIC_API_URL no está configurada. Configúrala en Vercel Dashboard > Settings > Environment Variables')
}

console.log('✅ API_URL configurada:', API_URL)

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  eslint: {
    // Permitir warnings durante el build
    ignoreDuringBuilds: false,
  },
  async rewrites() {
    console.log('🔧 Configurando rewrite con URL:', API_URL)
    return [
      {
        source: '/api/backend/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        // Aplicar headers CORS para rutas del proxy
        source: '/api/backend/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig 