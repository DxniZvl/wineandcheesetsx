import { useEffect, useRef } from 'react'
import '../style.css' // usamos el global

export default function Menu() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // Carrusel
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
    }, 5000)

    // Animación de secciones
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.menu-section'))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1'
            e.target.style.transform = 'translateY(0)'
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    sections.forEach(sec => {
      sec.style.opacity = '0'
      sec.style.transform = 'translateY(30px)'
      sec.style.transition = 'all 0.6s ease'
      observer.observe(sec)
    })

    return () => {
      window.clearInterval(id)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef}>
      {/* HERO CON CARRUSEL */}
      <section className="menu-hero">
        <div className="carousel-container">
          <div className="carousel-slide active">
            <img src="/Imagenes Wine/tabla-quesos-premium.jpg" alt="Tabla de Quesos Premium" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/cata-vinos-exclusiva.jpg" alt="Cata de Vinos" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/maridaje-perfecto.jpg" alt="Maridaje Perfecto" />
          </div>
          <div className="carousel-slide">
            <img src="/Imagenes Wine/quesos-internacionales.jpg" alt="Quesos Internacionales" />
          </div>
        </div>

        <div className="carousel-overlay">
          <h1 className="hero-title">Nuestra Carta</h1>
          <p className="hero-subtitle">Vinos excepcionales y quesos artesanales</p>
        </div>
      </section>

      {/* CONTENIDO DEL MENÚ (idéntico a tu PHP) */}
      <div className="menu-container">
        <div className="menu-content">
          {/* Cata de Vinos */}
          <section className="menu-section">
            <div className="section-header">
              <h2 className="section-title">Cata de Vinos</h2>
              <p className="section-subtitle">Experiencias únicas guiadas por nuestros sommeliers</p>
            </div>
            <div className="menu-grid">
              <MenuItem name="Cata Iniciación"
                        desc="Perfecta para principiantes. Degustación de 3 vinos seleccionados con explicación detallada de cada variedad."
                        details="Incluye: Sauvignon Blanc, Merlot y Cabernet Sauvignon"
                        price="₡22,500" />
              <MenuItem name="Cata Premium"
                        desc="Selección de 5 vinos premium de diferentes regiones con maridajes de quesos artesanales."
                        details="Incluye: Vinos de Francia, Italia y España + tabla de quesos"
                        price="₡37,500" />
              <MenuItem name="Cata Exclusiva"
                        desc="Experiencia de lujo con 6 vinos de reserva especial y maridajes gourmet diseñados por nuestro chef."
                        details="Vinos de añadas excepcionales + aperitivos gourmet"
                        price="₡60,000" />
              <MenuItem name="Cata Temática"
                        desc="Cata enfocada en una región específica o tipo de uva. Rotamos mensualmente entre Borgoña, Toscana, Rioja y Napa Valley."
                        details="4 vinos temáticos + historia y técnicas de la región"
                        price="₡32,500" />
            </div>
          </section>

          {/* Tablas de Quesos */}
          <section className="menu-section">
            <div className="section-header">
              <h2 className="section-title">Tablas de Quesos</h2>
              <p className="section-subtitle">Selecciones artesanales con maridajes perfectos</p>
            </div>
            <div className="package-grid">
              <PackageCard name="Tabla Clásica" price="₡17,500" items={[
                '3 quesos selectos','Acompañamientos tradicionales','Copa de vino recomendado','Pan artesanal y crackers'
              ]}/>
              <PackageCard name="Tabla Gourmet" price="₡32,500" items={[
                '5 quesos internacionales','Mermeladas y miel artesanal','2 copas de vino maridado','Frutos secos premium','Embutidos seleccionados'
              ]}/>
              <PackageCard name="Tabla Artesanal" price="₡47,500" items={[
                '7 quesos de diferentes países','Acompañamientos gourmet','3 copas de vino premium','Charcutería italiana','Frutas frescas y secas','Panes especiales'
              ]}/>
            </div>
          </section>

          {/* Platos Fuertes */}
          <Section title="Platos Fuertes" subtitle="Creaciones culinarias que complementan nuestra selección de vinos">
            <MenuItem name="Filete Wellington" price="₡22,500"
              desc="Filete de res envuelto en hojaldre con duxelles de champiñones, acompañado de puré de papa trufa y reducción de vino tinto."
              details="Maridaje recomendado: Cabernet Sauvignon" />
            <MenuItem name="Salmón en Costra de Hierbas" price="₡19,000"
              desc="Salmón noruego con costra de hierbas frescas, quinoa con vegetales y salsa de mantequilla al limón."
              details="Maridaje recomendado: Chardonnay" />
            <MenuItem name="Osso Buco" price="₡21,000"
              desc="Osobuco de ternera braseado en vino blanco con vegetales, servido con risotto al azafrán y gremolata."
              details="Maridaje recomendado: Barolo" />
            <MenuItem name="Pato Confitado" price="₡20,000"
              desc="Muslo de pato confitado con puré de manzana, col morada braseada y salsa de vino tinto especiada."
              details="Maridaje recomendado: Pinot Noir" />
            <MenuItem name="Risotto de Trufa" price="₡18,000"
              desc="Risotto cremoso con trufa negra, parmesano envejecido y aceite de trufa blanca. Opción vegetariana premium."
              details="Maridaje recomendado: Chianti Classico" />
          </Section>

          {/* Postres */}
          <Section title="Postres" subtitle="Dulces finales perfectos para acompañar nuestros vinos de postre">
            <MenuItem name="Tiramisú Clásico" price="₡6,000"
              desc="El clásico italiano con mascarpone, café espresso y cacao, preparado con la receta tradicional."
              details="Maridaje: Moscato d'Asti" />
            <MenuItem name="Tarta de Chocolate y Vino" price="₡7,000"
              desc="Decadente tarta de chocolate negro infusionada con vino tinto, servida con helado de vainilla."
              details="Maridaje: Port Ruby" />
            <MenuItem name="Panna Cotta de Frutas" price="₡5,500"
              desc="Suave panna cotta de vainilla con compota de frutos rojos y reducción de vino blanco."
              details="Maridaje: Riesling tardío" />
            <MenuItem name="Crème Brûlée" price="₡6,500"
              desc="Clásica crema catalana con azúcar caramelizada y toque de lavanda, acompañada de galletas de almendra."
              details="Maridaje: Sauternes" />
          </Section>

          {/* Vinos por copa & botella */}
          <Section title="Vinos por Copa & Botella" subtitle="Selección curada de vinos del mundo">
            <MenuItem name="Cabernet Sauvignon Reserva" price="₡7,500/₡32,500"
              desc="Vino tinto de cuerpo completo con notas de cassis y chocolate. Añejado 12 meses en barrica de roble francés."
              details="Valle de Napa, California • Copa ₡7,500 • Botella ₡32,500" />
            <MenuItem name="Chardonnay Premium" price="₡6,000/₡24,000"
              desc="Blanco elegante con toques de vainilla y mantequilla. Fermentado en barrica con crianza sobre lías."
              details="Borgoña, Francia • Copa ₡6,000 • Botella ₡24,000" />
            <MenuItem name="Pinot Noir Artesanal" price="₡7,000/₡28,000"
              desc="Tinto delicado con aromas de cereza y especias. Perfecto para acompañar quesos suaves."
              details="Oregón, EE.UU." />
            <MenuItem name="Sauvignon Blanc Orgánico" price="₡5,000/₡20,000"
              desc="Blanco fresco con notas cítricas y herbáceas. Ideal para quesos de cabra y mariscos."
              details="Marlborough, Nueva Zelanda" />
            <MenuItem name="Prosecco di Valdobbiadene" price="₡4,000/₡16,000"
              desc="Espumoso italiano con burbujas finas y notas florales. Perfecto para aperitivos."
              details="Veneto, Italia" />
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ---------- Subcomponentes simples ---------- */
function MenuItem(props: { name: string; desc: string; details?: string; price: string }) {
  return (
    <div className="menu-item">
      <div className="item-info">
        <h3 className="item-name">{props.name}</h3>
        <p className="item-description">{props.desc}</p>
        {props.details && <p className="item-details">{props.details}</p>}
      </div>
      <div className="item-price">{props.price}</div>
    </div>
  )
}
function PackageCard(props: { name: string; items: string[]; price: string }) {
  return (
    <div className="package-card">
      <h3 className="package-name">{props.name}</h3>
      <ul className="package-includes">
        {props.items.map(i => <li key={i}>{i}</li>)}
      </ul>
      <div className="package-price">{props.price}</div>
    </div>
  )
}
function Section(props: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="menu-section">
      <div className="section-header">
        <h2 className="section-title">{props.title}</h2>
        {props.subtitle && <p className="section-subtitle">{props.subtitle}</p>}
      </div>
      <div className="menu-grid">{props.children}</div>
    </section>
  )
}
