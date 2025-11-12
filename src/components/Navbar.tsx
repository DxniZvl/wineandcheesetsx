// src/components/Navbar.tsx
import React, { useEffect } from "react";
// Local fallback for useAuth when ../context/AuthContext is not present.
// Replace with: import { useAuth } from "../context/AuthContext";
// once you add the real AuthContext file.
type User = { id: string; name?: string } | null;
const useAuth = (): { user: User } => {
  // Default to no authenticated user; adapt to your real auth implementation.
  return { user: null };
};
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src="/Imagenes Wine/Logo.png" alt="Logo de Wine and Cheese" />
        </Link>
        <h1 className="companyname">Wine and Cheese</h1>
      </div>

      <div className="nav-container">
        <nav className="nav-links">
          <a href="/#nosotros">Nosotros</a>
          <Link to="/menu">Menú</Link>
          <Link to="/eventos">Eventos</Link>
          <a href="/eventos#juegos">Juegos</a>
          <a href="/#contactos">Contacto</a>
        </nav>

        {user ? (
          <Link to="/reservas" className="reserva-btn">Mis Reservas</Link>
        ) : (
          <Link to="/login" className="reserva-btn">Reservas</Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
