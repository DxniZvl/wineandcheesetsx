// src/utils/cartUtils.ts
export interface CartItem {
    vino_id: string
    nombre: string
    precio: number
    cantidad: number
    imagen_url?: string
    stock: number
}

const CART_STORAGE_KEY = 'wine_cart'

export const getCart = (): CartItem[] => {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY)
        return cartData ? JSON.parse(cartData) : []
    } catch {
        return []
    }
}

export const saveCart = (cart: CartItem[]): void => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // Disparar evento personalizado para actualizar badge
    window.dispatchEvent(new Event('cartUpdated'))
}

export const addToCart = (vino: Omit<CartItem, 'cantidad'>, cantidad: number = 1): boolean => {
    const cart = getCart()
    const existingIndex = cart.findIndex(item => item.vino_id === vino.vino_id)

    if (existingIndex >= 0) {
        // Ya existe en el carrito, actualizar cantidad
        const newCantidad = cart[existingIndex].cantidad + cantidad
        if (newCantidad > vino.stock) {
            alert(`Solo hay ${vino.stock} unidades disponibles`)
            return false
        }
        cart[existingIndex].cantidad = newCantidad
    } else {
        // Agregar nuevo item
        if (cantidad > vino.stock) {
            alert(`Solo hay ${vino.stock} unidades disponibles`)
            return false
        }
        cart.push({ ...vino, cantidad })
    }

    saveCart(cart)
    return true
}

export const removeFromCart = (vinoId: string): void => {
    const cart = getCart()
    const filtered = cart.filter(item => item.vino_id !== vinoId)
    saveCart(filtered)
}

export const updateQuantity = (vinoId: string, cantidad: number): boolean => {
    const cart = getCart()
    const itemIndex = cart.findIndex(item => item.vino_id === vinoId)

    if (itemIndex === -1) return false

    if (cantidad <= 0) {
        removeFromCart(vinoId)
        return true
    }

    if (cantidad > cart[itemIndex].stock) {
        alert(`Solo hay ${cart[itemIndex].stock} unidades disponibles`)
        return false
    }

    cart[itemIndex].cantidad = cantidad
    saveCart(cart)
    return true
}

export const clearCart = (): void => {
    localStorage.removeItem(CART_STORAGE_KEY)
    window.dispatchEvent(new Event('cartUpdated'))
}

export const getCartTotal = (): number => {
    const cart = getCart()
    return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0)
}

export const getCartCount = (): number => {
    const cart = getCart()
    return cart.reduce((count, item) => count + item.cantidad, 0)
}
