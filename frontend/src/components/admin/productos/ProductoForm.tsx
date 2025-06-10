'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoIcon, TrashIcon, EyeIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Producto } from '@/types/admin/Producto'
import { ProductoImagen } from '@/types/admin/ProductoImagen'
import { Categoria } from '@/types/admin/Categoria'
import { Relleno } from '@/types/admin/Relleno'
import { Tamaño } from '@/types/admin/Tamaño'
import { ProductoForm as ProductoFormType } from '@/types/admin/Producto'
import productoService from '@/services/admin/productoService'
import categoriaService from '@/services/admin/categoriaService'
import rellenoService from '@/services/admin/rellenoService'
import tamañoService from '@/services/admin/tamañoService'
import Toggle from '@/components/admin/ui/Toggle'
import ProductoImagenesIntegrada from './ProductoImagenesIntegrada'

interface ProductoFormProps {
  producto?: Producto
  isEdit?: boolean
}

export default function ProductoForm({ producto, isEdit = false }: ProductoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Datos relacionados
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [rellenos, setRellenos] = useState<Relleno[]>([])
  const [tamaños, setTamaños] = useState<Tamaño[]>([])
  
  const [formData, setFormData] = useState<ProductoFormType>({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    descripcion_corta: producto?.descripcion_corta || '',
    sku: producto?.sku || '',
    categoria_id: producto?.categoria_id || 0,
    precio_base: producto?.precio_base || 0,
    precio_oferta: producto?.precio_oferta || 0,
    fecha_inicio_oferta: producto?.fecha_inicio_oferta || '',
    fecha_fin_oferta: producto?.fecha_fin_oferta || '',
    stock_disponible: producto?.stock_disponible || 0,
    stock_minimo: producto?.stock_minimo || 5,
    peso_gramos: producto?.peso_gramos || 0,
    tiempo_preparacion_hrs: producto?.tiempo_preparacion_hrs || 60,
    ingredientes: producto?.ingredientes || '',
    informacion_nutricional: producto?.informacion_nutricional || '',
    imagen_principal: producto?.imagen_principal || '',
    orden_display: producto?.orden_display || 1,
    is_active: producto?.is_active ?? true,
    is_disponible: producto?.is_disponible ?? true,
    is_featured: producto?.is_featured ?? false,
    requiere_refrigeracion: producto?.requiere_refrigeracion ?? false,
    apto_veganos: producto?.apto_veganos ?? false,
    contiene_gluten: producto?.contiene_gluten ?? false,
    contiene_lactosa: producto?.contiene_lactosa ?? false,
    meta_title: producto?.meta_title || '',
    meta_description: producto?.meta_description || ''
  })

  const [slug, setSlug] = useState(producto?.slug || '')
  const [rellenosSeleccionados, setRellenosSeleccionados] = useState<number[]>([])
  const [tamañosSeleccionados, setTamañosSeleccionados] = useState<number[]>([])

  // Cargar datos básicos solo una vez al montar el componente
  useEffect(() => {
    console.log('🔄 ProductoForm - Montando componente, cargando datos básicos...')
    const loadBasicData = async () => {
      try {
        console.log('📡 ProductoForm - Haciendo llamadas: categorías, rellenos, tamaños')
        const [categoriasRes, rellenosRes, tamañosRes] = await Promise.all([
          categoriaService.getAll(),
          rellenoService.getAll(),
          tamañoService.getAll()
        ])
        
        setCategorias(categoriasRes.data)
        setRellenos(rellenosRes.data.filter(r => r.is_active))
        setTamaños(tamañosRes.data.filter(t => t.is_active))
        console.log('✅ ProductoForm - Datos básicos cargados')
      } catch (err) {
        console.error('Error al cargar datos básicos:', err)
      }
    }
    
    loadBasicData()
  }, []) // ✅ Sin dependencias - solo se ejecuta una vez

  // Cargar relaciones específicas solo cuando sea necesario
  useEffect(() => {
    console.log(`🔄 ProductoForm - Efecto relaciones ejecutándose. isEdit: ${isEdit}, productoId: ${producto?.id}`)
    const loadProductRelations = async () => {
      if (!isEdit || !producto?.id) {
        setLoadingData(false)
        console.log('⏭️ ProductoForm - Saltando carga de relaciones (no edit o sin ID)')
        return
      }

      try {
        console.log(`📡 ProductoForm - Cargando relaciones para producto ${producto.id}`)
        const [rellenosRes, tamañosRes] = await Promise.all([
          productoService.getProductoRellenos(producto.id),
          productoService.getProductoTamaños(producto.id)
        ])
        
        // Extraer solo los IDs de los rellenos y tamaños asociados
        const rellenosIds = rellenosRes.data.map((r: any) => r.id)
        const tamañosIds = tamañosRes.data.map((t: any) => t.id)
        
        setRellenosSeleccionados(rellenosIds)
        setTamañosSeleccionados(tamañosIds)
        
        console.log('🔗 Relaciones cargadas:', { rellenosIds, tamañosIds })
      } catch (err) {
        console.error('Error cargando relaciones del producto:', err)
      } finally {
        setLoadingData(false)
      }
    }
    
    loadProductRelations()
  }, [isEdit, producto?.id]) // ✅ Solo depende del ID, no del objeto completo

  // Auto-generar slug cuando cambia el nombre
  useEffect(() => {
    if (formData.nombre && !isEdit) {
      const generatedSlug = productoService.generateSlug(formData.nombre)
      setSlug(generatedSlug)
    }
  }, [formData.nombre, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const dataToSend = {
        ...formData,
        rellenos_ids: rellenosSeleccionados,
        tamaños_ids: tamañosSeleccionados
      }

      if (isEdit && producto) {
        await productoService.update(producto.id, dataToSend)
      } else {
        await productoService.create(dataToSend)
      }
      
      router.push('/admin/productos')
    } catch (err: any) {
      setError(err.message || 'Error al guardar producto')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductoFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleRelleno = (rellenoId: number) => {
    setRellenosSeleccionados((prev: number[]) => 
      prev.includes(rellenoId) 
        ? prev.filter(id => id !== rellenoId)
        : [...prev, rellenoId]
    )
  }

  const toggleTamaño = (tamañoId: number) => {
    setTamañosSeleccionados((prev: number[]) => 
      prev.includes(tamañoId) 
        ? prev.filter(id => id !== tamañoId)
        : [...prev, tamañoId]
    )
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Información Básica */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Información Básica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: Torta de Chocolate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="TCH001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                placeholder="torta-de-chocolate"
                readOnly={!isEdit}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                required
                value={formData.categoria_id}
                onChange={(e) => handleInputChange('categoria_id', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>Seleccionar categoría...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta
              </label>
              <input
                type="text"
                value={formData.descripcion_corta}
                onChange={(e) => handleInputChange('descripcion_corta', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción breve para listados..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Completa
              </label>
              <textarea
                rows={4}
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción detallada del producto..."
              />
            </div>
          </div>
        </div>

        {/* Precios y Stock */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Precios y Stock</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Base (S/.) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.precio_base}
                onChange={(e) => handleInputChange('precio_base', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Oferta (S/.)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.precio_oferta}
                onChange={(e) => handleInputChange('precio_oferta', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Disponible
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_disponible}
                onChange={(e) => handleInputChange('stock_disponible', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_minimo}
                onChange={(e) => handleInputChange('stock_minimo', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {formData.precio_oferta && formData.precio_oferta > 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inicio Oferta
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fecha_inicio_oferta}
                    onChange={(e) => handleInputChange('fecha_inicio_oferta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fin Oferta
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.fecha_fin_oferta}
                    onChange={(e) => handleInputChange('fecha_fin_oferta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Relaciones Many-to-Many */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rellenos */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Rellenos Disponibles
              <span className="text-sm text-gray-500 ml-2">
                ({rellenosSeleccionados.length} seleccionados)
              </span>
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rellenos.map((relleno) => (
                <div
                  key={relleno.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    rellenosSeleccionados.includes(relleno.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => toggleRelleno(relleno.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: relleno.color_hex }}
                      />
                      <span className="text-sm font-medium">{relleno.icono} {relleno.nombre}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                                                    +S/. {(typeof relleno.precio_adicional === 'number' ? relleno.precio_adicional : 0).toFixed(2)}
                    </div>
                  </div>
                  {relleno.descripcion && (
                    <p className="text-xs text-gray-500 mt-1">{relleno.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tamaños */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Tamaños Disponibles
              <span className="text-sm text-gray-500 ml-2">
                ({tamañosSeleccionados.length} seleccionados)
              </span>
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tamaños.map((tamaño) => (
                <div
                  key={tamaño.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    tamañosSeleccionados.includes(tamaño.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => toggleTamaño(tamaño.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: tamaño.color_hex }}
                      >
                        {tamaño.icono}
                      </div>
                      <span className="text-sm font-medium">{tamaño.nombre}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      +S/. {(typeof tamaño.precio_adicional === 'number' ? tamaño.precio_adicional : 0).toFixed(2)} x{tamaño.multiplicador_precio}
                    </div>
                  </div>
                  {tamaño.descripcion && (
                    <p className="text-xs text-gray-500 mt-1">{tamaño.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Información Adicional</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (gramos)
              </label>
              <input
                type="number"
                min="0"
                value={formData.peso_gramos}
                onChange={(e) => handleInputChange('peso_gramos', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo Preparación (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.tiempo_preparacion_hrs}
                onChange={(e) => handleInputChange('tiempo_preparacion_hrs', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Visualización
              </label>
              <input
                type="number"
                min="1"
                value={formData.orden_display}
                onChange={(e) => handleInputChange('orden_display', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredientes
              </label>
              <textarea
                rows={3}
                value={formData.ingredientes}
                onChange={(e) => handleInputChange('ingredientes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Lista de ingredientes..."
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Información Nutricional
              </label>
              <textarea
                rows={3}
                value={formData.informacion_nutricional}
                onChange={(e) => handleInputChange('informacion_nutricional', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Valores nutricionales por porción..."
              />
            </div>
          </div>
        </div>

        {/* Gestión de Imágenes */}
        <ProductoImagenesIntegrada 
          producto={producto} 
          isEdit={isEdit}
          onImagenPrincipalChange={(url) => handleInputChange('imagen_principal', url)}
          imagenPrincipal={formData.imagen_principal || ''}
        />

        {/* Estados y Características */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Estados y Características</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Estados</h4>
              <Toggle
                enabled={formData.is_active}
                onChange={(value) => handleInputChange('is_active', value)}
                label="Producto Activo"
              />
              
              <Toggle
                enabled={formData.is_disponible}
                onChange={(value) => handleInputChange('is_disponible', value)}
                label="Disponible para Pedidos"
              />
              
              <Toggle
                enabled={formData.is_featured}
                onChange={(value) => handleInputChange('is_featured', value)}
                label="Producto Destacado"
              />
              
              <Toggle
                enabled={formData.requiere_refrigeracion}
                onChange={(value) => handleInputChange('requiere_refrigeracion', value)}
                label="Requiere Refrigeración"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Características Alimentarias</h4>
              <Toggle
                enabled={formData.apto_veganos}
                onChange={(value) => handleInputChange('apto_veganos', value)}
                label="Apto para Veganos 🌱"
              />
              
              <Toggle
                enabled={formData.contiene_gluten}
                onChange={(value) => handleInputChange('contiene_gluten', value)}
                label="Contiene Gluten 🌾"
              />
              
              <Toggle
                enabled={formData.contiene_lactosa}
                onChange={(value) => handleInputChange('contiene_lactosa', value)}
                label="Contiene Lactosa 🥛"
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">SEO</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Título para SEO..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción para motores de búsqueda..."
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'} Producto
          </button>
        </div>
      </form>
    </div>
  )
} 