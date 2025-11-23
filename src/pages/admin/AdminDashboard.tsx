// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getWineStats } from '../../services/wineService'
import { Wine, Users, AlertTriangle, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0'
}

interface Stats {
    total_vinos_activos: number
    total_vinos_inactivos: number
    vinos_stock_bajo: number
    total_usuarios: number
    total_admins: number
    stock_total: number
}

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [stats, setStats] = useState<Stats>({
        total_vinos_activos: 0,
        total_vinos_inactivos: 0,
        vinos_stock_bajo: 0,
        total_usuarios: 0,
        total_admins: 0,
        stock_total: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const data = await getWineStats()
            setStats(data)
        } catch (error) {
            console.error('Error loading stats:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Vinos Activos',
            value: stats.total_vinos_activos,
            icon: Wine,
            color: COLORS.primary,
            bgColor: 'rgba(90, 0, 21, 0.1)',
            action: () => navigate('/admin/vinos')
        },
        {
            title: 'Usuarios Registrados',
            value: stats.total_usuarios,
            icon: Users,
            color: '#2563eb',
            bgColor: 'rgba(37, 99, 235, 0.1)',
            action: () => navigate('/admin/usuarios')
        },
        {
            title: 'Alertas de Stock',
            value: stats.vinos_stock_bajo,
            icon: AlertTriangle,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            action: () => navigate('/admin/vinos?filter=low-stock')
        },
        {
            title: 'Stock Total',
            value: stats.stock_total,
            icon: Package,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            action: () => navigate('/admin/vinos')
        }
    ]

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Wine size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ marginTop: '20px', color: COLORS.textLight }}>Cargando estadísticas...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Dashboard">
            {/* Estadísticas en cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
            }}>
                {statCards.map((card, index) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={index}
                            onClick={card.action}
                            style={{
                                background: COLORS.white,
                                borderRadius: '12px',
                                padding: '25px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: `1px solid ${COLORS.border}`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '10px',
                                    background: card.bgColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={28} color={card.color} />
                                </div>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: COLORS.text, marginBottom: '8px' }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '0.95rem', color: COLORS.textLight, fontWeight: 500 }}>
                                {card.title}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Sección de accesos rápidos */}
            <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    color: COLORS.primary,
                    marginBottom: '20px',
                    fontFamily: '"Playfair Display", serif'
                }}>
                    Accesos Rápidos
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px'
                }}>
                    <button
                        onClick={() => navigate('/admin/vinos')}
                        style={{
                            padding: '15px 20px',
                            background: COLORS.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#7a0020'
                            e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = COLORS.primary
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        <Wine size={20} />
                        Gestionar Vinos
                    </button>

                    <button
                        onClick={() => navigate('/admin/usuarios')}
                        style={{
                            padding: '15px 20px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1d4ed8'
                            e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#2563eb'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        <Users size={20} />
                        Gestionar Usuarios
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '15px 20px',
                            background: 'white',
                            color: COLORS.text,
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = COLORS.background
                            e.currentTarget.style.transform = 'scale(1.02)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        Ver Sitio Web
                    </button>
                </div>
            </div>

            {/* Información adicional */}
            {stats.vinos_stock_bajo > 0 && (
                <div style={{
                    marginTop: '20px',
                    background: '#fef3c7',
                    border: '2px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <AlertTriangle size={32} color="#f59e0b" />
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', color: '#92400e', fontSize: '1.1rem' }}>
                            ⚠️ Alerta de Inventario
                        </h3>
                        <p style={{ margin: 0, color: '#78350f' }}>
                            Hay {stats.vinos_stock_bajo} vino{stats.vinos_stock_bajo !== 1 ? 's' : ''} con stock bajo.
                            <button
                                onClick={() => navigate('/admin/vinos?filter=low-stock')}
                                style={{
                                    marginLeft: '10px',
                                    background: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Ver Detalles
                            </button>
                        </p>
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
