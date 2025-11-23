// src/components/AdminLayout.tsx
import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser, clearCurrentUser } from '../auth'
import { Home, Wine, Users, LogOut, BarChart3, Calendar } from 'lucide-react'

interface AdminLayoutProps {
    children: ReactNode
    title: string
}

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0'
}

/**
 * Layout común para todas las páginas de administración
 * Incluye sidebar, header y logout
 */
export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const user = getCurrentUser()

    const handleLogout = () => {
        // 🧹 Limpiar historial del ChatBot al cerrar sesión
        localStorage.removeItem('chatbot_messages');
        localStorage.removeItem('chatbot_isOpen');

        clearCurrentUser()
        navigate('/')
    }

    const menuItems = [
        { path: '/admin', icon: BarChart3, label: 'Dashboard' },
        { path: '/admin/vinos', icon: Wine, label: 'Gestión de Vinos' },
        { path: '/admin/usuarios', icon: Users, label: 'Gestión de Usuarios' },
        { path: '/admin/reservas', icon: Calendar, label: 'Gestión de Reservas' }
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: COLORS.primary,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '25px 20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.5rem',
                        fontFamily: '"Playfair Display", serif',
                        color: COLORS.secondary
                    }}>
                        Wine & Cheese
                    </h2>
                    <p style={{
                        margin: '5px 0 0',
                        fontSize: '0.85rem',
                        opacity: 0.8
                    }}>
                        Panel de Administración
                    </p>
                </div>

                {/* Usuario */}
                {user && (
                    <div style={{
                        padding: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '12px',
                            borderRadius: '8px'
                        }}>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>
                                Administrador
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {user.nombre} {user.apellido}
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '2px' }}>
                                {user.email}
                            </div>
                        </div>
                    </div>
                )}

                {/* Menú */}
                <nav style={{ flex: 1, padding: '20px 0' }}>
                    {menuItems.map(item => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                    border: 'none',
                                    borderLeft: isActive ? `4px solid ${COLORS.secondary}` : '4px solid transparent',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent'
                                    }
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                {/* Botones de navegación */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <button
                        onClick={() => navigate('/catalogo-vinos')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <Wine size={18} />
                        Ir al Catálogo
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <Home size={18} />
                        Ir al Inicio
                    </button>

                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                marginLeft: '260px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <header style={{
                    background: 'white',
                    padding: '25px 40px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2rem',
                        color: COLORS.primary,
                        fontFamily: '"Playfair Display", serif'
                    }}>
                        {title}
                    </h1>
                </header>

                {/* Content */}
                <div style={{ padding: '40px', flex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    )
}
