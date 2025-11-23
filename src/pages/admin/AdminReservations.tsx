// src/pages/admin/AdminReservations.tsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../supabaseClient'
import { Calendar, Search, Check, X, Users, Clock } from 'lucide-react'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0'
}

type TipoReserva = 'cata' | 'quesos' | 'cena' | 'privado'

interface Reserva {
    id: number
    usuario_id: number
    fecha_reserva: string
    hora_reserva: string
    numero_comensales: number
    tipo_reserva: TipoReserva
    detalles_adicionales: string | null
    estado: 'pendiente' | 'confirmada' | 'cancelada'
    descuento_aplicado: number
    created_at: string
}

interface ReservaConUsuario extends Reserva {
    usuario_nombre: string
    usuario_apellido: string
    usuario_email: string
}

export default function AdminReservations() {
    const [reservas, setReservas] = useState<ReservaConUsuario[]>([])
    const [filteredReservas, setFilteredReservas] = useState<ReservaConUsuario[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterEstado, setFilterEstado] = useState('all')

    useEffect(() => {
        loadReservations()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [reservas, searchTerm, filterEstado])

    const loadReservations = async () => {
        try {
            // Fetch reservations with user information using a join
            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    usuarios!inner(nombre, apellido, email)
                `)
                .order('fecha_reserva', { ascending: false })
                .order('hora_reserva', { ascending: false })

            if (error) throw error

            // Transform the data to flatten user info
            const reservasConUsuario = (data || []).map((r: any) => ({
                id: r.id,
                usuario_id: r.usuario_id,
                fecha_reserva: r.fecha_reserva,
                hora_reserva: r.hora_reserva,
                numero_comensales: r.numero_comensales,
                tipo_reserva: r.tipo_reserva,
                detalles_adicionales: r.detalles_adicionales,
                estado: r.estado,
                descuento_aplicado: r.descuento_aplicado,
                created_at: r.created_at,
                usuario_nombre: r.usuarios.nombre,
                usuario_apellido: r.usuarios.apellido,
                usuario_email: r.usuarios.email
            }))

            setReservas(reservasConUsuario)
        } catch (error) {
            console.error('Error loading reservations:', error)
            alert('Error al cargar las reservas')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = [...reservas]

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            result = result.filter(r =>
                r.usuario_nombre.toLowerCase().includes(search) ||
                r.usuario_apellido.toLowerCase().includes(search) ||
                r.usuario_email.toLowerCase().includes(search) ||
                r.id.toString().includes(search)
            )
        }

        // Status filter
        if (filterEstado !== 'all') {
            result = result.filter(r => r.estado === filterEstado)
        }

        setFilteredReservas(result)
    }

    const handleStatusChange = async (reservaId: number, newEstado: 'confirmada' | 'cancelada') => {
        try {
            if (newEstado === 'cancelada') {
                // Delete the reservation instead of updating status
                const { error } = await supabase
                    .from('reservas')
                    .delete()
                    .eq('id', reservaId)

                if (error) throw error

                alert('Reserva eliminada exitosamente')
            } else {
                // Confirm reservation (update status)
                const { error } = await supabase
                    .from('reservas')
                    .update({ estado: newEstado })
                    .eq('id', reservaId)

                if (error) throw error

                alert(`Reserva ${newEstado} exitosamente`)
            }

            loadReservations()
        } catch (error) {
            console.error('Error updating/deleting reservation:', error)
            alert('Error al procesar la reserva')
        }
    }

    const getTipoLabel = (tipo: TipoReserva) => {
        switch (tipo) {
            case 'cata': return 'Cata de Vinos'
            case 'quesos': return 'Tabla de Quesos'
            case 'cena': return 'Cena Maridaje'
            case 'privado': return 'Evento Privado'
            default: return tipo
        }
    }

    const formatFecha = (iso: string) => {
        const d = new Date(iso + 'T00:00:00')
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        })
    }

    const formatHora = (time: string) => {
        const [h, m] = time.split(':')
        const d = new Date()
        d.setHours(Number(h), Number(m), 0, 0)
        return d.toLocaleTimeString('es-ES', {
            hour: 'numeric',
            minute: '2-digit',
        })
    }

    const getEstadoBadgeStyle = (estado: string) => {
        switch (estado) {
            case 'confirmada':
                return { bg: '#e8f5e9', color: '#2e7d32', border: '#4caf50' }
            case 'cancelada':
                return { bg: '#ffebee', color: '#c62828', border: '#f44336' }
            default: // pendiente
                return { bg: '#fff3e0', color: '#e65100', border: '#ff9800' }
        }
    }

    const stats = {
        total: reservas.length,
        pendientes: reservas.filter(r => r.estado === 'pendiente').length,
        confirmadas: reservas.filter(r => r.estado === 'confirmada').length,
        canceladas: reservas.filter(r => r.estado === 'cancelada').length
    }

    if (loading) {
        return (
            <AdminLayout title="Gestión de Reservas">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <Calendar size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ marginTop: '20px', color: COLORS.textLight }}>Cargando reservas...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Gestión de Reservas">
            {/* Statistics */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <StatCard label="Total" value={stats.total} color="#2563eb" />
                <StatCard label="Pendientes" value={stats.pendientes} color="#ff9800" />
                <StatCard label="Confirmadas" value={stats.confirmadas} color="#4caf50" />
                <StatCard label="Canceladas" value={stats.canceladas} color="#f44336" />
            </div>

            {/* Filters */}
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
                    {/* Search */}
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
                            placeholder="Buscar por usuario, email o #reserva..."
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

                    {/* Status filter */}
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        style={{
                            padding: '10px',
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">Todos los estados</option>
                        <option value="pendiente">Solo Pendientes</option>
                        <option value="confirmada">Solo Confirmadas</option>
                        <option value="cancelada">Solo Canceladas</option>
                    </select>
                </div>
            </div>

            {/* Reservations Table */}
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
                                <th style={tableHeaderStyle}>ID</th>
                                <th style={tableHeaderStyle}>Usuario</th>
                                <th style={tableHeaderStyle}>Tipo</th>
                                <th style={tableHeaderStyle}>Fecha y Hora</th>
                                <th style={tableHeaderStyle}>Personas</th>
                                <th style={tableHeaderStyle}>Estado</th>
                                <th style={tableHeaderStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: COLORS.textLight }}>
                                        No se encontraron reservas
                                    </td>
                                </tr>
                            ) : (
                                filteredReservas.map(reserva => {
                                    const badgeStyle = getEstadoBadgeStyle(reserva.estado)
                                    return (
                                        <tr key={reserva.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                            <td style={tableCellStyle}>
                                                <span style={{ fontWeight: 600, color: COLORS.primary }}>
                                                    #{reserva.id}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ fontWeight: 600, color: COLORS.text }}>
                                                    {reserva.usuario_nombre} {reserva.usuario_apellido}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: COLORS.textLight }}>
                                                    {reserva.usuario_email}
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    background: 'rgba(90, 0, 21, 0.1)',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    color: COLORS.primary,
                                                    fontWeight: 600
                                                }}>
                                                    {getTipoLabel(reserva.tipo_reserva)}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                    <Calendar size={14} color={COLORS.textLight} />
                                                    <span style={{ fontSize: '0.9rem' }}>{formatFecha(reserva.fecha_reserva)}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Clock size={14} color={COLORS.textLight} />
                                                    <span style={{ fontSize: '0.9rem' }}>{formatHora(reserva.hora_reserva)}</span>
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Users size={16} color={COLORS.textLight} />
                                                    <span style={{ fontWeight: 600 }}>{reserva.numero_comensales}</span>
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                    background: badgeStyle.bg,
                                                    color: badgeStyle.color,
                                                    border: `1px solid ${badgeStyle.border}`
                                                }}>
                                                    {reserva.estado}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    {reserva.estado !== 'confirmada' && (
                                                        <button
                                                            onClick={() => handleStatusChange(reserva.id, 'confirmada')}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#4caf50',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 600,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#388e3c'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#4caf50'}
                                                        >
                                                            <Check size={14} />
                                                            Confirmar
                                                        </button>
                                                    )}
                                                    {reserva.estado !== 'cancelada' && (
                                                        <button
                                                            onClick={() => handleStatusChange(reserva.id, 'cancelada')}
                                                            style={{
                                                                padding: '6px 12px',
                                                                background: '#f44336',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 600,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}
                                                        >
                                                            <X size={14} />
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
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

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div style={{
            background: COLORS.white,
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderLeft: `4px solid ${color}`
        }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color, marginBottom: '8px' }}>
                {value}
            </div>
            <div style={{ fontSize: '0.95rem', color: COLORS.textLight, fontWeight: 500 }}>
                {label}
            </div>
        </div>
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
