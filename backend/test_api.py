import requests
import json
from time import sleep

# Configuración de la API
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

def test_endpoint(url, description):
    """Función para probar un endpoint y mostrar resultados"""
    print(f"\n🔗 Probando: {description}")
    print(f"📡 URL: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if 'count' in data:
                print(f"📊 Registros encontrados: {data['count']}")
            print(f"🔍 Muestra de respuesta:")
            print(json.dumps(data, indent=2, ensure_ascii=False)[:500] + "...")
        else:
            print(f"❌ Error: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")

def main():
    """Función principal para probar todos los endpoints"""
    
    print("🚀 INICIANDO PRUEBAS DE API KOKORITO")
    print("=" * 60)
    
    # Lista de endpoints para probar
    tests = [
        # Endpoint raíz
        (f"{BASE_URL}/", "Endpoint raíz"),
        (f"{API_BASE}/health", "Estado de salud de la API"),
        
        # Categorías
        (f"{API_BASE}/categorias", "Todas las categorías"),
        (f"{API_BASE}/categorias/1", "Categoría por ID (1)"),
        (f"{API_BASE}/categorias/destacadas/list", "Categorías destacadas"),
        
        # Productos
        (f"{API_BASE}/productos", "Todos los productos"),
        (f"{API_BASE}/productos/1", "Producto por ID (1)"),
        (f"{API_BASE}/productos/destacados/list", "Productos destacados"),
        (f"{API_BASE}/productos/categoria/1", "Productos de categoría 1"),
        
        # Rellenos
        (f"{API_BASE}/rellenos", "Todos los rellenos"),
        (f"{API_BASE}/rellenos/disponibles/list", "Rellenos disponibles"),
        (f"{API_BASE}/rellenos/producto/1", "Rellenos para producto 1"),
        
        # Tamaños
        (f"{API_BASE}/tamaños", "Todos los tamaños"),
        (f"{API_BASE}/tamaños/disponibles/list", "Tamaños disponibles"),
        (f"{API_BASE}/tamaños/producto/1", "Tamaños para producto 1"),
        
        # Testimonios
        (f"{API_BASE}/testimonios", "Todos los testimonios"),
        (f"{API_BASE}/testimonios/publicos/list", "Testimonios públicos"),
        (f"{API_BASE}/testimonios/producto/1", "Testimonios del producto 1"),
        
        # Imágenes
        (f"{API_BASE}/producto-imagenes", "Todas las imágenes"),
        (f"{API_BASE}/producto-imagenes/producto/1", "Imágenes del producto 1"),
        
        # Relaciones
        (f"{API_BASE}/producto-rellenos", "Relaciones producto-relleno"),
        (f"{API_BASE}/producto-tamaños", "Relaciones producto-tamaño"),
    ]
    
    # Contador de resultados
    total_tests = len(tests)
    passed_tests = 0
    
    # Ejecutar todas las pruebas
    for url, description in tests:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                passed_tests += 1
                test_endpoint(url, description)
            else:
                print(f"\n❌ FALLO: {description}")
                print(f"📡 URL: {url}")
                print(f"🔴 Status: {response.status_code}")
                
        except Exception as e:
            print(f"\n❌ ERROR: {description}")
            print(f"📡 URL: {url}")
            print(f"🔴 Error: {e}")
        
        sleep(0.5)  # Pausa breve entre pruebas
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📋 RESUMEN DE PRUEBAS")
    print("=" * 60)
    print(f"✅ Pruebas exitosas: {passed_tests}/{total_tests}")
    print(f"❌ Pruebas fallidas: {total_tests - passed_tests}")
    print(f"📊 Porcentaje de éxito: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("✅ La API está funcionando correctamente")
    else:
        print("\n⚠️  Algunas pruebas fallaron")
        print("💡 Revisa la configuración de la base de datos y el servidor")
    
    print("\n📖 Documentación disponible en: http://localhost:8000/docs")

if __name__ == "__main__":
    main() 