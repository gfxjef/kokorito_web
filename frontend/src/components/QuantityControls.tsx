'use client';

import { useState, useEffect } from 'react';

interface QuantityControlsProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  disabled?: boolean;
}

export default function QuantityControls({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 100,
  onQuantityChange,
  disabled = false
}: QuantityControlsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    onQuantityChange?.(quantity);
  }, [quantity, onQuantityChange]);

  const handleDecrease = () => {
    if (quantity > minQuantity && !disabled) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity && !disabled) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700">Cantidad:</span>
      
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        {/* Botón Disminuir */}
        <button
          onClick={handleDecrease}
          disabled={quantity <= minQuantity || disabled}
          className={`p-3 transition-colors duration-200 ${
            quantity <= minQuantity || disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
          aria-label="Disminuir cantidad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Input de Cantidad */}
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
          min={minQuantity}
          max={maxQuantity}
          className={`w-16 py-3 text-center border-0 focus:ring-0 focus:outline-none ${
            disabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'
          }`}
          aria-label="Cantidad del producto"
        />

        {/* Botón Aumentar */}
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity || disabled}
          className={`p-3 transition-colors duration-200 ${
            quantity >= maxQuantity || disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
          aria-label="Aumentar cantidad"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Información adicional */}
      <div className="text-xs text-gray-500">
        (max: {maxQuantity})
      </div>
    </div>
  );
} 