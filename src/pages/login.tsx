import { getCurrentUser, setCurrentUser, isAdmin } from '../auth'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../style.css'
import { supabase } from '../supabaseClient'


export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const markError = (ids: string[]) => {
    ids.forEach(id => {
      const el = document.getElementById(id)
      el?.classList.add('input-error', 'shake')
      setTimeout(() => el?.classList.remove('shake'), 300)
    })
  }
  const clearMarks = () => {
    ['email', 'password'].forEach(id => document.getElementById(id)?.classList.remove('input-error'))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  clearMarks()
  setError(null)

  const data = Object.fromEntries(new FormData(e.currentTarget).entries())

  const email = String(data.login_email || '').trim()
  const pass = String(data.login_password || '')

  if (!email || !pass) {
    setError('Por favor completa todos los campos.')
    markError([!email ? 'email' : '', !pass ? 'password' : ''].filter(Boolean))
    return
  }

  // 🔍 Buscar usuario por email en Supabase
  const { data: user, error: queryError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single()

  if (queryError || !user) {
    setError('Correo o contraseña incorrectos.')
    markError(['email', 'password'])
    return
  }

  // 🔐 Comparar contraseña
  if (user.password !== pass) {
    setError('Correo o contraseña incorrectos.')
    markError(['email', 'password'])
    return
  }

  // ⭐ Guardar datos del usuario logueado
  setCurrentUser({
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
  })

  // 🔁 Redirigir
  // Aquí decides:
  // Ejemplo: si el correo es admin, va al panel
  if (isAdmin(user)) {
    navigate('/admin')
  } else {
    navigate('/')
  }
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
          maxWidth: 520,
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
            <h2>Iniciar Sesión</h2>
            <div className="modal-subtitle">Accede a tu cuenta para continuar</div>
          </div>

          <div className="modal-body">
            {/* Banner elegante */}
            {error && (
              <div className="wine-alert" role="alert" aria-live="assertive">
                <div className="icon">!</div>
                <div>
                  <div className="title">Ups, algo salió mal</div>
                  <p className="msg">{error}</p>
                </div>
                <button type="button" className="close" onClick={() => setError(null)} aria-label="Cerrar">×</button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group full-width">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  name="login_email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="login_password"
                  type="password"
                  placeholder="Contraseña"
                  required
                />
              </div>

              <button type="submit" name="login" className="confirm-btn">
                Entrar
              </button>
            </form>

            <div className="register-link">
              ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
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
