import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css'

export default function Reserva() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setOk(null)

    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const nombre = String(data.nombre || '').trim()
    const personas = Number(data.personas || 0)
    const fecha = String(data.fecha || '').trim()
    const hora = String(data.hora || '').trim()
    const tipo = String(data.tipo || '').trim()

    if (!nombre || !fecha || !hora || !tipo || !personas) {
      setError('Por favor completa todos los campos.')
      return
    }

    // DEMO → simulación
    setOk('Reserva registrada correctamente 🍷')
    e.currentTarget.reset()

    setTimeout(() => {
      navigate('/')
    }, 1500)
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
        aria-hidden="true"
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
          padding: '20px'
        }}
      >
        <div className="modal-content" style={{ width: '100%', backgroundColor: '#fff' }}>
          <div className="modal-header" style={{ backgroundColor: '#5a0015' }}>
            <h2>Reservar Experiencia</h2>
            <div className="modal-subtitle">Completa la información para tu visita</div>
          </div>

          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            {ok && (
              <div className="usuario-info">
                <p>{ok}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" type="text" placeholder="Tu nombre completo" />
                </div>

                <div className="form-group">
                  <label htmlFor="personas">Personas</label>
                  <input id="personas" name="personas" type="number" min={1} placeholder="Ej. 2" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input id="fecha" name="fecha" type="date" />
                </div>
                <div className="form-group">
                  <label htmlFor="hora">Hora</label>
                  <input id="hora" name="hora" type="time" />
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
                <textarea id="mensaje" name="mensaje" placeholder="Notas especiales o alergias..." />
              </div>

              <button type="submit" className="confirm-btn">Confirmar Reserva</button>
            </form>

            <div className="register-link" style={{ marginTop: 25 }}>
              ¿Quieres modificar tus datos? <Link to="/login">Inicia sesión</Link>
            </div>
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
