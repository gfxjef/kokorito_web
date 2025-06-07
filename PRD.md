# PRD - Web de Tortas y Keks "Kokorito" (VERSIÓN 2.0)

## 📋 Resumen Ejecutivo
Desarrollo de una tienda online especializada en tortas personalizadas, keks y productos de pastelería con interfaz moderna inspirada en MercadoLibre, usando React + Next.js para una experiencia de compra optimizada.

## 🎯 Objetivos Actualizados
- Crear una experiencia similar a MercadoLibre pero enfocada en pastelería
- Usar el 100% del ancho de pantalla sin sidebars laterales
- Implementar secciones categorizadas y banners promocionales
- Facilitar la navegación con diseño limpio y moderno
- Mostrar productos de manera atractiva y organizada

## 👥 Usuarios Objetivo
- Personas que buscan tortas personalizadas para eventos
- Amantes de la repostería artesanal y gourmet
- Clientes que prefieren compras online con variedad
- Empresas que necesitan tortas corporativas
- Rango de edad: 20-65 años

## 🎨 Especificaciones de Diseño Actualizadas

### Paleta de Colores (inspirada en pastelería moderna):
- **Primario**: #FF6B9D (Rosa vibrante - pasteles)
- **Secundario**: #FFF3E0 (Crema suave)
- **Acento**: #4ECDC4 (Verde menta - decoración)
- **Warning/Ofertas**: #FFD93D (Amarillo - promociones)
- **Fondo**: #FFFFFF (Blanco limpio)
- **Texto**: #2C3E50 (Gris oscuro)

### Layout Principal Rediseñado:
1. **Header Profesional**
   - Logo "Kokorito" prominente (izquierda)
   - Barra de búsqueda redondeada (centro, ocupa resto del espacio)
   - Mi cuenta, Favoritos, Carrito (derecha, pegados)
   - Navegación con dropdown de categorías

2. **Banner Slider Dinámico**
   - Slider automático con múltiples promociones
   - Indicadores y navegación manual
   - Llamadas a la acción variables por slide

3. **Secciones Estructuradas**
   - "Más Vendidos" - productos populares con scroll horizontal
   - "Categorías Principales" - grid con hover dropdown
   - "Ofertas del Día" - productos en descuento con timer
   - "Historias de Clientes" - testimonios y reviews
   - "Clientes Corporativos" - empresas que confían en nosotros
   - "Garantías de Calidad" - iconografía de beneficios

4. **Footer Completo SEO**
   - Productos más buscados (para SEO)
   - Enlaces de categorías
   - Información corporativa
   - Políticas y términos
   - Redes sociales y contacto

## 🏗️ Arquitectura del Proyecto

### Páginas Principales:
1. **Home** (/) - Landing principal
2. **Categorías** (/categoria/[slug]) - Listado de productos por categoría
3. **Producto** (/producto/[id]) - Detalle individual del producto
4. **Carrito** (/carrito) - Resumen de compra
5. **Checkout** (/checkout) - Proceso de pago
6. **Corporativos** (/corporativos) - Página B2B
7. **Sobre Nosotros** (/nosotros) - Historia de la empresa

## 🛠️ Especificaciones Técnicas

### Stack Tecnológico:
- **Frontend**: React 18 + Next.js 14
- **Estilos**: Tailwind CSS
- **Componentes**: Componentes funcionales con hooks
- **Imágenes**: URLs externas
- **Routing**: Next.js App Router

### Estructura de Carpetas:
```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── TopProducts.tsx
│   │   └── FeaturedImages.tsx
│   ├── data/
│   │   └── staticData.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
└── tailwind.config.js
```

## 📋 Funcionalidades Principales

### Fase 1 - MVP (Información Estática):
- ✅ Header con logo y navegación
- ✅ Sidebar con menú vertical
- ✅ Hero section con imagen principal
- ✅ Sección de productos top
- ✅ Grid de imágenes destacadas
- ✅ Grid de productos con información básica
- ✅ Diseño responsive
- ✅ Navegación por categorías

### Fase 2 - Futuras Mejoras:
- 🔄 Integración con backend
- 🔄 Carrito de compras
- 🔄 Sistema de filtros
- 🔄 Búsqueda en tiempo real
- 🔄 Páginas de detalle de producto

## 📱 Responsive Design
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsable
- **Mobile**: Menú hamburguesa, grid de productos adaptado

## 🖼️ Contenido Estático Inicial

### Categorías:
- Tortas de Cumpleaños
- Cupcakes Gourmet
- Keks Personalizados
- Tortas de Boda
- Postres Especiales

### Productos de Ejemplo:
1. **Torta Red Velvet** - Categoría: Tortas Especiales - S/. 45.00
2. **Cupcakes de Fresa** - Categoría: Cupcakes - S/. 5.00
3. **Kek de Chocolate** - Categoría: Keks - S/. 35.00
4. **Torta de Vainilla** - Categoría: Tortas Clásicas - S/. 40.00

## 🚀 Criterios de Aceptación
- [ ] Diseño fiel a los wireframes proporcionados
- [ ] Colores coherentes con la imagen de referencia
- [ ] Responsive en todos los dispositivos
- [ ] Navegación intuitiva
- [ ] Carga rápida de imágenes externas
- [ ] Código limpio y bien estructurado
- [ ] Preparado para integración futura con backend

## 📅 Timeline Estimado
- **Día 1**: Estructura del proyecto y componentes base
- **Día 2**: Implementación de diseño y estilos
- **Día 3**: Responsive design y ajustes finales
- **Día 4**: Testing y optimización 