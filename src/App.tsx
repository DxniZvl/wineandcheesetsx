import { useEffect, useRef } from 'react'
import './App.css'
import './style.css'

export default function App() {
  const navbarRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const nav = navbarRef.current
      if (!nav) return
      if (window.scrollY > 10) nav.classList.add('scrolled')
      else nav.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const toAnimate = document.querySelectorAll<HTMLElement>(
      '.nosotros-text, .contactos-info, .contactos-datos'
    )
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('animate')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    toAnimate.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar" ref={navbarRef}>
        <div className="logo-container">
          <img src="/Imagenes Wine/Imagen3.jpg" alt="Logo" />
          <h1 className="companyname">Wine & Cheese</h1>
        </div>

        <div className="nav-container">
          <ul className="nav-links">
            <li><a href="#home">Inicio</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#contactos">Contactos</a></li>
          </ul>
          <a className="reserva-btn" href="#reservar">Reservar</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="home">
        <div className="hero-text">
          <p className="hero-welcome">Bienvenidos</p>
          <h2>Experiencias con vino y queso</h2>
          <div className="botones-extra">
            <a className="vino-button" href="#nosotros">Conócenos</a>
            <a className="vino-button" href="#contactos">Ubicación</a>
          </div>
        </div>
      </header>

      {/* NOSOTROS */}
      <section className="nosotros-section" id="nosotros">
        <div className="container">
          <div className="nosotros-content">
            <div className="nosotros-imagen-izq">
              <img src="/Imagenes Wine/Imagen3.jpg" alt="Bodega / experiencia" />
            </div>

            <div className="nosotros-text">
              <div className="nosotros-subtitle">Tradición & Sabor</div>
              <h2>Nuestra Historia</h2>
              <p>
                En <strong>Wine & Cheese</strong> celebramos la armonía entre
                vinos selectos y quesos artesanales. Creamos momentos memorables
                con maridajes para todos los gustos.
              </p>
              <p>
                Te esperamos con experiencias guiadas, catas y un ambiente
                diseñado para disfrutar.
              </p>
            </div>

            <div className="nosotros-imagen-der">
              <img src="/Imagenes Wine/Imagen3.jpg" alt="Cata / maridaje" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTOS */}
      <section className="contactos-section" id="contactos">
        <div className="contactos-content">
          <div className="contactos-info">
            <h3>Visítanos</h3>
            <p>Ambiente acogedor, música suave, y una carta seleccionada.</p>

            <div className="logo-home">
              <a href="#home" aria-label="Volver al inicio">
                <img src="/Imagenes Wine/Imagen3.jpg" alt="Logo" />
              </a>
            </div>
          </div>

          <div className="contactos-datos">
            <h3>Contacto</h3>

            <div className="contacto-item">
              <div className="contacto-icon">📍</div>
              <div className="contacto-info">
                <strong>Dirección</strong>
                <p>San José, Costa Rica</p>
              </div>
            </div>

            <div className="contacto-item">
              <div className="contacto-icon">☎️</div>
              <div className="contacto-info">
                <strong>Teléfono</strong>
                <p>+506 0000 0000</p>
              </div>
            </div>

            <div className="contacto-item">
              <div className="contacto-icon">⏰</div>
              <div className="contacto-info">
                <strong>Horario</strong>
                <p>Mar–Dom, 12:00–22:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="social-icons">
          <a className="social-icon facebook" href="#" aria-label="Facebook">
            <img src="/Imagenes Wine/Imagen3.jpg" alt="" />
          </a>
          <a className="social-icon instagram" href="#" aria-label="Instagram">
            <img src="/Imagenes Wine/Imagen3.jpg" alt="" />
          </a>
          <a className="social-icon waze" href="#" aria-label="Waze">
            <img src="/Imagenes Wine/Imagen3.jpg" alt="" />
          </a>
        </div>
      </section>

      {/* MODAL */}
      <div id="loginModal" className="modal" role="dialog" aria-modal="true" aria-hidden="true">
        <div className="modal-content login-modal">
          <div className="modal-header">
            <h2>Iniciar Sesión</h2>
            <div className="modal-subtitle">Bienvenido de nuevo</div>
            <span className="close" aria-label="Cerrar">×</span>
          </div>
          <div className="modal-body">
            <div className="form-group full-width">
              <label>Email</label>
              <input type="email" placeholder="tu@email.com" />
            </div>
            <div className="form-group full-width">
              <label>Contraseña</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="confirm-btn">Entrar</button>
            <div className="register-link">¿No tienes cuenta? <a href="#">Regístrate</a></div>
          </div>
        </div>
      </div>
    </>
  )
}
