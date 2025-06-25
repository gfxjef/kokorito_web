from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ============================================
# MODELO: CATEGORIA
# ============================================
class Categoria(BaseModel):
    id: int
    nombre: str
    slug: str
    descripcion: Optional[str] = None
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None
    color_tema: Optional[str] = None
    orden_display: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELO: PRODUCTO
# ============================================
class Producto(BaseModel):
    id: int
    nombre: str
    slug: str
    descripcion: Optional[str] = None
    descripcion_corta: Optional[str] = None
    precio_base: float
    precio_oferta: Optional[float] = None
    categoria_id: int
    sku: Optional[str] = None
    stock_disponible: int
    stock_minimo: int
    requiere_stock: bool
    tiempo_preparacion_hrs: int
    peso_gramos: Optional[int] = None
    porciones: Optional[int] = None
    imagen_principal: Optional[str] = None
    is_featured: bool
    is_disponible: bool
    permite_personalizacion: bool
    rating_promedio: float
    total_reviews: int
    total_ventas: int
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELO: PRODUCTO_IMAGEN
# ============================================
class ProductoImagen(BaseModel):
    id: int
    producto_id: int
    url: str
    alt_text: Optional[str] = None
    titulo: Optional[str] = None
    orden: int
    is_principal: bool
    width: Optional[int] = None
    height: Optional[int] = None
    tamaño_bytes: Optional[int] = None
    formato: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELO: RELLENO
# ============================================
class Relleno(BaseModel):
    id: int
    nombre: str
    slug: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    color_hex: Optional[str] = None
    icono: Optional[str] = None
    precio_adicional: float
    is_disponible: bool
    is_premium: bool
    contiene_lactosa: bool
    contiene_gluten: bool
    es_vegano: bool
    requiere_stock: bool
    stock_disponible: Optional[int] = None
    orden_display: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELO: TAMAÑO
# ============================================
class Tamaño(BaseModel):
    id: int
    nombre: str
    slug: str
    descripcion: Optional[str] = None
    porciones_aproximadas: Optional[int] = None
    diametro_cm: Optional[int] = None
    peso_gramos: Optional[int] = None
    multiplicador_precio: float
    precio_adicional: float
    is_disponible: bool
    icono: Optional[str] = None
    color_hex: Optional[str] = None
    orden_display: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELO: TESTIMONIO
# ============================================
class Testimonio(BaseModel):
    id: int
    nombre_cliente: str
    email_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None
    producto_id: int
    titulo: Optional[str] = None
    comentario: str
    rating: float
    is_publico: bool
    is_verificado: bool
    is_destacado: bool
    moderado_por: Optional[str] = None
    fecha_moderacion: Optional[datetime] = None
    notas_moderacion: Optional[str] = None
    ip_origen: Optional[str] = None
    user_agent: Optional[str] = None
    orden_display: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

# ============================================
# MODELOS DE RELACIÓN (Many-to-Many)
# ============================================
class ProductoRelleno(BaseModel):
    producto_id: int
    relleno_id: int

class ProductoTamaño(BaseModel):
    producto_id: int
    tamaño_id: int

# ============================================
# MODELOS DE RESPUESTA API
# ============================================
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[list] = None
    count: Optional[int] = None

