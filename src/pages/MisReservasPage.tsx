import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css'
import { supabase } from '../supabaseClient'
import { getCurrentUser } from '../auth'
import ChatBot from '../components/ChatBot'

type TipoReserva = 'cata' | 'quesos' | 'cena' | 'privado'

interface ReservaRow {
  id: number
  fecha_reserva: string
  hora_reserva: string
  numero_comensales: number
  tipo_reserva: TipoReserva
  detalles_adicionales: string | null
  estado: string
}

export default function MisReservas() {
  const [reservas, setReservas] = useState<ReservaRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')
  const navigate = useNavigate()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate('/login')
      return
    }

    const cargar = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha_reserva', { ascending: false })
        .order('hora_reserva', { ascending: false })

      if (error) {
        console.error('Error cargando reservas:', error)
        setError('No se pudieron cargar tus reservas.')
      } else {
        setReservas(data || [])
      }

      setLoading(false)
    }

    cargar()
  }, [navigate])

  const formatFecha = (iso: string) => {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })
  }

  const formatHora = (time: string) => {
    const [h, m] = time.split(':')
    const d = new Date()
    d.setHours(Number(h), Number(m), 0, 0)
    return d.toLocaleTimeString('es-CR', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getTipoLabel = (tipo: TipoReserva) => {
    switch (tipo) {
      case 'cata':
        return 'Cata de vinos'
      case 'quesos':
        return 'Tabla de quesos'
      case 'cena':
        return 'Cena maridaje'
      case 'privado':
        return 'Evento privado'
      default:
        return tipo
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' }
      case 'cancelada':
        return { bg: '#ffebee', border: '#f44336', text: '#c62828' }
      default:
        return { bg: '#fff3e0', border: '#ff9800', text: '#e65100' }
    }
  }

  const reservasFiltradas = filtroEstado === 'todas' 
    ? reservas 
    : reservas.filter(r => r.estado === filtroEstado)

  const estadisticas = {
    total: reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'confirmada').length,
    pendientes: reservas.filter(r => r.estado === 'pendiente').length,
    canceladas: reservas.filter(r => r.estado === 'cancelada').length,
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '90px',
        backgroundImage: "url('/Imagenes Wine/vino-fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(44,10,26,0.92) 0%, rgba(0,0,0,0.85) 100%)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '20px',
          minHeight: 'calc(100vh - 90px)',
        }}
      >
        {/* Header con estadísticas */}
        <div
          style={{
            background: 'linear-gradient(135deg, #5a0015 0%, #2c0a1a 100%)',
            borderRadius: '12px',
            padding: '36px 40px',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'slideDown 0.5s ease-out',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: '2em',
              marginBottom: '8px',
              fontWeight: '600',
            }}
          >
            Mis Reservas
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1em',
              marginBottom: '28px',
              fontWeight: '300',
            }}
          >
            Gestiona y consulta todas tus experiencias
          </p>

          {/* Estadísticas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div style={{ color: 'white', fontSize: '2em', fontWeight: '600', marginBottom: '4px' }}>
                {estadisticas.total}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9em' }}>
                Total
              </div>
            </div>
            <div
              style={{
                background: 'rgba(76,175,80,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid rgba(76,175,80,0.3)',
              }}
            >
              <div style={{ color: 'white', fontSize: '2em', fontWeight: '600', marginBottom: '4px' }}>
                {estadisticas.confirmadas}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9em' }}>
                Confirmadas
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,193,7,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid rgba(255,193,7,0.3)',
              }}
            >
              <div style={{ color: 'white', fontSize: '2em', fontWeight: '600', marginBottom: '4px' }}>
                {estadisticas.pendientes}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9em' }}>
                Pendientes
              </div>
            </div>
            <div
              style={{
                background: 'rgba(244,67,54,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                border: '1px solid rgba(244,67,54,0.3)',
              }}
            >
              <div style={{ color: 'white', fontSize: '2em', fontWeight: '600', marginBottom: '4px' }}>
                {estadisticas.canceladas}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9em' }}>
                Canceladas
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontWeight: '500',
                color: '#5a0015',
                fontSize: '0.95em',
              }}
            >
              Filtrar:
            </span>
            {['todas', 'confirmada', 'pendiente', 'cancelada'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: `2px solid ${filtroEstado === estado ? '#5a0015' : '#ddd'}`,
                  background: filtroEstado === estado ? '#5a0015' : 'white',
                  color: filtroEstado === estado ? 'white' : '#5a0015',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize',
                  fontSize: '0.9em',
                }}
                onMouseEnter={(e) => {
                  if (filtroEstado !== estado) {
                    e.currentTarget.style.borderColor = '#5a0015'
                  }
                }}
                onMouseLeave={(e) => {
                  if (filtroEstado !== estado) {
                    e.currentTarget.style.borderColor = '#ddd'
                  }
                }}
              >
                {estado === 'todas' ? 'Todas' : estado}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            minHeight: '400px',
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#5a0015',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #f0f0f0',
                  borderTop: '4px solid #5a0015',
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ fontSize: '1.05em', color: '#666' }}>
                Cargando reservas...
              </p>
            </div>
          )}

          {error && (
            <div
              style={{
                background: '#fff5f5',
                color: '#d32f2f',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #f44336',
                borderLeft: '4px solid #f44336',
                textAlign: 'center',
                fontSize: '1em',
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && reservasFiltradas.length === 0 && filtroEstado !== 'todas' && (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#666',
              }}
            >
              <h3 style={{ color: '#5a0015', marginBottom: '8px', fontSize: '1.3em' }}>
                No hay reservas con este estado
              </h3>
              <p style={{ fontSize: '0.95em' }}>Prueba con otro filtro o crea una nueva reserva</p>
            </div>
          )}

          {!loading && !error && reservas.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
              }}
            >
              <h3
                style={{
                  color: '#5a0015',
                  marginBottom: '12px',
                  fontSize: '1.5em',
                }}
              >
                Comienza tu experiencia
              </h3>
              <p
                style={{
                  color: '#666',
                  marginBottom: '28px',
                  fontSize: '1em',
                }}
              >
                No tienes reservas registradas. Explora nuestras experiencias exclusivas.
              </p>
              <button
                type="button"
                onClick={() => navigate('/reserva')}
                style={{
                  background: 'linear-gradient(135deg, #5a0015 0%, #8b0025 100%)',
                  color: 'white',
                  padding: '14px 36px',
                  fontSize: '1em',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(90,0,21,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Hacer mi primera reserva
              </button>
            </div>
          )}

          {!loading && reservasFiltradas.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              {reservasFiltradas.map((r) => {
                const estadoColors = getEstadoColor(r.estado)
                return (
                  <div
                    key={r.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      padding: '24px',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
                      e.currentTarget.style.borderColor = '#5a0015'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                      e.currentTarget.style.borderColor = '#e0e0e0'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '1.2em',
                            fontWeight: '600',
                            color: '#5a0015',
                            marginBottom: '6px',
                          }}
                        >
                          {getTipoLabel(r.tipo_reserva)}
                        </div>
                        <div
                          style={{
                            color: '#666',
                            fontSize: '0.95em',
                          }}
                        >
                          {formatFecha(r.fecha_reserva)} • {formatHora(r.hora_reserva)}
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '6px 16px',
                          borderRadius: '6px',
                          fontWeight: '500',
                          fontSize: '0.85em',
                          textTransform: 'capitalize',
                          background: estadoColors.bg,
                          color: estadoColors.text,
                          border: `1px solid ${estadoColors.border}`,
                        }}
                      >
                        {r.estado}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        padding: '16px',
                        background: '#f8f8f8',
                        borderRadius: '8px',
                        marginBottom: r.detalles_adicionales ? '16px' : '0',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '4px' }}>
                          Comensales
                        </div>
                        <div style={{ fontSize: '1.1em', fontWeight: '600', color: '#5a0015' }}>
                          {r.numero_comensales}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '4px' }}>
                          Reserva #
                        </div>
                        <div style={{ fontSize: '1.1em', fontWeight: '600', color: '#5a0015' }}>
                          {r.id}
                        </div>
                      </div>
                    </div>

                    {r.detalles_adicionales && (
                      <div
                        style={{
                          background: '#f8f5f2',
                          padding: '14px',
                          borderRadius: '6px',
                          borderLeft: '3px solid #5a0015',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.85em',
                            color: '#666',
                            marginBottom: '4px',
                            fontWeight: '500',
                          }}
                        >
                          Comentarios:
                        </div>
                        <div style={{ color: '#333', fontSize: '0.95em', lineHeight: '1.5' }}>
                          {r.detalles_adicionales}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Botón para nueva reserva */}
          {!loading && reservas.length > 0 && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <p
                style={{
                  color: '#666',
                  marginBottom: '16px',
                  fontSize: '0.95em',
                }}
              >
                ¿Quieres vivir otra experiencia?
              </p>
              <button
                type="button"
                onClick={() => navigate('/reserva')}
                style={{
                  background: 'linear-gradient(135deg, #5a0015 0%, #8b0025 100%)',
                  color: 'white',
                  padding: '12px 32px',
                  fontSize: '0.95em',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(90,0,21,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Reservar nueva experiencia
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 3 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: '500',
            background: 'rgba(0,0,0,0.5)',
            padding: '12px 24px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            fontSize: '0.95em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(90,0,21,0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)'
          }}
        >
          ← Volver al inicio
        </Link>
      </div>

      <ChatBot />

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #5a0015;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #8b0025;
        }
      `}</style>
    </div>
  )
}