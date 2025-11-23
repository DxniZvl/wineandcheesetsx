// src/pages/admin/AdminWines.tsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Modal from '../../components/Modal'
import {
    getAllWinesAdmin,
    createWine,
    updateWine,
    deleteWine,
    updateStock,
    Wine
} from '../../services/wineService'
import { Wine as WineIcon, Plus, Edit, Trash2, Search, AlertTriangle, Power } from 'lucide-react'

const COLORS = {
    primary: '#5a0015',
    secondary: '#d4af37',
    background: '#f8f6f3',
    white: '#ffffff',
    text: '#333',
    textLight: '#666',
    border: '#e0e0e0'
}

const WINE_TYPES = ['Tinto', 'Blanco', 'Espumoso', 'Rosado', 'Dulce', 'Dulce Fortificado', 'Fortificado']

export default function AdminWines() {
    const [wines, setWines] = useState<Wine[]>([])
    const [filteredWines, setFilteredWines] = useState<Wine[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('Todos')
    const [filterStock, setFilterStock] = useState('all') // all, low, out

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingWine, setEditingWine] = useState<Wine | null>(null)
    const [formData, setFormData] = useState<Partial<Wine>>({
        nombre: '',
        tipo: 'Tinto',
        pais: '',
        region: '',
        precio: 0,
        descripcion: '',
        imagen: '',
        stock: 0,
        stock_minimo: 5,
        activo: true
    })

    useEffect(() => {
        loadWines()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [wines, searchTerm, filterType, filterStock])

    const loadWines = async () => {
        try {
            const data = await getAllWinesAdmin()
            setWines(data)
        } catch (error) {
            console.error('Error loading wines:', error)
            alert('Error al cargar los vinos')
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = [...wines]

        // Búsqueda por texto
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            result = result.filter(w =>
                w.nombre.toLowerCase().includes(search) ||
                w.pais.toLowerCase().includes(search) ||
                w.region.toLowerCase().includes(search)
            )
        }

        // Filtro por tipo
        if (filterType !== 'Todos') {
            result = result.filter(w => w.tipo === filterType)
        }

        // Filtro por stock
        if (filterStock === 'low') {
            result = result.filter(w => w.stock <= w.stock_minimo && w.stock > 0)
        } else if (filterStock === 'out') {
            result = result.filter(w => w.stock === 0)
        }

        setFilteredWines(result)
    }

    const handleOpenModal = (wine?: Wine) => {
        if (wine) {
            setEditingWine(wine)
            setFormData(wine)
        } else {
            setEditingWine(null)
            setFormData({
                nombre: '',
                tipo: 'Tinto',
                pais: '',
                region: '',
                precio: 0,
                descripcion: '',
                imagen: '',
                stock: 0,
                stock_minimo: 5,
                activo: true
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingWine(null)
        setFormData({
            nombre: '',
            tipo: 'Tinto',
            pais: '',
            region: '',
            precio: 0,
            descripcion: '',
            imagen: '',
            stock: 0,
            stock_minimo: 5,
            activo: true
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validaciones
        if (!formData.nombre || !formData.pais || !formData.region) {
            alert('Por favor completa todos los campos obligatorios')
            return
        }

        if ((formData.precio || 0) <= 0) {
            alert('El precio debe ser mayor a 0')
            return
        }

        try {
            if (editingWine && editingWine.id) {
                // Actualizar
                await updateWine(editingWine.id, formData)
                alert('Vino actualizado exitosamente')
            } else {
                // Crear
                await createWine(formData as Omit<Wine, 'id' | 'created_at' | 'updated_at'>)
                alert('Vino creado exitosamente')
            }

            handleCloseModal()
            loadWines()
        } catch (error) {
            console.error('Error saving wine:', error)
            alert('Error al guardar el vino')
        }
    }

    const handleDelete = async (wine: Wine) => {
        if (!wine.id) return

        if (!confirm(`¿Estás seguro de ELIMINAR permanentemente "${wine.nombre}"? Esta acción no se puede deshacer.`)) {
            return
        }

        try {
            await deleteWine(wine.id)
            alert('Vino eliminado exitosamente')
            loadWines()
        } catch (error) {
            console.error('Error deleting wine:', error)
            alert('Error al eliminar el vino')
        }
    }

    const handleStockUpdate = async (wine: Wine, newStock: number) => {
        if (!wine.id) return

        if (newStock < 0) {
            alert('El stock no puede ser negativo')
            return
        }

        try {
            await updateStock(wine.id, newStock)
            loadWines()
        } catch (error) {
            console.error('Error updating stock:', error)
            alert('Error al actualizar el stock')
        }
    }

    const handleToggleStatus = async (wine: Wine) => {
        if (!wine.id) return

        const newStatus = !wine.activo
        const action = newStatus ? 'activar' : 'desactivar'

        if (!confirm(`¿Estás seguro de ${action} "${wine.nombre}"?`)) {
            return
        }

        try {
            await updateWine(wine.id, { ...wine, activo: newStatus })
            alert(`Vino ${newStatus ? 'activado' : 'desactivado'} exitosamente`)
            loadWines()
        } catch (error) {
            console.error('Error updating wine status:', error)
            alert(`Error al ${action} el vino`)
        }
    }

    if (loading) {
        return (
            <AdminLayout title="Gestión de Vinos">
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <WineIcon size={64} color={COLORS.primary} style={{ animation: 'pulse 2s infinite' }} />
                    <p style={{ marginTop: '20px', color: COLORS.textLight }}>Cargando vinos...</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title="Gestión de Vinos">
            {/* Header con botón añadir */}
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: COLORS.text }}>
                        Total: {filteredWines.length} vino{filteredWines.length !== 1 ? 's' : ''}
                    </h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '12px 24px',
                        background: COLORS.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#7a0020'
                        e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = COLORS.primary
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    <Plus size={20} />
                    Añadir Vino
                </button>
            </div>

            {/* Filtros */}
            <div style={{
                background: COLORS.white,
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '25px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px'
                }}>
                    {/* Búsqueda */}
                    <div style={{ position: 'relative' }}>
                        <Search style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: COLORS.textLight
                        }} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar vino..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: `2px solid ${COLORS.border}`,
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    {/* Filtro tipo */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '10px',
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="Todos">Todos los tipos</option>
                        {WINE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Filtro stock */}
                    <select
                        value={filterStock}
                        onChange={(e) => setFilterStock(e.target.value)}
                        style={{
                            padding: '10px',
                            border: `2px solid ${COLORS.border}`,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">Todos los stocks</option>
                        <option value="low">Stock bajo</option>
                        <option value="out">Agotados</option>
                    </select>
                </div>
            </div>

            {/* Tabla de vinos */}
            <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ background: COLORS.background }}>
                                <th style={tableHeaderStyle}>Nombre</th>
                                <th style={tableHeaderStyle}>Tipo</th>
                                <th style={tableHeaderStyle}>País</th>
                                <th style={tableHeaderStyle}>Precio</th>
                                <th style={tableHeaderStyle}>Stock</th>
                                <th style={tableHeaderStyle}>Estado</th>
                                <th style={tableHeaderStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWines.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: COLORS.textLight }}>
                                        No se encontraron vinos
                                    </td>
                                </tr>
                            ) : (
                                filteredWines.map(wine => (
                                    <tr key={wine.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ fontWeight: 600, color: COLORS.text }}>{wine.nombre}</div>
                                            <div style={{ fontSize: '0.85rem', color: COLORS.textLight }}>{wine.region}</div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                background: 'rgba(90, 0, 21, 0.1)',
                                                color: COLORS.primary,
                                                fontSize: '0.85rem',
                                                fontWeight: 600
                                            }}>{wine.tipo}</span>
                                        </td>
                                        <td style={tableCellStyle}>{wine.pais}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>${wine.precio}</span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="number"
                                                    value={wine.stock}
                                                    onChange={(e) => handleStockUpdate(wine, parseInt(e.target.value) || 0)}
                                                    style={{
                                                        width: '70px',
                                                        padding: '6px 8px',
                                                        border: `2px solid ${wine.stock <= wine.stock_minimo ? '#f59e0b' : COLORS.border}`,
                                                        borderRadius: '6px',
                                                        fontSize: '0.9rem',
                                                        textAlign: 'center'
                                                    }}
                                                    min="0"
                                                />
                                                {wine.stock <= wine.stock_minimo && (
                                                    <AlertTriangle size={18} color="#f59e0b" />
                                                )}
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '999px',
                                                background: wine.activo ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: wine.activo ? '#10b981' : '#ef4444',
                                                fontSize: '0.85rem',
                                                fontWeight: 600
                                            }}>
                                                {wine.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleOpenModal(wine)}
                                                    style={actionButtonStyle}
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(wine)}
                                                    style={{ ...actionButtonStyle, color: '#ef4444' }}
                                                    title="Desactivar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(wine)}
                                                    style={{
                                                        ...actionButtonStyle,
                                                        color: wine.activo ? '#ef4444' : '#10b981',
                                                        background: wine.activo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                                                    }}
                                                    title={wine.activo ? "Desactivar" : "Activar"}
                                                >
                                                    <Power size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de crear/editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingWine ? 'Editar Vino' : 'Añadir Nuevo Vino'}
                maxWidth="700px"
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div>
                            <label style={labelStyle}>Nombre *</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Tipo *</label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    style={inputStyle}
                                    required
                                >
                                    {WINE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Precio * ($)</label>
                                <input
                                    type="number"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                                    style={inputStyle}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>País *</label>
                                <input
                                    type="text"
                                    value={formData.pais}
                                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Región *</label>
                                <input
                                    type="text"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>URL de Imagen</label>
                            <input
                                type="text"
                                value={formData.imagen}
                                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                style={inputStyle}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    style={inputStyle}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Stock Mínimo</label>
                                <input
                                    type="number"
                                    value={formData.stock_minimo}
                                    onChange={(e) => setFormData({ ...formData, stock_minimo: parseInt(e.target.value) })}
                                    style={inputStyle}
                                    min="0"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Estado</label>
                                <select
                                    value={formData.activo ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'true' })}
                                    style={inputStyle}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: COLORS.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {editingWine ? 'Actualizar' : 'Crear'} Vino
                            </button>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'white',
                                    color: COLORS.text,
                                    border: `2px solid ${COLORS.border}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </AdminLayout>
    )
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '15px 12px',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
}

const tableCellStyle: React.CSSProperties = {
    padding: '15px 12px'
}

const actionButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.primary,
    padding: '6px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: COLORS.text,
    fontSize: '0.9rem'
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `2px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
}
