'use client';

const categories = [
  {
    id: 1,
    name: "Keks Artesanales",
    title: "Los mejores keks caseros",
    subtitle: "Tradición familiar en cada bocado",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=400&fit=crop",
    bgColor: "from-orange-400 to-orange-600",
    products: [
      {
        id: 1,
        name: "Kek de Chocolate Premium",
        price: "S/ 45.00",
        originalPrice: "S/ 60.00",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
        discount: "25%",
        rating: 4.8,
        reviews: 127
      },
      {
        id: 2,
        name: "Kek de Vainilla Clásico",
        price: "S/ 38.00",
        originalPrice: "S/ 50.00",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300&h=200&fit=crop",
        discount: "24%",
        rating: 4.9,
        reviews: 89
      },
      {
        id: 3,
        name: "Kek Marmoleado",
        price: "S/ 42.00",
        originalPrice: "S/ 55.00",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop",
        discount: "24%",
        rating: 4.7,
        reviews: 156
      },
      {
        id: 4,
        name: "Kek de Limón",
        price: "S/ 40.00",
        originalPrice: "S/ 52.00",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop",
        discount: "23%",
        rating: 4.6,
        reviews: 94
      }
    ]
  },
  {
    id: 2,
    name: "Tortas Personalizadas",
    title: "Tortas únicas para momentos especiales",
    subtitle: "Diseños exclusivos a tu medida",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    bgColor: "from-pink-400 to-pink-600",
    products: [
      {
        id: 5,
        name: "Torta Red Velvet 3 Pisos",
        price: "S/ 180.00",
        originalPrice: "S/ 220.00",
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=300&h=200&fit=crop",
        discount: "18%",
        rating: 5.0,
        reviews: 73
      },
      {
        id: 6,
        name: "Torta Temática Infantil",
        price: "S/ 120.00",
        originalPrice: "S/ 150.00",
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop",
        discount: "20%",
        rating: 4.9,
        reviews: 168
      },
      {
        id: 7,
        name: "Torta de Boda Elegante",
        price: "S/ 350.00",
        originalPrice: "S/ 420.00",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop",
        discount: "17%",
        rating: 5.0,
        reviews: 45
      },
      {
        id: 8,
        name: "Torta Cumpleaños Adulto",
        price: "S/ 95.00",
        originalPrice: "S/ 115.00",
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop",
        discount: "17%",
        rating: 4.8,
        reviews: 201
      }
    ]
  },
  {
    id: 3,
    name: "Cupcakes Gourmet",
    title: "Pequeñas obras de arte comestibles",
    subtitle: "Sabores únicos en cada bocado",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&h=400&fit=crop",
    bgColor: "from-purple-400 to-purple-600",
    products: [
      {
        id: 9,
        name: "Cupcakes Red Velvet (6 und)",
        price: "S/ 36.00",
        originalPrice: "S/ 45.00",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=300&h=200&fit=crop",
        discount: "20%",
        rating: 4.9,
        reviews: 234
      },
      {
        id: 10,
        name: "Cupcakes Oreo (12 und)",
        price: "S/ 68.00",
        originalPrice: "S/ 84.00",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop",
        discount: "19%",
        rating: 4.8,
        reviews: 187
      },
      {
        id: 11,
        name: "Cupcakes Ferrero (6 und)",
        price: "S/ 48.00",
        originalPrice: "S/ 60.00",
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=200&fit=crop",
        discount: "20%",
        rating: 5.0,
        reviews: 145
      },
      {
        id: 12,
        name: "Cupcakes Temáticos (12 und)",
        price: "S/ 72.00",
        originalPrice: "S/ 90.00",
        image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=300&h=200&fit=crop",
        discount: "20%",
        rating: 4.7,
        reviews: 298
      }
    ]
  },
  {
    id: 4,
    name: "Postres Especiales",
    title: "Postres que conquistan paladares",
    subtitle: "Sabores internacionales y únicos",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
    bgColor: "from-teal-400 to-teal-600",
    products: [
      {
        id: 13,
        name: "Cheesecake de Fresa",
        price: "S/ 65.00",
        originalPrice: "S/ 80.00",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop",
        discount: "19%",
        rating: 4.9,
        reviews: 167
      },
      {
        id: 14,
        name: "Tiramisú Individual",
        price: "S/ 28.00",
        originalPrice: "S/ 35.00",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop",
        discount: "20%",
        rating: 4.8,
        reviews: 203
      },
      {
        id: 15,
        name: "Tres Leches Premium",
        price: "S/ 55.00",
        originalPrice: "S/ 70.00",
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=200&fit=crop",
        discount: "21%",
        rating: 5.0,
        reviews: 124
      },
      {
        id: 16,
        name: "Macarons Franceses (12 und)",
        price: "S/ 85.00",
        originalPrice: "S/ 105.00",
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=300&h=200&fit=crop",
        discount: "19%",
        rating: 4.7,
        reviews: 89
      }
    ]
  }
];

export default function CategoriesGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Imagen Promocional Izquierda */}
              <div className={`lg:w-80 h-64 lg:h-auto bg-gradient-to-br ${category.bgColor} relative flex-shrink-0`}>
                <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                  <div className="mb-4">
                    <span className="bg-warning text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Ofertas del día
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                    {category.name}
                  </h2>
                  <h3 className="text-lg font-medium mb-1 opacity-90">
                    {category.title}
                  </h3>
                  <p className="text-sm opacity-80 mb-4">
                    {category.subtitle}
                  </p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-fit">
                    Ver todos
                  </button>
                </div>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{
                    backgroundImage: `url(${category.image})`
                  }}
                ></div>
              </div>

              {/* Productos Derecha - Carrusel Horizontal */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.products.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Imagen del producto */}
                        <div className="relative">
                          <div 
                            className="h-40 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                            style={{
                              backgroundImage: `url(${product.image})`
                            }}
                          ></div>
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {product.discount} OFF
                            </div>
                          )}
                          <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-colors">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Info del producto */}
                        <div className="p-3">
                          <h4 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h4>
                          
                          {/* Rating */}
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400 text-xs">
                              {'★'.repeat(Math.floor(product.rating))}
                            </div>
                            <span className="text-xs text-gray-600 ml-1">
                              ({product.reviews})
                            </span>
                          </div>

                          {/* Precios */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                {product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-1">
                                  {product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Envío gratis */}
                          <div className="text-xs text-green-600 mt-1">
                            Envío gratis
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 