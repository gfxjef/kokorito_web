# 📋 PRD - Sistema de Administración Kokorito Web

## 🎯 **OBJETIVOS**
Crear un sistema de administración completo para gestionar productos, categorías, rellenos, tamaños y testimonios de la pastelería Kokorito, permitiendo operaciones CRUD y manejo de relaciones complejas entre entidades.

## 📊 **ARQUITECTURA DE BASE DE DATOS**

### **Tablas Principales**
| Tabla | Registros | Columnas | Descripción |
|-------|-----------|----------|-------------|
| `categoria` | 5 | 14 | Categorías de productos (1 nivel jerarquía) |
| `producto` | 6 | 27 | Catálogo de productos |
| `relleno` | 5 | 19 | Rellenos disponibles con precios |
| `tamaño` | 5 | 16 | Tamaños con precios adicionales |
| `testimonio` | 5 | 20 | Reviews de clientes |

### **Tablas de Relación**
| Tabla | Descripción |
|-------|-------------|
| `producto_imagen` | Imágenes de productos (máx 6) |
| `producto_relleno` | Relación Many-to-Many productos ↔ rellenos |
| `producto_tamaño` | Relación Many-to-Many productos ↔ tamaños |

## 🎨 **ESPECIFICACIONES TÉCNICAS**

### **Frontend**
- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Responsive**: Solo desktop
- **Rutas**: `/admin/*`

### **Autenticación**
- **Usuario**: `admin`
- **Contraseña**: `admin`
- **Método**: Hardcodeado (sin JWT/sessions)

### **API Endpoints**
- **Base URL**: Usar endpoints existentes del backend
- **Nuevos**: Crear POST/PUT/DELETE para todas las tablas

## 📋 **FUNCIONALIDADES POR MÓDULO**

### **🏷️ CATEGORÍAS**
#### **Características**
- CRUD completo
- Solo 1 nivel de jerarquía (`parent_id`)
- Orden display manual (campos numéricos)
- Color tema con selector profesional
- Estados: activo/inactivo (visibles marcadas)

#### **Reglas de Negocio**
- **Eliminación**: Reasignar productos a "Sin Categoría"
- **Slug**: Auto-generado del nombre
- **Validaciones**: Nombre único

#### **Campos Editables**
```typescript
interface Categoria {
  nombre: string           // Requerido, único
  slug: string            // Auto-generado
  descripcion?: string    // Opcional
  parent_id?: number     // Opcional (subcategorías)
  color_tema?: string    // Selector de colores
  imagen_url?: string    // URL externa
  orden_display: number  // Manual
  is_active: boolean     // Toggle
  is_featured: boolean   // Toggle
  meta_title?: string    // SEO
  meta_description?: string // SEO
}
```

### **🛍️ PRODUCTOS**
#### **Características**
- CRUD completo con relaciones
- Gestión de stock e inventario
- Sistema de ofertas con fechas
- Múltiples imágenes (máx 6)
- SKU único manual

#### **Reglas de Negocio**
- **SKU**: Manual + validación única
- **Slug**: Auto-generado del nombre
- **Stock**: Vendible con stock 0 si `requiere_stock = 0`
- **Rating**: Editable manualmente (0-6 círculos)
- **Ofertas**: Toggle + fecha inicio/fin + auto-desactivar

#### **Campos Editables**
```typescript
interface Producto {
  nombre: string                    // Requerido
  slug: string                     // Auto-generado
  sku?: string                     // Manual, único
  descripcion?: string             // Textarea
  descripcion_corta?: string       // Resumen
  categoria_id: number             // Select categorías
  precio_base: number              // Requerido
  precio_oferta?: number           // Opcional
  fecha_inicio_oferta?: Date       // Para ofertas
  fecha_fin_oferta?: Date          // Para ofertas
  is_oferta_activa: boolean        // Toggle
  peso_gramos?: number             // Opcional
  porciones?: number               // Opcional
  stock_disponible: number         // Stock actual
  stock_minimo: number             // Alerta stock
  tiempo_preparacion_hrs: number   // No afecta disponibilidad
  imagen_principal?: string        // URL principal
  permite_personalizacion: boolean // Toggle
  is_active: boolean               // Toggle
  is_disponible: boolean           // Toggle
  is_featured: boolean             // Toggle
  requiere_stock: boolean          // Toggle
  rating_promedio: number          // Editable (0-6)
  meta_title?: string              // SEO
  meta_description?: string        // SEO
}
```

