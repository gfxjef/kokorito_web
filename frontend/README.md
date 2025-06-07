# 🍰 Kokorito - Frontend

Aplicación web de tienda online especializada en tortas, keks y cupcakes artesanales, desarrollada con React + Next.js.

## 🚀 Tecnologías

- **Framework**: Next.js 15.3.3 (App Router)
- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Imágenes**: URLs externas (Unsplash)

## 🎨 Características

- ✅ Diseño responsive y moderno
- ✅ Paleta de colores personalizada (rosa coral)
- ✅ Componentes reutilizables
- ✅ Datos estáticos para demostración
- ✅ Interfaz intuitiva y atractiva

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globales
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página de inicio
│   ├── components/
│   │   ├── Header.tsx       # Cabecera con navegación
│   │   ├── Sidebar.tsx      # Menú lateral
│   │   ├── Hero.tsx         # Sección hero
│   │   ├── TopProducts.tsx  # Productos destacados
│   │   ├── FeaturedImages.tsx # Imágenes destacadas
│   │   └── ProductGrid.tsx  # Grid de productos
│   ├── data/
│   │   └── staticData.ts    # Datos estáticos
│   └── types/
│       └── index.ts         # Interfaces TypeScript
├── public/                  # Archivos estáticos
├── package.json
├── tailwind.config.js       # Configuración Tailwind
└── tsconfig.json           # Configuración TypeScript
```

## 🎯 Componentes Principales

### Header
- Logo "Kokorito"
- Barra de búsqueda
- Información de contacto
- Navegación por categorías

### Sidebar
- Menú vertical con categorías
- Diseño en color primario (rosa coral)

### Hero Section
- Imagen destacada de cupcakes
- Texto promocional
- Botón de acción

### Top Products
- Lista de productos destacados
- Imágenes, títulos, categorías y precios
- Diseño compacto lateral

### Featured Images
- Grid de 3 imágenes grandes
- Efectos hover
- Categorías destacadas

### Product Grid
- Grid responsive de productos
- Cards con imagen, título, categoría y precio
- Botones de acción

## 🎨 Paleta de Colores

- **Primario**: #E8A298 (Rosa coral)
- **Secundario**: #F4C2C2 (Rosa claro)
- **Acento**: #D67B7B (Rosa oscuro)
- **Fondo**: #FFF8F8 (Blanco rosado)
- **Texto**: #333333 (Gris oscuro)

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

## 📱 Responsive Design

- **Desktop**: Layout completo con sidebar y productos laterales
- **Tablet**: Adaptación de grids y espaciados
- **Mobile**: Diseño optimizado para pantallas pequeñas

## 🔗 URLs de Desarrollo

- **Local**: http://localhost:3000
- **Producción**: Por definir

## 📋 Estado del Proyecto

✅ **Completado**:
- Configuración inicial del proyecto
- Estructura de componentes
- Datos estáticos
- Diseño responsive básico
- Integración de componentes

🔄 **Pendiente**:
- Optimización responsive para mobile
- Testing completo
- Integración con backend (futuro)

## 🤝 Contribución

Este es un proyecto de demostración. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Proyecto de demostración - Kokorito 2024 