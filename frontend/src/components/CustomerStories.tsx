'use client';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Organizadora de eventos",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612c84c?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "¡Increíble! La torta de cumpleaños de mi hija superó todas mis expectativas. El diseño de princesa quedó perfecto y el sabor red velvet estaba delicioso. Definitivamente volveré a pedirles.",
    product: "Torta Temática Princesa",
    date: "Hace 2 semanas",
    verified: true
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Gerente de RRHH",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Contratamos a Kokorito para el evento anual de la empresa. 200 cupcakes gourmet que fueron la sensación. Excelente presentación y sabor único. El servicio fue impecable.",
    product: "Paquete Corporativo",
    date: "Hace 1 mes",
    verified: true
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    role: "Novia",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Nuestra torta de boda fue un sueño hecho realidad. Trabajaron con nosotros en cada detalle y el resultado fue espectacular. Todos nuestros invitados quedaron encantados.",
    product: "Torta de Boda 3 Pisos",
    date: "Hace 3 semanas",
    verified: true
  },
  {
    id: 4,
    name: "Roberto Silva",
    role: "Papá",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "El kek de chocolate que pedimos para la familia estaba buenísimo. Perfecto para compartir en casa. La entrega fue rápida y el empaque muy cuidado.",
    product: "Kek Familiar Chocolate",
    date: "Hace 1 semana",
    verified: true
  }
];

export default function CustomerStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Función para verificar si se puede hacer scroll
  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Efectos para verificar scroll al cargar y redimensionar
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  // Funciones de navegación
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4">
            Historias de Nuestros Clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada torta cuenta una historia especial. Lee lo que nuestros clientes satisfechos tienen que decir sobre sus experiencias con Kokorito.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex text-warning text-2xl">
              {'★'.repeat(5)}
            </div>
            <span className="text-xl font-semibold text-text">4.9/5</span>
            <span className="text-gray-600">• +500 reseñas verificadas</span>
          </div>
        </div>

        {/* Layout Desktop: Grid 2 columnas */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-warning text-lg">
                  {'★'.repeat(testimonial.rating)}
                </div>
                {testimonial.verified && (
                  <div className="flex items-center text-accent text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </div>
                )}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Product Info */}
              <div className="bg-pastel-pink rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    📦 {testimonial.product}
                  </span>
                  <span className="text-xs text-gray-600">{testimonial.date}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 bg-cover bg-center rounded-full border-2 border-primary mr-4"
                  style={{
                    backgroundImage: `url(${testimonial.image})`
                  }}
                ></div>
                <div>
                  <h4 className="font-semibold text-text">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layout Mobile: Scroll horizontal con flechas */}
        <div className="lg:hidden mb-12 relative">
          {/* Flecha izquierda */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-primary p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Flecha derecha */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white text-primary p-2 rounded-full shadow-lg border border-gray-200 transition-all hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollRef}
            className="overflow-x-auto hide-scrollbar"
            onScroll={checkScrollability}
          >
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className={`flex-shrink-0 w-80 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 ${index === 0 ? 'ml-4' : ''} ${index === testimonials.length - 1 ? 'mr-4' : ''}`}>
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-warning text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    {testimonial.verified && (
                      <div className="flex items-center text-accent text-xs">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verificado
                      </div>
                    )}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 mb-4 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Product Info */}
                  <div className="bg-pastel-pink rounded-lg p-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">
                        📦 {testimonial.product}
                      </span>
                      <span className="text-xs text-gray-600">{testimonial.date}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 bg-cover bg-center rounded-full border-2 border-primary mr-3"
                      style={{
                        backgroundImage: `url(${testimonial.image})`
                      }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-text text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-text mb-4">
              ¿Ya probaste nuestros productos?
            </h3>
            <p className="text-gray-600 mb-6">
              Comparte tu experiencia y ayuda a otros clientes a descubrir la magia de Kokorito
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors">
                ⭐ Escribir Reseña
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                Ver Más Testimonios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 