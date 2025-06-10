'use client';
import { useState, useEffect } from 'react';
import { categoriaService, transformers } from '@/services/api';

// Iconos predefinidos para categorías
const categoryIcons = {
  1: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
      <circle cx="12" cy="12" r="10" className="fill-primary/20 stroke-primary"/>
      <path d="M8 12h8M10 8h4M10 16h4" className="stroke-primary" strokeWidth={2}/>
    </svg>
  ),
  2: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} className="fill-primary/20 stroke-primary" d="M8 20h8a2 2 0 002-2V10a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="stroke-primary" d="M7 10V6a5 5 0 0110 0v4"/>
      <circle cx="12" cy="6" r="1" className="fill-primary"/>
    </svg>
  ),
  3: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="4" y="8" width="16" height="12" rx="2" className="fill-primary/20 stroke-primary" strokeWidth={1.5}/>
      <path d="M8 8V6a4 4 0 118 0v2" className="stroke-primary" strokeWidth={2}/>
      <circle cx="10" cy="14" r="1" className="fill-primary"/>
      <circle cx="14" cy="14" r="1" className="fill-primary"/>
    </svg>
  ),
  4: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} className="fill-primary/20 stroke-primary" d="M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="stroke-primary" d="M8 12h8M12 8v8"/>
    </svg>
  )
};

