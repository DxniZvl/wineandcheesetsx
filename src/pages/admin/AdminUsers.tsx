// src/pages/admin/AdminUsers.tsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../supabaseClient'
import { Users, Search, Shield, Edit } from 'lucide-react'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0'
}

interface User {
    id: number
    nombre: string
    apellido: string
    email: string
    role: 'admin' | 'user'
    can_edit: boolean
    fecha_cumpleanos?: string
    created_at?: string
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all') // all, admin, user

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [users, searchTerm, filterRole])

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error

            setUsers(data || [])
        } catch (error) {
            console.error('Error loading users:', error)
            alert('Error al cargar los usuarios')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = [...users]

        // Búsqueda por texto
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            result = result.filter(u =>
                u.nombre.toLowerCase().includes(search) ||
                u.apellido.toLowerCase().includes(search) ||
                u.email.toLowerCase().includes(search)
            )
        }

        // Filtro por rol
        if (filterRole !== 'all') {
            result = result.filter(u => u.role === filterRole)
        }

        setFilteredUsers(result)
    }

    const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            alert(`Rol actualizado a ${newRole} exitosamente`)
            loadUsers()
        } catch (error) {
            console.error('Error updating role:', error)
            alert('Error al actualizar el rol')
        }
    }

    const handleCanEditToggle = async (userId: number, canEdit: boolean) => {
        try {
            const { error } = await supabase
                .from('usuarios')
                .update({ can_edit: canEdit })
                .eq('id', userId)

            if (error) throw error

            loadUsers()
        } catch (error) {
            console.error('Error updating permissions:', error)
            alert('Error al actualizar los permisos')
        }
    }

    if (loading) {
        return (
            <AdminLayout title="Gestión de Usuarios">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Users size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ marginTop: '20px', color: COLORS.textLight }}>Cargando usuarios...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Gestión de Usuarios">
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', color: COLORS.text }}>
                    Total: {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                </h2>
                <p style={{ margin: '8px 0 0', color: COLORS.textLight }}>
                    Administradores: {users.filter(u => u.role === 'admin').length} |
                    Usuarios regulares: {users.filter(u => u.role === 'user').length}
                </p>
            </div>

            {/* Filtros */}
            <div style={{
                background: COLORS.white,
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '15px'
                }}>
                    {/* Búsqueda */}
                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: COLORS.textLight
                        }} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: `2px solid ${COLORS.border}`,
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Filtro por rol */}
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{
                            padding: '10px',
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">Todos los roles</option>
                        <option value="admin">Solo Administradores</option>
                        <option value="user">Solo Usuarios</option>
                    </select>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ background: COLORS.background }}>
                                <th style={tableHeaderStyle}>Usuario</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>Rol</th>
                                <th style={tableHeaderStyle}>Puede Editar</th>
                                <th style={tableHeaderStyle}>Fecha de Registro</th>
                                <th style={tableHeaderStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: COLORS.textLight }}>
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ fontWeight: 600, color: COLORS.text }}>
                                                {user.nombre} {user.apellido}
                                            </div>
                                            {user.fecha_cumpleanos && (
                                                <div style={{ fontSize: '0.85rem', color: COLORS.textLight }}>
                                                    🎂 {new Date(user.fecha_cumpleanos).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                        <td style={tableCellStyle}>
                                            <span style={{ color: COLORS.textLight }}>{user.email}</span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <select
                                                value={user.role || 'user'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                    border: `2px solid ${user.role === 'admin' ? COLORS.primary : COLORS.border}`,
                                                    background: user.role === 'admin' ? 'rgba(90, 0, 21, 0.05)' : 'white',
                                                    color: user.role === 'admin' ? COLORS.primary : COLORS.text,
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                <option value="user">Usuario</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <label style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                width: 'fit-content'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={user.can_edit || false}
                                                    onChange={(e) => handleCanEditToggle(user.id, e.target.checked)}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <span style={{ fontSize: '0.9rem', color: COLORS.textLight }}>
                                                    {user.can_edit ? 'Sí' : 'No'}
                                                </span>
                                            </label>
                                        </td>
                                        <td style={tableCellStyle}>
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '-'}
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                {user.role === 'admin' && (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '4px 10px',
                                                        background: 'rgba(90, 0, 21, 0.1)',
                                                        borderRadius: '999px',
                                                        fontSize: '0.85rem',
                                                        color: COLORS.primary,
                                                        fontWeight: 600
                                                    }}>
                                                        <Shield size={14} />
                                                        Admin
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Información adicional */}
            <div style={{
                marginTop: '25px',
                background: '#e0f2fe',
                border: '2px solid #0ea5e9',
                borderRadius: '12px',
                padding: '20px'
            }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#075985', fontSize: '1.1rem' }}>
                    ℹ️ Acerca de Roles y Permisos
                </h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e', lineHeight: 1.8 }}>
                    <li><strong>Admin</strong>: Acceso completo al panel de administración y gestión de vinos/usuarios</li>
                    <li><strong>Usuario</strong>: Acceso básico al sitio, puede realizar reservas</li>
                    <li><strong>Puede Editar</strong>: Permiso adicional para usuarios regulares (funcionalidad futura)</li>
                </ul>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </AdminLayout>
    )
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '15px 12px',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
}

const tableCellStyle: React.CSSProperties = {
    padding: '15px 12px'
}
