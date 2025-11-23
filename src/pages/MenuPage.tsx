// src/pages/MenuPage.tsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";


const slidesSrc = [
  { src: "/Imagenes Wine/tabla-quesos-premium.jpg", alt: "Tabla de Quesos Premium" },
  { src: "/Imagenes Wine/cata-vinos-exclusiva.jpg", alt: "Cata de Vinos" },
  { src: "/Imagenes Wine/maridaje-perfecto.jpg", alt: "Maridaje Perfecto" },
  { src: "/Imagenes Wine/quesos-internacionales.jpg", alt: "Quesos Internacionales" },
];

const Menu: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);

  // Carrusel automático
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slidesSrc.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Intersection Observer para revelar secciones
  useEffect(() => {
    const opts: IntersectionObserverInit = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, opts);

    sectionsRef.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "all 0.6s ease";
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO con carrusel */}
      <section className="menu-hero">
        <div className="carousel-container">
          {slidesSrc.map((s, i) => (
            <div key={s.src} className={`carousel-slide ${i === current ? "active" : ""}`}>
              <img src={s.src} alt={s.alt} />
            </div>
          ))}
        </div>

        <div className="carousel-overlay">
          <h1 className="hero-title">Nuestra Carta</h1>
          <p className="hero-subtitle">Vinos excepcionales y quesos artesanales</p>
        </div>
      </section>

      {/* CONTENEDOR DEL MENÚ */}
      <div className="menu-container">
        <div className="menu-content">
          {/* CATA DE VINOS */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[0] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Cata de Vinos</h2>
              <p className="section-subtitle">Experiencias únicas guiadas por nuestros sommeliers</p>
            </div>

            <div className="menu-grid">
              {[
                {
                  name: "Cata Iniciación",
                  desc:
                    "Perfecta para principiantes. Degustación de 3 vinos seleccionados con explicación detallada de cada variedad.",
                  details: "Incluye: Sauvignon Blanc, Merlot y Cabernet Sauvignon",
                  price: "₡22,500",
                },
                {
                  name: "Cata Premium",
                  desc:
                    "Selección de 5 vinos premium de diferentes regiones con maridajes de quesos artesanales.",
                  details: "Incluye: Vinos de Francia, Italia y España + tabla de quesos",
                  price: "₡37,500",
                },
                {
                  name: "Cata Exclusiva",
                  desc:
                    "Experiencia de lujo con 6 vinos de reserva especial y maridajes gourmet diseñados por nuestro chef.",
                  details: "Vinos de añadas excepcionales + aperitivos gourmet",
                  price: "₡60,000",
                },
                {
                  name: "Cata Temática",
                  desc:
                    "Cata enfocada en una región específica o tipo de uva. Rotamos mensualmente entre Borgoña, Toscana, Rioja y Napa Valley.",
                  details: "4 vinos temáticos + historia y técnicas de la región",
                  price: "₡32,500",
                },
              ].map((it) => (
                <div className="menu-item" key={it.name}>
                  <div className="item-info">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-description">{it.desc}</p>
                    <p className="item-details">{it.details}</p>
                  </div>
                  <div className="item-price">{it.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* TABLAS DE QUESOS */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[1] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Tablas de Quesos</h2>
              <p className="section-subtitle">Selecciones artesanales con maridajes perfectos</p>
            </div>

            <div className="package-grid">
              {[
                {
                  name: "Tabla Clásica",
                  includes: ["3 quesos selectos", "Acompañamientos tradicionales", "Copa de vino recomendado", "Pan artesanal y crackers"],
                  price: "₡17,500",
                },
                {
                  name: "Tabla Gourmet",
                  includes: ["5 quesos internacionales", "Mermeladas y miel artesanal", "2 copas de vino maridado", "Frutos secos premium", "Embutidos seleccionados"],
                  price: "₡32,500",
                },
                {
                  name: "Tabla Artesanal",
                  includes: ["7 quesos de diferentes países", "Acompañamientos gourmet", "3 copas de vino premium", "Charcutería italiana", "Frutas frescas y secas", "Panes especiales"],
                  price: "₡47,500",
                },
              ].map((p) => (
                <div className="package-card" key={p.name}>
                  <h3 className="package-name">{p.name}</h3>
                  <ul className="package-includes">
                    {p.includes.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                  <div className="package-price">{p.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* PLATOS FUERTES */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[2] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Platos Fuertes</h2>
              <p className="section-subtitle">Creaciones culinarias que complementan nuestra selección de vinos</p>
            </div>

            <div className="menu-grid">
              {[
                {
                  name: "Filete Wellington",
                  desc:
                    "Filete de res envuelto en hojaldre con duxelles de champiñones, acompañado de puré de papa trufa y reducción de vino tinto.",
                  details: "Maridaje recomendado: Cabernet Sauvignon",
                  price: "₡22,500",
                },
                {
                  name: "Salmón en Costra de Hierbas",
                  desc:
                    "Salmón noruego con costra de hierbas frescas, quinoa con vegetales y salsa de mantequilla al limón.",
                  details: "Maridaje recomendado: Chardonnay",
                  price: "₡19,000",
                },
                {
                  name: "Osso Buco",
                  desc:
                    "Osobuco de ternera braseado en vino blanco con vegetales, servido con risotto al azafrán y gremolata.",
                  details: "Maridaje recomendado: Barolo",
                  price: "₡21,000",
                },
                {
                  name: "Pato Confitado",
                  desc:
                    "Muslo de pato confitado con puré de manzana, col morada braseada y salsa de vino tinto especiada.",
                  details: "Maridaje recomendado: Pinot Noir",
                  price: "₡20,000",
                },
                {
                  name: "Risotto de Trufa",
                  desc:
                    "Risotto cremoso con trufa negra, parmesano envejecido y aceite de trufa blanca. Opción vegetariana premium.",
                  details: "Maridaje recomendado: Chianti Classico",
                  price: "₡18,000",
                },
              ].map((it) => (
                <div className="menu-item" key={it.name}>
                  <div className="item-info">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-description">{it.desc}</p>
                    <p className="item-details">{it.details}</p>
                  </div>
                  <div className="item-price">{it.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* POSTRES */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[3] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Postres</h2>
              <p className="section-subtitle">Dulces finales perfectos para acompañar nuestros vinos de postre</p>
            </div>

            <div className="menu-grid">
              {[
                {
                  name: "Tiramisú Clásico",
                  desc: "El clásico italiano con mascarpone, café espresso y cacao, preparado con la receta tradicional.",
                  details: "Maridaje: Moscato d'Asti",
                  price: "₡6,000",
                },
                {
                  name: "Tarta de Chocolate y Vino",
                  desc: "Decadente tarta de chocolate negro infusionada con vino tinto, servida con helado de vainilla.",
                  details: "Maridaje: Port Ruby",
                  price: "₡7,000",
                },
                {
                  name: "Panna Cotta de Frutas",
                  desc: "Suave panna cotta de vainilla con compota de frutos rojos y reducción de vino blanco.",
                  details: "Maridaje: Riesling tardío",
                  price: "₡5,500",
                },
                {
                  name: "Crème Brûlée",
                  desc: "Clásica crema catalana con azúcar caramelizada y toque de lavanda, acompañada de galletas de almendra.",
                  details: "Maridaje: Sauternes",
                  price: "₡6,500",
                },
              ].map((it) => (
                <div className="menu-item" key={it.name}>
                  <div className="item-info">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-description">{it.desc}</p>
                    <p className="item-details">{it.details}</p>
                  </div>
                  <div className="item-price">{it.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Vinos por copa y botella */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[4] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Vinos por Copa &amp; Botella</h2>
              <p className="section-subtitle">Selección curada de vinos del mundo</p>
            </div>

            <div className="menu-grid">
              {[
                {
                  name: "Cabernet Sauvignon Reserva",
                  desc: "Vino tinto de cuerpo completo con notas de cassis y chocolate. Añejado 12 meses en barrica de roble francés.",
                  details: "Valle de Napa, California • Copa ₡7,500 • Botella ₡32,500",
                  price: "₡7,500/₡32,500",
                },
                {
                  name: "Chardonnay Premium",
                  desc: "Blanco elegante con toques de vainilla y mantequilla. Fermentado en barrica con crianza sobre lías.",
                  details: "Borgoña, Francia • Copa ₡6,000 • Botella ₡24,000",
                  price: "₡6,000/₡24,000",
                },
                {
                  name: "Pinot Noir Artesanal",
                  desc: "Tinto delicado con aromas de cereza y especias. Perfecto para acompañar quesos suaves.",
                  details: "Oregón, EE.UU. • Copa ₡7,000 • Botella ₡28,000",
                  price: "₡7,000/₡28,000",
                },
                {
                  name: "Sauvignon Blanc Orgánico",
                  desc: "Blanco fresco con notas cítricas y herbáceas. Ideal para quesos de cabra y mariscos.",
                  details: "Marlborough, Nueva Zelanda • Copa ₡5,000 • Botella ₡20,000",
                  price: "₡5,000/₡20,000",
                },
                {
                  name: "Prosecco di Valdobbiadene",
                  desc: "Espumoso italiano con burbujas finas y notas florales. Perfecto para aperitivos.",
                  details: "Veneto, Italia • Copa ₡4,000 • Botella ₡16,000",
                  price: "₡4,000/₡16,000",
                },
              ].map((it) => (
                <div className="menu-item" key={it.name}>
                  <div className="item-info">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-description">{it.desc}</p>
                    <p className="item-details">{it.details}</p>
                  </div>
                  <div className="item-price">{it.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Otras bebidas */}
          <section
            className="menu-section"
            ref={(el) => el && (sectionsRef.current[5] = el)}
          >
            <div className="section-header">
              <h2 className="section-title">Otras Bebidas</h2>
              <p className="section-subtitle">Complementos perfectos para tu experiencia</p>
            </div>

            <div className="menu-grid">
              {[
                { name: "Café Espresso", desc: "Café de origen único tostado artesanalmente. Perfecto para después de la cena.", details: "Granos de Colombia y Etiopía", price: "₡2,000" },
                { name: "Té de Hojas Premium", desc: "Selección de tés importados servidos en tetera individual.", details: "Earl Grey, Jasmine, Chamomile", price: "₡2,500" },
                { name: "Agua Mineral San Pellegrino", desc: "Agua con gas italiana, ideal para limpiar el paladar entre catas.", details: "500ml o 750ml", price: "₡1,500/₡2,500" },
                { name: "Digestivos Artesanales", desc: "Selección de digestivos para cerrar la experiencia gastronómica.", details: "Grappa, Brandy, Amaro", price: "₡4,000-₡7,500" },
                { name: "Cócteles con Vino", desc: "Cócteles únicos elaborados con vinos de nuestra carta.", details: "Sangría Premium, Wine Spritz, Kir Royal", price: "₡6,000" },
              ].map((it) => (
                <div className="menu-item" key={it.name}>
                  <div className="item-info">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-description">{it.desc}</p>
                    <p className="item-details">{it.details}</p>
                  </div>
                  <div className="item-price">{it.price}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ChatBot flotante */}
      <ChatBot />
    </>
  );
};

export default Menu;
