import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type ChatMessage = {
  from: 'user' | 'bot';
  text: string;
};

// Creamos el cliente UNA sola vez fuera del componente
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!ai || !apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'No encuentro la API key de Gemini. Revisa el .env (VITE_GEMINI_API_KEY) y reinicia npm run dev.',
        },
      ]);
      return;
    }

    const userText = input.trim();
    const newMessages: ChatMessage[] = [
      ...messages,
      { from: 'user', text: userText },
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // System prompt + historial
      const systemPrompt =
        'Eres un asistente de ayuda para la página del restaurante Wine and Cheese en Costa Rica. ' +
        'Respondes de forma breve, clara y amable. ' +
        'Puedes ayudar con menú, vinos, reservas, horarios, ubicación y eventos. ' +
        'Si te preguntan algo fuera del restaurante, también puedes responder, pero en respuestas cortas.';

      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        ...newMessages.map((m) => ({
          role: m.from === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      ];

      // 👇 Aquí usamos EXACTAMENTE el patrón del quickstart:
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // modelo recomendado ahora
        contents,
      });

      const reply =
        (response as any).text?.trim?.() ||
        'Lo siento, hubo un problema al responder.';

      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch (error) {
      console.error('Gemini error:', error);
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text:
            'Hubo un error de conexión con Gemini. Revisa tu API key en aistudio.google.com y vuelve a intentar.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#770707',
            color: 'white',
            fontSize: 24,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          💬
        </button>
      ) : (
        <div
          style={{
            width: 320,
            maxHeight: 420,
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#770707',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 14,
            }}
          >
            <span>Wine &amp; Cheese - Ayuda</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'white',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: 'auto',
              fontSize: 14,
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  fontStyle: 'italic',
                  color: '#666',
                }}
              >
                Hola 👋 Soy tu asistente. Pregúntame sobre reservaciones, menú,
                vinos, eventos o cómo llegar al restaurante.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent:
                    m.from === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: 10,
                    maxWidth: '80%',
                    backgroundColor:
                      m.from === 'user' ? '#770707' : '#f1f1f1',
                    color: m.from === 'user' ? 'white' : 'black',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <p style={{ fontSize: 12, color: '#666' }}>Escribiendo…</p>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid #ddd',
              padding: 8,
              display: 'flex',
              gap: 6,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: 14,
                borderRadius: 6,
                border: '1px solid #ccc',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#770707',
                color: 'white',
                cursor: loading ? 'default' : 'pointer',
                fontSize: 14,
              }}
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