### **🧁 RELLENOS**
#### **Características**
- CRUD completo
- Precios adicionales
- Filtros alérgenos
- Disponibilidad por producto

#### **Reglas de Negocio**
- **Precio**: Se suma al precio base del producto
- **Stock**: Si `requiere_stock = 1` puede desactivarse
- **Premium**: Lógica especial de precios
- **Disponibilidad**: Toggle por producto específico

#### **Campos Editables**
```typescript
interface Relleno {
  nombre: string              // Requerido
  slug: string               // Auto-generado
  descripcion?: string       // Opcional
  precio_adicional: number   // Se suma al precio base
  color_hex?: string         // Color representativo
  icono?: string            // Icono representativo
  imagen_url?: string       // URL externa
  orden_display: number     // Manual
  is_premium: boolean       // Toggle
  is_active: boolean        // Toggle
  is_disponible: boolean    // Toggle general
  requiere_stock: boolean   // Toggle
  stock_disponible?: number // Si requiere stock
  contiene_gluten: boolean  // Filtro alérgenos
  contiene_lactosa: boolean // Filtro alérgenos
  es_vegano: boolean        // Filtro alérgenos
}
```

### **📏 TAMAÑOS**
#### **Características**
- CRUD completo
- Precios adicionales (no multiplicadores)
- Información nutricional
- Disponibilidad por producto

#### **Reglas de Negocio**
- **Precio**: Solo usar `precio_adicional` (suma al precio base)
- **Disponibilidad**: Checkbox por producto
- **Diámetro**: Solo informativo

#### **Campos Editables**
```typescript
interface Tamaño {
  nombre: string                  // Requerido
  slug: string                   // Auto-generado
  descripcion?: string           // Opcional
  precio_adicional: number       // Se suma al precio base
  diametro_cm?: number          // Solo informativo
  peso_gramos?: number          // Informativo
  porciones_aproximadas?: number // Informativo
  color_hex?: string            // Color representativo
  icono?: string               // Icono representativo
  orden_display: number        // Manual
  is_active: boolean           // Toggle
  is_disponible: boolean       // Toggle general
}
```

### **💬 TESTIMONIOS**
#### **Características**
- CRUD completo
- Sistema de moderación
- Rating 0-6 (círculos)
- Estados de publicación

#### **Reglas de Negocio**
- **Moderación**: No requerida por defecto
- **Edición**: Permitida después de publicar
- **Rating**: 0-6 (mantener sistema actual)
- **Verificación**: Sin marca especial

#### **Campos Editables**
```typescript
interface Testimonio {
  nombre_cliente: string     // Requerido
  email_cliente?: string     // Opcional
  telefono_cliente?: string  // Opcional
  titulo?: string           // Opcional
  comentario: string        // Requerido
  rating: number           // 0-6 círculos
  producto_id: number      // Select productos
  is_active: boolean       // Toggle
  is_publico: boolean      // Toggle
  is_destacado: boolean    // Toggle
  is_verificado: boolean   // Toggle
  orden_display: number    // Manual
}
```

## 🎨 **ESPECIFICACIONES UI/UX**

### **Layout General**
- Sidebar navegación fija
- Header con breadcrumbs
- Estilo administrativo profesional
- Paleta de colores corporativa

### **Formularios**
- Páginas completas (no modales)
- Validación en tiempo real
- Campos organizados en secciones
- Botones de acción claros

### **Listas y Tablas**
- Paginación automática
- Filtros por columnas
- Búsqueda en tiempo real
- Acciones por fila (editar/eliminar)
- Estados visuales claros

### **Componentes Específicos**
- **Selector de colores**: Paleta profesional
- **Upload imágenes**: Campo URL con preview
- **Editor texto**: Textarea simple (no WYSIWYG)
- **Fechas**: DatePicker para ofertas
- **Toggles**: Switch components elegantes

