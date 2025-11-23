// src/services/wineService.ts
import { supabase } from '../supabaseClient'

export interface Wine {
    id?: string
    nombre: string
    tipo: string
    pais: string
    region: string
    precio: number
    descripcion: string
    imagen?: string
    stock: number
    stock_minimo: number
    activo: boolean
    created_at?: string
    updated_at?: string
}

/**
 * Obtiene todos los vinos activos
 */
export async function getAllWines(): Promise<Wine[]> {
    const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true })

    if (error) {
        console.error('Error fetching wines:', error)
        throw error
    }

    return data || []
}

/**
 * Obtiene todos los vinos (incluyendo inactivos) - solo para admin
 */
export async function getAllWinesAdmin(): Promise<Wine[]> {
    const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .order('nombre', { ascending: true })

    if (error) {
        console.error('Error fetching wines (admin):', error)
        throw error
    }

    return data || []
}

/**
 * Obtiene un vino por ID
 */
export async function getWineById(id: string): Promise<Wine | null> {
    const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching wine:', error)
        return null
    }

    return data
}

/**
 * Crea un nuevo vino (solo admin)
 */
export async function createWine(wine: Omit<Wine, 'id' | 'created_at' | 'updated_at'>): Promise<Wine | null> {
    const { data, error } = await supabase
        .from('vinos')
        .insert([wine])
        .select()
        .single()

    if (error) {
        console.error('Error creating wine:', error)
        throw error
    }

    return data
}

/**
 * Actualiza un vino existente (solo admin)
 */
export async function updateWine(id: string, updates: Partial<Wine>): Promise<Wine | null> {
    const { data, error } = await supabase
        .from('vinos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating wine:', error)
        throw error
    }

    return data
}

/**
 * Elimina un vino (soft delete - marca como inactivo)
 */
export async function deleteWine(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('vinos')
        .update({ activo: false })
        .eq('id', id)

    if (error) {
        console.error('Error deleting wine:', error)
        return false
    }

    return true
}

/**
 * Actualiza el stock de un vino
 */
export async function updateStock(id: string, stock: number): Promise<Wine | null> {
    if (stock < 0) {
        throw new Error('El stock no puede ser negativo')
    }

    const { data, error } = await supabase
        .from('vinos')
        .update({ stock })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating stock:', error)
        throw error
    }

    return data
}

/**
 * Obtiene vinos con stock bajo (stock <= stock_minimo)
 */
export async function getLowStockWines(): Promise<Wine[]> {
    const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .eq('activo', true)
        .order('stock', { ascending: true })

    if (error) {
        console.error('Error fetching low stock wines:', error)
        return []
    }

    // Filtrar en el cliente ya que comparar columnas (stock <= stock_minimo) 
    // es complejo directamente en la query sin una vista o RPC
    return (data || []).filter(wine => wine.stock <= wine.stock_minimo)
}

/**
 * Busca vinos por nombre, tipo o país
 */
export async function searchWines(query: string): Promise<Wine[]> {
    const searchTerm = `%${query}%`

    const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .eq('activo', true)
        .or(`nombre.ilike.${searchTerm},tipo.ilike.${searchTerm},pais.ilike.${searchTerm}`)
        .order('nombre', { ascending: true })

    if (error) {
        console.error('Error searching wines:', error)
        return []
    }

    return data || []
}

/**
 * Obtiene estadísticas de vinos
 */
export async function getWineStats() {
    const { data, error } = await supabase
        .from('estadisticas_admin')
        .select('*')
        .single()

    if (error) {
        console.error('Error fetching stats:', error)
        return {
            total_vinos_activos: 0,
            total_vinos_inactivos: 0,
            vinos_stock_bajo: 0,
            total_usuarios: 0,
            total_admins: 0,
            stock_total: 0
        }
    }

    return data
}
