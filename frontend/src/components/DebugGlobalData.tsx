'use client';
import { useGlobalData } from '@/context/GlobalDataContext';

export default function DebugGlobalData() {
  const { 
    categorias, 
    productos, 
    imagenes, 
    loading, 
    error, 
    lastUpdated,
    getProductosDestacados,
    getCategoriasDestacadas
  } = useGlobalData();

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
        🔄 Cargando datos globales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
        ❌ Error: {error}
      </div>
    );
  }

  const productosDestacados = getProductosDestacados();
  const categoriasDestacadas = getCategoriasDestacadas();

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <div className="text-sm">
        <h4 className="font-bold mb-2">📊 Datos Globales Cargados</h4>
        <div className="space-y-1">
          <div>✅ Categorías: {categorias.length}</div>
          <div>✅ Productos: {productos.length}</div>
          <div>✅ Imágenes: {imagenes.length}</div>
          <div>⭐ Destacados: {productosDestacados.length}</div>
          <div>🏷️ Cat. Destacadas: {categoriasDestacadas.length}</div>
          {lastUpdated && (
            <div className="text-xs opacity-75">
              Actualizado: {
                lastUpdated instanceof Date 
                  ? lastUpdated.toLocaleTimeString()
                  : new Date(lastUpdated).toLocaleTimeString()
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 