// src/services/orderService.ts
import { supabase } from '../supabaseClient'
import { CartItem } from '../utils/cartUtils'

export interface Pedido {
    id: number
    usuario_id: number
    numero_pedido: string
    estado: 'pendiente' | 'completado' | 'cancelado' | 'expirado'
    total: number
    descuento_aplicado: number
    fecha_pedido: string
    fecha_vencimiento: string
    fecha_completado?: string
    notas?: string
}

export interface PedidoItem {
    id: number
    pedido_id: number
    vino_id: number
    nombre_vino: string
    cantidad: number
    precio_unitario: number
    subtotal: number
}

export interface PedidoConItems extends Pedido {
    items: PedidoItem[]
}

/**
 * Verificar si el usuario tiene un pedido pendiente
 */
export const checkPendingOrder = async (userId: number): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('id')
            .eq('usuario_id', userId)
            .eq('estado', 'pendiente')
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
        return !!data
    } catch (error) {
        console.error('Error checking pending order:', error)
        return false
    }
}

/**
 * Crear un nuevo pedido
 */
export const createOrder = async (
    userId: number,
    items: CartItem[],
    total: number,
    descuento: number = 0
): Promise<Pedido | null> => {
    try {
        // 1. Verificar que no tenga pedido pendiente
        const hasPending = await checkPendingOrder(userId)
        if (hasPending) {
            throw new Error('Ya tienes un pedido pendiente. Complétalo antes de crear uno nuevo.')
        }

        // 2. Verificar stock disponible
        for (const item of items) {
            const { data: vino } = await supabase
                .from('vinos')
                .select('stock')
                .eq('id', item.vino_id)
                .single()

            if (!vino || vino.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para ${item.nombre}`)
            }
        }

        // 3. Crear pedido
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({
                usuario_id: userId,
                total,
                descuento_aplicado: descuento
            })
            .select()
            .single()

        if (pedidoError) throw pedidoError

        // 4. Crear items del pedido
        const pedidoItems = items.map(item => ({
            pedido_id: pedido.id,
            vino_id: item.vino_id,
            nombre_vino: item.nombre,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad
        }))

        const { error: itemsError } = await supabase
            .from('pedido_items')
            .insert(pedidoItems)

        if (itemsError) throw itemsError

        // 5. Reducir stock (manual update)
        for (const item of items) {
            // Obtener stock actual
            const { data: vino } = await supabase
                .from('vinos')
                .select('stock')
                .eq('id', item.vino_id)
                .single();
            const currentStock = vino?.stock ?? 0;
            const newStock = currentStock - item.cantidad;
            if (newStock < 0) {
                throw new Error(`Stock negativo para ${item.nombre}`);
            }
            await supabase
                .from('vinos')
                .update({ stock: newStock })
                .eq('id', item.vino_id);
        }

        return pedido
    } catch (error) {
        console.error('Error creating order:', error)
        if (error instanceof Error) {
            alert(error.message)
        }
        return null
    }
}

/**
 * Obtener pedidos del usuario
 */
export const getUserOrders = async (userId: number): Promise<PedidoConItems[]> => {
    try {
        const { data: pedidos, error: pedidosError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('usuario_id', userId)
            .order('fecha_pedido', { ascending: false })

        if (pedidosError) throw pedidosError

        // Obtener items para cada pedido
        const pedidosConItems: PedidoConItems[] = []
        for (const pedido of pedidos || []) {
            const { data: items } = await supabase
                .from('pedido_items')
                .select('*')
                .eq('pedido_id', pedido.id)

            pedidosConItems.push({
                ...pedido,
                items: items || []
            })
        }

        return pedidosConItems
    } catch (error) {
        console.error('Error getting user orders:', error)
        return []
    }
}

/**
 * Obtener todos los pedidos (admin)
 */
export const getAllOrders = async (): Promise<PedidoConItems[]> => {
    try {
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                usuarios!inner(nombre, apellido, email)
            `)
            .order('fecha_pedido', { ascending: false })

        if (error) throw error

        // Obtener items para cada pedido
        const pedidosConItems: any[] = []
        for (const pedido of pedidos || []) {
            const { data: items } = await supabase
                .from('pedido_items')
                .select('*')
                .eq('pedido_id', pedido.id)

            pedidosConItems.push({
                ...pedido,
                items: items || [],
                usuario_nombre: pedido.usuarios.nombre,
                usuario_apellido: pedido.usuarios.apellido,
                usuario_email: pedido.usuarios.email
            })
        }

        return pedidosConItems
    } catch (error) {
        console.error('Error getting all orders:', error)
        return []
    }
}

/**
 * Actualizar estado del pedido
 */
export const updateOrderStatus = async (
    orderId: number,
    estado: 'completado' | 'cancelado' | 'expirado',
    returnStock: boolean = false
): Promise<boolean> => {
    try {
        const updates: any = { estado }

        if (estado === 'completado') {
            updates.fecha_completado = new Date().toISOString()
        }

        const { error } = await supabase
            .from('pedidos')
            .update(updates)
            .eq('id', orderId)

        if (error) throw error

        // Si se cancela o expira, devolver stock
        if (returnStock && (estado === 'cancelado' || estado === 'expirado')) {
            // Si se cancela o expira, devolver stock (manual update)
            if (returnStock && (estado === 'cancelado' || estado === 'expirado')) {
                const { data: items } = await supabase
                    .from('pedido_items')
                    .select('vino_id, cantidad')
                    .eq('pedido_id', orderId)

                for (const item of items || []) {
                    // Obtener stock actual
                    const { data: vino } = await supabase
                        .from('vinos')
                        .select('stock')
                        .eq('id', item.vino_id)
                        .single()
                    const currentStock = vino?.stock ?? 0
                    const newStock = currentStock + item.cantidad
                    await supabase
                        .from('vinos')
                        .update({ stock: newStock })
                        .eq('id', item.vino_id)
                }
            }
        }

        return true
    } catch (error) {
        console.error('Error updating order status:', error)
        return false
    }
}

/**
 * Obtener detalles de un pedido específico
 */
export const getOrderDetails = async (orderId: number): Promise<PedidoConItems | null> => {
    try {
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', orderId)
            .single()

        if (pedidoError) throw pedidoError

        const { data: items, error: itemsError } = await supabase
            .from('pedido_items')
            .select('*')
            .eq('pedido_id', orderId)

        if (itemsError) throw itemsError

        return {
            ...pedido,
            items: items || []
        }
    } catch (error) {
        console.error('Error getting order details:', error)
        return null
    }
}
