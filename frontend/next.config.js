/** @type {import('next').NextConfig} */
const { readFileSync } = require('fs')
const { join } = require('path')

// Función para cargar .env manualmente
function loadEnvLocal() {
  try {
    const envPath = join(__dirname, '.env')
    const envFile = readFileSync(envPath, 'utf8')
    const envLines = envFile.split('\n').filter(line => line.trim() && !line.startsWith('#'))
    
    const envVars = {}
    envLines.forEach(line => {
      const equalsIndex = line.indexOf('=')
      if (equalsIndex > 0) {
        const key = line.substring(0, equalsIndex).trim()
        const value = line.substring(equalsIndex + 1).trim()
        if (key && value) {
          envVars[key] = value
        }
      }
    })
    
    console.log('📄 Variables cargadas desde .env.local:', Object.keys(envVars))
    return envVars
  } catch (error) {
    console.error('❌ Error: No se pudo cargar .env.local:', error.message)
    throw new Error('Crea el archivo .env.local con NEXT_PUBLIC_API_URL')
  }
}

const envVars = loadEnvLocal()
const API_URL = envVars.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL

// Validar que la variable esté configurada
if (!API_URL) {
  throw new Error('❌ NEXT_PUBLIC_API_URL no está configurada en .env.local')
}

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'picsum.photos'],
  },
  env: {
    NEXT_PUBLIC_API_URL: API_URL,
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