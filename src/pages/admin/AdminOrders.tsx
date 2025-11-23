// src/pages/admin/AdminOrders.tsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAllOrders, updateOrderStatus, PedidoConItems } from '../../services/orderService'
import { ShoppingCart, User, Calendar, DollarSign, Package, Eye, Check, X, RefreshCw } from 'lucide-react'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
}

interface OrderWithUser extends PedidoConItems {
    usuario_nombre?: string
    usuario_apellido?: string
    usuario_email?: string
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<OrderWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pendiente' | 'completado' | 'cancelado' | 'expirado'>('all')
    const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        setLoading(true)
        try {
            const data = await getAllOrders()
            setOrders(data as OrderWithUser[])
        } catch (error) {
            console.error('Error loading orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (orderId: number, newStatus: 'completado' | 'cancelado' | 'expirado', returnStock: boolean = false) => {
        if (!confirm(`¿Estás seguro de marcar este pedido como ${newStatus}?`)) return

        const success = await updateOrderStatus(orderId, newStatus, returnStock)
        if (success) {
            alert(`Pedido actualizado a ${newStatus}`)
            loadOrders()
            setShowDetails(false)
        } else {
            alert('Error al actualizar el pedido')
        }
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.estado === filter)

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return COLORS.warning
            case 'completado': return COLORS.success
            case 'cancelado': return COLORS.danger
            case 'expirado': return '#6b7280'
            default: return COLORS.textLight
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pendiente': return 'Pendiente'
            case 'completado': return 'Completado'
            case 'cancelado': return 'Cancelado'
            case 'expirado': return 'Expirado'
            default: return status
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
    }

