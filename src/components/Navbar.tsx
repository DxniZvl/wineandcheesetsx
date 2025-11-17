// src/components/Navbar.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCurrentUser, clearCurrentUser, isAdmin } from "../auth"; 
// 👆 This replaces the fake useAuth()

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser(); // 👈 read session from localStorage

  const handleLogout = () => {
    clearCurrentUser();        // remove session
    navigate("/");            // redirect to Home
  };

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

        {/* ------- RIGHT SIDE (User actions) ------- */}
        {user ? (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Show name */}
            <span style={{ color: "white", fontWeight: "bold" }}>
              Hola, {user.nombre}
              {isAdmin(user) && " (Admin)"}
            </span>

            {/* Reservations button */}
            <Link to="/Reserva" className="reserva-btn">
              Mis Reservas
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid white",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          // If no logged user
          <Link to="/login" className="reserva-btn">
            Reservas
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
