import { useEffect, useRef } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Eventos from './pages/Eventos'
import Reserva from './pages/Reserva'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Admin from './pages/Admin'
import './App.css' // si quieres, o bórralo si no lo usas

export default function App() {
  const navbarRef = useRef<HTMLElement | null>(null)

  // Efecto scroll para navbar
  useEffect(() => {
    const onScroll = () => {
      const nav = navbarRef.current
      if (!nav) return
      if (window.scrollY > 50) nav.classList.add('scrolled')
      else nav.classList.remove('scrolled')
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Animaciones de aparición (opcional: Home/Contactos)
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
      {/* NAVBAR (mismas clases que tu CSS) */}
      <header className="navbar" ref={navbarRef as any}>
        <div className="logo-container">
          <NavLink to="/">
            <img src="/Imagenes Wine/Imagen3.jpg" alt="Logo" />
          </NavLink>
          <h1 className="companyname">Wine & Cheese</h1>
        </div>

        <div className="nav-container">
          <ul className="nav-links">
            <li><NavLink to="/">Inicio</NavLink></li>
            <li><NavLink to="/menu">Menú</NavLink></li>
            <li><NavLink to="/eventos">Eventos</NavLink></li>
            <li><NavLink to="/reservas">Reservas</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
          </ul>
          <NavLink className="reserva-btn" to="/reservas">Reservar</NavLink>
        </div>
      </header>

      {/* CONTENIDO */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/reservas" element={<Reserva />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* FOOTER simple */}
      <footer style={{ textAlign: 'right', padding: '2rem', color: '#333' }}>
        © {new Date().getFullYear()} Wine & Cheese
      </footer>
    </>
  )
}
