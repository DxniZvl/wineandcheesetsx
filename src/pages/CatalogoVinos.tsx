import React, { useState, useEffect, useMemo } from 'react';
import { Wine, MapPin, Filter, X, Search, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../auth';
import { isBirthday, applyBirthdayDiscount, getBirthdayDiscountAmount, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday';

// Tipos
interface Vino {
  id?: string;
  nombre: string;
  tipo: string;
  pais: string;
  region: string;
  precio: number;
  descripcion: string;
  imagen?: string;
}

// Constantes de colores
const COLORS = {
  primary: '#5a0015',
  secondary: '#d4af37',
  background: '#f8f6f3',
  white: '#ffffff',
  text: '#333',
  textLight: '#666',
  textLighter: '#999',
  border: '#e0e0e0',
};

const CatalogoVinos: React.FC = () => {
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos');
  const [filtroPais, setFiltroPais] = useState<string>('Todos');
  const [busqueda, setBusqueda] = useState<string>('');
  const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false);
  const [isBirthdayToday, setIsBirthdayToday] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [ordenamiento, setOrdenamiento] = useState<string>('nombre');
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(5000);
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar cumpleaños
  useEffect(() => {
    const checkBirthday = async () => {
      try {
        const user = getCurrentUser();
        if (!user) {
          setLoading(false);
          return;
        }
        
        const { data } = await supabase
          .from('usuarios')
          .select('fecha_cumpleanos, nombre')
          .eq('id', user.id)
          .single();
        
        if (data?.fecha_cumpleanos && isBirthday(data.fecha_cumpleanos)) {
          setIsBirthdayToday(true);
          setUserName(data.nombre);
        }
      } catch (error) {
        console.error('Error al verificar cumpleaños:', error);
      } finally {
        setLoading(false);
      }
    };
    checkBirthday();
  }, []);

  const vinos: Vino[] = [
    // Tintos
    { nombre: 'Château Margaux', tipo: 'Tinto', pais: 'Francia', region: 'Burdeos', precio: 450, descripcion: 'Elegante y complejo, con notas de frutas negras y especias' },
    { nombre: 'Barolo Cannubi', tipo: 'Tinto', pais: 'Italia', region: 'Piamonte', precio: 380, descripcion: 'Robusto y estructurado, ideal para carnes rojas' },
    { nombre: 'Opus One', tipo: 'Tinto', pais: 'Estados Unidos', region: 'California', precio: 420, descripcion: 'Blend excepcional con gran potencial de guarda' },
    { nombre: 'Vega Sicilia Único', tipo: 'Tinto', pais: 'España', region: 'Ribera del Duero', precio: 500, descripcion: 'Icónico vino español con elegancia y complejidad' },
    { nombre: 'Penfolds Grange', tipo: 'Tinto', pais: 'Australia', region: 'Sur de Australia', precio: 650, descripcion: 'Potente y concentrado, uno de los mejores del mundo' },
    { nombre: 'Catena Zapata Malbec', tipo: 'Tinto', pais: 'Argentina', region: 'Mendoza', precio: 180, descripcion: 'Expresión perfecta del Malbec argentino' },
    { nombre: 'Château Lafite Rothschild', tipo: 'Tinto', pais: 'Francia', region: 'Burdeos', precio: 850, descripcion: 'Primer cru legendario, sofisticación absoluta' },
    { nombre: 'Brunello di Montalcino', tipo: 'Tinto', pais: 'Italia', region: 'Toscana', precio: 320, descripcion: 'Sangiovese en su máxima expresión' },
    { nombre: 'Pingus', tipo: 'Tinto', pais: 'España', region: 'Ribera del Duero', precio: 750, descripcion: 'Vino de culto, producción limitada' },
    { nombre: 'Screaming Eagle Cabernet', tipo: 'Tinto', pais: 'Estados Unidos', region: 'Napa Valley', precio: 3500, descripcion: 'Ultra premium, uno de los más exclusivos' },

    // Blancos
    { nombre: 'Chablis Grand Cru', tipo: 'Blanco', pais: 'Francia', region: 'Borgoña', precio: 280, descripcion: 'Mineral y fresco, Chardonnay en su forma más pura' },
    { nombre: 'Cloudy Bay Sauvignon Blanc', tipo: 'Blanco', pais: 'Nueva Zelanda', region: 'Marlborough', precio: 150, descripcion: 'Aromático y vibrante, notas cítricas' },
    { nombre: 'Albariño Pazo de Señorans', tipo: 'Blanco', pais: 'España', region: 'Rías Baixas', precio: 95, descripcion: 'Fresco y floral, perfecto para mariscos' },
    { nombre: 'Gavi di Gavi', tipo: 'Blanco', pais: 'Italia', region: 'Piamonte', precio: 120, descripcion: 'Elegante y delicado, excelente aperitivo' },
    { nombre: 'Casillero del Diablo Chardonnay', tipo: 'Blanco', pais: 'Chile', region: 'Valle Central', precio: 65, descripcion: 'Equilibrado y versátil, gran relación calidad-precio' },
    { nombre: 'Riesling Dr. Loosen', tipo: 'Blanco', pais: 'Alemania', region: 'Mosel', precio: 140, descripcion: 'Dulzura equilibrada con acidez refrescante' },
    { nombre: 'Chassagne-Montrachet', tipo: 'Blanco', pais: 'Francia', region: 'Borgoña', precio: 350, descripcion: 'Gran Chardonnay, complejo y longevo' },
    { nombre: 'Verdejo Rueda', tipo: 'Blanco', pais: 'España', region: 'Rueda', precio: 55, descripcion: 'Herbáceo y fresco, notas de frutas blancas' },

    // Espumosos
    { nombre: 'Moët & Chandon', tipo: 'Espumoso', pais: 'Francia', region: 'Champagne', precio: 180, descripcion: 'Champagne icónico, elegante y festivo' },
    { nombre: 'Prosecco Valdobbiadene', tipo: 'Espumoso', pais: 'Italia', region: 'Véneto', precio: 75, descripcion: 'Ligero y afrutado, perfecto para aperitivos' },
    { nombre: 'Cava Codorníu', tipo: 'Espumoso', pais: 'España', region: 'Penedés', precio: 60, descripcion: 'Método tradicional, excelente calidad' },
    { nombre: 'Veuve Clicquot', tipo: 'Espumoso', pais: 'Francia', region: 'Champagne', precio: 220, descripcion: 'Champagne de gran prestigio y elegancia' },
    { nombre: 'Chandon Brut', tipo: 'Espumoso', pais: 'Argentina', region: 'Mendoza', precio: 85, descripcion: 'Espumoso argentino de alta calidad' },
    { nombre: 'Franciacorta Ca del Bosco', tipo: 'Espumoso', pais: 'Italia', region: 'Lombardía', precio: 190, descripcion: 'Método clásico italiano, refinado' },

    // Rosados
    { nombre: 'Whispering Angel', tipo: 'Rosado', pais: 'Francia', region: 'Provenza', precio: 110, descripcion: 'Rosado de culto, elegante y refrescante' },
    { nombre: 'Mateus Rosé', tipo: 'Rosado', pais: 'Portugal', region: 'Portugal', precio: 45, descripcion: 'Clásico portugués, ligero y afrutado' },
    { nombre: 'Marqués de Cáceres Rosado', tipo: 'Rosado', pais: 'España', region: 'Rioja', precio: 55, descripcion: 'Fresco y versátil, excelente para el verano' },

    // Dulces/Fortificados
    { nombre: 'Sauternes Château d\'Yquem', tipo: 'Dulce', pais: 'Francia', region: 'Burdeos', precio: 550, descripcion: 'El mejor vino dulce del mundo' },
    { nombre: 'Oporto Taylor\'s', tipo: 'Fortificado', pais: 'Portugal', region: 'Valle del Duero', precio: 180, descripcion: 'Porto vintage, complejo y longevo' },
    { nombre: 'Pedro Ximénez González Byass', tipo: 'Dulce Fortificado', pais: 'España', region: 'Jerez', precio: 120, descripcion: 'Intensamente dulce, perfecto para postres' },

    // Costa Rica
    { nombre: 'Viñedos Altamira Tinto', tipo: 'Tinto', pais: 'Costa Rica', region: 'Coto Brus', precio: 85, descripcion: 'Orgullo local, producción artesanal' },
    { nombre: 'Viñedos Altamira Blanco', tipo: 'Blanco', pais: 'Costa Rica', region: 'Coto Brus', precio: 80, descripcion: 'Vino blanco costarricense único' },
    { nombre: 'Viñedos Altamira Rosado', tipo: 'Rosado', pais: 'Costa Rica', region: 'Coto Brus', precio: 75, descripcion: 'Frescura tropical en cada copa' }
  ];

  const tipos = ['Todos', 'Tinto', 'Blanco', 'Espumoso', 'Rosado', 'Dulce', 'Dulce Fortificado', 'Fortificado'];
  const paises = ['Todos', ...new Set(vinos.map(v => v.pais))].sort();

  // Filtrado y ordenamiento con useMemo
  const vinosFiltrados = useMemo(() => {
    let resultado = vinos.filter(vino => {
      const precioFinal = isBirthdayToday ? applyBirthdayDiscount(vino.precio) : vino.precio;
      const cumpleTipo = filtroTipo === 'Todos' || vino.tipo === filtroTipo;
      const cumplePais = filtroPais === 'Todos' || vino.pais === filtroPais;
      const cumpleBusqueda = vino.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        vino.region.toLowerCase().includes(busqueda.toLowerCase());
      const cumplePrecio = precioFinal >= precioMin && precioFinal <= precioMax;
      return cumpleTipo && cumplePais && cumpleBusqueda && cumplePrecio;
    });

    // Ordenamiento
    resultado.sort((a, b) => {
      const precioA = isBirthdayToday ? applyBirthdayDiscount(a.precio) : a.precio;
      const precioB = isBirthdayToday ? applyBirthdayDiscount(b.precio) : b.precio;

      switch (ordenamiento) {
        case 'precio-asc':
          return precioA - precioB;
        case 'precio-desc':
          return precioB - precioA;
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'pais':
          return a.pais.localeCompare(b.pais);
        default:
          return 0;
      }
    });

    return resultado;
  }, [vinos, filtroTipo, filtroPais, busqueda, precioMin, precioMax, ordenamiento, isBirthdayToday]);

  const agregarAlCarrito = (vino: Vino) => {
    // Aquí implementarías la lógica de agregar al carrito
    console.log('Agregado al carrito:', vino);
    alert(`${vino.nombre} agregado al carrito`);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: COLORS.background 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Wine size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
          <p style={{ marginTop: '20px', color: COLORS.text }}>Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background }}>
      <Navbar />

      {/* HERO */}
      <div style={{
        backgroundImage: 'url("/Imagenes Wine/Imagen3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        marginTop: '70px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px' }}>
          {/* Banner de cumpleaños */}
          {isBirthdayToday && (
            <div style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 100%)',
              border: '2px solid #d4af37',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '30px',
              textAlign: 'center',
              boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)',
              maxWidth: '600px',
              margin: '0 auto 30px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉🎂🍷</div>
              <h2 style={{
                color: COLORS.primary,
                margin: '0 0 12px 0',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>¡Feliz Cumpleaños{userName ? `, ${userName}` : ''}!</h2>
              <p style={{
                color: '#2c1810',
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 600
              }}>🎁 Todos los vinos con <strong style={{ color: COLORS.primary }}>{BIRTHDAY_DISCOUNT_PERCENT}% de descuento</strong> solo por hoy</p>
            </div>
          )}
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
            marginBottom: '10px'
          }}>
            Catálogo de Vinos
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontStyle: 'italic',
            color: COLORS.secondary,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}>
            Descubre nuestra selecta colección
          </p>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: COLORS.white,
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          {/* Barra de búsqueda */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: COLORS.textLighter
            }} size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o región..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                border: `2px solid ${COLORS.border}`,
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              aria-label="Buscar vinos"
            />
          </div>

          {/* Botón filtros móvil */}
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: 600
            }}
            aria-expanded={mostrarFiltros}
            aria-label="Mostrar filtros"
          >
            <Filter size={18} />
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>

          {/* Filtros */}
          <div style={{
            display: mostrarFiltros ? 'grid' : 'none',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: COLORS.text }}>
                Tipo de Vino
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                aria-label="Filtrar por tipo de vino"
              >
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: COLORS.text }}>
                País de Origen
              </label>
              <select
                value={filtroPais}
                onChange={(e) => setFiltroPais(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                aria-label="Filtrar por país"
              >
                {paises.map(pais => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: COLORS.text }}>
                Ordenar por
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
                aria-label="Ordenar vinos"
              >
                <option value="nombre">Nombre (A-Z)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
                <option value="pais">País (A-Z)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: COLORS.text }}>
                Rango de Precio: ${precioMin} - ${precioMax}
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(Number(e.target.value))}
                  placeholder="Mín"
                  style={{
                    width: '50%',
                    padding: '10px',
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  aria-label="Precio mínimo"
                />
                <input
                  type="number"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(Number(e.target.value))}
                  placeholder="Máx"
                  style={{
                    width: '50%',
                    padding: '10px',
                    border: `2px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  aria-label="Precio máximo"
                />
              </div>
            </div>

            {(filtroTipo !== 'Todos' || filtroPais !== 'Todos' || busqueda || precioMin > 0 || precioMax < 5000) && (
              <button
                onClick={() => {
                  setFiltroTipo('Todos');
                  setFiltroPais('Todos');
                  setBusqueda('');
                  setPrecioMin(0);
                  setPrecioMax(5000);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  background: '#f0f0f0',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  alignSelf: 'end'
                }}
                aria-label="Limpiar todos los filtros"
              >
                <X size={18} />
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <p style={{
          textAlign: 'center',
          color: COLORS.textLight,
          marginBottom: '20px',
          fontSize: '16px'
        }}>
          Mostrando {vinosFiltrados.length} de {vinos.length} vinos
        </p>

        {/* GRID DE VINOS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px',
          paddingBottom: '60px'
        }}>
          {vinosFiltrados.map((vino, index) => {
            const precioFinal = isBirthdayToday ? Math.round(applyBirthdayDiscount(vino.precio)) : vino.precio;
            const ahorroDescuento = isBirthdayToday ? Math.round(getBirthdayDiscountAmount(vino.precio)) : 0;
            
            return (
              <div 
                key={index} 
                style={{
                  background: COLORS.white,
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${COLORS.border}`,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                }}
              >

                {/* Encabezado con tipo */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <Wine size={28} color={COLORS.primary} />
                  <span style={{
                    background: COLORS.primary,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }}>
                    {vino.tipo}
                  </span>
                </div>

                {/* Nombre del vino */}
                <h3 style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.5rem',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  fontWeight: 700,
                  minHeight: '60px'
                }}>
                  {vino.nombre}
                </h3>

                {/* Ubicación */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: COLORS.textLight,
                  marginBottom: '12px',
                  fontSize: '14px'
                }}>
                  <MapPin size={16} />
                  <span>{vino.region}, {vino.pais}</span>
                </div>

                {/* Descripción */}
                <p style={{
                  color: '#555',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  minHeight: '60px'
                }}>
                  {vino.descripcion}
                </p>

                {/* Precio */}
                <div style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: '15px',
                  marginBottom: '15px'
                }}>
                  <span style={{
                    display: 'block',
                    fontSize: '12px',
                    color: COLORS.textLighter,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                  }}>
                    Precio
                  </span>
                  
                  {isBirthdayToday ? (
                    <div>
                      <span style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        color: COLORS.textLighter,
                        textDecoration: 'line-through',
                        fontFamily: '"Playfair Display", serif',
                        marginBottom: '4px'
                      }}>
                        ${vino.precio}
                      </span>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <span style={{
                          fontSize: '1.8rem',
                          fontWeight: 700,
                          color: COLORS.primary,
                          fontFamily: '"Playfair Display", serif'
                        }}>
                          ${precioFinal}
                        </span>
                        <span style={{
                          fontSize: '0.85rem',
                          color: COLORS.primary,
                          fontWeight: 600,
                          background: 'rgba(212, 175, 55, 0.2)',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          whiteSpace: 'nowrap'
                        }}>
                          🎂 {BIRTHDAY_DISCOUNT_PERCENT}% OFF • Ahorras ${ahorroDescuento}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: COLORS.secondary,
                      fontFamily: '"Playfair Display", serif'
                    }}>
                      ${vino.precio}
                    </span>
                  )}
                </div>

                {/* Botón agregar al carrito */}
                <button
                  onClick={() => agregarAlCarrito(vino)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#7a0020';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = COLORS.primary;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label={`Agregar ${vino.nombre} al carrito`}
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </button>
              </div>
            );
          })}
        </div>

        {/* Sin resultados */}
        {vinosFiltrados.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: COLORS.textLighter
          }}>
            <Wine size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: COLORS.text }}>
              No se encontraron vinos
            </h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
          </div>
        )}
      </div>

      {/* ChatBot flotante */}
      <ChatBot />

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .wine-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CatalogoVinos;