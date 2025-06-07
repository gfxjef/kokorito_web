export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  featured?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface FeaturedImage {
  id: number;
  title: string;
  image: string;
  link?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  href: string;
  icon?: string;
} 