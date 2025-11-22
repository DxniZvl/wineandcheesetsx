import React, { useState } from 'react';
import { Wine, MapPin, Filter, X, Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const CatalogoVinos = () => {
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroPais, setFiltroPais] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const vinos = [
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

  const vinosFiltrados = vinos.filter(vino => {
    const cumpleTipo = filtroTipo === 'Todos' || vino.tipo === filtroTipo;
    const cumplePais = filtroPais === 'Todos' || vino.pais === filtroPais;
    const cumpleBusqueda = vino.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          vino.region.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleTipo && cumplePais && cumpleBusqueda;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f3' }}>
      {/* NAVBAR COMPONENTE */}
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '4rem',
            fontWeight: 700,
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
            marginBottom: '10px'
          }}>
            Catálogo de Vinos
          </h1>
          <p style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            color: '#d4af37',
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
          background: 'white',
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
              color: '#999'
            }} size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o región..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 45px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
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
              background: '#5a0015',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: 600
            }}
          >
            <Filter size={18} />
            Filtros
          </button>

          {/* Filtros */}
          <div style={{
            display: mostrarFiltros ? 'grid' : 'none',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
                Tipo de Vino
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#333' }}>
                País de Origen
              </label>
              <select
                value={filtroPais}
                onChange={(e) => setFiltroPais(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {paises.map(pais => (
                  <option key={pais} value={pais}>{pais}</option>
                ))}
              </select>
            </div>

            {(filtroTipo !== 'Todos' || filtroPais !== 'Todos' || busqueda) && (
              <button
                onClick={() => {
                  setFiltroTipo('Todos');
                  setFiltroPais('Todos');
                  setBusqueda('');
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
          color: '#666',
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
          {vinosFiltrados.map((vino, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid #f0f0f0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
            }}>
              {/* Encabezado con tipo */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <Wine size={28} color="#5a0015" />
                <span style={{
                  background: '#5a0015',
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
                color: '#5a0015',
                marginBottom: '10px',
                fontWeight: 700
              }}>
                {vino.nombre}
              </h3>

              {/* Ubicación */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#666',
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
                borderTop: '1px solid #f0f0f0',
                paddingTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Precio
                </span>
                <span style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#d4af37',
                  fontFamily: '"Playfair Display", serif'
                }}>
                  ${vino.precio}
                </span>
              </div>
            </div>
          ))}
        </div>

        {vinosFiltrados.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <Wine size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
              No se encontraron vinos
            </h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogoVinos;