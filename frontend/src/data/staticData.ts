import { Product, Category, FeaturedImage, MenuItem } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'Tortas de Cumpleaños', slug: 'tortas-cumpleanos' },
  { id: 2, name: 'Cupcakes Gourmet', slug: 'cupcakes-gourmet' },
  { id: 3, name: 'Keks Personalizados', slug: 'keks-personalizados' },
  { id: 4, name: 'Tortas de Boda', slug: 'tortas-boda' },
  { id: 5, name: 'Postres Especiales', slug: 'postres-especiales' },
];

export const products: Product[] = [
  {
    id: 1,
    title: 'Torta Red Velvet',
    category: 'Tortas Especiales',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    description: 'Deliciosa torta red velvet con frosting de queso crema',
    featured: true
  },
  {
    id: 2,
    title: 'Cupcakes de Fresa',
    category: 'Cupcakes',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop',
    description: 'Suaves cupcakes con frosting de fresa natural',
    featured: true
  },
  {
    id: 3,
    title: 'Kek de Chocolate',
    category: 'Keks',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop',
    description: 'Kek húmedo de chocolate con cobertura de ganache',
    featured: true
  },
  {
    id: 4,
    title: 'Torta de Vainilla',
    category: 'Tortas Clásicas',
    price: 40.00,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop',
    description: 'Clásica torta de vainilla con buttercream',
    featured: true
  },
  {
    id: 5,
    title: 'Cheesecake de Frutos Rojos',
    category: 'Postres Especiales',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    description: 'Cremoso cheesecake con salsa de frutos rojos'
  },
  {
    id: 6,
    title: 'Brownies Premium',
    category: 'Postres Especiales',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop',
    description: 'Brownies con chocolate belga y nueces'
  },
  {
    id: 7,
    title: 'Tres Leches',
    category: 'Tortas Especiales',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    description: 'Tradicional torta tres leches casera'
  },
  {
    id: 8,
    title: 'Macarons Surtidos',
    category: 'Postres Especiales',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop',
    description: 'Deliciosos macarons en varios sabores'
  }
];

export const topProducts: Product[] = products.filter(p => p.featured).slice(0, 5);

export const featuredImages: FeaturedImage[] = [
  {
    id: 1,
    title: 'Tortas Especiales',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Cupcakes Gourmet',
    image: 'https://images.unsplash.com/photo-1599785209781-0b64b8d946f8?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Postres Premium',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop'
  }
];

export const menuItems: MenuItem[] = [
  { id: 1, name: 'Tortas & Keks', href: '/tortas-keks' },
  { id: 2, name: 'Cupcakes', href: '/cupcakes' },
  { id: 3, name: 'Postres Especiales', href: '/postres-especiales' },
  { id: 4, name: 'Tortas de Cumpleaños', href: '/cumpleanos' },
  { id: 5, name: 'Postres Franceses', href: '/franceses' },
  { id: 6, name: 'Cheesecakes & Flanes', href: '/cheesecakes-flanes' },
  { id: 7, name: 'Cookies Gourmet', href: '/cookies' },
  { id: 8, name: 'Bocaditos', href: '/bocaditos' },
  { id: 9, name: 'Otros Menús', href: '/otros' }
];

export const navigationCategories: Category[] = [
  { id: 1, name: 'Category1', slug: 'category1' },
  { id: 2, name: 'Category2', slug: 'category2' },
  { id: 3, name: 'Category3', slug: 'category3' },
  { id: 4, name: 'Category4', slug: 'category4' },
  { id: 5, name: 'Category5', slug: 'category5' }
]; 