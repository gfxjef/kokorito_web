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

  // Obtener la imagen del slide actual
  const currentSlideImage = slides[selectedIndex]?.image || slides[0].image

  return (
    <section className="relative overflow-visible min-h-[526px] lg:min-h-[700px]">
      {/* Slides principales */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide) => (
            <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0">
              <div className="relative min-h-[450px] lg:min-h-[600px] overflow-hidden">
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

                      {/* Características especiales - Solo visible en desktop */}
                      <div className="hidden lg:flex flex-col sm:flex-row gap-4 mb-8">
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

      {/* SVG Overlay Fijo - Solo visible en desktop */}
      <div 
        className="hidden lg:block absolute z-30 pointer-events-none"
        style={{
          width: '733px',
          height: '688px', 
          top: 'calc(50% - 380px)', // Posicionamiento ajustado para mejor integración visual
          left: '46%', // Ajustado para mejor posicionamiento visual
          transform: 'translateX(0)' // Sin desplazamiento adicional
        }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1891.12 1770.13" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Patrón con la imagen del slide actual */}
            <pattern 
              id="slideImagePattern"
              patternUnits="objectBoundingBox" 
              width="1" 
              height="1"
            >
              <image 
                href={currentSlideImage} 
                x="0"
                y="0" 
                width="100%" 
                height="100%" 
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          </defs>
          
          {/* Path principal del SVG con la imagen como relleno */}
          <path 
            fill="url(#slideImagePattern)"
            d="M.83,854.32h.04c-.16,4.79-.24,9.57-.15,14.33.76,41.12,17.21,82.16,30.02,108.09,8.29,16.79,15.07,27.26,15.07,27.26,0,0-3.38,7.34-4.89,18.08-3.33,23.72-1.35,47.22,5.3,68.8,11.84,38.41,38.52,70.75,76.73,87.38.12,10.66,5.23,19.04,11.89,25.44-21.96,46.82-22.2,95.64-17.09,127.46,0,.02,0,.05.01.07h0c-.29,3.15-.55,6.34-.72,9.63-5.88,160.51,141.94,158.34,158.34,158.34,0,0,16.55,62.31,79.61,102.12-6.14,85.13,7.76,104.85,42.79,144.21,36.41,40.92,89.94,25.37,85.78-7.02-4.16-32.38-9.14-44.69,55.26-57.07,45.13-8.68,53.75-45.72,54.87-67.12,28.07-12.22,41.79-25.4,41.79-25.4,0,0,59.5,66.22,217.95,88.5,250.72,35.25,497.87-82.09,592.91-260.29,80.9-33.19,198.07-104.69,220.5-308.73,66.23-9.46,117.39-20.25,191.19-108.59,37.91-45.38,54.5-103.19,47.71-157.95-.01-.11-.04-.22-.05-.33,3.83-30.61,7.98-84.27-57.85-159.67.01-.02.03-.03.04-.05,34.53-44.12,60.01-119.2,51.01-178.43-11.17-73.5-49.76-193.87-185.87-213-79.88-11.23-129.35.8-156.59,12.66h0c-10.87-23.29-50.88-90.49-150.76-132.88-83.71-32.62-136.31-14.41-136.31-14.41,0,0-59.63-128.33-228.82-152.11-169.19-23.79-256.94,76.47-269.59,96.58-68.69-33.63-215.9-39.53-291.64,50.58-43.79,48.21-56.72,73.5-56.72,73.5,0,0-162.58-4.05-205.66,154.07-20.7,80.47,10.54,163.99,10.54,163.99h0c1.56,5.44,3.25,10.71,5.03,15.82-27.72.27-120.14,9.24-178.07,112.16C-8.86,736.73.83,854.32.83,854.32Z"
          />
        </svg>
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
          min-width: 0;
        }
      `}</style>
    </section>
  )
} 