## 🔗 **ESTRUCTURA DE RUTAS**

```
/admin
├── /login                    # Autenticación simple
├── /dashboard               # Página principal (opcional)
├── /categorias              
│   ├── /                    # Lista + filtros
│   ├── /crear               # Formulario crear
│   └── /[id]/editar        # Formulario editar
├── /productos               
│   ├── /                    # Lista + filtros + búsqueda
│   ├── /crear               # Formulario crear completo
│   └── /[id]/editar        # Formulario editar completo
├── /rellenos                
│   ├── /                    # Lista + filtros
│   ├── /crear               # Formulario crear
│   └── /[id]/editar        # Formulario editar
├── /tamaños                 
│   ├── /                    # Lista + filtros
│   ├── /crear               # Formulario crear
│   └── /[id]/editar        # Formulario editar
└── /testimonios             
    ├── /                    # Lista + filtros
    ├── /crear               # Formulario crear
    └── /[id]/editar        # Formulario editar
```

## 🛠️ **ENDPOINTS REQUERIDOS**

### **Endpoints Existentes (GET)**
✅ Disponibles según README.md del backend

### **Endpoints a Crear**
❌ **POST** - Crear registros
❌ **PUT/PATCH** - Actualizar registros  
❌ **DELETE** - Eliminar registros

#### **Nuevos Endpoints Necesarios**
```
POST   /api/v1/categorias
PUT    /api/v1/categorias/{id}
DELETE /api/v1/categorias/{id}

POST   /api/v1/productos
PUT    /api/v1/productos/{id}
DELETE /api/v1/productos/{id}

POST   /api/v1/rellenos
PUT    /api/v1/rellenos/{id}
DELETE /api/v1/rellenos/{id}

POST   /api/v1/tamaños
PUT    /api/v1/tamaños/{id}
DELETE /api/v1/tamaños/{id}

POST   /api/v1/testimonios
PUT    /api/v1/testimonios/{id}
DELETE /api/v1/testimonios/{id}

# Endpoints de relaciones
POST   /api/v1/producto-rellenos
DELETE /api/v1/producto-rellenos
POST   /api/v1/producto-tamaños
DELETE /api/v1/producto-tamaños
POST   /api/v1/producto-imagenes
DELETE /api/v1/producto-imagenes/{id}
```

## ✅ **CRITERIOS DE ACEPTACIÓN**

### **Funcionalidad Core**
- [ ] Autenticación admin hardcodeada
- [ ] CRUD completo para todas las entidades
- [ ] Validaciones de campos únicos (SKU, nombres)
- [ ] Manejo de relaciones Many-to-Many
- [ ] Sistema de ofertas con fechas automáticas

### **UX/UI**
- [ ] Design administrativo profesional
- [ ] Formularios intuitivos y organizados
- [ ] Filtros y búsqueda funcionales
- [ ] Estados visuales claros (activo/inactivo)
- [ ] Navegación fluida entre secciones

### **Reglas de Negocio**
- [ ] Reasignación automática "Sin Categoría"
- [ ] Auto-generación de slugs
- [ ] Validación SKU único
- [ ] Gestión correcta de precios adicionales
- [ ] Sistema rating 6 círculos mantenido

## 🚀 **PLAN DE IMPLEMENTACIÓN**

### **FASE 1: Base Structure** 
- Estructura carpetas `/admin`
- Layout administrativo
- Autenticación simple
- Tipos TypeScript completos

### **FASE 2: CRUD Simple**
- Módulo Categorías
- Módulo Rellenos  
- Módulo Tamaños

### **FASE 3: CRUD Complejo**
- Módulo Productos (con relaciones)
- Módulo Testimonios

### **FASE 4: Features Avanzadas**
- Sistema ofertas
- Gestión imágenes múltiples
- Filtros avanzados
- Optimizaciones

---

**📅 Fecha Creación**: Enero 2025  
**👨‍💻 Responsable**: Desarrollo Frontend  
**🎯 Estado**: Listo para implementación 