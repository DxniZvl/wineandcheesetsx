// src/components/CartIcon.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { getCartCount } from '../utils/cartUtils'

export default function CartIcon() {
    const navigate = useNavigate()
    const [itemCount, setItemCount] = useState(0)

    useEffect(() => {
        // Actualizar contador inicial
        updateCount()

        // Escuchar cambios en el carrito
        const handleCartUpdate = () => updateCount()
        window.addEventListener('cartUpdated', handleCartUpdate)

        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
    }, [])

    const updateCount = () => {
        setItemCount(getCartCount())
    }

    if (itemCount === 0) return null

    return (
        <div
            onClick={() => navigate('/carrito')}
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '30px',
                background: '#5a0015',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(90, 0, 21, 0.4)',
                zIndex: 999,
                transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(90, 0, 21, 0.6)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(90, 0, 21, 0.4)'
            }}
        >
            <ShoppingCart size={28} color="white" />

            {/* Badge contador */}
            <div
                style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#d4af37',
                    color: '#5a0015',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    border: '2px solid white',
                    animation: 'pulse 0.5s ease'
                }}
            >
                {itemCount}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `}</style>
        </div>
    )
}
