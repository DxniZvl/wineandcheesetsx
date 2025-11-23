// src/pages/Carrito.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import { getCart, updateQuantity, removeFromCart, clearCart, getCartTotal, CartItem } from '../utils/cartUtils'
import { getCurrentUser } from '../auth'
import { createOrder, checkPendingOrder } from '../services/orderService'
import { generateReciboPDF } from '../utils/pdfGenerator'
import { isBirthday, applyBirthdayDiscount, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday'
import { supabase } from '../supabaseClient'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    border: '#e0e0e0'
}

export default function Carrito() {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const [isBirthdayToday, setIsBirthdayToday] = useState(false)
    const [confirmedOrder, setConfirmedOrder] = useState<{ pedido: any, items: any[], user: any } | null>(null)
    const user = getCurrentUser()

    useEffect(() => {
        loadCart()
        checkBirthday()

        const handleCartUpdate = () => loadCart()
        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
    }, [])

    const loadCart = () => {
        setCartItems(getCart())
    }

    const checkBirthday = async () => {
        if (!user) return

        try {
            const { data } = await supabase
                .from('usuarios')
                .select('fecha_cumpleanos')
                .eq('id', user.id)
                .single()

            if (data?.fecha_cumpleanos && isBirthday(data.fecha_cumpleanos)) {
                setIsBirthdayToday(true)
            }
        } catch (error) {
            console.error('Error checking birthday:', error)
        }
    }

    const handleUpdateQuantity = (vinoId: string, newQuantity: number) => {
        updateQuantity(vinoId, newQuantity)
        loadCart()
    }

    const handleRemoveItem = (vinoId: string) => {
        removeFromCart(vinoId)
        loadCart()
    }

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
        if (isBirthdayToday) {
            return applyBirthdayDiscount(subtotal)
        }
        return subtotal
    }

    const calculateDiscount = () => {
        if (!isBirthdayToday) return 0
        const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
        return subtotal - applyBirthdayDiscount(subtotal)
    }

    const handleConfirmarPedido = async () => {
        if (!user) {
            alert('Debes iniciar sesión para realizar un pedido')
            navigate('/login')
            return
        }

        if (cartItems.length === 0) {
            alert('El carrito está vacío')
            return
        }

        setLoading(true)

        try {
            // Verificar si ya tiene un pedido pendiente
            const hasPending = await checkPendingOrder(user.id)
            if (hasPending) {
                alert('Ya tienes un pedido pendiente. Complétalo o cancélalo antes de crear uno nuevo.')
                setLoading(false)
                return
            }

            // Crear pedido
            const total = calculateTotal()
            const descuento = calculateDiscount()

            const pedido = await createOrder(user.id, cartItems, total, descuento)

            if (!pedido) {
                setLoading(false)
                return
            }

            // Obtener items del pedido
            const { data: pedidoItems } = await supabase
                .from('pedido_items')
                .select('*')
                .eq('pedido_id', pedido.id)

            if (pedidoItems) {
                // Guardar estado para mostrar confirmación y opción de descarga
                setConfirmedOrder({
                    pedido,
                    items: pedidoItems,
                    user: {
                        nombre: user.nombre,
                        apellido: user.apellido,
                        email: user.email
                    }
                })
            }

            // Limpiar carrito
            clearCart()
            setCartItems([])

        } catch (error) {
            console.error('Error al crear pedido:', error)
            alert('Hubo un error al crear el pedido')
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadReceipt = async () => {
        if (!confirmedOrder) return
        try {
            await generateReciboPDF(confirmedOrder.pedido, confirmedOrder.items, confirmedOrder.user)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error al generar el recibo')
        }
    }

    const handleDownloadQuote = async () => {
        if (!user || cartItems.length === 0) return

        try {
            const total = calculateTotal()
            const descuento = calculateDiscount()

            // Mock pedido object for quote
            const mockPedido: any = {
                numero_pedido: 'COTIZACION-' + new Date().getTime().toString().slice(-6),
                fecha_pedido: new Date().toISOString(),
                fecha_vencimiento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours validity
                total: total,
                descuento_aplicado: descuento,
                estado: 'pendiente'
            }

            const mockItems: any[] = cartItems.map(item => ({
                cantidad: item.cantidad,
                nombre_vino: item.nombre,
                precio_unitario: item.precio,
                subtotal: item.precio * item.cantidad
            }))

            await generateReciboPDF(mockPedido, mockItems, {
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email
            }, {
                title: 'Cotización de Productos',
                isQuote: true
            })

        } catch (error) {
            console.error('Error generating quote:', error)
            alert(`Error al generar la cotización: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: COLORS.background }}>
                <Navbar />
                <div style={{
                    maxWidth: '600px',
                    margin: '100px auto',
                    padding: '40px',
                    background: COLORS.white,
                    borderRadius: '15px',
                    textAlign: 'center'
                }}>
                    <ShoppingCart size={64} color={COLORS.primary} style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ color: COLORS.primary, marginBottom: '15px' }}>Inicia Sesión</h2>
                    <p style={{ color: COLORS.text, marginBottom: '25px' }}>
                        Necesitas iniciar sesión para ver tu carrito y realizar pedidos
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '12px 30px',
                            background: COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        )
    }

    // Vista de confirmación de pedido
    if (confirmedOrder) {
        return (
            <div style={{ minHeight: '100vh', background: COLORS.background }}>
                <Navbar />
                <div style={{
                    maxWidth: '600px',
                    margin: '100px auto',
                    padding: '40px',
                    background: COLORS.white,
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#e8f5e9',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <span style={{ fontSize: '40px' }}>✅</span>
                    </div>

                    <h2 style={{ color: COLORS.primary, marginBottom: '15px', fontSize: '2rem' }}>
                        ¡Pedido Confirmado!
                    </h2>
                    <p style={{ color: '#666', marginBottom: '10px', fontSize: '1.1rem' }}>
                        Tu pedido <strong>#{confirmedOrder.pedido.numero_pedido}</strong> ha sido creado exitosamente.
                    </p>
                    <p style={{ color: '#666', marginBottom: '30px' }}>
                        Puedes descargar tu recibo ahora para presentarlo al momento de recoger y pagar tu pedido.
                    </p>

                    <button
                        onClick={handleDownloadReceipt}
                        style={{
                            padding: '15px 30px',
                            background: COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            marginBottom: '15px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <span></span> Descargar Recibo
                    </button>

                    <button
                        onClick={() => {
                            setConfirmedOrder(null)
                            navigate('/catalogo-vinos')
                        }}
                        style={{
                            padding: '15px 30px',
                            background: 'transparent',
                            color: COLORS.primary,
                            border: `2px solid ${COLORS.primary}`,
                            borderRadius: '10px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            width: '100%'
                        }}
                    >
                        Volver al Catálogo
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: COLORS.background }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '100px auto 40px', padding: '0 20px' }}>
                {/* Header */}
                <div style={{ marginBottom: '30px' }}>
                    <button
                        onClick={() => navigate('/catalogo-vinos')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: COLORS.primary,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginBottom: '20px',
                            fontWeight: 600
                        }}
                    >
                        <ArrowLeft size={20} />
                        Volver al Catálogo
                    </button>

                    <h1 style={{
                        fontSize: '2.5rem',
                        color: COLORS.primary,
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <ShoppingCart size={40} />
                        Mi Carrito
                    </h1>

                    {isBirthdayToday && (
                        <div style={{
                            background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 100%)',
                            border: '2px solid #d4af37',
                            borderRadius: '12px',
                            padding: '15px 20px',
                            marginTop: '20px'
                        }}>
                            <p style={{
                                margin: 0,
                                color: COLORS.primary,
                                fontWeight: 600,
                                fontSize: '1.1rem'
                            }}>
                                🎉 ¡Feliz Cumpleaños! Tienes {BIRTHDAY_DISCOUNT_PERCENT}% de descuento en todo
                            </p>
                        </div>
                    )}
                </div>

                {/* Carrito vacío */}
                {cartItems.length === 0 ? (
                    <div style={{
                        background: COLORS.white,
                        borderRadius: '15px',
                        padding: '60px 40px',
                        textAlign: 'center'
                    }}>
                        <ShoppingCart size={80} color="#ccc" style={{ margin: '0 auto 20px' }} />
                        <h2 style={{ color: COLORS.text, marginBottom: '15px' }}>Tu carrito está vacío</h2>
                        <p style={{ color: '#666', marginBottom: '30px' }}>
                            Explora nuestro catálogo y agrega tus vinos favoritos
                        </p>
                        <button
                            onClick={() => navigate('/catalogo-vinos')}
                            style={{
                                padding: '12px 30px',
                                background: COLORS.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            Ver Catálogo
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {/* Items del carrito */}
                        <div style={{
                            background: COLORS.white,
                            borderRadius: '15px',
                            padding: '25px'
                        }}>
                            {cartItems.map((item) => (
                                <div key={item.vino_id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '80px 1fr auto',
                                    gap: '20px',
                                    padding: '20px 0',
                                    borderBottom: `1px solid ${COLORS.border}`,
                                    alignItems: 'center'
                                }}>
                                    {/* Imagen */}
                                    <div style={{
                                        width: '80px',
                                        height: '120px',
                                        background: '#f0f0f0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {item.imagen_url ? (
                                            <img src={item.imagen_url} alt={item.nombre} style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }} />
                                        ) : (
                                            <span style={{ fontSize: '2rem' }}>🍷</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: COLORS.primary }}>
                                            {item.nombre}
                                        </h3>
                                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.95rem' }}>
                                            Precio: ${item.precio.toFixed(2)}
                                        </p>
                                        <p style={{ margin: 0, color: '#999', fontSize: '0.9rem' }}>
                                            Stock disponible: {item.stock}
                                        </p>
                                    </div>

                                    {/* Controles */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '15px',
                                            justifyContent: 'flex-end'
                                        }}>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.vino_id, item.cantidad - 1)}
                                                disabled={item.cantidad <= 1}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    border: `2px solid ${COLORS.primary}`,
                                                    background: 'white',
                                                    color: COLORS.primary,
                                                    cursor: item.cantidad <= 1 ? 'not-allowed' : 'pointer',
                                                    opacity: item.cantidad <= 1 ? 0.5 : 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                textAlign: 'center'
                                            }}>
                                                {item.cantidad}
                                            </span>

                                            <button
                                                onClick={() => handleUpdateQuantity(item.vino_id, item.cantidad + 1)}
                                                disabled={item.cantidad >= item.stock}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    border: `2px solid ${COLORS.primary}`,
                                                    background: 'white',
                                                    color: COLORS.primary,
                                                    cursor: item.cantidad >= item.stock ? 'not-allowed' : 'pointer',
                                                    opacity: item.cantidad >= item.stock ? 0.5 : 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <p style={{
                                            margin: '0 0 10px 0',
                                            fontSize: '1.3rem',
                                            fontWeight: 'bold',
                                            color: COLORS.primary
                                        }}>
                                            ${(item.precio * item.cantidad).toFixed(2)}
                                        </p>

                                        <button
                                            onClick={() => handleRemoveItem(item.vino_id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#f44336',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                marginLeft: 'auto'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resumen */}
                        <div style={{
                            background: COLORS.white,
                            borderRadius: '15px',
                            padding: '30px'
                        }}>
                            <h2 style={{ margin: '0 0 20px 0', color: COLORS.primary }}>
                                Resumen del Pedido
                            </h2>

                            <div style={{ marginBottom: '15px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    fontSize: '1.1rem'
                                }}>
                                    <span>Subtotal:</span>
                                    <span>${cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)}</span>
                                </div>

                                {isBirthdayToday && calculateDiscount() > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '10px',
                                        fontSize: '1.1rem',
                                        color: '#4caf50'
                                    }}>
                                        <span>Descuento ({BIRTHDAY_DISCOUNT_PERCENT}%):</span>
                                        <span>-${calculateDiscount().toFixed(2)}</span>
                                    </div>
                                )}

                                <div style={{
                                    borderTop: `2px solid ${COLORS.border}`,
                                    paddingTop: '15px',
                                    marginTop: '15px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: COLORS.primary
                                    }}>
                                        <span>TOTAL:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmarPedido}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: COLORS.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    marginTop: '20px'
                                }}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>

                        

                            <p style={{
                                margin: '20px 0 0 0',
                                fontSize: '0.9rem',
                                color: '#666',
                                textAlign: 'center'
                            }}>
                                Tendrás 48 horas para recoger tu pedido<br />
                                Pago en efectivo o tarjeta al recoger
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
