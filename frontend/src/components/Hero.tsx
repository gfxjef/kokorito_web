'use client';

export default function Hero() {
  return (
    <section className="bg-background py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            {/* Content Side */}
            <div className="flex-1 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
                Strawberry Cupcakes
              </h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Nuestros deliciosos cupcakes con sabor fresco son elaborados diariamente 
                con ingredientes de primera calidad. Una explosión de sabor que conquistará 
                tus sentidos en cada bocado.
              </p>
              <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-accent transition-colors duration-200 shadow-md">
                Shop Now →
              </button>
            </div>
            
            {/* Image Side */}
            <div className="flex-1 relative h-80 md:h-96">
              <div 
                className="w-full h-full bg-cover bg-center rounded-r-2xl"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&h=400&fit=crop)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 rounded-r-2xl"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3, 4].map((dot) => (
            <button
              key={dot}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                dot === 1 ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 