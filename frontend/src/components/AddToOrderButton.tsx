'use client';

import { useState } from 'react';

interface AddToOrderButtonProps {
  onAddToOrder: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function AddToOrderButton({ 
  onAddToOrder, 
  disabled = false, 
  className = '' 
}: AddToOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    
    try {
      await onAddToOrder();
      
      // Mostrar feedback de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error('Error adding to order:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative w-full py-4 px-6 rounded-lg font-semibold text-lg
        transition-all duration-200 transform active:scale-95
        ${disabled || isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : showSuccess
          ? 'bg-green-600 text-white'
          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
        }
        ${className}
      `}
      aria-label="Agregar producto al pedido"
    >
      {/* Contenido del botón */}
      <div className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Agregando...</span>
          </>
        ) : showSuccess ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>¡Agregado!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar a Pedido</span>
          </>
        )}
      </div>

      {/* Efecto de ondas */}
      {!disabled && !isLoading && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
    </button>
  );
} 