'use client';
import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    badge: "🎂 ESPECIAL DEL MES",
    title: "TORTAS",
    highlight: "PERSONALIZADAS",
    description: "Crea la torta perfecta para tu celebración especial",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    features: [
      { icon: "50%", label: "DESCUENTO", detail: "En tu primera torta personalizada" },
      { icon: "24h", label: "ENTREGA", detail: "Preparamos tu torta en tiempo record" }
    ],
    primaryBtn: "🍰 Personalizar Ahora",
    secondaryBtn: "Ver Galería",
    gradient: "from-pink-500 to-primary"
  },
  {
    id: 2,
    badge: "🧁 NUEVO SABOR",
    title: "CUPCAKES",
    highlight: "GOURMET",
    description: "Descubre nuestros nuevos sabores únicos y deliciosos",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&h=400&fit=crop",
    features: [
      { icon: "30%", label: "DESCUENTO", detail: "En paquetes de 12 cupcakes" },
      { icon: "5★", label: "CALIDAD", detail: "Ingredientes premium importados" }
    ],
    primaryBtn: "🧁 Pedir Ahora",
    secondaryBtn: "Ver Sabores",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    badge: "🏢 CORPORATIVO",
    title: "SERVICIOS",
    highlight: "EMPRESARIALES",
    description: "Endulza tus eventos corporativos con nuestros productos",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&h=400&fit=crop",
    features: [
      { icon: "100+", label: "EMPRESAS", detail: "Confían en nuestros servicios" },
      { icon: "15%", label: "DESCUENTO", detail: "En pedidos corporativos" }
    ],
    primaryBtn: "💼 Cotizar Ahora",
    secondaryBtn: "Ver Casos",
    gradient: "from-accent to-teal-500"
  }
];

export default function PromoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className={`bg-gradient-to-r ${currentSlideData.gradient} py-16 px-4 transition-all duration-1000`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Content Side */}
          <div className="flex-1 text-white mb-8 lg:mb-0 lg:pr-12">
            <div className="mb-4">
              <span className="bg-warning text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                {currentSlideData.badge}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              {currentSlideData.title}
              <br />
              <span className="text-warning">{currentSlideData.highlight}</span>
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {currentSlideData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center mb-2">
                    <span className="text-warning text-2xl font-bold">{feature.icon}</span>
                    <span className="ml-2 text-sm">{feature.label}</span>
                  </div>
                  <p className="text-sm opacity-75">{feature.detail}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-warning text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors transform hover:scale-105">
                {currentSlideData.primaryBtn}
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-colors">
                {currentSlideData.secondaryBtn}
              </button>
            </div>
          </div>

          {/* Image Side */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full bg-white/20 rounded-2xl"></div>
              <div 
                className="relative bg-cover bg-center h-96 rounded-2xl shadow-2xl transition-all duration-1000"
                style={{
                  backgroundImage: `url(${currentSlideData.image})`
                }}
              >
                <div className="absolute top-4 right-4 bg-warning text-gray-900 px-3 py-2 rounded-full font-bold text-sm">
                  ¡Nuevo!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          {/* Dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-warning scale-125' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex space-x-2 ml-6">
            <button
              onClick={() => goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 