'use client';

import { useState } from 'react';
import Image from 'next/image';
import { availableFillings } from '@/data/mockProducts';

interface FillingSelectorProps {
  productFillings: string[];
  onFillingChange: (filling: string) => void;
  selectedFilling?: string;
}

export default function FillingSelector({ 
  productFillings, 
  onFillingChange, 
  selectedFilling 
}: FillingSelectorProps) {
  const [currentFilling, setCurrentFilling] = useState(selectedFilling || productFillings[0]);

  // Filtrar solo los rellenos disponibles para este producto
  const availableForProduct = availableFillings.filter(filling => 
    productFillings.includes(filling.name)
  );

  const handleFillingSelect = (fillingName: string) => {
    setCurrentFilling(fillingName);
    onFillingChange(fillingName);
  };

  if (!productFillings || productFillings.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-lg font-semibold text-gray-800">Relleno:</span>
        <span className="text-lg font-bold" style={{ color: '#FF6B9D' }}>
          {currentFilling}
        </span>
      </div>

      {/* Grid de rellenos con imágenes */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {availableForProduct.map((filling) => {
          const isSelected = currentFilling === filling.name;
          
          return (
            <button
              key={filling.id}
              onClick={() => handleFillingSelect(filling.name)}
              className={`relative group transition-all duration-200 transform hover:scale-105 ${
                isSelected ? 'scale-105' : ''
              }`}
              aria-label={`Seleccionar relleno de ${filling.name}`}
            >
              {/* Container de imagen */}
              <div 
                className={`w-20 h-20 rounded-xl border-3 overflow-hidden transition-all duration-200 ${
                  isSelected 
                    ? 'shadow-lg' 
                    : 'border-gray-200 hover:border-teal-400'
                }`}
                style={{
                  borderColor: isSelected ? '#FF6B9D' : '#e5e7eb'
                }}
              >
                <Image
                  src={filling.image}
                  alt={filling.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Nombre del relleno */}
              <div className="mt-2 text-center">
                <span 
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isSelected 
                      ? 'text-pink-600' 
                      : 'text-gray-600 group-hover:text-teal-600'
                  }`}
                >
                  {filling.name}
                </span>
              </div>

              {/* Indicador de selección */}
              {isSelected && (
                <div 
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF6B9D' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 rounded-xl bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
            </button>
          );
        })}
      </div>

      {/* Descripción del relleno seleccionado */}
      {currentFilling && (
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-pink-800">
                <span className="font-medium">Relleno seleccionado:</span> {' '}
                {availableForProduct.find(f => f.name === currentFilling)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 