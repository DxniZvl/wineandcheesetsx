const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `Eres un asistente virtual. Usuario: ${message}`;

        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ error: 'Error al procesar el mensaje', details: error.message, stack: error.stack });
    }
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`✅ Debug Server running on http://localhost:${PORT}`);
});
