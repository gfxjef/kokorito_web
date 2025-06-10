'use client'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  label?: string
  disabled?: boolean
}

export default function Toggle({
  enabled,
  onChange,
  size = 'md',
  label,
  disabled = false
}: ToggleProps) {
  const sizes = {
    sm: 'h-4 w-7',
    md: 'h-6 w-11',
    lg: 'h-8 w-14'
  }

  const thumbSizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5', 
    lg: 'h-7 w-7'
  }

  const translateX = {
    sm: enabled ? 'translate-x-3' : 'translate-x-0',
    md: enabled ? 'translate-x-5' : 'translate-x-0',
    lg: enabled ? 'translate-x-6' : 'translate-x-0'
  }

  return (
    <div className="flex items-center">
      <button
        type="button"
        className={`
          ${sizes[size]} relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        aria-checked={enabled}
        aria-label={label}
      >
        <span
          className={`
            ${thumbSizes[size]} ${translateX[size]} pointer-events-none relative inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          `}
        />
      </button>
      {label && (
        <span className={`ml-3 text-sm ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label}
        </span>
      )}
    </div>
  )
} 