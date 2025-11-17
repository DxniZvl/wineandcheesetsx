import React, { useState, useEffect } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser, clearCurrentUser } from './auth';

interface User {
  id: string;
  nombre: string;
}

const WineAndCheeseHome: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Cargar usuario real desde localStorage
  useEffect(() => {
    const u = getCurrentUser();
    if (u) setUser({ id: String(u.id), nombre: u.nombre });
  }, []);

  // Navbar scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animaciones de "Nosotros" y "Contactos"
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    const contactosObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const columnas = entry.target.querySelectorAll(
              '.contactos-info, .contactos-datos'
            );
            columnas.forEach((columna, index) => {
              setTimeout(() => {
                columna.classList.add('animate');
              }, index * 200);
            });
            contactosObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const nosotrosText = document.getElementById('nosotros-text');
    if (nosotrosText) observer.observe(nosotrosText);

    const contactosSection = document.querySelector('.contactos-section');
    if (contactosSection) contactosObserver.observe(contactosSection);

    return () => {
      if (nosotrosText) observer.unobserve(nosotrosText);
      if (contactosSection) contactosObserver.unobserve(contactosSection);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(null);
    navigate('/');
  };

  return (
    <div>
      {/* NAVBAR */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo-container">
          <img src="Imagenes Wine/Logo.png" alt="Logo de Wine and Cheese" />
          <h1 className="companyname">Wine and Cheese</h1>
        </div>

        <div className="nav-container">
          <nav className="nav-links">
            <a
              href="#nosotros"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('nosotros');
              }}
            >
              Nosotros
            </a>
            <a href="/menu">Menú</a>
            <a href="/eventos">Eventos</a>
            <a href="/eventos#juegos">Juegos</a>
            <a
              href="#contactos"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contactos');
              }}
            >
              Contacto
            </a>
          </nav>

          {/* Botones según login */}
          {user ? (
            <div className="user-menu">
              <span>¡Hola, {user.nombre}!</span>
              <button
                className="reserva-btn"
                type="button"
                onClick={() => navigate('/reservas')}
              >
                Mis Reservas
              </button>
              <button
                className="logout-btn"
                type="button"
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              className="reserva-btn"
              type="button"
              onClick={() => navigate('/login')}
            >
              Reservas
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-welcome">
            Bienvenido/a{user ? `, ${user.nombre}` : ''}
          </div>
          <h2>Wine and Cheese</h2>

          <div className="botones-extra">
            <a href="/cata-de-vinos" className="vino-button">
              Ver Catálogo
            </a>
            <a href="/menu" className="vino-button">
              Menú
            </a>
            
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section className="nosotros-section" id="nosotros">
        <div className="container">
          <div className="nosotros-content">
            <div className="nosotros-imagen-izq">
              <img
                src="Imagenes Wine/nosotros-izq.jpg"
                alt="Experiencia gastronómica"
              />
            </div>

            <div className="nosotros-text" id="nosotros-text">
              <h2>Nosotros</h2>
              <p className="nosotros-subtitle">
                Donde el sabor se convierte en arte
              </p>

              <p>
                En <strong>Wine and Cheese</strong> transformamos cada
                encuentro gastronómico en una experiencia única. Seleccionamos
                con dedicación los mejores vinos y quesos del mundo para crear
                maridajes que despiertan los sentidos y cuentan historias.
              </p>

              <p>
                Nuestro equipo de <strong>sommeliers y maestros queseros</strong>{' '}
                combina experiencia y pasión para ofrecer armonías que
                trascienden lo tradicional. Creemos que la gastronomía es un
                arte que se comparte, y cada detalle está pensado para dejar una
                huella en tu memoria mucho después de la última copa.
              </p>
            </div>

            <div className="nosotros-imagen-der">
              <img
                src="Imagenes Wine/nosotros-der.jpg"
                alt="Selección de quesos y vinos"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTOS */}
      <section className="contactos-section" id="contactos">
        <div className="container">
          <div className="contactos-content">
            <div className="contactos-info">
              <h3>Información del Restaurante</h3>
              <p>Vive la experiencia gastronómica más exclusiva de la ciudad</p>

              <div className="logo-home">
                <a href="/" title="Volver al inicio">
                  <img
                    src="Imagenes Wine/Logo.png"
                    alt="Logo Wine and Cheese"
                  />
                </a>
              </div>
            </div>

            <div className="contactos-datos">
              <h3>Contáctanos</h3>

              <div className="contacto-item">
                <span className="contacto-icon">📍</span>
                <div className="contacto-info">
                  <strong>Ubicación</strong>
                  <p>Alajuela, La Ceiba, Costa Rica</p>
                </div>
              </div>

              <div className="contacto-item">
                <span className="contacto-icon">📞</span>
                <div className="contacto-info">
                  <strong>Teléfono</strong>
                  <p>+506 64306861</p>
                </div>
              </div>

              <div className="contacto-item">
                <span className="contacto-icon">✉️</span>
                <div className="contacto-info">
                  <strong>Email</strong>
                  <p>info@wineandcheese.cr</p>
                </div>
              </div>
            </div>

            <div className="social-icons">
              <a
                href="https://www.facebook.com/p/Wine-and-Cheese-61550695744673/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon facebook"
              >
                <img
                  src="Imagenes Wine/facebook-icon.png"
                  alt="Facebook Wine and Cheese"
                />
              </a>
              <a
                href="https://www.instagram.com/wineandcheesecr/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
              >
                <img
                  src="Imagenes Wine/instagram-icon.png"
                  alt="Instagram Wine and Cheese"
                />
              </a>
              <a
                href="https://waze.com/ul/hd1u15dh8y"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon waze"
              >
                <img
                  src="Imagenes Wine/Waze-icon.png"
                  alt="Waze Wine and Cheese"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WineAndCheeseHome;
