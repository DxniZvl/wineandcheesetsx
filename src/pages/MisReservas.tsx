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
        .order('fecha_reserva', { ascending: true })
        .order('hora_reserva', { ascending: true })

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
    // iso = "2025-11-18"
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    })
  }

  const formatHora = (time: string) => {
    // "19:30:00" → "7:30 p. m."
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

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return 'estado-badge estado-confirmada'
      case 'cancelada':
        return 'estado-badge estado-cancelada'
      default:
        return 'estado-badge estado-pendiente'
    }
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
      {/* overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,.55)',
          zIndex: 1,
          backdropFilter: 'blur(4px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 90px)',
          padding: '20px',
        }}
      >
        <div className="modal-content" style={{ width: '100%', backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ backgroundColor: '#5a0015' }}>
            <h2>Mis Reservas</h2>
            <div className="modal-subtitle">
              Consulta el historial de tus experiencias en Wine and Cheese
            </div>
          </div>

          <div className="modal-body">
            {loading && <div className="usuario-info">Cargando reservas…</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && reservas.length === 0 && (
              <div className="usuario-info">
                <p>No tienes reservas registradas todavía.</p>
                <button
                  className="confirm-btn"
                  type="button"
                  onClick={() => navigate('/reservas')}
                >
                  Hacer mi primera reserva
                </button>
              </div>
            )}

            {!loading && reservas.length > 0 && (
              <div className="reservas-lista">
                {reservas.map((r) => (
                  <div key={r.id} className="reserva-card">
                    <div className="reserva-card-header">
                      <span className="reserva-fecha">
                        {formatFecha(r.fecha_reserva)} – {formatHora(r.hora_reserva)}
                      </span>
                      <span className={getEstadoBadgeClass(r.estado)}>
                        {r.estado}
                      </span>
                    </div>

                    <div className="reserva-card-body">
                      <div className="reserva-tipo">
                        {getTipoLabel(r.tipo_reserva)}
                      </div>
                      <div className="reserva-detalle">
                        <strong>Personas:</strong> {r.numero_comensales}
                      </div>
                      {r.detalles_adicionales && (
                        <div className="reserva-detalle">
                          <strong>Comentarios:</strong> {r.detalles_adicionales}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="register-link" style={{ marginTop: 25 }}>
              ¿Quieres hacer una nueva reserva?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => navigate('/reserva')}
              >
                Reservar ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="back-home" style={{ position: 'fixed', top: 20, left: 20, zIndex: 3 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al inicio
        </Link>
      </div>

      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  )
}
