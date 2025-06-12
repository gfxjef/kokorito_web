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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#f69eb7');

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

  // Efecto para rotación de colores del logo
  useEffect(() => {
    const colors = ['#f69eb7', '#ff6b6b', '#4ecdc4', '#45b7d1']; // Rosa, Rojo, Turquesa, Azul
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % colors.length;
      setCurrentColor(colors[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearchExpand = () => {
    setIsSearchAnimating(true);
    setTimeout(() => {
      setIsSearchExpanded(true);
      setIsSearchAnimating(false);
    }, 200);
  };

  const handleSearchCollapse = () => {
    setIsSearchAnimating(true);
    setTimeout(() => {
      setIsSearchExpanded(false);
      setIsSearchAnimating(false);
    }, 200);
  };

  const handleSidebarClose = () => {
    setSidebarClosing(true);
    setTimeout(() => {
      setIsMobileSidebarOpen(false);
      setSidebarClosing(false);
    }, 300);
  };

  return (
    <header className="bg-warning shadow-sm">
      {/* Top Yellow Bar - Solo visible en desktop */}
      <div className="hidden lg:block bg-warning text-gray-800 py-2 px-4">
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

      {/* Desktop Header - Solo visible en desktop */}
      <div className="hidden lg:block bg-white py-3 px-4">
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

      {/* Mobile Header - Solo visible en móviles */}
      <div className="lg:hidden bg-white px-4 py-3">
        {!isSearchExpanded ? (
          /* Layout Normal: Logo + Search + Hamburguesa + Carrito */
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 -ml-2">
              <svg className="h-12 w-auto transition-all duration-500" viewBox="0 0 422.52 296.05" xmlns="http://www.w3.org/2000/svg">
                <path fill={currentColor} d="M186.27,226.14s-5.22-4-9.61-8.08c-1.84-1.71-3.53-3.44-4.63-4.9-39,20.34-45.73,27.37-71.42,40.46-25.69,13.09-30.59,15.82-44.36,15.82-5.06,0-8.48-1.53-10.63-4.04-3.7-4.32-3.66-11.57-1.78-19.04,2.98-11.82,6.33-24.66,6.33-24.66l8.63-6.93s1.19,19.03,10.17,29.08c8.98,10.05,23.5,9.87,33.13,3.54,8.49-5.57,10.94-8.55,9.29-11.82-.22-.44-.52-.89-.89-1.35-2.21-2.72-6.75,1.4-7.72,1.88-4.47,2.84-11.82,2.21-16.92-1.84-5.1-4.05-6.75-12.1-10.89-24.9-1.58-5.03-4.23-7.31-4.23-7.31,0,0,16.89-16.38,25.92-30.76,9.03-14.38,11.4-25.27,11.4-33.37,0-6.18-2.3-16.01-8.08-23.09-1.8-2.2-3.93-4.14-6.44-5.61-.45-.27-.87-.49-1.26-.68-4.85-2.35-5,1.27-3.36,2.79,1.77,1.64,11.6,10.58,11.6,24.91,0,3.17-.45,6.33-1.31,9.48-3.03,11.09-11.15,22.09-22.61,33.15-12.08,11.66-17.66,16.35-19.26,17.65-.35.28-.51.41-.51.41,0,0,8.19-31.64,9.82-40.39.86-4.62.98-10.58-1.91-15.17-2.58-4.1-7.54-7.12-16.52-7.12-16.61,0-28.85,10.8-36.67,19.36-7.23,7.92-10.95,13.37-11.47,25.96-.04,1.03-.07,2.1-.07,3.22,0,14.94,10.64,20.13,15.61,20.13,6.27,0,14.4-3.85,14.4-14.64,0-3.76-.61-6.28-1.57-8.05-1.8-3.32-4.81-4.02-7.3-5.35,4.72-13.4,21.27-21.22,26.53-20.1-8,42.25-21.08,82-22.99,94.84-.74,4.97-1.33,9.99-1.33,14.84.01,7.7,1.54,15,6.45,21.08,8,9.91,20.8,15.78,48.91,3.86,22.38-10.01,44.61-28.57,73.95-45.65,25.63-14.92,33.63-17.61,33.63-17.61Z"/>
                <path fill={currentColor} d="M139.78,166.92c-3.1-5.33-8.2-9.41-15.57-9.4-3.65,0-17.65,2.32-27.33,25.4-1.82,4.8-3.26,10.69-3.79,16.58-1.2,13.4,2.31,26.82,16.83,27.54,22.5,1.12,33.55-36.21,33.55-46.21,0-4.47-1.19-9.61-3.69-13.92ZM108.71,196.52c2.19-8.8,8.05-27.13,17.73-27.13,3.22,0,4.05,2.95,4.26,5.56.05.67.07,1.32.07,1.89-.88,21.31-14.05,37.42-20.24,37.42-.77,0-1.41-.14-1.94-.4-3.71-1.82-1.79-9.63.12-17.33Z"/>
                <path fill={currentColor} d="M232.23,113.41c-3.65,0-17.65,2.32-27.33,25.4-1.82,4.8-3.26,10.69-3.79,16.58-1.2,13.4,2.31,26.82,16.83,27.54,22.5,1.12,33.55-36.21,33.55-46.21,0-4.47-1.19-9.61-3.69-13.92-3.1-5.33-8.2-9.41-15.57-9.4ZM216.74,152.41c2.19-8.8,8.05-27.13,17.73-27.13,3.22,0,4.05,2.94,4.26,5.56.05.67.07,1.32.07,1.89-.88,21.31-14.05,37.42-20.24,37.42-.77,0-1.41-.14-1.94-.4-3.71-1.82-1.79-9.63.12-17.33Z"/>
                <path fill={currentColor} d="M358.78,95.21c-1.82,4.8-3.26,10.69-3.79,16.58-1.2,13.4,2.31,26.82,16.83,27.54,22.5,1.12,33.55-36.21,33.55-46.21,0-4.47-1.19-9.61-3.69-13.92-3.1-5.33-8.2-9.41-15.57-9.4-3.65,0-17.65,2.32-27.33,25.4ZM372.43,126.54c-.77,0-1.41-.14-1.94-.4-3.71-1.82-1.79-9.63.12-17.33,2.19-8.8,8.05-27.13,17.73-27.13,3.22,0,4.05,2.95,4.26,5.56.05.67.07,1.32.07,1.89-.88,21.31-14.05,37.42-20.24,37.42Z"/>
                <path fill={currentColor} d="M148.57,215.96c5.96,0,8.62-5.52,9.99-11.29,1.36-5.77,6.36-22.46,6.36-22.46,0,0,7.1,20.48,24.42,34.44,17.31,13.96,31.33,9.74,36.3,4.9,4.44-4.33,4.66-8.07,3.14-10.98-.18-.34-.37-.67-.59-.99-2.11-3.04-7.69-.12-16.13-2.05-8.44-1.92-18.61-10.18-26.68-24.26-8.07-14.08-7.32-13.87-7.32-13.87,0,0,10.92-3.51,17.13-12.94,3.78-5.75,4.49-10.29,3.28-13.67-.78-2.17-2.34-3.86-4.4-5.07-5.27-3.1-9.36,1.28-11.51,6.61-1.33,3.29-6.03,8.25-11.4,12.22.2-.76,10.53-39.61,13.72-52.21,2.12-8.37,2.04-14.29-1.37-17.95-1.77-1.9-4.45-3.19-8.18-3.89-10.92-2.05-24.51,9.37-31.83,17.25s-13.96,14.02-13.96,27.92c0,.35,0,.69.02,1.02.41,12.91,8.62,13.56,11.65,13.56s9.74-1.92,9.74-10.42c0-1.43-.22-2.65-.51-3.63-.53-1.82-1.29-2.82-1.29-2.82,0,0,3.6-12.22,16.82-17.25-.04.16-.08.32-.12.49-9.17,37.37-21.17,88.27-23.02,95.07-.26.94-.44,1.85-.56,2.72-.76,5.5,1.19,9.56,6.33,9.56Z"/>
                <path fill={currentColor} d="M256.83,171.53c6.79,0,9.12-5.17,10.8-16.01s8-27.69,15.4-35.27c-.51,9.21,7.91,10.84,12.66,5.72,4.75-5.12,6.33-14.43,3.16-20.76-.43-.85-.95-1.59-1.55-2.22-3.84-4.02-10.77-3.4-15.2,1.8-1.93,2-3.81,4.5-4.35,5.23-.1.13-.16.22-.16.22,0,0-.17-1.09-.89-2.27-.84-1.39-2.43-2.89-5.39-2.89-5.49,0-7.86,3.91-12.29,23.97-2.94,13.34-5.86,22.44-7.42,28.9-.78,3.25-1.22,5.84-1.15,7.95.23,6.33,6.38,5.63,6.38,5.63Z"/>
                <path fill={currentColor} d="M316.49,154.97c7.54-4.05,9.03-9.73,7.91-14.01-.16-.63-.4-1.15-.69-1.59-1.67-2.6-5.06-2.16-5.73,1.22-.79,3.96-4.93,3.58-4.93,3.58,0,0,10.5-38.94,10.5-43.03,0-3.11-.47-6.8-3.74-8.39-1.03-.5-2.33-.79-3.99-.79-2.95,0-6.08,1.26-7.38,6.93-1.3,5.68-6.24,26.11-7.94,33.27-.72,3.03-1.51,6.25-1.93,9.3-.57,4.15-.44,7.97,1.49,10.57,3.35,4.51,8.89,6.98,16.43,2.93Z"/>
                <path fill={currentColor} d="M329.1,77.39c0-1.09-.2-2.12-.55-3.08-1.22-3.36-4.36-5.76-8.06-5.76s-6.96,2.49-8.13,5.94c-.31.91-.48,1.88-.48,2.9,0,4.88,3.85,8.84,8.61,8.84s8.61-3.96,8.61-8.84Z"/>
                <path fill={currentColor} d="M327.06,125.3c-.56,2.95-.84,5.43-.84,8.03,0,7.07,3.82,16.61,15.17,16.61s14.43-10.66,14.43-13.68c0-.97-.36-1.95-.94-2.74-1.24-1.66-3.5-2.43-5.62-.38-2.62,2.54-4.94,2.78-7.52,2.41-.49-.07-.99-.16-1.51-.27l15.5-60.12s1.58-.7,12.66-4.37c11.77-3.72,16.29-6.28,16.29-10.05,0-2.41-1.58-4.2-4.29-4.74-1.53-.3-3.41-.21-5.58.41-6,1.72-15.87,5.09-15.87,5.09,0,0,0,0,0-.03,0-.28,0-3,2.51-10.55,2.65-8,14.85-15.87,14.85-32.11,0-10.9-4.59-16.53-9.24-18.23-1.05-.38-2.09-.57-3.09-.57-1.58,0-6.65.37-8.52,8.05-1.86,7.68-18.71,77.58-22.94,94.79-2.68,10.89-4.48,17.37-5.45,22.45Z"/>
                <path fill={currentColor} d="M421.56,119.13c-1.4-6.18-4.19-11.12-7.67-13.21-.13-.08-.26-.14-.39-.2-2.89-1.41-5.2,1.25-3.15,3.74,1.52,1.85,6.25,9.11,3.33,19.21-1.2,4.16-3.7,8.8-8.26,13.74-15.64,16.94-37.51,13.03-67.11,16.38-29.6,3.35-60.5,8.93-101.73,24.85-16.1,5.86-30.71,12.01-30.71,12.01,0,0,3.27,3.17,10.46,2.97.78-.02,1.6-.07,2.47-.18,8.93-1.12,12.94,1.77,15.26,4.84,44.4-16.57,73.34-25.04,128.35-27.18,37.14-2.05,46.26-13.59,55.19-29.04,5.14-8.9,5.84-19.54,3.95-27.92Z"/>
              </svg>
            </div>

            {/* Search Bar Compacta */}
            <div 
              className="flex-1 relative cursor-pointer"
              onClick={handleSearchExpand}
            >
              <div className={`bg-gray-100 rounded-full h-12 px-4 py-3 flex items-center transition-all duration-200 ${
                isSearchAnimating && !isSearchExpanded ? 'animate-expand-search' : ''
              }`}>
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-500 text-sm">Estoy buscando...</span>
              </div>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-primary transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Carrito */}
            <button className="relative flex-shrink-0 p-2 text-gray-600 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293a1 1 0 00.293 1.414L6.414 18H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
            </button>
          </div>
        ) : (
          /* Layout Expandido: Flecha Atrás + Search Expandida */
          <div className="flex items-center gap-3">
            {/* Botón Atrás */}
            <button
              onClick={handleSearchCollapse}
              className="p-2 text-gray-600 hover:text-primary transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Search Bar Expandida */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Estoy buscando..."
                className="w-full h-12 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                autoFocus
              />
              <button className="absolute right-3 top-3 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Desktop - Solo visible en desktop */}
      <div className="hidden lg:block bg-white border-t border-gray-200 relative">
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

      {/* Mobile Sidebar - Overlay y sidebar */}
      {(isMobileSidebarOpen || sidebarClosing) && (
        <>
          {/* Overlay */}
          <div 
            className={`fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden ${
              sidebarClosing ? 'animate-fade-out' : 'animate-fade-in'
            }`}
            onClick={handleSidebarClose}
          />

          {/* Sidebar */}
          <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:hidden overflow-y-auto ${
            sidebarClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
          }`}>
            {/* Header del sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">Menú</h2>
              <button
                onClick={handleSidebarClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del sidebar */}
            <div className="py-2">
              {/* Categorías */}
              {categories.map((category) => (
                <a 
                  key={category.id}
                  href="#" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                  onClick={handleSidebarClose}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>{category.name}</span>
                </a>
              ))}

              {/* Divisor */}
              <div className="border-t border-gray-200 my-1"></div>

              {/* Navegación Principal */}
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                onClick={handleSidebarClose}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Ofertas</span>
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                onClick={handleSidebarClose}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Tortas Personalizadas</span>
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                onClick={handleSidebarClose}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
                <span>Delivery</span>
              </a>

              {/* Divisor */}
              <div className="border-t border-gray-200 my-1"></div>

              {/* Usuario */}
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mi cuenta</span>
              </a>
              <a 
                href="#" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                onClick={handleSidebarClose}
              >
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Favoritos</span>
              </a>


            </div>
          </div>
        </>
      )}
    </header>
  );
} 