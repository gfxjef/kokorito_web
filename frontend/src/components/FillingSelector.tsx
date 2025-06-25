'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RellenoOpcion } from '@/types/Product';

interface FillingSelectorProps {
  rellenos: RellenoOpcion[];
  onFillingChange: (relleno: RellenoOpcion) => void;
  selectedFilling?: RellenoOpcion;
}

export default function FillingSelector({ 
  rellenos, 
  onFillingChange, 
  selectedFilling 
}: FillingSelectorProps) {
  const [currentFilling, setCurrentFilling] = useState(selectedFilling || (rellenos.length > 0 ? rellenos[0] : null));

  // Sincronizar con selectedFilling cuando cambie desde el padre
  useEffect(() => {
    if (selectedFilling && selectedFilling.id !== currentFilling?.id) {
      setCurrentFilling(selectedFilling);
    }
  }, [selectedFilling, currentFilling?.id]);

  // Manejar cambios en la lista de rellenos
  useEffect(() => {
    if (!currentFilling && rellenos.length > 0) {
      setCurrentFilling(rellenos[0]);
    }
  }, [rellenos, currentFilling]);

  const handleFillingSelect = (relleno: RellenoOpcion) => {
    setCurrentFilling(relleno);
    onFillingChange(relleno);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!rellenos || rellenos.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-base font-medium text-gray-700">Relleno:</span>
        <span className="text-base font-semibold" style={{ color: '#FF6B9D' }}>
          {currentFilling?.name}
        </span>
        {/* Mostrar precio adicional si existe */}
        {currentFilling && currentFilling.precioAdicional > 0 && (
          <span className="text-sm text-gray-600">
            (+ {formatPrice(currentFilling.precioAdicional)})
          </span>
        )}
      </div>

      {/* Grid de rellenos con imágenes */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {rellenos.map((relleno) => {
          const isSelected = currentFilling?.id === relleno.id;
          
          return (
            <button
              key={relleno.id}
              onClick={() => handleFillingSelect(relleno)}
              className="relative group"
              aria-label={`Seleccionar relleno de ${relleno.name}`}
            >
              {/* Container de imagen */}
              <div 
                className={`w-full aspect-square rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                  isSelected 
                    ? 'border-pink-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {relleno.image ? (
                  <Image
                    src={relleno.image}
                    alt={relleno.name}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: relleno.color || '#E5E7EB' }}
                  >
                    {relleno.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Nombre del relleno */}
              <div className="mt-2 text-center">
                <span 
                  className={`text-xs font-medium ${
                    isSelected 
                      ? 'text-pink-600' 
                      : 'text-gray-600'
                  }`}
                >
                  {relleno.name}
                </span>
                
                {/* Precio adicional */}
                {relleno.precioAdicional > 0 && (
                  <div className="text-xs text-gray-500">
                    + {formatPrice(relleno.precioAdicional)}
                  </div>
                )}
              </div>

              {/* Indicador de selección */}
              {isSelected && (
                <div 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF6B9D' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Descripción del relleno seleccionado - más minimalista */}
      {currentFilling && currentFilling.description && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Relleno seleccionado:</span> {currentFilling.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {currentFilling.description}
          </p>
          
          {/* Información nutricional en línea */}
          {(currentFilling.containsLactose || currentFilling.isVegan) && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              {currentFilling.containsLactose && (
                <span>Contiene lactosa</span>
              )}
              {currentFilling.isVegan && (
                <span>🌱 Vegano</span>
              )}
            </div>
          )}

          {currentFilling.precioAdicional > 0 && (
            <div className="text-xs text-gray-600 mt-2">
              <strong>Precio adicional:</strong> {formatPrice(currentFilling.precioAdicional)}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 