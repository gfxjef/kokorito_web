'use client';

import { useState, useEffect } from 'react';
import { TamañoOpcion } from '@/types/Product';

interface SizeSelectorProps {
  tamaños: TamañoOpcion[];
  onSizeChange: (tamaño: TamañoOpcion) => void;
  selectedSize?: TamañoOpcion;
  precioBase: number;
}

export default function SizeSelector({ 
  tamaños, 
  onSizeChange, 
  selectedSize,
  precioBase
}: SizeSelectorProps) {
  const [currentSize, setCurrentSize] = useState(selectedSize || (tamaños.length > 0 ? tamaños[0] : null));

  // Sincronizar con selectedSize cuando cambie desde el padre
  useEffect(() => {
    if (selectedSize && selectedSize.id !== currentSize?.id) {
      setCurrentSize(selectedSize);
    }
  }, [selectedSize, currentSize?.id]);

  // Manejar cambios en la lista de tamaños
  useEffect(() => {
    if (!currentSize && tamaños.length > 0) {
      setCurrentSize(tamaños[0]);
    }
  }, [tamaños, currentSize]);

  const handleSizeSelect = (tamaño: TamañoOpcion) => {
    setCurrentSize(tamaño);
    onSizeChange(tamaño);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calcularPrecioConTamaño = (tamaño: TamañoOpcion) => {
    return (precioBase * tamaño.multiplicadorPrecio) + tamaño.precioAdicional;
  };

  if (!tamaños || tamaños.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-base font-medium text-gray-700">Tamaño:</span>
        <span className="text-base font-semibold" style={{ color: '#FF6B9D' }}>
          {currentSize?.name}
        </span>
      </div>

      {/* Opciones de tamaño */}
      <div className="space-y-2">
        {tamaños.map((tamaño) => {
          const isSelected = currentSize?.id === tamaño.id;
          const precioCalculado = calcularPrecioConTamaño(tamaño);
          
          return (
            <button
              key={tamaño.id}
              onClick={() => handleSizeSelect(tamaño)}
              className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                isSelected 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {/* Icono del tamaño */}
                    {tamaño.icono && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: tamaño.color || '#FF6B9D' }}
                      >
                        {tamaño.icono}
                      </div>
                    )}
                    
                    <div>
                      <h4 className={`font-medium text-sm ${isSelected ? 'text-pink-700' : 'text-gray-900'}`}>
                        {tamaño.name}
                      </h4>
                      <p className="text-xs text-gray-500">{tamaño.description}</p>
                    </div>
                  </div>
                  
                  {/* Información adicional */}
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-400">
                    {tamaño.porciones && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {tamaño.porciones} personas
                      </span>
                    )}
                    {tamaño.diametro && (
                      <span>⌀ {tamaño.diametro}cm</span>
                    )}
                    {tamaño.peso && (
                      <span>{tamaño.peso}g</span>
                    )}
                  </div>
                </div>
                
                {/* Precio y selección */}
                <div className="text-right ml-4">
                  <div className={`font-bold ${isSelected ? 'text-pink-600' : 'text-gray-900'}`}>
                    {formatPrice(precioCalculado)}
                  </div>
                  {tamaño.multiplicadorPrecio !== 1 && (
                    <div className="text-xs text-gray-400">
                      Base × {tamaño.multiplicadorPrecio}
                    </div>
                  )}
                  {tamaño.precioAdicional > 0 && (
                    <div className="text-xs text-gray-400">
                      + {formatPrice(tamaño.precioAdicional)}
                    </div>
                  )}
                  
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="mt-1 inline-block">
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 