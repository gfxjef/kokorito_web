# 🍰 API REST Kokorito - Sistema de Consultas

API REST completa para consultas de la base de datos **atusalud_kokorito** con **8 tablas** y **múltiples endpoints** por tabla.

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz con:
```env
DB_HOST=atusaludlicoreria.com
DB_NAME=atusalud_kokorito
DB_PASSWORD=kmachin1
DB_PORT=3306
DB_USER=atusalud_atusalud
```

### 3. Iniciar servidor
```bash
# Opción 1: Con uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Opción 2: Ejecutar main.py
python main.py
```

### 4. Probar API
```bash
python test_api.py
```

## 📖 Documentación

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **API Root**: http://localhost:8000/

## 🗄️ Estructura de Base de Datos

| Tabla | Filas | Columnas | Descripción |
|-------|-------|----------|-------------|
| **categoria** | 5 | 14 | Categorías de productos |
| **producto** | 6 | 27 | Productos del catálogo |
| **producto_imagen** | 0 | 14 | Imágenes de productos |
| **producto_relleno** | 20 | 2 | Relación productos-rellenos |
| **producto_tamaño** | 14 | 2 | Relación productos-tamaños |
| **relleno** | 5 | 19 | Rellenos disponibles |
| **tamaño** | 5 | 16 | Tamaños disponibles |
| **testimonio** | 5 | 20 | Testimonios de clientes |

## 🔗 Endpoints Disponibles

### 📋 **CATEGORÍAS** `/api/v1/categorias`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/categorias` | Todas las categorías |
| `GET` | `/categorias/{id}` | Categoría por ID |
| `GET` | `/categorias/slug/{slug}` | Categoría por slug |
| `GET` | `/categorias/destacadas/list` | Categorías destacadas |

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Registros obtenidos exitosamente de categoria",
  "data": [
    {
      "id": 1,
      "nombre": "Tortas Personalizadas",
      "slug": "tortas-personalizadas",
      "descripcion": "...",
      "is_featured": true,
      "is_active": true
    }
  ],
  "count": 5
}
```

### 🛍️ **PRODUCTOS** `/api/v1/productos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/productos` | Todos los productos |
| `GET` | `/productos/{id}` | Producto por ID |
| `GET` | `/productos/slug/{slug}` | Producto por slug |
| `GET` | `/productos/categoria/{categoria_id}` | Productos por categoría |
| `GET` | `/productos/destacados/list` | Productos destacados |

### 🧁 **RELLENOS** `/api/v1/rellenos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/rellenos` | Todos los rellenos |
| `GET` | `/rellenos/{id}` | Relleno por ID |
| `GET` | `/rellenos/disponibles/list` | Rellenos disponibles |
| `GET` | `/rellenos/producto/{producto_id}` | Rellenos de un producto |

### 📏 **TAMAÑOS** `/api/v1/tamaños`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tamaños` | Todos los tamaños |
| `GET` | `/tamaños/{id}` | Tamaño por ID |
| `GET` | `/tamaños/disponibles/list` | Tamaños disponibles |
| `GET` | `/tamaños/producto/{producto_id}` | Tamaños de un producto |

### 💬 **TESTIMONIOS** `/api/v1/testimonios`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/testimonios` | Todos los testimonios |
| `GET` | `/testimonios/{id}` | Testimonio por ID |
| `GET` | `/testimonios/publicos/list` | Testimonios públicos |
| `GET` | `/testimonios/producto/{producto_id}` | Testimonios de un producto |

### 🖼️ **PRODUCTO IMÁGENES** `/api/v1/producto-imagenes`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/producto-imagenes` | Todas las imágenes |
| `GET` | `/producto-imagenes/{id}` | Imagen por ID |
| `GET` | `/producto-imagenes/producto/{producto_id}` | Imágenes de un producto |

### 🔗 **RELACIONES** `/api/v1/`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/producto-rellenos` | Relaciones producto-relleno |
| `GET` | `/producto-tamaños` | Relaciones producto-tamaño |

### 🏥 **SISTEMA** `/api/v1/`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado de la API |
| `GET` | `/` | Información general |

## 📝 Parámetros de Consulta

### Filtros Disponibles:
- `activos_solo=true/false` - Solo registros activos (por defecto: true)

**Ejemplo:**
```
GET /api/v1/productos?activos_solo=false
```

## 🎯 Ejemplos de Uso

### 1. Obtener todas las categorías activas
```bash
curl http://localhost:8000/api/v1/categorias
```

### 2. Obtener productos de una categoría específica
```bash
curl http://localhost:8000/api/v1/productos/categoria/1
```

### 3. Obtener rellenos disponibles para un producto
```bash
curl http://localhost:8000/api/v1/rellenos/producto/1
```

### 4. Obtener testimonios públicos
```bash
curl http://localhost:8000/api/v1/testimonios/publicos/list
```

## 🔧 Estructura del Proyecto

```
backend/
├── api/
│   ├── __init__.py
│   ├── database.py      # Conexión a MySQL
│   ├── models.py        # Modelos Pydantic
│   ├── services.py      # Lógica de negocio
│   └── routes.py        # Endpoints FastAPI
├── .env                 # Variables de entorno
├── main.py             # Aplicación principal
├── test_api.py         # Script de pruebas
├── requirements.txt    # Dependencias
└── README.md          # Esta documentación
```

## 🛠️ Tecnologías Utilizadas

- **FastAPI** - Framework web moderno
- **Pydantic** - Validación de datos
- **MySQL Connector** - Conexión a base de datos
- **Uvicorn** - Servidor ASGI
- **Python-dotenv** - Variables de entorno

## ✅ Estado de la API

- ✅ **8 tablas** completamente mapeadas
- ✅ **30+ endpoints** disponibles
- ✅ Conexión a BD funcionando
- ✅ Documentación automática (Swagger)
- ✅ Manejo de errores
- ✅ CORS configurado
- ✅ Script de pruebas incluido

## 🚀 Próximos Pasos

1. **Probar todos los endpoints** con el script de pruebas
2. **Integrar con el frontend** 
3. **Optimizar consultas** si es necesario
4. **Agregar cache** para mejor performance
5. **Implementar autenticación** si se requiere

## 📞 Soporte

Para problemas o consultas:
- Revisa la documentación en `/docs`
- Ejecuta las pruebas con `python test_api.py`
- Verifica la conexión a la BD en el archivo `.env` 