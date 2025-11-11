import { useEffect, useRef } from 'react'
import '../style.css'

export default function Eventos() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Reuse the same carousel behavior you already use in Menu
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const slides = Array.from(root.querySelectorAll<HTMLDivElement>('.carousel-slide'))
    if (!slides.length) return

    let current = 0
    const show = (i: number) => {
      slides.forEach(s => s.classList.remove('active'))
      slides[i].classList.add('active')
    }
    show(current)
    const id = window.setInterval(() => {
      current = (current + 1) % slides.length
      show(current)
    }, 4000)

    return () => window.clearInterval(id)
  }, [])

  return (
    <div ref={rootRef}>
      {/* HERO con carrusel (reutiliza clases del Menú: .menu-hero, .carousel-*, .hero-title, .hero-subtitle) */}
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
          <p className="hero-subtitle">Experiencias gastronómicas inolvidables</p>
        </div>
      </section>

      {/* “Nuestros Eventos” (usa .menu-content y .section-title existentes) */}
      <section style={{ background: '#fff', padding: '80px 20px' }}>
        <div className="menu-content" style={{ maxWidth: 1000 }}>
          <h2 className="section-title" style={{ color: '#2c1810' }}>Nuestros Eventos</h2>

          {/* Slider simple: mostramos uno a la vez con el mismo look elegante sin nuevas clases */}
          <EventosSlider />
        </div>
      </section>

      {/* CTA Reserva (reutiliza tu .confirm-btn) */}
      <section
        style={{
          padding: '60px 20px',
          backgroundImage: "url('/Imagenes Wine/vino-fondo.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)',
            backdropFilter: 'blur(3px)'
          }}
          aria-hidden="true"
        />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2.4rem',
            color: '#d4af37',
            textShadow: '2px 2px 4px rgba(0,0,0,.8)',
            margin: '0 0 16px'
          }}>
            ¿Listo para una experiencia única?
          </h2>
          <p style={{
            color: '#f4e4c1',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            margin: '0 0 28px',
            textShadow: '1px 1px 2px rgba(0,0,0,.8)'
          }}>
            Reserva tu lugar en nuestros exclusivos eventos y vive momentos inolvidables.
          </p>
          <a href="/reservas" className="confirm-btn" style={{ maxWidth: 260, margin: '0 auto', display: 'block' }}>
            Reserva Ahora
          </a>
        </div>
      </section>

      {/* Juegos de Mesa (estructura + estilos mínimos inline, sin nuevas clases en CSS) */}
      <section id="juegos" style={{ background: '#f8f8f8', padding: '60px 20px' }}>
        <div className="menu-content" style={{ maxWidth: 1000 }}>
          <h2 className="section-title" style={{ color: '#2c1810' }}>Juegos de Mesa</h2>
          <p style={{ textAlign: 'center', color: '#666', marginTop: 10, marginBottom: 30 }}>
            Disfruta de una velada perfecta con nuestros juegos mientras saboreas vinos y quesos.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 24
            }}
          >
            <Categoria
              titulo="Clásicos"
              juegos={[
                ['Ajedrez', 'El juego de estrategia por excelencia'],
                ['Damas', 'Estrategia clásica para todas las edades'],
                ['Monopoly', 'El clásico juego de bienes raíces'],
                ['Scrabble', 'Pon a prueba tu vocabulario']
              ]}
            />
            <Categoria
              titulo="Cartas"
              juegos={[
                ['UNO', 'Diversión garantizada'],
                ['Poker', 'El clásico juego de cartas'],
                ['Blackjack', 'Emoción y estrategia'],
                ['Baraja Española', 'Brisca, Chinchón y más']
              ]}
            />
            <Categoria
              titulo="Familiares"
              juegos={[
                ['Jenga', 'Tensión y risas aseguradas'],
                ['Pictionary', 'Dibuja y adivina'],
                ['Charadas', 'Actúa y divierte a tu grupo'],
                ['Rompecabezas', 'Perfectos para una tarde tranquila']
              ]}
            />
          </div>

          <div
            style={{
              marginTop: 28,
              background: 'rgba(212,175,55,0.1)',
              padding: 20,
              borderRadius: 10,
              borderLeft: '4px solid #d4af37',
              color: '#5a0015',
              fontWeight: 600,
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            Todos nuestros juegos están disponibles de forma gratuita para nuestros clientes.
            ¡Solo solicítalos a nuestro personal!
          </div>
        </div>
      </section>
    </div>
  )
}

