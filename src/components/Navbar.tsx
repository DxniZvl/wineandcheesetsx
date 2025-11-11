import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/Imagenes Wine/Imagen3.jpg" alt="Logo" height={40} />
        <h1 className="companyname">Wine & Cheese</h1>
      </div>

      <ul className="nav-links">
        <li><NavLink to="/">Inicio</NavLink></li>
        <li><NavLink to="/menu">Menú</NavLink></li>
        <li><NavLink to="/eventos">Eventos</NavLink></li>
        <li><NavLink to="/reservas">Reservas</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  )
}
