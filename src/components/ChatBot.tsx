import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC = () => {
  // Cargar estado inicial desde localStorage
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('chatbot_isOpen');
    return saved ? JSON.parse(saved) : false;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatbot_messages');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de Wine and Cheese. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre nuestros vinos, quesos, reservas, eventos y más.'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  // Guardar estado de isOpen en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('chatbot_isOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Llamada al backend seguro
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();

      if (data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, no pude conectarme al servidor. Por favor verifica que el backend esté corriendo o contáctanos al +506 64306861.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #5a0015 0%, #8b0505 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(90, 0, 21, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 999
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(90, 0, 21, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(90, 0, 21, 0.4)';
          }}
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '380px',
          height: '550px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #5a0015 0%, #8b0505 100%)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Asistente Virtual
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  Wine and Cheese
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: '#f8f6f3',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #5a0015 0%, #8b0505 100%)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#333',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  wordWrap: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <Loader2 size={16} style={{
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Escribiendo...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            background: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#5a0015';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #5a0015 0%, #8b0505 100%)'
                  : '#e0e0e0',
                color: 'white',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isLoading) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <style>
        {`
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
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;