/* -------- Subcomponentes (sin nuevas clases globales) -------- */

function EventosSlider() {
  // Cards del PHP original
  const cards = [
    {
      nombre: 'Cata de Vinos Premium',
      descripcion:
        'Descubre los secretos de los mejores vinos del mundo en una experiencia guiada por nuestro sommelier. Incluye degustación de 5 vinos selectos con maridajes de quesos artesanales.',
      precio: 'Desde $75 por persona'
    },
    {
      nombre: 'Cena Maridaje Exclusiva',
      descripcion:
        'Velada de 5 tiempos donde cada plato se armoniza con vinos cuidadosamente seleccionados. Una experiencia que despertará todos tus sentidos.',
      precio: 'Desde $120 por persona'
    },
    {
      nombre: 'Eventos Privados',
      descripcion:
        'Celebra ocasiones especiales en un ambiente íntimo y elegante. Organizamos cumpleaños, aniversarios y reuniones corporativas con menús personalizados.',
      precio: 'Desde $90 por persona'
    },
    {
      nombre: 'Curso de Sommelier',
      descripcion:
        'Aprende técnicas de cata, maridaje y servicio del vino. Curso de 4 sesiones con certificación y degustación de más de 20 variedades.',
      precio: 'Desde $200 por persona'
    },
    {
      nombre: 'Degustación de Quesos',
      descripcion:
        'Explora la diversidad del mundo quesero con una selección artesanal nacional e internacional, acompañada de vinos que realzan cada sabor.',
      precio: 'Desde $65 por persona'
    }
  ]

  // Slider mínimo con estado local + estilos inline
  const trackRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let i = 0
    const tick = () => {
      i = (i + 1) % cards.length
      track.style.transform = `translateX(-${i * 100}%)`
    }
    const id = window.setInterval(tick, 4500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          transition: 'transform .6s ease',
          willChange: 'transform'
        }}
      >
        {cards.map(card => (
          <div
            key={card.nombre}
            style={{
              minWidth: '100%',
              background: '#f9f9f9',
              padding: 32,
              boxSizing: 'border-box',
              boxShadow: '0 10px 30px rgba(0,0,0,.08)'
            }}
          >
            <h3
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.8rem',
                color: '#d4af37',
                margin: '0 0 12px'
              }}
            >
              {card.nombre}
            </h3>
            <p style={{ color: '#666', lineHeight: 1.7, margin: '0 0 10px' }}>
              {card.descripcion}
            </p>
            <p style={{ fontWeight: 600, color: '#2c1810', margin: 0 }}>{card.precio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Categoria({
  titulo,
  juegos
}: {
  titulo: string
  juegos: [string, string][]
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: 22,
        boxShadow: '0 6px 18px rgba(0,0,0,.08)'
      }}
    >
      <h3
        style={{
          fontFamily: '"Playfair Display", serif',
          color: '#5a0015',
          textAlign: 'center',
          marginTop: 0
        }}
      >
        {titulo}
      </h3>
      <div style={{ display: 'grid', gap: 10 }}>
        {juegos.map(([name, desc]) => (
          <div
            key={name}
            style={{
              padding: 12,
              borderRadius: 8,
              transition: 'transform .2s ease, background .2s ease'
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 6px', color: '#2c1810' }}>{name}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '.95rem' }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
