import { FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css'
import { supabase } from '../supabaseClient'
import { getCurrentUser } from '../auth'
import { isBirthday, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday'

type DatosReserva = {
  nombre: string
  personas: number
  fecha: string
  hora: string
  tipo: string
}

// función de validación para limpiar handleSubmit
function validarReserva({ nombre, personas, fecha, hora, tipo }: DatosReserva): string | null {
  if (!nombre || !fecha || !hora || !tipo || !personas) {
    return 'Por favor completa todos los campos.'
  }

  if (personas <= 0) {
    return 'La cantidad de personas debe ser al menos 1.'
  }

  // Validar fecha futura (no permitir ayer o antes)
  const hoy = new Date().toISOString().split('T')[0] // "yyyy-mm-dd"
  if (fecha < hoy) {
    return 'La fecha debe ser futura.'
  }

  return null
}

export default function Reserva() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isBirthdayToday, setIsBirthdayToday] = useState(false)
  const [userName, setUserName] = useState('')

  // 🎂 Verificar si es el cumpleaños del usuario
  useEffect(() => {
    const checkBirthday = async () => {
      const user = getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from('usuarios')
        .select('fecha_cumpleanos, nombre')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        setUserName(data.nombre)
        if (data.fecha_cumpleanos && isBirthday(data.fecha_cumpleanos)) {
          setIsBirthdayToday(true)
        }
      }
    }

    checkBirthday()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setOk(null)

    const user = getCurrentUser()
    if (!user) {
      setError('Debes iniciar sesión para hacer una reserva.')
      return
    }

    if (loading) return
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const nombre = String(formData.get('nombre') || '').trim()
    const personas = Number(formData.get('personas') || 0)
    const fecha = String(formData.get('fecha') || '').trim()
    const hora = String(formData.get('hora') || '').trim()
    const tipo = String(formData.get('tipo') || '').trim()
    const detalles = String(formData.get('mensaje') || '').trim()

    const err = validarReserva({ nombre, personas, fecha, hora, tipo })
    if (err) {
      setError(err)
      setLoading(false)
      return
    }

    // INSERTAR RESERVA EN SUPABASE
    const { error: insertError } = await supabase
      .from('reservas')
      .insert([
        {
          usuario_id: user.id,
          fecha_reserva: fecha,
          hora_reserva: hora,
          numero_comensales: personas,
          tipo_reserva: tipo,
          detalles_adicionales: detalles || null,
          descuento_aplicado: isBirthdayToday ? BIRTHDAY_DISCOUNT_PERCENT : 0, // 🎂 Guardar descuento
          // estado lo pone la BD como 'pendiente'
        },
      ])

    if (insertError) {
      console.error('Error al guardar reserva:', insertError)
      setError(insertError.details || insertError.message || 'Error desconocido al guardar la reserva.')
      setLoading(false)
      return
    }

    setOk('Reserva registrada correctamente')
    e.currentTarget.reset()
    setLoading(false)



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
          maxWidth: 650,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 90px)',
          padding: '20px',
        }}
      >
        <div className="modal-content" style={{ width: '100%', backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ backgroundColor: '#5a0015' }}>
            <h2>Reservar Experiencia</h2>
            <div className="modal-subtitle">Completa la información para tu visita</div>
          </div>

          <div className="modal-body">
            {/* 🎂 Banner de cumpleaños */}
            {isBirthdayToday && (
              <div style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 100%)',
                border: '2px solid #d4af37',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '8px'
                }}>🎉🎂✨</div>
                <h3 style={{
                  color: '#5a0015',
                  margin: '0 0 8px 0',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>¡Feliz Cumpleaños{userName ? `, ${userName}` : ''}!</h3>
                <p style={{
                  color: '#2c1810',
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>🎁 Tienes un <strong>{BIRTHDAY_DISCOUNT_PERCENT}% de descuento</strong> en tu reserva de hoy</p>
              </div>
            )}
            {error && (
              <div className="wine-alert" role="alert" aria-live="assertive">
                <div className="icon">!</div>
                <div>
                  <div className="title">No pudimos completar tu reserva</div>
                  <p className="msg">{error}</p>
                </div>
                <button
                  type="button"
                  className="close"
                  onClick={() => setError(null)}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            )}

            {ok && (
              <div
                className="wine-alert"
                style={{
                  background: "#e7f7ee",
                  borderColor: "#badbcc",
                  color: "#0f5132",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="icon"
                  style={{
                    background: "#0f5132",
                    color: "white",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </div>

                <div style={{ flex: 1 }}>
                  <div className="title" style={{ fontWeight: 600 }}>
                    Reserva completada
                  </div>
                  <p className="msg" style={{ margin: 0 }}>{ok}</p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/mis-reservas')}
                  style={{
                    background: "#5a0015",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ver mis reservas
                </button>
              </div>
            )}


            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="personas">Personas</label>
                  <input
                    id="personas"
                    name="personas"
                    type="number"
                    min={1}
                    placeholder="Ej. 2"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hora">Hora</label>
                  <input
                    id="hora"
                    name="hora"
                    type="time"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="tipo">Tipo de experiencia</label>
                <select id="tipo" name="tipo">
                  <option value="">Selecciona una opción</option>
                  <option value="cata">Cata de Vinos</option>
                  <option value="quesos">Tabla de Quesos</option>
                  <option value="cena">Cena Maridaje</option>
                  <option value="privado">Evento Privado</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="mensaje">Comentarios adicionales</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Notas especiales o alergias..."
                />
              </div>

              <button type="submit" className="confirm-btn" disabled={loading}>
                {loading ? 'Guardando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="back-home" style={{ position: 'fixed', top: 20, left: 20, zIndex: 3 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
