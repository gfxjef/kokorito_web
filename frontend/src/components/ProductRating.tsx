interface ProductRatingProps {
  rating: number; // Valor entre 0 y 6
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductRating({ rating, maxRating = 6, size = 'md' }: ProductRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const circles = Array.from({ length: maxRating }, (_, index) => {
    const isFilled = index < rating;
    
    return (
      <div
        key={index}
        className={`${sizeClasses[size]} rounded-full border-2 transition-all duration-200 ${
          isFilled
            ? 'bg-black border-black'
            : 'bg-white border-gray-300'
        }`}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 mr-2">Relleno:</span>
      <div className="flex items-center space-x-1" role="img" aria-label={`Calificación: ${rating} de ${maxRating}`}>
        {circles}
      </div>
      <span className="text-sm text-gray-500 ml-2">
        ({rating}/{maxRating})
      </span>
    </div>
  );
} 