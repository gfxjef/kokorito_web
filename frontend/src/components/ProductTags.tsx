import Link from 'next/link';

interface ProductTagsProps {
  tags: string[];
  linkPattern?: string; // Patrón para generar links, ej: "/categoria?tag={tag}"
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProductTags({ 
  tags, 
  linkPattern,
  maxVisible = 10,
  size = 'md' 
}: ProductTagsProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const renderTag = (tag: string, index: number) => {
    const baseClasses = `
      inline-flex items-center rounded-full font-medium
      bg-gray-100 text-gray-800 border border-gray-200
      hover:bg-gray-200 transition-colors duration-200
      ${sizeClasses[size]}
    `;

    if (linkPattern) {
      const href = linkPattern.replace('{tag}', encodeURIComponent(tag.toLowerCase()));
      return (
        <Link
          key={index}
          href={href}
          className={baseClasses}
        >
          {tag}
        </Link>
      );
    }

    return (
      <span
        key={index}
        className={baseClasses.replace('hover:bg-gray-200', '')}
      >
        {tag}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Etiquetas:</span>
      
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(renderTag)}
        
        {hiddenCount > 0 && (
          <span className={`
            inline-flex items-center rounded-full font-medium
            bg-gray-50 text-gray-600 border border-gray-200
            ${sizeClasses[size]}
          `}>
            +{hiddenCount} más
          </span>
        )}
      </div>
    </div>
  );
} 