import React, { useState, useEffect, useMemo } from 'react';
import { Wine, MapPin, Filter, X, Search, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
import CartIcon from '../components/CartIcon';
import { supabase } from '../supabaseClient';
import { getCurrentUser } from '../auth';
import { isBirthday, applyBirthdayDiscount, getBirthdayDiscountAmount, BIRTHDAY_DISCOUNT_PERCENT } from '../utils/birthday';
import { getAllWines, Wine as Vino } from '../services/wineService';
import { addToCart } from '../utils/cartUtils';

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
  const [vinos, setVinos] = useState<Vino[]>([]);
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

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar vinos
        const dataVinos = await getAllWines();
        setVinos(dataVinos);

        // Verificar cumpleaños
        const user = getCurrentUser();
        if (user) {
          const { data } = await supabase
            .from('usuarios')
            .select('fecha_cumpleanos, nombre')
            .eq('id', user.id)
            .single();

          if (data?.fecha_cumpleanos && isBirthday(data.fecha_cumpleanos)) {
            setIsBirthdayToday(true);
            setUserName(data.nombre);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const tipos = ['Todos', 'Tinto', 'Blanco', 'Espumoso', 'Rosado', 'Dulce', 'Dulce Fortificado', 'Fortificado'];
  const paises = useMemo(() => ['Todos', ...new Set(vinos.map(v => v.pais))].sort(), [vinos]);

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
    if (!vino.stock || vino.stock === 0) {
      alert('Este vino no tiene stock disponible')
      return
    }

    if (!vino.id) return

    const success = addToCart({
      vino_id: vino.id,
      nombre: vino.nombre,
      precio: isBirthdayToday ? applyBirthdayDiscount(vino.precio) : vino.precio,
      imagen_url: vino.imagen,
      stock: vino.stock
    }, 1)

    if (success) {
      alert(`✅ ${vino.nombre} agregado al carrito`)
    }
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
                {/* Imagen del Vino (Placeholder o Real) */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {vino.imagen ? (
                    <img
                      src={vino.imagen}
                      alt={vino.nombre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '10px'
                      }}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#ccc'
                    }}>
                      <Wine size={48} strokeWidth={1} />
                      <span style={{ fontSize: '0.9rem' }}>Imagen próximamente</span>
                    </div>
                  )}

                  {/* Badge de Tipo flotante */}
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: COLORS.primary,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
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

                {/* Stock info */}
                {vino.stock !== undefined && (
                  <div style={{
                    marginBottom: '10px',
                    padding: '8px',
                    background: (vino.stock || 0) === 0 ? '#fee' : (vino.stock || 0) <= (vino.stock_minimo || 0) ? '#fff3cd' : '#e8f5e9',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: (vino.stock || 0) === 0 ? '#c00' : (vino.stock || 0) <= (vino.stock_minimo || 0) ? '#856404' : '#2e7d32'
                    }}>
                      {(vino.stock || 0) === 0 ? '🚫 AGOTADO' : `Disponible(s): ${vino.stock} ${(vino.stock || 0) <= (vino.stock_minimo || 0) ? '⚠️' : ''}`}
                    </span>
                  </div>
                )}

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
                  disabled={(vino.stock || 0) === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: (vino.stock || 0) === 0 ? '#ccc' : COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: (vino.stock || 0) === 0 ? 'not-allowed' : 'pointer',
                    opacity: (vino.stock || 0) === 0 ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if ((vino.stock || 0) > 0) {
                      e.currentTarget.style.background = '#7a0020';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if ((vino.stock || 0) > 0) {
                      e.currentTarget.style.background = COLORS.primary;
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  aria-label={`Agregar ${vino.nombre} al carrito`}
                >
                  <ShoppingCart size={18} />
                  {(vino.stock || 0) === 0 ? 'Agotado' : 'Agregar al Carrito'}
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

      {/* Ícono flotante del carrito */}
      <CartIcon />

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