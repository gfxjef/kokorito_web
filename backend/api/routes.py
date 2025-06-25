from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from .services import (
    categoria_service, producto_service, producto_imagen_service,
    relleno_service, tamaño_service, testimonio_service,
    producto_relleno_service, producto_tamaño_service
)
from .models import (
    CategoriaCreate, CategoriaUpdate, ProductoCreate, ProductoUpdate,
    RellenoCreate, RellenoUpdate, TamañoCreate, TamañoUpdate,
    TestimonioCreate, TestimonioUpdate, ProductoImagenCreate, ProductoImagenUpdate
)

# ============================================
# ROUTER PRINCIPAL
# ============================================
router = APIRouter()

# ============================================
# ENDPOINTS DE CATEGORIA
# ============================================
@router.get("/categorias", tags=["Categorías"])
async def get_categorias(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todas las categorías"""
    response = categoria_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/categorias/{categoria_id}", tags=["Categorías"])
async def get_categoria_by_id(categoria_id: int):
    """Obtiene categoría por ID"""
    response = categoria_service.get_by_id(categoria_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/categorias/slug/{slug}", tags=["Categorías"])
async def get_categoria_by_slug(slug: str):
    """Obtiene categoría por slug"""
    response = categoria_service.get_by_slug(slug)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/categorias/destacadas/list", tags=["Categorías"])
async def get_categorias_destacadas():
    """Obtiene categorías destacadas"""
    response = categoria_service.get_featured()
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/categorias", tags=["Categorías"])
async def create_categoria(categoria: CategoriaCreate):
    """Crea una nueva categoría"""
    response = categoria_service.create(categoria.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/categorias/{categoria_id}", tags=["Categorías"])
async def update_categoria(categoria_id: int, categoria: CategoriaUpdate):
    """Actualiza una categoría existente"""
    response = categoria_service.update(categoria_id, categoria.dict(exclude_unset=True))
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/categorias/{categoria_id}", tags=["Categorías"])
async def delete_categoria(categoria_id: int):
    """Elimina una categoría"""
    response = categoria_service.delete(categoria_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINTS DE PRODUCTO
# ============================================
@router.get("/productos", tags=["Productos"])
async def get_productos(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todos los productos"""
    response = producto_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/productos/{producto_id}", tags=["Productos"])
async def get_producto_by_id(producto_id: int):
    """Obtiene producto por ID"""
    response = producto_service.get_by_id(producto_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/productos/slug/{slug}", tags=["Productos"])
async def get_producto_by_slug(slug: str):
    """Obtiene producto por slug"""
    response = producto_service.get_by_slug(slug)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/productos/categoria/{categoria_id}", tags=["Productos"])
async def get_productos_by_categoria(categoria_id: int):
    """Obtiene productos por categoría"""
    response = producto_service.get_by_category(categoria_id)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/productos/destacados/list", tags=["Productos"])
async def get_productos_destacados():
    """Obtiene productos destacados"""
    response = producto_service.get_featured()
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/productos", tags=["Productos"])
async def create_producto(producto: ProductoCreate):
    """Crea un nuevo producto"""
    response = producto_service.create(producto.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/productos/{producto_id}", tags=["Productos"])
async def update_producto(producto_id: int, producto: ProductoUpdate):
    """Actualiza un producto existente"""
    product_data = producto.dict(exclude_unset=True)
    
    # Extraer relaciones si están presentes
    rellenos_ids = product_data.pop('rellenos_ids', None)
    tamaños_ids = product_data.pop('tamaños_ids', None)
    
    # Usar el método que maneja relaciones si hay relaciones, sino el método normal
    if rellenos_ids is not None or tamaños_ids is not None:
        response = producto_service.update_with_relations(
            producto_id, 
            product_data, 
            rellenos_ids, 
            tamaños_ids
        )
    else:
        response = producto_service.update(producto_id, product_data)
    
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/productos/{producto_id}", tags=["Productos"])
async def delete_producto(producto_id: int):
    """Elimina un producto"""
    response = producto_service.delete(producto_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/productos/{producto_id}/rellenos", tags=["Productos"])
async def get_producto_rellenos(producto_id: int):
    """Obtiene los rellenos asociados a un producto"""
    try:
        query = """
            SELECT r.* FROM relleno r 
            INNER JOIN producto_relleno pr ON r.id = pr.relleno_id 
            WHERE pr.producto_id = %s AND r.is_active = 1
        """
        from .database import db
        results = db.execute_query(query, (producto_id,))
        
        return {
            "success": True,
            "message": f"Rellenos del producto {producto_id} obtenidos",
            "data": results or [],
            "count": len(results) if results else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/productos/{producto_id}/tamaños", tags=["Productos"])
async def get_producto_tamaños(producto_id: int):
    """Obtiene los tamaños asociados a un producto"""
    try:
        query = """
            SELECT t.* FROM tamaño t 
            INNER JOIN producto_tamaño pt ON t.id = pt.tamaño_id 
            WHERE pt.producto_id = %s AND t.is_active = 1
        """
        from .database import db
        results = db.execute_query(query, (producto_id,))
        
        return {
            "success": True,
            "message": f"Tamaños del producto {producto_id} obtenidos",
            "data": results or [],
            "count": len(results) if results else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# ============================================
# ENDPOINTS DE PRODUCTO_IMAGEN
# ============================================
@router.get("/producto-imagenes", tags=["Producto Imágenes"])
async def get_producto_imagenes(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todas las imágenes de productos"""
    response = producto_imagen_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/producto-imagenes/{imagen_id}", tags=["Producto Imágenes"])
async def get_producto_imagen_by_id(imagen_id: int):
    """Obtiene imagen de producto por ID"""
    response = producto_imagen_service.get_by_id(imagen_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/producto-imagenes/producto/{producto_id}", tags=["Producto Imágenes"])
async def get_imagenes_by_producto(producto_id: int):
    """Obtiene imágenes de un producto específico"""
    response = producto_imagen_service.get_by_producto(producto_id)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/producto-imagenes", tags=["Producto Imágenes"])
async def create_producto_imagen(imagen: ProductoImagenCreate):
    """Crea una nueva imagen de producto"""
    response = producto_imagen_service.create(imagen.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/producto-imagenes/{imagen_id}", tags=["Producto Imágenes"])
async def update_producto_imagen(imagen_id: int, imagen: ProductoImagenUpdate):
    """Actualiza una imagen de producto existente"""
    response = producto_imagen_service.update(imagen_id, imagen.dict(exclude_unset=True))
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/producto-imagenes/{imagen_id}", tags=["Producto Imágenes"])
async def delete_producto_imagen(imagen_id: int):
    """Elimina una imagen de producto"""
    response = producto_imagen_service.delete(imagen_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINTS DE RELLENO
# ============================================
@router.get("/rellenos", tags=["Rellenos"])
async def get_rellenos(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todos los rellenos"""
    response = relleno_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/rellenos/{relleno_id}", tags=["Rellenos"])
async def get_relleno_by_id(relleno_id: int):
    """Obtiene relleno por ID"""
    response = relleno_service.get_by_id(relleno_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/rellenos/disponibles/list", tags=["Rellenos"])
async def get_rellenos_disponibles():
    """Obtiene rellenos disponibles"""
    response = relleno_service.get_disponibles()
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/rellenos/producto/{producto_id}", tags=["Rellenos"])
async def get_rellenos_by_producto(producto_id: int):
    """Obtiene rellenos disponibles para un producto"""
    response = relleno_service.get_by_producto(producto_id)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/rellenos", tags=["Rellenos"])
async def create_relleno(relleno: RellenoCreate):
    """Crea un nuevo relleno"""
    response = relleno_service.create(relleno.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/rellenos/{relleno_id}", tags=["Rellenos"])
async def update_relleno(relleno_id: int, relleno: RellenoUpdate):
    """Actualiza un relleno existente"""
    response = relleno_service.update(relleno_id, relleno.dict(exclude_unset=True))
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/rellenos/{relleno_id}", tags=["Rellenos"])
async def delete_relleno(relleno_id: int):
    """Elimina un relleno"""
    response = relleno_service.delete(relleno_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINTS DE TAMAÑO
# ============================================
@router.get("/tamaños", tags=["Tamaños"])
async def get_tamaños(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todos los tamaños"""
    response = tamaño_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/tamaños/{tamaño_id}", tags=["Tamaños"])
async def get_tamaño_by_id(tamaño_id: int):
    """Obtiene tamaño por ID"""
    response = tamaño_service.get_by_id(tamaño_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/tamaños/disponibles/list", tags=["Tamaños"])
async def get_tamaños_disponibles():
    """Obtiene tamaños disponibles"""
    response = tamaño_service.get_disponibles()
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/tamaños/producto/{producto_id}", tags=["Tamaños"])
async def get_tamaños_by_producto(producto_id: int):
    """Obtiene tamaños disponibles para un producto"""
    response = tamaño_service.get_by_producto(producto_id)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/tamaños", tags=["Tamaños"])
async def create_tamaño(tamaño: TamañoCreate):
    """Crea un nuevo tamaño"""
    response = tamaño_service.create(tamaño.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/tamaños/{tamaño_id}", tags=["Tamaños"])
async def update_tamaño(tamaño_id: int, tamaño: TamañoUpdate):
    """Actualiza un tamaño existente"""
    response = tamaño_service.update(tamaño_id, tamaño.dict(exclude_unset=True))
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/tamaños/{tamaño_id}", tags=["Tamaños"])
async def delete_tamaño(tamaño_id: int):
    """Elimina un tamaño"""
    response = tamaño_service.delete(tamaño_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINTS DE TESTIMONIO
# ============================================
@router.get("/testimonios", tags=["Testimonios"])
async def get_testimonios(activos_solo: bool = Query(True, description="Solo registros activos")):
    """Obtiene todos los testimonios"""
    response = testimonio_service.get_all(active_only=activos_solo)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/testimonios/{testimonio_id}", tags=["Testimonios"])
async def get_testimonio_by_id(testimonio_id: int):
    """Obtiene testimonio por ID"""
    response = testimonio_service.get_by_id(testimonio_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.get("/testimonios/publicos/list", tags=["Testimonios"])
async def get_testimonios_publicos():
    """Obtiene testimonios públicos"""
    response = testimonio_service.get_publicos()
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/testimonios/producto/{producto_id}", tags=["Testimonios"])
async def get_testimonios_by_producto(producto_id: int):
    """Obtiene testimonios de un producto"""
    response = testimonio_service.get_by_producto(producto_id)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/testimonios", tags=["Testimonios"])
async def create_testimonio(testimonio: TestimonioCreate):
    """Crea un nuevo testimonio"""
    response = testimonio_service.create(testimonio.dict())
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.put("/testimonios/{testimonio_id}", tags=["Testimonios"])
async def update_testimonio(testimonio_id: int, testimonio: TestimonioUpdate):
    """Actualiza un testimonio existente"""
    response = testimonio_service.update(testimonio_id, testimonio.dict(exclude_unset=True))
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.delete("/testimonios/{testimonio_id}", tags=["Testimonios"])
async def delete_testimonio(testimonio_id: int):
    """Elimina un testimonio"""
    response = testimonio_service.delete(testimonio_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINTS DE RELACIONES
# ============================================
@router.get("/producto-rellenos", tags=["Relaciones"])
async def get_producto_rellenos():
    """Obtiene todas las relaciones producto-relleno"""
    response = producto_relleno_service.get_all(active_only=False)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.get("/producto-tamaños", tags=["Relaciones"])
async def get_producto_tamaños():
    """Obtiene todas las relaciones producto-tamaño"""
    response = producto_tamaño_service.get_all(active_only=False)
    if not response.success:
        raise HTTPException(status_code=500, detail=response.message)
    return response

@router.post("/producto-rellenos", tags=["Relaciones"])
async def create_producto_relleno(producto_id: int, relleno_id: int):
    """Crea una relación producto-relleno"""
    response = producto_relleno_service.create_relation(producto_id, relleno_id)
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.delete("/producto-rellenos", tags=["Relaciones"])
async def delete_producto_relleno(producto_id: int, relleno_id: int):
    """Elimina una relación producto-relleno"""
    response = producto_relleno_service.delete_relation(producto_id, relleno_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

@router.post("/producto-tamaños", tags=["Relaciones"])
async def create_producto_tamaño(producto_id: int, tamaño_id: int):
    """Crea una relación producto-tamaño"""
    response = producto_tamaño_service.create_relation(producto_id, tamaño_id)
    if not response.success:
        raise HTTPException(status_code=400, detail=response.message)
    return response

@router.delete("/producto-tamaños", tags=["Relaciones"])
async def delete_producto_tamaño(producto_id: int, tamaño_id: int):
    """Elimina una relación producto-tamaño"""
    response = producto_tamaño_service.delete_relation(producto_id, tamaño_id)
    if not response.success:
        raise HTTPException(status_code=404, detail=response.message)
    return response

# ============================================
# ENDPOINT DE SALUD DE LA API
# ============================================
@router.get("/health", tags=["Sistema"])
async def health_check():
    """Verifica el estado de la API"""
    return {
        "success": True,
        "message": "API Kokorito funcionando correctamente",
        "status": "healthy",
        "version": "1.0.0"
    } 