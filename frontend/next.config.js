/** @type {import('next').NextConfig} */
const { readFileSync } = require('fs')
const { join } = require('path')

// Función para cargar .env manualmente solo en desarrollo
function loadEnvLocal() {
  // Solo intentar cargar .env en desarrollo local
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log('🚀 Ejecutándose en Vercel/Production - usando variables de entorno del sistema')
    return {}
  }

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
    
    console.log('📄 Variables cargadas desde .env:', Object.keys(envVars))
    return envVars
  } catch (error) {
    console.warn('⚠️ Advertencia: No se pudo cargar .env local:', error.message)
    console.log('💡 Tip: Crea el archivo .env con NEXT_PUBLIC_API_URL para desarrollo local')
    return {}
  }
}

// Cargar variables de entorno
const envVars = loadEnvLocal()

// Obtener API_URL desde variables locales o del sistema
const API_URL = envVars.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL

// Validar que la variable esté configurada
if (!API_URL) {
  const errorMsg = process.env.VERCEL 
    ? '❌ NEXT_PUBLIC_API_URL no está configurada en Vercel. Ve a Dashboard > Project > Settings > Environment Variables'
    : '❌ NEXT_PUBLIC_API_URL no está configurada. Crea el archivo .env con NEXT_PUBLIC_API_URL'
  
  console.error(errorMsg)
  throw new Error(errorMsg)
}

console.log('✅ API_URL configurada:', API_URL)

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