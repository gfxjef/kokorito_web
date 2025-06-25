from typing import List, Optional
from .database import db
from .models import (
    Categoria, Producto, ProductoImagen, Relleno, 
    Tamaño, Testimonio, ProductoRelleno, ProductoTamaño,
    APIResponse, APIError
)
import re
from datetime import datetime

def generate_slug(text: str) -> str:
    """Genera un slug URL-friendly desde un texto"""
    # Convertir a minúsculas
    slug = text.lower()
    # Remover caracteres especiales excepto espacios, guiones y letras
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Reemplazar espacios y múltiples guiones por un solo guión
    slug = re.sub(r'[\s_-]+', '-', slug)
    # Remover guiones al inicio y final
    slug = slug.strip('-')
    return slug

class BaseService:
    """Clase base para servicios con operaciones CRUD completas"""
    
    def __init__(self, table_name: str):
        self.table_name = table_name
    
    def get_all(self, active_only: bool = True) -> APIResponse:
        """Obtiene todos los registros de una tabla"""
        try:
            query = f"SELECT * FROM {self.table_name}"
            if active_only:
                query += " WHERE is_active = 1"
            query += " ORDER BY id"
            
            results = db.execute_query(query)
            
            if results is None:
                return APIResponse(
                    success=False,
                    message="Error en la consulta a la base de datos",
                    data=[],
                    count=0
                )
            
            return APIResponse(
                success=True,
                message=f"Registros obtenidos exitosamente de {self.table_name}",
                data=results,
                count=len(results)
            )
            
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_id(self, record_id: int) -> APIResponse:
        """Obtiene un registro por ID"""
        try:
            query = f"SELECT * FROM {self.table_name} WHERE id = %s"
            result = db.execute_query(query, (record_id,), fetch_all=False)
            
            if result is None:
                return APIResponse(
                    success=False,
                    message=f"No se encontró registro con ID {record_id} en {self.table_name}",
                    data=[],
                    count=0
                )
            
            return APIResponse(
                success=True,
                message=f"Registro encontrado en {self.table_name}",
                data=[result],
                count=1
            )
            
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )

    def create(self, data: dict) -> APIResponse:
        """Crea un nuevo registro"""
        try:
            # Generar slug si no existe y hay campo nombre
            if 'nombre' in data and 'slug' not in data:
                data['slug'] = generate_slug(data['nombre'])
            
            # Agregar timestamps
            now = datetime.now()
            data['created_at'] = now
            data['updated_at'] = now
            
            # Construir query INSERT
            columns = list(data.keys())
            placeholders = ', '.join(['%s'] * len(columns))
            columns_str = ', '.join(columns)
            
            query = f"INSERT INTO {self.table_name} ({columns_str}) VALUES ({placeholders})"
            values = tuple(data.values())
            
            # Ejecutar inserción
            result = db.execute_query(query, values, fetch_all=False, return_id=True)
            
            if result:
                # Obtener el registro creado
                return self.get_by_id(result)
            else:
                return APIResponse(
                    success=False,
                    message=f"Error al crear registro en {self.table_name}",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno al crear: {str(e)}",
                data=[],
                count=0
            )
    
    def update(self, record_id: int, data: dict) -> APIResponse:
        """Actualiza un registro existente"""
        try:
            # Filtrar campos vacíos/None
            data = {k: v for k, v in data.items() if v is not None}
            
            if not data:
                return APIResponse(
                    success=False,
                    message="No hay datos para actualizar",
                    data=[],
                    count=0
                )
            
            # Actualizar slug si se cambió el nombre
            if 'nombre' in data:
                data['slug'] = generate_slug(data['nombre'])
            
            # Agregar timestamp de actualización
            data['updated_at'] = datetime.now()
            
            # Construir query UPDATE
            set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
            query = f"UPDATE {self.table_name} SET {set_clause} WHERE id = %s"
            values = tuple(data.values()) + (record_id,)
            
            # Ejecutar actualización
            result = db.execute_query(query, values, fetch_all=False)
            
            if result is not None:
                # Obtener el registro actualizado
                return self.get_by_id(record_id)
            else:
                return APIResponse(
                    success=False,
                    message=f"No se encontró registro con ID {record_id} en {self.table_name}",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno al actualizar: {str(e)}",
                data=[],
                count=0
            )
    
    def delete(self, record_id: int) -> APIResponse:
        """Elimina un registro (soft delete)"""
        try:
            # Soft delete - marcar como inactivo
            query = f"UPDATE {self.table_name} SET is_active = 0, updated_at = %s WHERE id = %s"
            result = db.execute_query(query, (datetime.now(), record_id), fetch_all=False)
            
            if result is not None:
                return APIResponse(
                    success=True,
                    message=f"Registro {record_id} eliminado exitosamente de {self.table_name}",
                    data=[],
                    count=0
                )
            else:
                return APIResponse(
                    success=False,
                    message=f"No se encontró registro con ID {record_id} en {self.table_name}",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno al eliminar: {str(e)}",
                data=[],
                count=0
            )

