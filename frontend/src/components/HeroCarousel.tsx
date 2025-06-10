'use client';

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Slide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  buttonText: string
  gradient: string
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://i.ibb.co/S71KgVYh/personalizado-slide.webp",
    title: "Obtén tu Torta",
    subtitle: "Personalizada",
    description: "Crea la torta perfecta para tu celebración especial con diseños únicos",
    buttonText: "🍰 Personalizar Ahora",
    gradient: "from-pink-500 to-primary"
  },
  {
    id: 2,
    image: "https://i.ibb.co/wFpJJrZF/torta-boda.webp",
    title: "Obtén tu Torta", 
    subtitle: "de Boda",
    description: "Diseños elegantes y románticos para el día más especial de tu vida",
    buttonText: "💒 Ver Modelos",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    image: "https://i.ibb.co/8Lzv4YP9/keke-slide.webp",
    title: "Obtén ese delicioso",
    subtitle: "Keke",
    description: "Sabores tradicionales y únicos que conquistarán tu paladar",
    buttonText: "🧁 Pedir Ahora",
    gradient: "from-accent to-orange-500"
  }
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )
  
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  return (
    <section className="relative overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide) => (
            <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
                {/* Imagen de fondo completa */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url("${slide.image}")` }}
                />
                
                {/* Overlay de gradiente para legibilidad */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-75`} />
                
                {/* Overlay oscuro adicional para mejor contraste */}
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 h-full flex items-center">
                  <div className="w-full">
                    
                    {/* Contenido de texto */}
                    <div className="max-w-2xl text-white">
                      <div className="mb-6">
                        <span className="bg-warning text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                          ✨ ESPECIAL KOKORITO
                        </span>
                      </div>
                      
                      <h1 className="text-4xl lg:text-6xl font-bold mb-4 font-['Pacifico'] leading-tight">
                        {slide.title}
                        <br />
                        <span className="text-warning">{slide.subtitle}</span>
                      </h1>
                      
                      <p className="text-xl mb-8 opacity-90 max-w-lg">
                        {slide.description}
                      </p>

                      {/* Características especiales */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                          <div className="flex items-center mb-2">
                            <span className="text-warning text-2xl font-bold">🎂</span>
                            <span className="ml-2 text-sm font-semibold">PREMIUM</span>
                          </div>
                          <p className="text-sm opacity-75">Ingredientes de la más alta calidad</p>
                        </div>
                        
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                          <div className="flex items-center mb-2">
                            <span className="text-warning text-2xl font-bold">24h</span>
                            <span className="ml-2 text-sm font-semibold">ENTREGA</span>
                          </div>
                          <p className="text-sm opacity-75">Preparación rápida y segura</p>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-warning text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg">
                          {slide.buttonText}
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all">
                          📱 WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-6">
          
          {/* Dots indicadores */}
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? 'bg-warning scale-125 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Flechas de navegación */}
          <div className="flex space-x-2">
            <button
              onClick={scrollPrev}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110 border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={scrollNext}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all hover:scale-110 border border-white/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Estilos CSS para Embla */}
      <style jsx>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          position: relative;
        }
      `}</style>
    </section>
  )
} 