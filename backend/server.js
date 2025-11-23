const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    status: '✅ Backend funcionando correctamente',
    endpoints: {
      chat: 'POST /api/chat'
    }
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Usando gemini-2.0-flash (versión estable)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = `Eres un asistente virtual experto de Wine and Cheese, un restaurante elegante especializado en vinos y quesos en Alajuela, Costa Rica.

INFORMACIÓN DEL RESTAURANTE:
- Ubicación: Alajuela, La Ceiba, Costa Rica
- Teléfono: +506 64306861
- Email: info@wineandcheese.cr
- Horario: Martes a Domingo 12:00 PM - 10:00 PM (Lunes cerrado)
- Especialidad: Maridaje de vinos y quesos premium
- Servicios: Catas de vino, eventos privados, menú gourmet

VINOS DESTACADOS:
- Tintos: Château Margaux ($450), Opus One ($420), Vega Sicilia Único ($500)
- Blancos: Chablis Grand Cru ($280), Cloudy Bay Sauvignon Blanc ($150)
- Espumosos: Moët & Chandon ($180), Veuve Clicquot ($220)
- Vinos Costarricenses: Viñedos Altamira ($75-85)

Responde en español, sé amable, profesional y conciso (2-4 líneas máximo).

Usuario: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al procesar el mensaje', details: error.message });
  }
});

// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;