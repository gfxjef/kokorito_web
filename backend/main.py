from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

# ============================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ============================================
app = FastAPI(
    title="API Kokorito - Sistema de Consultas",
    description="API REST para consultas de información de la base de datos Kokorito",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================
# CONFIGURACIÓN DE CORS
# ============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambiar por dominios específicos
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# ============================================
# REGISTRO DE RUTAS
# ============================================
app.include_router(router, prefix="/api/v1")

# ============================================
# ENDPOINT RAÍZ
# ============================================
@app.get("/", tags=["Sistema"])
async def root():
    """Endpoint raíz de la API"""
    return {
        "success": True,
        "message": "¡Bienvenido a la API de Kokorito!",
        "description": "Sistema de consultas para la base de datos de productos",
        "version": "1.0.0",
        "documentation": "/docs",
        "status": "operational",
        "endpoints": {
            "categorias": "/api/v1/categorias",
            "productos": "/api/v1/productos", 
            "rellenos": "/api/v1/rellenos",
            "tamaños": "/api/v1/tamaños",
            "testimonios": "/api/v1/testimonios",
            "imagenes": "/api/v1/producto-imagenes",
            "relaciones": "/api/v1/producto-rellenos",
            "salud": "/api/v1/health"
        }
    }

# ============================================
# MANEJO DE ERRORES GLOBALES
# ============================================
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "success": False,
        "message": "Endpoint no encontrado",
        "error": "404 - Not Found",
        "documentation": "/docs"
    }

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return {
        "success": False,
        "message": "Error interno del servidor",
        "error": "500 - Internal Server Error",
        "support": "Contacta al administrador del sistema"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 