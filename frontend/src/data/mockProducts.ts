import { Product } from '../types/Product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Kek de Chocolate Premium',
    description: 'Delicioso kek de chocolate húmedo y esponjoso, elaborado con cacao de primera calidad. Perfecto para cualquier ocasión especial.',
    price: 35,
    quantity: 20,
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop'
    ],
    category: 'Keks',
    subCategory: 'Tradicionales',
    tags: ['Chocolate', 'Premium', 'Húmedo', 'Artesanal'],
    inStock: true,
    relatedProducts: ['2', '3', '4', '5'],
    fillings: ['Chocolate', 'Manjar Blanco', 'Crema Pastelera'],
    sizes: ['Individual', 'Mediano', 'Grande']
  },
  {
    id: '2', 
    name: 'Torta Red Velvet',
    description: 'Clásica torta red velvet con su característico color rojo y sabor único, cubierta con cream cheese frosting.',
    price: 85,
    quantity: 15,
    rating: 6,
    images: [
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop'
    ],
    category: 'Tortas',
    subCategory: 'Ocasiones Especiales', 
    tags: ['Red Velvet', 'Cream Cheese', 'Premium', 'Cumpleaños'],
    inStock: true,
    relatedProducts: ['1', '3', '4', '5'],
    fillings: ['Cream Cheese', 'Manjar Blanco', 'Chocolate'],
    sizes: ['Mediano (8 personas)', 'Grande (15 personas)', 'XL (25+ personas)']
  },
  {
    id: '3',
    name: 'Cupcakes de Vainilla Gourmet',
    description: 'Set de 6 cupcakes de vainilla con buttercream artesanal. Ideales para compartir en reuniones familiares.',
    price: 42,
    quantity: 30,
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop'
    ],
    category: 'Cupcakes',
    subCategory: 'Clásicos',
    tags: ['Vainilla', 'Buttercream', 'Set de 6', 'Artesanal'],
    inStock: true,
    relatedProducts: ['1', '2', '4', '5'],
    fillings: ['Buttercream', 'Manjar Blanco', 'Nutella', 'Mermelada'],
    sizes: ['Set de 6', 'Set de 12', 'Set de 24']
  },
  {
    id: '4',
    name: 'Kek de Manjar Blanco',
    description: 'Tradicional kek peruano relleno de delicioso manjar blanco casero. Un clásico que nunca pasa de moda.',
    price: 38,
    quantity: 18,
    rating: 6,
    images: [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop'
    ],
    category: 'Keks',
    subCategory: 'Rellenos',
    tags: ['Manjar Blanco', 'Tradicional', 'Peruano', 'Casero'],
    inStock: true,
    relatedProducts: ['1', '2', '3', '5'],
    fillings: ['Manjar Blanco', 'Chocolate', 'Crema Pastelera', 'Frutas'],
    sizes: ['Individual', 'Familiar', 'Grande']
  },
  {
    id: '5',
    name: 'Cheesecake de Oreo',
    description: 'Cremoso cheesecake con base de galletas Oreo y toppings de galleta triturada. Una explosión de sabor.',
    price: 65,
    quantity: 12,
    rating: 5,
    images: [
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop'
    ],
    category: 'Postres',
    subCategory: 'Fríos',
    tags: ['Cheesecake', 'Oreo', 'Cremoso', 'Sin Horno'],
    inStock: true,
    relatedProducts: ['1', '2', '3', '4'],
    fillings: ['Oreo', 'Chocolate Blanco', 'Nutella', 'Frutas del Bosque'],
    sizes: ['Individual', 'Mediano', 'Grande']
  }
];

// Función para obtener producto por ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product || !product.relatedProducts) return [];
  
  return product.relatedProducts
    .map(id => getProductById(id))
    .filter(Boolean) as Product[];
};

// Datos mock para categorías (productos de repostería)
export const mockCategories = [
  { id: '1', name: 'Tortas', slug: 'tortas' },
  { id: '2', name: 'Cupcakes', slug: 'cupcakes' },
  { id: '3', name: 'Keks', slug: 'keks' },
  { id: '4', name: 'Postres', slug: 'postres' }
];

export const mockSubCategories = [
  { id: '1', name: 'Ocasiones Especiales', slug: 'ocasiones-especiales', categoryId: '1' },
  { id: '2', name: 'Por Sabor', slug: 'por-sabor', categoryId: '1' },
  { id: '3', name: 'Gourmet', slug: 'gourmet', categoryId: '2' },
  { id: '4', name: 'Clásicos', slug: 'clasicos', categoryId: '2' },
  { id: '5', name: 'Tradicionales', slug: 'tradicionales', categoryId: '3' },
  { id: '6', name: 'Rellenos', slug: 'rellenos', categoryId: '3' },
  { id: '7', name: 'Fríos', slug: 'frios', categoryId: '4' },
  { id: '8', name: 'Tradicionales', slug: 'tradicionales-postres', categoryId: '4' }
];

// Rellenos disponibles con imágenes
export const availableFillings = [
  { 
    id: '1', 
    name: 'Chocolate', 
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
    description: 'Chocolate premium' 
  },
  { 
    id: '2', 
    name: 'Manjar Blanco', 
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=100&h=100&fit=crop',
    description: 'Manjar blanco casero' 
  },
  { 
    id: '3', 
    name: 'Oreo', 
    image: 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=100&h=100&fit=crop',
    description: 'Crema de Oreo' 
  },
  { 
    id: '4', 
    name: 'Nutella', 
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=100&h=100&fit=crop',
    description: 'Nutella premium' 
  },
  { 
    id: '5', 
    name: 'Frutas', 
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop',
    description: 'Frutas frescas' 
  },
  { 
    id: '6', 
    name: 'Crema Pastelera', 
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=100&h=100&fit=crop',
    description: 'Crema pastelera tradicional' 
  }
]; 