    if (loading) {
        return (
            <AdminLayout title="Gestión de Pedidos">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <ShoppingCart size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ marginTop: '20px', color: COLORS.textLight }}>Cargando pedidos...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Gestión de Pedidos">
            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '30px'
            }}>
                <StatCard
                    title="Total Pedidos"
                    value={orders.length}
                    color={COLORS.primary}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Pendientes"
                    value={orders.filter(o => o.estado === 'pendiente').length}
                    color={COLORS.warning}
                    icon={RefreshCw}
                />
                <StatCard
                    title="Completados"
                    value={orders.filter(o => o.estado === 'completado').length}
                    color={COLORS.success}
                    icon={Check}
                />
                <StatCard
                    title="Cancelados"
                    value={orders.filter(o => o.estado === 'cancelado').length}
                    color={COLORS.danger}
                    icon={X}
                />
            </div>

            {/* Filters */}
            <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['all', 'pendiente', 'completado', 'cancelado', 'expirado'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            style={{
                                padding: '10px 20px',
                                background: filter === status ? COLORS.primary : 'white',
                                color: filter === status ? 'white' : COLORS.text,
                                border: `2px solid ${filter === status ? COLORS.primary : COLORS.border}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {status === 'all' ? 'Todos' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: COLORS.primary,
                    marginBottom: '20px',
                    fontFamily: '"Playfair Display", serif'
                }}>
                    Pedidos de Clientes ({filteredOrders.length})
                </h2>

                {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: COLORS.textLight }}>
                        <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                        <p>No hay pedidos {filter !== 'all' ? `con estado "${getStatusLabel(filter)}"` : ''}</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.95rem'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                                    <th style={tableHeaderStyle}>Número</th>
                                    <th style={tableHeaderStyle}>Cliente</th>
                                    <th style={tableHeaderStyle}>Fecha</th>
                                    <th style={tableHeaderStyle}>Items</th>
                                    <th style={tableHeaderStyle}>Total</th>
                                    <th style={tableHeaderStyle}>Estado</th>
                                    <th style={tableHeaderStyle}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        style={{
                                            borderBottom: `1px solid ${COLORS.border}`,
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = COLORS.background}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={tableCellStyle}>
                                            <strong>#{order.numero_pedido}</strong>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <User size={16} color={COLORS.textLight} />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>
                                                        {order.usuario_nombre} {order.usuario_apellido}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: COLORS.textLight }}>
                                                        {order.usuario_email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={14} color={COLORS.textLight} />
                                                <span style={{ fontSize: '0.9rem' }}>
                                                    {new Date(order.fecha_pedido).toLocaleDateString('es-MX')}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Package size={14} color={COLORS.textLight} />
                                                {order.items?.length || 0} items
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <DollarSign size={14} color={COLORS.success} />
                                                <strong>{formatCurrency(order.total)}</strong>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                background: `${getStatusColor(order.estado)}20`,
                                                color: getStatusColor(order.estado),
                                                fontWeight: 600,
                                                fontSize: '0.85rem'
                                            }}>
                                                {getStatusLabel(order.estado)}
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    setShowDetails(true)
                                                }}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: COLORS.primary,
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#7a0020'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primary}
                                            >
                                                <Eye size={14} />
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showDetails && selectedOrder && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: COLORS.white,
                        borderRadius: '16px',
                        maxWidth: '800px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '30px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowDetails(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: COLORS.textLight
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{
                            fontSize: '1.8rem',
                            color: COLORS.primary,
                            marginBottom: '20px',
                            fontFamily: '"Playfair Display", serif'
                        }}>
                            Pedido #{selectedOrder.numero_pedido}
                        </h2>

                        {/* Customer Info */}
                        <div style={{
                            background: COLORS.background,
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: COLORS.text }}>Información del Cliente</h3>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <p><strong>Nombre:</strong> {selectedOrder.usuario_nombre} {selectedOrder.usuario_apellido}</p>
                                <p><strong>Email:</strong> {selectedOrder.usuario_email}</p>
                                <p><strong>Estado:</strong> <span style={{ color: getStatusColor(selectedOrder.estado), fontWeight: 600 }}>{getStatusLabel(selectedOrder.estado)}</span></p>
                            </div>
                        </div>

                        {/* Order Info */}
                        <div style={{
                            background: COLORS.background,
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: COLORS.text }}>Detalles del Pedido</h3>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                <p><strong>Fecha de Pedido:</strong> {formatDate(selectedOrder.fecha_pedido)}</p>
                                <p><strong>Fecha de Vencimiento:</strong> {formatDate(selectedOrder.fecha_vencimiento)}</p>
                                {selectedOrder.fecha_completado && (
                                    <p><strong>Fecha de Completado:</strong> {formatDate(selectedOrder.fecha_completado)}</p>
                                )}
                                <p><strong>Descuento Aplicado:</strong> {formatCurrency(selectedOrder.descuento_aplicado)}</p>
                                <p><strong>Total:</strong> <span style={{ fontSize: '1.3rem', color: COLORS.primary, fontWeight: 700 }}>{formatCurrency(selectedOrder.total)}</span></p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div style={{
                            background: COLORS.background,
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ marginBottom: '15px', color: COLORS.text }}>Productos</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {selectedOrder.items?.map((item) => (
                                    <div key={item.id} style={{
                                        background: COLORS.white,
                                        padding: '15px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '5px' }}>{item.nombre_vino}</div>
                                            <div style={{ fontSize: '0.9rem', color: COLORS.textLight }}>
                                                Cantidad: {item.cantidad} × {formatCurrency(item.precio_unitario)}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: COLORS.primary }}>
                                            {formatCurrency(item.subtotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedOrder.estado === 'pendiente' && (
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completado')}
                                    style={{
                                        padding: '12px 24px',
                                        background: COLORS.success,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Check size={18} />
                                    Marcar como Completado
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelado', true)}
                                    style={{
                                        padding: '12px 24px',
                                        background: COLORS.danger,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <X size={18} />
                                    Cancelar Pedido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </AdminLayout>
    )
}

// Helper Components
function StatCard({ title, value, color, icon: Icon }: { title: string; value: number; color: string; icon: any }) {
    return (
        <div style={{
            background: COLORS.white,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: `1px solid ${COLORS.border}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon size={22} color={color} />
                </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.text, marginBottom: '5px' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.9rem', color: COLORS.textLight, fontWeight: 500 }}>
                {title}
            </div>
        </div>
    )
}

const tableHeaderStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '15px 12px',
    fontWeight: 700,
    color: COLORS.text,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
}

const tableCellStyle: React.CSSProperties = {
    padding: '15px 12px',
    color: COLORS.text
}