# ============================================
# SERVICIOS ESPECÍFICOS POR TABLA
# ============================================

class CategoriaService(BaseService):
    def __init__(self):
        super().__init__("categoria")
    
    def get_featured(self) -> APIResponse:
        """Obtiene categorías destacadas"""
        try:
            query = "SELECT * FROM categoria WHERE is_featured = 1 AND is_active = 1 ORDER BY orden_display"
            results = db.execute_query(query)
            
            return APIResponse(
                success=True,
                message="Categorías destacadas obtenidas",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_slug(self, slug: str) -> APIResponse:
        """Obtiene categoría por slug"""
        try:
            query = "SELECT * FROM categoria WHERE slug = %s AND is_active = 1"
            result = db.execute_query(query, (slug,), fetch_all=False)
            
            if result:
                return APIResponse(
                    success=True,
                    message="Categoría encontrada",
                    data=[result],
                    count=1
                )
            else:
                return APIResponse(
                    success=False,
                    message=f"Categoría con slug '{slug}' no encontrada",
                    data=[],
                    count=0
                )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

class ProductoService(BaseService):
    def __init__(self):
        super().__init__("producto")
    
    def update_with_relations(self, producto_id: int, data: dict, rellenos_ids: list = None, tamaños_ids: list = None) -> APIResponse:
        """Actualiza un producto con sus relaciones de rellenos y tamaños"""
        try:
            # 1. Actualizar datos básicos del producto
            basic_update = self.update(producto_id, data)
            if not basic_update.success:
                return basic_update
            
            # 2. Sincronizar rellenos si se proporcionaron
            if rellenos_ids is not None:
                self._sync_rellenos(producto_id, rellenos_ids)
            
            # 3. Sincronizar tamaños si se proporcionaron  
            if tamaños_ids is not None:
                self._sync_tamanos(producto_id, tamaños_ids)
            
            # 4. Retornar producto actualizado
            return self.get_by_id(producto_id)
            
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error al actualizar producto con relaciones: {str(e)}",
                data=[],
                count=0
            )
    
    def _sync_rellenos(self, producto_id: int, rellenos_ids: list):
        """Sincroniza rellenos de un producto directamente"""
        try:
            # 1. Eliminar relaciones existentes
            delete_query = "DELETE FROM producto_relleno WHERE producto_id = %s"
            db.execute_query(delete_query, (producto_id,), fetch_all=False)
            
            # 2. Insertar nuevas relaciones
            if rellenos_ids:
                insert_query = "INSERT INTO producto_relleno (producto_id, relleno_id) VALUES (%s, %s)"
                for relleno_id in rellenos_ids:
                    db.execute_query(insert_query, (producto_id, relleno_id), fetch_all=False)
                    
        except Exception as e:
            print(f"Error sincronizando rellenos: {e}")
    
    def _sync_tamanos(self, producto_id: int, tamanos_ids: list):
        """Sincroniza tamaños de un producto directamente"""
        try:
            # 1. Eliminar relaciones existentes
            delete_query = "DELETE FROM producto_tamaño WHERE producto_id = %s"
            db.execute_query(delete_query, (producto_id,), fetch_all=False)
            
            # 2. Insertar nuevas relaciones
            if tamanos_ids:
                insert_query = "INSERT INTO producto_tamaño (producto_id, tamaño_id) VALUES (%s, %s)"
                for tamano_id in tamanos_ids:
                    db.execute_query(insert_query, (producto_id, tamano_id), fetch_all=False)
                    
        except Exception as e:
            print(f"Error sincronizando tamaños: {e}")
    
    def get_by_category(self, categoria_id: int) -> APIResponse:
        """Obtiene productos por categoría"""
        try:
            query = """
                SELECT * FROM producto 
                WHERE categoria_id = %s AND is_disponible = 1 AND is_active = 1 
                ORDER BY is_featured DESC, total_ventas DESC
            """
            results = db.execute_query(query, (categoria_id,))
            
            return APIResponse(
                success=True,
                message=f"Productos de categoría {categoria_id} obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_featured(self) -> APIResponse:
        """Obtiene productos destacados"""
        try:
            query = """
                SELECT * FROM producto 
                WHERE is_featured = 1 AND is_disponible = 1 AND is_active = 1 
                ORDER BY total_ventas DESC, rating_promedio DESC
            """
            results = db.execute_query(query)
            
            return APIResponse(
                success=True,
                message="Productos destacados obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_slug(self, slug: str) -> APIResponse:
        """Obtiene producto por slug"""
        try:
            query = "SELECT * FROM producto WHERE slug = %s AND is_active = 1"
            result = db.execute_query(query, (slug,), fetch_all=False)
            
            if result:
                return APIResponse(
                    success=True,
                    message="Producto encontrado",
                    data=[result],
                    count=1
                )
            else:
                return APIResponse(
                    success=False,
                    message=f"Producto con slug '{slug}' no encontrado",
                    data=[],
                    count=0
                )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

class ProductoImagenService(BaseService):
    def __init__(self):
        super().__init__("producto_imagen")
    
    def get_by_producto(self, producto_id: int) -> APIResponse:
        """Obtiene imágenes de un producto"""
        try:
            query = """
                SELECT * FROM producto_imagen 
                WHERE producto_id = %s AND is_active = 1 
                ORDER BY is_principal DESC, orden ASC
            """
            results = db.execute_query(query, (producto_id,))
            
            return APIResponse(
                success=True,
                message=f"Imágenes del producto {producto_id} obtenidas",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

class RellenoService(BaseService):
    def __init__(self):
        super().__init__("relleno")
    
    def get_disponibles(self) -> APIResponse:
        """Obtiene rellenos disponibles"""
        try:
            query = """
                SELECT * FROM relleno 
                WHERE is_disponible = 1 AND is_active = 1 
                ORDER BY is_premium DESC, precio_adicional ASC, orden_display ASC
            """
            results = db.execute_query(query)
            
            return APIResponse(
                success=True,
                message="Rellenos disponibles obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_producto(self, producto_id: int) -> APIResponse:
        """Obtiene rellenos disponibles para un producto"""
        try:
            query = """
                SELECT r.* FROM relleno r
                INNER JOIN producto_relleno pr ON r.id = pr.relleno_id
                WHERE pr.producto_id = %s AND r.is_disponible = 1 AND r.is_active = 1
                ORDER BY r.is_premium DESC, r.precio_adicional ASC
            """
            results = db.execute_query(query, (producto_id,))
            
            return APIResponse(
                success=True,
                message=f"Rellenos para producto {producto_id} obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

class TamañoService(BaseService):
    def __init__(self):
        super().__init__("tamaño")
    
    def get_disponibles(self) -> APIResponse:
        """Obtiene tamaños disponibles"""
        try:
            query = """
                SELECT * FROM tamaño 
                WHERE is_disponible = 1 AND is_active = 1 
                ORDER BY orden_display ASC, multiplicador_precio ASC
            """
            results = db.execute_query(query)
            
            return APIResponse(
                success=True,
                message="Tamaños disponibles obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_producto(self, producto_id: int) -> APIResponse:
        """Obtiene tamaños disponibles para un producto"""
        try:
            query = """
                SELECT t.* FROM tamaño t
                INNER JOIN producto_tamaño pt ON t.id = pt.tamaño_id
                WHERE pt.producto_id = %s AND t.is_disponible = 1 AND t.is_active = 1
                ORDER BY t.orden_display ASC
            """
            results = db.execute_query(query, (producto_id,))
            
            return APIResponse(
                success=True,
                message=f"Tamaños para producto {producto_id} obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

class TestimonioService(BaseService):
    def __init__(self):
        super().__init__("testimonio")
    
    def get_publicos(self) -> APIResponse:
        """Obtiene testimonios públicos"""
        try:
            query = """
                SELECT * FROM testimonio 
                WHERE is_publico = 1 AND is_active = 1 
                ORDER BY is_destacado DESC, rating DESC, created_at DESC
            """
            results = db.execute_query(query)
            
            return APIResponse(
                success=True,
                message="Testimonios públicos obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )
    
    def get_by_producto(self, producto_id: int) -> APIResponse:
        """Obtiene testimonios de un producto"""
        try:
            query = """
                SELECT * FROM testimonio 
                WHERE producto_id = %s AND is_publico = 1 AND is_active = 1 
                ORDER BY is_destacado DESC, rating DESC, created_at DESC
            """
            results = db.execute_query(query, (producto_id,))
            
            return APIResponse(
                success=True,
                message=f"Testimonios del producto {producto_id} obtenidos",
                data=results or [],
                count=len(results) if results else 0
            )
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error: {str(e)}",
                data=[],
                count=0
            )

# ============================================
# SERVICIOS DE RELACIONES
# ============================================

class ProductoRellenoService(BaseService):
    def __init__(self):
        super().__init__("producto_relleno")
    
    def create_relation(self, producto_id: int, relleno_id: int) -> APIResponse:
        """Crea una relación producto-relleno"""
        try:
            # Verificar si ya existe
            check_query = "SELECT COUNT(*) as count FROM producto_relleno WHERE producto_id = %s AND relleno_id = %s"
            result = db.execute_query(check_query, (producto_id, relleno_id), fetch_all=False)
            
            if result and result['count'] > 0:
                return APIResponse(
                    success=False,
                    message=f"Relación producto {producto_id} - relleno {relleno_id} ya existe",
                    data=[],
                    count=0
                )
            
            # Crear nueva relación
            insert_query = "INSERT INTO producto_relleno (producto_id, relleno_id) VALUES (%s, %s)"
            result = db.execute_query(insert_query, (producto_id, relleno_id), fetch_all=False)
            
            if result is not None:
                return APIResponse(
                    success=True,
                    message=f"Relación producto-relleno creada exitosamente",
                    data=[{"producto_id": producto_id, "relleno_id": relleno_id}],
                    count=1
                )
            else:
                return APIResponse(
                    success=False,
                    message="Error al crear relación producto-relleno",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )
    
    def delete_relation(self, producto_id: int, relleno_id: int) -> APIResponse:
        """Elimina una relación producto-relleno"""
        try:
            delete_query = "DELETE FROM producto_relleno WHERE producto_id = %s AND relleno_id = %s"
            result = db.execute_query(delete_query, (producto_id, relleno_id), fetch_all=False)
            
            if result is not None and result > 0:
                return APIResponse(
                    success=True,
                    message=f"Relación producto-relleno eliminada exitosamente",
                    data=[],
                    count=0
                )
            else:
                return APIResponse(
                    success=False,
                    message="Relación no encontrada",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )
    
    def sync_producto_rellenos(self, producto_id: int, rellenos_ids: list) -> APIResponse:
        """Sincroniza todos los rellenos de un producto"""
        try:
            # 1. Eliminar todas las relaciones existentes
            delete_query = "DELETE FROM producto_relleno WHERE producto_id = %s"
            db.execute_query(delete_query, (producto_id,), fetch_all=False)
            
            # 2. Insertar nuevas relaciones
            if rellenos_ids:
                insert_query = "INSERT INTO producto_relleno (producto_id, relleno_id) VALUES (%s, %s)"
                for relleno_id in rellenos_ids:
                    db.execute_query(insert_query, (producto_id, relleno_id), fetch_all=False)
            
            return APIResponse(
                success=True,
                message=f"Rellenos sincronizados para producto {producto_id}",
                data=[{"producto_id": producto_id, "rellenos_count": len(rellenos_ids)}],
                count=len(rellenos_ids)
            )
            
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error al sincronizar rellenos: {str(e)}",
                data=[],
                count=0
            )

class ProductoTamañoService(BaseService):
    def __init__(self):
        super().__init__("producto_tamaño")
    
    def create_relation(self, producto_id: int, tamaño_id: int) -> APIResponse:
        """Crea una relación producto-tamaño"""
        try:
            # Verificar si ya existe
            check_query = "SELECT COUNT(*) as count FROM producto_tamaño WHERE producto_id = %s AND tamaño_id = %s"
            result = db.execute_query(check_query, (producto_id, tamaño_id), fetch_all=False)
            
            if result and result['count'] > 0:
                return APIResponse(
                    success=False,
                    message=f"Relación producto {producto_id} - tamaño {tamaño_id} ya existe",
                    data=[],
                    count=0
                )
            
            # Crear nueva relación
            insert_query = "INSERT INTO producto_tamaño (producto_id, tamaño_id) VALUES (%s, %s)"
            result = db.execute_query(insert_query, (producto_id, tamaño_id), fetch_all=False)
            
            if result is not None:
                return APIResponse(
                    success=True,
                    message=f"Relación producto-tamaño creada exitosamente",
                    data=[{"producto_id": producto_id, "tamaño_id": tamaño_id}],
                    count=1
                )
            else:
                return APIResponse(
                    success=False,
                    message="Error al crear relación producto-tamaño",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )
    
    def delete_relation(self, producto_id: int, tamaño_id: int) -> APIResponse:
        """Elimina una relación producto-tamaño"""
        try:
            delete_query = "DELETE FROM producto_tamaño WHERE producto_id = %s AND tamaño_id = %s"
            result = db.execute_query(delete_query, (producto_id, tamaño_id), fetch_all=False)
            
            if result is not None and result > 0:
                return APIResponse(
                    success=True,
                    message=f"Relación producto-tamaño eliminada exitosamente",
                    data=[],
                    count=0
                )
            else:
                return APIResponse(
                    success=False,
                    message="Relación no encontrada",
                    data=[],
                    count=0
                )
                
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error interno: {str(e)}",
                data=[],
                count=0
            )
    
    def sync_producto_tamaños(self, producto_id: int, tamaños_ids: list) -> APIResponse:
        """Sincroniza todos los tamaños de un producto"""
        try:
            # 1. Eliminar todas las relaciones existentes
            delete_query = "DELETE FROM producto_tamaño WHERE producto_id = %s"
            db.execute_query(delete_query, (producto_id,), fetch_all=False)
            
            # 2. Insertar nuevas relaciones
            if tamaños_ids:
                insert_query = "INSERT INTO producto_tamaño (producto_id, tamaño_id) VALUES (%s, %s)"
                for tamaño_id in tamaños_ids:
                    db.execute_query(insert_query, (producto_id, tamaño_id), fetch_all=False)
            
            return APIResponse(
                success=True,
                message=f"Tamaños sincronizados para producto {producto_id}",
                data=[{"producto_id": producto_id, "tamaños_count": len(tamaños_ids)}],
                count=len(tamaños_ids)
            )
            
        except Exception as e:
            return APIResponse(
                success=False,
                message=f"Error al sincronizar tamaños: {str(e)}",
                data=[],
                count=0
            )

# ============================================
# INSTANCIAS DE SERVICIOS
# ============================================

categoria_service = CategoriaService()
producto_service = ProductoService()
producto_imagen_service = ProductoImagenService()
relleno_service = RellenoService()
tamaño_service = TamañoService()
testimonio_service = TestimonioService()
producto_relleno_service = ProductoRellenoService()
producto_tamaño_service = ProductoTamañoService() 