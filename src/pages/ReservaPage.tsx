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

function validarReserva({ nombre, personas, fecha, hora, tipo }: DatosReserva): string | null {
  if (!nombre || !fecha || !hora || !tipo || !personas) {
    return 'Por favor completa todos los campos.'
  }

  if (personas <= 0) {
    return 'La cantidad de personas debe ser al menos 1.'
  }

  const hoy = new Date().toISOString().split('T')[0]
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
  const [selectedTipo, setSelectedTipo] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

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
          descuento_aplicado: isBirthdayToday ? BIRTHDAY_DISCOUNT_PERCENT : 0,
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
    setSelectedTipo('')
    setLoading(false)
  }

  const experiencias = [
    {
      value: 'cata',
      label: 'Cata de Vinos',
      description: 'Degustación guiada de vinos selectos',
    },
    {
      value: 'quesos',
      label: 'Tabla de Quesos',
      description: 'Selección artesanal de quesos premium',
    },
    {
      value: 'cena',
      label: 'Cena Maridaje',
      description: 'Experiencia gastronómica completa',
    },
    {
      value: 'privado',
      label: 'Evento Privado',
      description: 'Espacio exclusivo personalizado',
    },
  ]

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
          maxWidth: 850,
          margin: '0 auto',
          padding: '20px',
          minHeight: 'calc(100vh - 90px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            animation: 'slideUp 0.5s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #5a0015 0%, #2c0a1a 100%)',
              padding: '48px 40px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                animation: 'shine 4s ease-in-out infinite',
              }}
            />
            
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <h2
                style={{
                  color: 'white',
                  fontSize: '2.2em',
                  margin: '0 0 8px 0',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                }}
              >
                Reservar Experiencia
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1.05em',
                  margin: 0,
                  fontWeight: '300',
                }}
              >
                Complete el formulario para confirmar su visita
              </p>
            </div>
          </div>

          <div style={{ padding: '40px' }}>
            {/* Banner de cumpleaños */}
            {isBirthdayToday && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 100%)',
                  border: '2px solid #d4af37',
                  borderRadius: '12px',
                  padding: '24px 28px',
                  marginBottom: '30px',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
                }}
              >
                <h3
                  style={{
                    color: '#5a0015',
                    margin: '0 0 6px 0',
                    fontSize: '1.4em',
                    fontWeight: '600',
                  }}
                >
                  Feliz Cumpleaños{userName ? `, ${userName}` : ''}
                </h3>
                <p
                  style={{
                    color: '#2c1810',
                    margin: 0,
                    fontSize: '1.05em',
                  }}
                >
                  Disfruta de un descuento especial del <strong>{BIRTHDAY_DISCOUNT_PERCENT}%</strong> en tu reserva de hoy
                </p>
              </div>
            )}

            {/* Alerta de error */}
            {error && (
              <div
                style={{
                  background: '#fff5f5',
                  border: '1px solid #f44336',
                  borderLeft: '4px solid #f44336',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#d32f2f', marginBottom: '4px' }}>
                    Error en la reserva
                  </div>
                  <p style={{ margin: 0, color: '#5a0015', fontSize: '0.95em' }}>{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#d32f2f',
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    lineHeight: 1,
                    padding: '0 4px',
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Alerta de éxito */}
            {ok && (
              <div
                style={{
                  background: '#f0f9f4',
                  border: '1px solid #4caf50',
                  borderLeft: '4px solid #4caf50',
                  borderRadius: '8px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'slideDown 0.4s ease-out',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px' }}>
                    Reserva confirmada
                  </div>
                  <p style={{ margin: 0, color: '#1b5e20', fontSize: '0.95em' }}>{ok}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/mis-reservas')}
                  style={{
                    background: '#5a0015',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.9em',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#8b0025')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#5a0015')}
                >
                  Ver reservas
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nombre y personas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <label
                    htmlFor="nombre"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#2c0a1a',
                      fontWeight: '500',
                      fontSize: '0.95em',
                    }}
                  >
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Ingrese su nombre"
                    onFocus={() => setFocusedField('nombre')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${focusedField === 'nombre' ? '#5a0015' : '#ddd'}`,
                      borderRadius: '8px',
                      fontSize: '1em',
                      transition: 'border-color 0.2s ease',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="personas"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#2c0a1a',
                      fontWeight: '500',
                      fontSize: '0.95em',
                    }}
                  >
                    Número de personas
                  </label>
                  <input
                    id="personas"
                    name="personas"
                    type="number"
                    min={1}
                    placeholder="Ej. 2"
                    onFocus={() => setFocusedField('personas')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${focusedField === 'personas' ? '#5a0015' : '#ddd'}`,
                      borderRadius: '8px',
                      fontSize: '1em',
                      transition: 'border-color 0.2s ease',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Fecha y hora */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <label
                    htmlFor="fecha"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#2c0a1a',
                      fontWeight: '500',
                      fontSize: '0.95em',
                    }}
                  >
                    Fecha
                  </label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    onFocus={() => setFocusedField('fecha')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${focusedField === 'fecha' ? '#5a0015' : '#ddd'}`,
                      borderRadius: '8px',
                      fontSize: '1em',
                      transition: 'border-color 0.2s ease',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="hora"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#2c0a1a',
                      fontWeight: '500',
                      fontSize: '0.95em',
                    }}
                  >
                    Hora
                  </label>
                  <input
                    id="hora"
                    name="hora"
                    type="time"
                    onFocus={() => setFocusedField('hora')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${focusedField === 'hora' ? '#5a0015' : '#ddd'}`,
                      borderRadius: '8px',
                      fontSize: '1em',
                      transition: 'border-color 0.2s ease',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Tipo de experiencia */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '12px',
                    color: '#2c0a1a',
                    fontWeight: '500',
                    fontSize: '1em',
                  }}
                >
                  Tipo de experiencia
                </label>
                <input type="hidden" name="tipo" value={selectedTipo} />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {experiencias.map((exp) => (
                    <div
                      key={exp.value}
                      onClick={() => setSelectedTipo(exp.value)}
                      style={{
                        background: selectedTipo === exp.value ? '#5a0015' : '#ffffff',
                        border: `2px solid ${selectedTipo === exp.value ? '#5a0015' : '#ddd'}`,
                        borderRadius: '10px',
                        padding: '20px 16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTipo !== exp.value) {
                          e.currentTarget.style.borderColor = '#5a0015'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTipo !== exp.value) {
                          e.currentTarget.style.borderColor = '#ddd'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '1.05em',
                          marginBottom: '6px',
                          color: selectedTipo === exp.value ? 'white' : '#5a0015',
                        }}
                      >
                        {exp.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.85em',
                          color: selectedTipo === exp.value ? 'rgba(255,255,255,0.9)' : '#666',
                          lineHeight: '1.4',
                        }}
                      >
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comentarios */}
              <div style={{ marginBottom: '28px' }}>
                <label
                  htmlFor="mensaje"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#2c0a1a',
                    fontWeight: '500',
                    fontSize: '0.95em',
                  }}
                >
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Alergias, preferencias especiales, ocasión..."
                  rows={4}
                  onFocus={() => setFocusedField('mensaje')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `2px solid ${focusedField === 'mensaje' ? '#5a0015' : '#ddd'}`,
                    borderRadius: '8px',
                    fontSize: '1em',
                    transition: 'border-color 0.2s ease',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #5a0015 0%, #8b0025 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1.05em',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.3px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(90,0,21,0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {loading ? 'Procesando reserva...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Botón volver */}
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

      {/* Estilos CSS */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(0.3) sepia(1) saturate(4) hue-rotate(315deg);
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