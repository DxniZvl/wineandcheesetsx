import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

// Import your pages (you can fill them later)
import Home from './pages/Home'
import Menu from './pages/Menu'
import Eventos from './pages/Eventos'
import Reserva from './pages/Reserva'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/reservas" element={<Reserva />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Wine & Cheese</p>
      </footer>
    </>
  )
}
