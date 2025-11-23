// src/pages/EventosPage.tsx
import React, { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import "../style.css";
import { getCurrentUser } from "../auth";
import { useNavigate } from "react-router-dom";
import ChatBot from "../components/ChatBot";

export default function Eventos() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Carrusel automático (mismo comportamiento que en Menu)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const slides = Array.from(
      root.querySelectorAll<HTMLDivElement>(".carousel-slide")
    );
    if (!slides.length) return;

    let current = 0;
    const show = (i: number) => {
      slides.forEach((s) => s.classList.remove("active"));
      slides[i].classList.add("active");
    };
    show(current);

    const id = window.setInterval(() => {
      current = (current + 1) % slides.length;
      show(current);
    }, 4000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div ref={rootRef}>
      {/* NAVBAR REUTILIZADA */}
      <Navbar />

      {/* HERO CON CARRUSEL */}
      <section className="menu-hero">
        <div className="carousel-container">
          <div className="carousel-slide active">
            <img src="/Imagenes Wine/evento1.jpg" alt="Cata de Vinos" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/evento2.jpg" alt="Cena Maridaje" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/evento3.jpg" alt="Evento Privado" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/evento4.jpg" alt="Celebración" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/evento5.jpg" alt="Degustación" />
          </div>
        </div>

        <div className="carousel-overlay">
          <h1 className="hero-title">Eventos Únicos</h1>
          <p className="hero-subtitle">
            Experiencias gastronómicas inolvidables
          </p>
        </div>
      </section>

      {/* SECCIÓN DE EVENTOS */}
      <section style={{ background: "#fff", padding: "80px 20px" }}>
        <div className="menu-content" style={{ maxWidth: 1000 }}>
          <h2 className="section-title" style={{ color: "#2c1810", textAlign: "center" }}>
            Nuestros Eventos
          </h2>
          <EventosSlider />
        </div>
      </section>

      {/* SECCIÓN RESERVA */}
      <section
        style={{
          padding: "60px 20px",
          backgroundImage: "url('/Imagenes Wine/vino-fondo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            backdropFilter: "blur(3px)",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "2.8rem",
              fontWeight: 600,
              color: "#d4af37",
              textShadow: "2px 2px 4px rgba(0,0,0,.8)",
              margin: "0 0 16px",
            }}
          >
            ¿Listo para una experiencia única?
          </h2>
          <p
            style={{
              color: "#f4e4c1",
              fontSize: "1.1rem",
              lineHeight: 1.6,
              margin: "0 0 28px",
              textShadow: "1px 1px 2px rgba(0,0,0,.8)",
            }}
          >
            Reserva tu lugar en nuestros exclusivos eventos y vive momentos
            inolvidables.
          </p>
          <button
            onClick={() => {
              if (!user) {
                navigate("/login");
              } else {
                navigate("/Reserva");
              }
            }}
            className="reserva-btn"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: 35,
              textDecoration: "none",
            }}
          >
            Reserva Ahora
          </button>

        </div>
      </section>

      {/* SECCIÓN JUEGOS */}
      <section id="juegos" style={{ background: "#f8f8f8", padding: "60px 20px" }}>
        <div className="menu-content" style={{ maxWidth: 1000 }}>
          <h2
            className="section-title"
            style={{ color: "#2c1810", textAlign: "center" }}
          >
            Juegos de Mesa
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            Disfruta de una velada perfecta con nuestros juegos mientras saboreas
            vinos y quesos.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 24,
            }}
          >
            <Categoria
              titulo="Clásicos"
              juegos={[
                ["Ajedrez", "El juego de estrategia por excelencia"],
                ["Damas", "Estrategia clásica para todas las edades"],
                ["Monopoly", "El clásico juego de bienes raíces"],
                ["Scrabble", "Pon a prueba tu vocabulario"],
              ]}
            />
            <Categoria
              titulo="Cartas"
              juegos={[
                ["UNO", "Diversión garantizada"],
                ["Poker", "El clásico juego de cartas"],
                ["Blackjack", "Emoción y estrategia"],
                ["Baraja Española", "Brisca, Chinchón y más"],
              ]}
            />
            <Categoria
              titulo="Familiares"
              juegos={[
                ["Jenga", "Tensión y risas aseguradas"],
                ["Pictionary", "Dibuja y adivina"],
                ["Charadas", "Actúa y divierte a tu grupo"],
                ["Rompecabezas", "Perfectos para una tarde tranquila"],
              ]}
            />
          </div>

          <div
            style={{
              marginTop: 28,
              background: "rgba(212,175,55,0.1)",
              padding: 20,
              borderRadius: 10,
              borderLeft: "4px solid #d4af37",
              color: "#5a0015",
              fontWeight: 600,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Todos nuestros juegos están disponibles de forma gratuita para
            nuestros clientes. ¡Solo solicítalos a nuestro personal!
          </div>
        </div>
      </section>

      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  );
}

/* ---------- Subcomponentes ---------- */
function EventosSlider() {
  const cards = [
    {
      nombre: "Cata de Vinos Premium",
      descripcion:
        "Descubre los secretos de los mejores vinos del mundo en una experiencia guiada por nuestro sommelier. Incluye degustación de 5 vinos selectos con maridajes de quesos artesanales.",
      precio: "Desde $75 por persona",
    },
    {
      nombre: "Cena Maridaje Exclusiva",
      descripcion:
        "Velada de 5 tiempos donde cada plato se armoniza con vinos cuidadosamente seleccionados. Una experiencia que despertará todos tus sentidos.",
      precio: "Desde $120 por persona",
    },
    {
      nombre: "Eventos Privados",
      descripcion:
        "Celebra tus momentos especiales con nosotros. Ofrecemos espacios exclusivos y menús personalizados para bodas, aniversarios y reuniones corporativas.",
      precio: "Cotización personalizada",
    },
  ];

  return (
    <div className="menu-grid">
      {cards.map((card, index) => (
        <div className="menu-item" key={index}>
          <div className="item-info">
            <h3 className="item-name">{card.nombre}</h3>
            <p className="item-description">{card.descripcion}</p>
          </div>
          <div className="item-price">{card.precio}</div>
        </div>
      ))}
    </div>
  );
}

function Categoria({ titulo, juegos }: { titulo: string; juegos: string[][] }) {
  return (
    <div className="package-card">
      <h3 className="package-name">{titulo}</h3>
      <ul className="package-includes">
        {juegos.map(([nombre, desc]) => (
          <li key={nombre}>
            <strong>{nombre}:</strong> {desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
