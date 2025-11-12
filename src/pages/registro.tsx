import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css'

export default function Registro() {
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const navigate = useNavigate()

  const markError = (ids: string[]) => {
    ids.forEach(id => {
      const el = document.getElementById(id)
      el?.classList.add('input-error', 'shake')
      setTimeout(() => el?.classList.remove('shake'), 300)
    })
  }
  const clearMarks = () => {
    ['nombre','apellido','email','fecha_nacimiento','password','password2'].forEach(
      id => document.getElementById(id)?.classList.remove('input-error')
    )
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearMarks()
    setError(null)
    setOk(null)

    const data = Object.fromEntries(new FormData(e.currentTarget).entries())

    const nombre = String(data.nombre || '').trim()
    const apellido = String(data.apellido || '').trim()
    const email = String(data.email || '').trim()
    const pass = String(data.password || '')
    const pass2 = String(data.password2 || '')
    const fecha = String(data.fecha_nacimiento || '')

    if (!nombre || !apellido || !email || !pass || !pass2 || !fecha) {
      setError('Por favor completa todos los campos.')
      const ids = [
        !nombre && 'nombre',
        !apellido && 'apellido',
        !email && 'email',
        !fecha && 'fecha_nacimiento',
        !pass && 'password',
        !pass2 && 'password2',
      ].filter(Boolean) as string[]
      markError(ids)
      return
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      setError('Correo inválido.')
      markError(['email'])
      return
    }

    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      markError(['password'])
      return
    }
    if (pass !== pass2) {
      setError('Las contraseñas no coinciden.')
      markError(['password','password2'])
      return
    }

    // Edad mínima 18
    const nacimiento = new Date(fecha)
    const hoy = new Date()
    const edad =
      hoy.getFullYear() - nacimiento.getFullYear() -
      (hoy < new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate()) ? 1 : 0)

    if (isNaN(edad) || edad < 18) {
      setError('Debes ser mayor de 18 años para registrarte.')
      markError(['fecha_nacimiento'])
      return
    }

    // DEMO: conectar backend/Supabase después
    setOk('Cuenta creada correctamente. Redirigiendo al login…')
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '90px',
        backgroundImage: "url('/Imagenes Wine/Imagen2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 1 }}
        aria-hidden="true"
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 620,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 90px)',
          padding: '20px'
        }}
      >
        <div className="modal-content login-modal" style={{ margin: 0, width: '100%' }}>
          <div className="modal-header">
            <h2>Crear Cuenta</h2>
            <div className="modal-subtitle">Regístrate para reservar y gestionar tus eventos</div>
          </div>

          <div className="modal-body">
            {/* Banner elegante */}
            {error && (
              <div className="wine-alert" role="alert" aria-live="assertive">
                <div className="icon">!</div>
                <div>
                  <div className="title">Revisa tu información</div>
                  <p className="msg">{error}</p>
                </div>
                <button type="button" className="close" onClick={() => setError(null)} aria-label="Cerrar">×</button>
              </div>
            )}
            {ok && (
              <div className="usuario-info" style={{ marginTop: 0 }}>
                <p>{ok}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input id="nombre" name="nombre" type="text" placeholder="Nombre" />
                </div>
                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input id="apellido" name="apellido" type="text" placeholder="Apellido" />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Correo electrónico</label>
                <input id="email" name="email" type="email" placeholder="ejemplo@correo.com" />
              </div>

              <div className="form-group full-width">
                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                <input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" />
                </div>
                <div className="form-group">
                  <label htmlFor="password2">Confirmar contraseña</label>
                  <input id="password2" name="password2" type="password" placeholder="Repite tu contraseña" />
                </div>
              </div>

              <button type="submit" className="confirm-btn">Crear cuenta</button>
            </form>

            <div className="register-link">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