// Subcategorías por defecto basadas en el tipo de categoría
const defaultSubcategories = {
  1: { // Tortas
    "Ocasiones Especiales": {
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop",
      items: [
        { name: "Cumpleaños", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop" },
        { name: "Boda", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop" },
        { name: "Aniversarios", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop" },
        { name: "Graduaciones", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop" }
      ]
    },
    "Por Sabor": {
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      items: [
        { name: "Red Velvet", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
        { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
        { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
        { name: "Tres Leches", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" }
      ]
    }
  },
  2: { // Cupcakes
    "Gourmet": {
      image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
      items: [
        { name: "Red Velvet", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" },
        { name: "Lemon", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
        { name: "Oreo", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
        { name: "Ferrero", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop" }
      ]
    },
    "Clásicos": {
      image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
      items: [
        { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
        { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
        { name: "Fresa", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
        { name: "Zanahoria", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" }
      ]
    }
  },
  3: { // Keks
    "Tradicionales": {
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      items: [
        { name: "Kek de Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
        { name: "Kek de Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
        { name: "Kek Marmoleado", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
        { name: "Kek de Limón", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
      ]
    },
    "Rellenos": {
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
      items: [
        { name: "Manjar Blanco", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
        { name: "Crema Pastelera", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
        { name: "Frutas", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
        { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" }
      ]
    }
  },
  4: { // Postres
    "Fríos": {
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
      items: [
        { name: "Cheesecakes", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop" },
        { name: "Tiramisú", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
        { name: "Panna Cotta", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
        { name: "Mousse", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" }
      ]
    },
    "Tradicionales": {
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
      items: [
        { name: "Tres Leches", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
        { name: "Suspiro Limeño", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
        { name: "Mazamorra", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
        { name: "Arroz con Leche", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
      ]
    }
  }
};

interface CategoryData {
  id: number;
  name: string;
  icon: any;
  image: string;
  subcategories: any;
}

const staticCategories = [
  {
    id: 1,
    name: "Tortas",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        <circle cx="12" cy="12" r="10" className="fill-primary/20 stroke-primary"/>
        <path d="M8 12h8M10 8h4M10 16h4" className="stroke-primary" strokeWidth={2}/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    subcategories: {
      "Ocasiones Especiales": {
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop",
        items: [
          { name: "Cumpleaños", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop" },
          { name: "Boda", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop" },
          { name: "Aniversarios", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop" },
          { name: "Graduaciones", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop" },
          { name: "Baby Shower", image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=300&fit=crop" }
        ]
      },
      "Por Sabor": {
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        items: [
          { name: "Red Velvet", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
          { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Tres Leches", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
          { name: "Cheesecake", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop" }
        ]
      },
      "Por Tamaño": {
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
        items: [
          { name: "Individual", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Mediana (8 personas)", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Grande (15 personas)", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop" },
          { name: "XL (25+ personas)", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop" }
        ]
      },
      "Temáticas": {
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
        items: [
          { name: "Infantiles", image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=300&fit=crop" },
          { name: "Princesas", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop" },
          { name: "Superhéroes", image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop" },
          { name: "Unicornios", image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400&h=300&fit=crop" },
          { name: "Flores", image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&h=300&fit=crop" }
        ]
      }
    }
  },
  {
    id: 2,
    name: "Cupcakes",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} className="fill-primary/20 stroke-primary" d="M8 20h8a2 2 0 002-2V10a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="stroke-primary" d="M7 10V6a5 5 0 0110 0v4"/>
        <circle cx="12" cy="6" r="1" className="fill-primary"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
    subcategories: {
      "Gourmet": {
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
        items: [
          { name: "Red Velvet", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" },
          { name: "Lemon", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Oreo", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
          { name: "Ferrero Rocher", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop" },
          { name: "Nutella", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" }
        ]
      },
      "Clásicos": {
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop",
        items: [
          { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Fresa", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Zanahoria", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Coco", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" }
        ]
      },
      "Especiales": {
        image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop",
        items: [
          { name: "Sin Gluten", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" },
          { name: "Veganos", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Sin Azúcar", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop" },
          { name: "Keto", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
          { name: "Proteína", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" }
        ]
      },
      "Decorados": {
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop",
        items: [
          { name: "Fondant", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
          { name: "Buttercream", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=300&fit=crop" },
          { name: "Flores", image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=300&fit=crop" },
          { name: "Personalizados", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Temáticos", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" }
        ]
      }
    }
  },
  {
    id: 3,
    name: "Keks",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="4" y="8" width="16" height="12" rx="2" className="fill-primary/20 stroke-primary" strokeWidth={1.5}/>
        <path d="M8 8V6a4 4 0 118 0v2" className="stroke-primary" strokeWidth={2}/>
        <circle cx="10" cy="14" r="1" className="fill-primary"/>
        <circle cx="14" cy="14" r="1" className="fill-primary"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop",
    subcategories: {
      "Tradicionales": {
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        items: [
          { name: "Kek de Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Kek de Vainilla", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Kek Marmoleado", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
          { name: "Kek de Limón", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
        ]
      },
      "Rellenos": {
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        items: [
          { name: "Manjar Blanco", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
          { name: "Crema Pastelera", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Frutas", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Chocolate", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Mermelada", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" }
        ]
      },
      "Especiales": {
        image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop",
        items: [
          { name: "Sin Gluten", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
          { name: "Integrales", image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop" },
          { name: "Con Frutas", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Decorados", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Mini Keks", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" }
        ]
      },
      "Tamaños": {
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        items: [
          { name: "Individual", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Familiar", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop" },
          { name: "Grande", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" },
          { name: "Extra Grande", image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop" }
        ]
      }
    }
  },
  {
    id: 4,
    name: "Postres",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} className="fill-primary/20 stroke-primary" d="M6 18h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="stroke-primary" d="M8 12h8M12 8v8"/>
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    subcategories: {
      "Fríos": {
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop",
        items: [
          { name: "Cheesecakes", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop" },
          { name: "Tiramisú", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
          { name: "Panna Cotta", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Mousse", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Gelatinas", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
        ]
      },
      "Tradicionales": {
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
        items: [
          { name: "Tres Leches", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
          { name: "Suspiro Limeño", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Mazamorra", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Arroz con Leche", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
        ]
      },
      "Internacionales": {
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop",
        items: [
          { name: "Macarons", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&h=300&fit=crop" },
          { name: "Cannoli", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Éclair", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" },
          { name: "Profiteroles", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
          { name: "Crème Brûlée", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop" }
        ]
      },
      "Brownies & Cookies": {
        image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop",
        items: [
          { name: "Brownies", image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop" },
          { name: "Cookies", image: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?w=400&h=300&fit=crop" },
          { name: "Blondies", image: "https://images.unsplash.com/photo-1606313364555-b33b7660cc35?w=400&h=300&fit=crop" },
          { name: "Bars", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
          { name: "Bites", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" }
        ]
      }
    }
  }
];

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("");
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriasDB = await categoriaService.getAll();
        
        // Tomar solo las primeras 4 categorías y transformarlas
        const categoriesData = categoriasDB.slice(0, 4).map((categoria) => ({
          id: categoria.id,
          name: categoria.nombre,
          icon: categoryIcons[categoria.id as keyof typeof categoryIcons] || categoryIcons[1],
          image: categoria.imagen_url || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=400&h=300&fit=crop`,
          subcategories: defaultSubcategories[categoria.id as keyof typeof defaultSubcategories] || defaultSubcategories[1]
        }));
        
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        // Usar categorías por defecto en caso de error
        setCategories(staticCategories.slice(0, 4));
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-warning shadow-sm">
      {/* Top Yellow Bar - MercadoLibre style */}
      <div className="bg-warning text-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>🍰 Las mejores tortas artesanales de Lima</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>📍 Envíos gratis desde S/39</span>
            <span>📞 938101013</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">Kokorito</h1>
          </div>

          {/* Search Bar - Redondeada y ocupa el resto del espacio */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tortas personalizadas, cupcakes, keks..."
                className="w-full px-6 py-3 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary transition-colors shadow-sm"
              />
              <button className="absolute right-3 top-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Actions - Pegados a la derecha */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <a href="#" className="text-gray-600 hover:text-primary flex flex-col items-center text-xs min-w-0">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="whitespace-nowrap">Mi cuenta</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary flex flex-col items-center text-xs min-w-0">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="whitespace-nowrap">Favoritos</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-primary flex flex-col items-center text-xs relative min-w-0">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.414L6.414 18H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              <span className="whitespace-nowrap">Carrito</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation con Dropdown tipo MercadoLibre */}
      <div className="bg-white border-t border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-8 py-2">
                        <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => {
                // Delay para permitir navegación
                setTimeout(() => {
                  setShowDropdown(false);
                  setHoveredCategory(null);
                }, 150);
              }}
            >
              <a href="#" className="text-gray-700 hover:text-primary font-medium py-2 border-b-2 border-transparent hover:border-primary transition-all flex items-center">
                Todas las categorías
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              
              {/* MegaMenu Dropdown - Con Panel de Imagen */}
              {showDropdown && (
                <div 
                  className="absolute top-full left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 flex"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => {
                    setShowDropdown(false);
                    setHoveredCategory(null);
                    setCurrentImage("");
                    setActiveSubcategory("");
                  }}
                >
                  {/* Panel Izquierdo - Categorías Principales */}
                  <div className="w-64 bg-gray-50 rounded-l-lg">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          hoveredCategory === category.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                        }`}
                        onMouseEnter={() => {
                          setHoveredCategory(category.id);
                          setCurrentImage(category.image);
                          setActiveSubcategory("");
                        }}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">{category.icon}</div>
                          <span className="font-medium">{category.name}</span>
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Panel Central - Subcategorías */}
                  {hoveredCategory && (
                    <div className="w-96 p-6 bg-white">
                      {(() => {
                        const currentCategory = categories.find(cat => cat.id === hoveredCategory);
                        if (!currentCategory) return null;
                        
                        return (
                          <div className="grid grid-cols-1 gap-6">
                            {Object.entries(currentCategory.subcategories).map(([groupName, subcategory]: [string, any]) => (
                              <div key={groupName}>
                                <h4 
                                  className="font-bold text-primary mb-3 text-sm uppercase tracking-wide cursor-pointer hover:text-pink-600 transition-colors"
                                  onMouseEnter={() => {
                                    setCurrentImage(subcategory.image);
                                    setActiveSubcategory(groupName);
                                  }}
                                >
                                  {groupName}
                                </h4>
                                <div className="grid grid-cols-2 gap-1">
                                  {subcategory.items.map((item: any, itemIndex: number) => (
                                    <a
                                      key={itemIndex}
                                      href="#"
                                      className="text-gray-600 hover:text-primary text-sm py-1 block transition-colors hover:bg-gray-50 px-2 rounded"
                                      onMouseEnter={() => {
                                        setCurrentImage(item.image);
                                        setActiveSubcategory(groupName);
                                      }}
                                    >
                                      {item.name}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Panel Derecho - Solo Imagen de Fondo */}
                  {currentImage && (
                    <div 
                      className="w-80 rounded-r-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        minHeight: '400px'
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            
            <a href="#" className="text-gray-700 hover:text-primary font-medium py-2 border-b-2 border-transparent hover:border-primary transition-all">
              Ofertas
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium py-2 border-b-2 border-transparent hover:border-primary transition-all">
              Tortas Personalizadas
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium py-2 border-b-2 border-transparent hover:border-primary transition-all">
              Delivery
            </a>
            <a href="#" className="text-gray-700 hover:text-primary font-medium py-2 border-b-2 border-transparent hover:border-primary transition-all">
              Ayuda
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
} 