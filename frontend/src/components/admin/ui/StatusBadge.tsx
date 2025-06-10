interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'featured' | 'available' | 'unavailable' | 'premium' | 'public' | 'private'
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusBadge({ status, text, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          text: text || 'Activo'
        }
      case 'inactive':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          text: text || 'Inactivo'
        }
      case 'featured':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: text || 'Destacado'
        }
      case 'available':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          text: text || 'Disponible'
        }
      case 'unavailable':
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: text || 'No disponible'
        }
      case 'premium':
        return { 
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          text: text || 'Premium'
        }
      case 'public':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          text: text || 'Público'
        }
      case 'private':
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: text || 'Privado'
        }
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: text || 'Sin estado'
        }
    }
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }

  const config = getStatusConfig()

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${config.color}
      ${sizes[size]}
    `}>
      {config.text}
    </span>
  )
} 