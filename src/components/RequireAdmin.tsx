// src/components/RequireAdmin.tsx
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser, isAdmin } from '../auth'

interface RequireAdminProps {
    children: ReactNode
}

/**
 * Componente HOC para proteger rutas administrativas
 * Redirige a login si no está autenticado
 * Muestra mensaje de error si no es admin
 */
export default function RequireAdmin({ children }: RequireAdminProps) {
    const user = getCurrentUser()

    if (!user) {
        // No autenticado, redirigir a login
        return <Navigate to="/login" replace />
    }

    if (!isAdmin(user)) {
        // Autenticado pero no es admin
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f6f3',
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '20px'
                    }}>🔒</div>
                    <h2 style={{
                        color: '#5a0015',
                        marginBottom: '15px',
                        fontSize: '1.8rem'
                    }}>
                        Acceso Denegado
                    </h2>
                    <p style={{
                        color: '#666',
                        marginBottom: '25px',
                        lineHeight: '1.6'
                    }}>
                        No tienes permisos de administrador para acceder a esta sección.
                    </p>
                    <a
                        href="/"
                        style={{
                            display: 'inline-block',
                            padding: '12px 30px',
                            background: '#5a0015',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Volver al Inicio
                    </a>
                </div>
            </div>
        )
    }

    // Usuario es admin, renderizar contenido protegido
    return <>{children}</>
}
