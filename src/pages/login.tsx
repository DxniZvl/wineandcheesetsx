import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@./supabase'
import '../style.css'

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const email = String(data.login_email || '').trim()
    const pass = String(data.login_password || '')

    if (!email || !pass) {
      setError('Por favor completa todos los campos.')
      return
    }
   

    // DEMO: reemplazar con Supabase más adelante
    if (email === 'admin@wine.com' && pass === '1234') {
      localStorage.setItem('demo_auth', 'admin')
      navigate('/admin')
    } else if (email === 'user@wine.com' && pass === '1234') {
      localStorage.setItem('demo_auth', 'cliente')
      navigate('/reservas')
    } else {
      setError('Correo o contraseña incorrectos.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '90px',              // despega del navbar fijo
        backgroundImage: "url('/Imagenes Wine/Imagen2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* overlay del fondo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,.35)',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* contenedor centrado */}
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
        {/* tarjeta usando tus clases de “modal” */}
        <div className="modal-content login-modal" style={{ margin: 0, width: '100%' }}>
          <div className="modal-header">
            <h2>Iniciar Sesión</h2>
            <div className="modal-subtitle">Accede a tu cuenta para continuar</div>
          </div>

          <div className="modal-body">
            {error && <div className="error-message" style={{ marginTop: 0 }}>{error}</div>}

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

      {/* botón volver (opcional) */}
      <div className="back-home" style={{ position: 'fixed', top: 20, left: 20, zIndex: 3 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