class APIError(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None

# ============================================
# MODELOS DE ENTRADA (CREATE/UPDATE)
# ============================================

# Modelos para Categorías
class CategoriaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None
    color_tema: Optional[str] = "#3B82F6"
    orden_display: int = 1
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    parent_id: Optional[int] = None
    imagen_url: Optional[str] = None
    color_tema: Optional[str] = None
    orden_display: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None

# Modelos para Productos
class ProductoCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    descripcion_corta: Optional[str] = None
    precio_base: float
    precio_oferta: Optional[float] = None
    categoria_id: int
    sku: Optional[str] = None
    stock_disponible: int = 0
    stock_minimo: int = 0
    requiere_stock: bool = True
    tiempo_preparacion_hrs: int = 24
    peso_gramos: Optional[int] = None
    porciones: Optional[int] = None
    imagen_principal: Optional[str] = None
    is_featured: bool = False
    is_disponible: bool = True
    permite_personalizacion: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: bool = True

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    descripcion_corta: Optional[str] = None
    precio_base: Optional[float] = None
    precio_oferta: Optional[float] = None
    categoria_id: Optional[int] = None
    sku: Optional[str] = None
    stock_disponible: Optional[int] = None
    stock_minimo: Optional[int] = None
    requiere_stock: Optional[bool] = None
    tiempo_preparacion_hrs: Optional[int] = None
    peso_gramos: Optional[int] = None
    porciones: Optional[int] = None
    imagen_principal: Optional[str] = None
    is_featured: Optional[bool] = None
    is_disponible: Optional[bool] = None
    permite_personalizacion: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_active: Optional[bool] = None
    # Relaciones opcionales
    rellenos_ids: Optional[list[int]] = None
    tamaños_ids: Optional[list[int]] = None

# Modelos para Rellenos
class RellenoCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    color_hex: Optional[str] = None
    icono: Optional[str] = None
    precio_adicional: float = 0.0
    is_disponible: bool = True
    is_premium: bool = False
    contiene_lactosa: bool = False
    contiene_gluten: bool = False
    es_vegano: bool = False
    requiere_stock: bool = False
    stock_disponible: Optional[int] = None
    orden_display: int = 1
    is_active: bool = True

class RellenoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    color_hex: Optional[str] = None
    icono: Optional[str] = None
    precio_adicional: Optional[float] = None
    is_disponible: Optional[bool] = None
    is_premium: Optional[bool] = None
    contiene_lactosa: Optional[bool] = None
    contiene_gluten: Optional[bool] = None
    es_vegano: Optional[bool] = None
    requiere_stock: Optional[bool] = None
    stock_disponible: Optional[int] = None
    orden_display: Optional[int] = None
    is_active: Optional[bool] = None

# Modelos para Tamaños
class TamañoCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    porciones_aproximadas: Optional[int] = None
    diametro_cm: Optional[int] = None
    peso_gramos: Optional[int] = None
    multiplicador_precio: float = 1.0
    precio_adicional: float = 0.0
    is_disponible: bool = True
    icono: Optional[str] = None
    color_hex: Optional[str] = None
    orden_display: int = 1
    is_active: bool = True

class TamañoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    porciones_aproximadas: Optional[int] = None
    diametro_cm: Optional[int] = None
    peso_gramos: Optional[int] = None
    multiplicador_precio: Optional[float] = None
    precio_adicional: Optional[float] = None
    is_disponible: Optional[bool] = None
    icono: Optional[str] = None
    color_hex: Optional[str] = None
    orden_display: Optional[int] = None
    is_active: Optional[bool] = None

# Modelos para Testimonios
class TestimonioCreate(BaseModel):
    nombre_cliente: str
    email_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None
    producto_id: int
    titulo: Optional[str] = None
    comentario: str
    rating: float
    is_publico: bool = True
    is_verificado: bool = False
    is_destacado: bool = False
    orden_display: int = 1
    is_active: bool = True

class TestimonioUpdate(BaseModel):
    nombre_cliente: Optional[str] = None
    email_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None
    producto_id: Optional[int] = None
    titulo: Optional[str] = None
    comentario: Optional[str] = None
    rating: Optional[float] = None
    is_publico: Optional[bool] = None
    is_verificado: Optional[bool] = None
    is_destacado: Optional[bool] = None
    orden_display: Optional[int] = None
    is_active: Optional[bool] = None

# Modelos para Producto Imágenes
class ProductoImagenCreate(BaseModel):
    producto_id: int
    url: str
    alt_text: Optional[str] = None
    titulo: Optional[str] = None
    orden: int = 1
    is_principal: bool = False
    width: Optional[int] = None
    height: Optional[int] = None
    tamaño_bytes: Optional[int] = None
    formato: Optional[str] = None
    is_active: bool = True

class ProductoImagenUpdate(BaseModel):
    url: Optional[str] = None
    alt_text: Optional[str] = None
    titulo: Optional[str] = None
    orden: Optional[int] = None
    is_principal: Optional[bool] = None
    width: Optional[int] = None
    height: Optional[int] = None
    tamaño_bytes: Optional[int] = None
    formato: Optional[str] = None
    is_active: Optional[bool] = None 