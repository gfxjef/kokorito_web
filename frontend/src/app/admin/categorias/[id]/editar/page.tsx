'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import CategoriaForm from '@/components/admin/categorias/CategoriaForm'
import { Categoria } from '@/types/admin/Categoria'
import categoriaService from '@/services/admin/categoriaService'
import Breadcrumbs from '@/components/admin/Breadcrumbs'

interface EditarCategoriaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditarCategoriaPage({ params }: EditarCategoriaPageProps) {
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategoria = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Await params since it's now a Promise in Next.js 15
        const resolvedParams = await params
        console.log('🔍 Cargando categoría con ID:', resolvedParams.id)
        
        const id = parseInt(resolvedParams.id)
        if (isNaN(id)) {
          setError('ID inválido')
          return
        }

        const response = await categoriaService.getById(id)
        console.log('✅ Categoría cargada:', response.data)
        
        // Si response.data es un array, tomar el primer elemento
        const categoriaData = Array.isArray(response.data) ? response.data[0] : response.data
        console.log('📋 Categoría procesada:', categoriaData)
        setCategoria(categoriaData)
      } catch (err: any) {
        console.error('❌ Error al cargar categoría:', err)
        setError(`Error al cargar categoría: ${err.message || 'Error desconocido'}`)
      } finally {
        setLoading(false)
      }
    }

    loadCategoria()
  }, [params])

  const breadcrumbItems = [
    { name: 'Categorías', href: '/admin/categorias' },
    { name: categoria?.nombre || 'Editar', current: true }
  ]

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Cargar Categoría">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Cargando categoría...</div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  if (error || !categoria) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Error">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700">{error || 'Categoría no encontrada'}</div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout title={`Editar: ${categoria.nombre}`}>
        <Breadcrumbs items={breadcrumbItems} />
        <CategoriaForm categoria={categoria} isEdit={true} />
      </AdminLayout>
    </ProtectedRoute>
  )
} 