// src/components/Modal.tsx
import { ReactNode, useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    maxWidth?: string
}

/**
 * Componente modal reutilizable para formularios y confirmaciones
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = '600px' }: ModalProps) {
    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            // Prevenir scroll del body cuando modal está abierto
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            >
                {/* Modal Content */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        width: '100%',
                        maxWidth,
                        maxHeight: '90vh',
                        overflow: 'auto',
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 25px',
                        borderBottom: '1px solid #e0e0e0',
                        position: 'sticky',
                        top: 0,
                        background: 'white',
                        zIndex: 1
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            color: '#5a0015',
                            fontFamily: '"Playfair Display", serif'
                        }}>
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '28px',
                                color: '#999',
                                cursor: 'pointer',
                                padding: '0',
                                lineHeight: '1',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f0f0f0'
                                e.currentTarget.style.color = '#333'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none'
                                e.currentTarget.style.color = '#999'
                            }}
                            aria-label="Cerrar modal"
                        >
                            ×
                        </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '25px' }}>
                        {children}
                    </div>
                </div>
            </div>

            {/* Animaciones */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </>
    )
}
