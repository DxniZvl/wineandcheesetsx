const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        const apiKey = process.env.GEMINI_API_KEY;
        // Using gemini-1.5-flash
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const fetchResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Eres un asistente virtual. Usuario: ${message}`
                    }]
                }]
            })
        });

        if (!fetchResponse.ok) {
            const errorText = await fetchResponse.text();
            throw new Error(`API Error: ${fetchResponse.status} ${fetchResponse.statusText} - ${errorText}`);
        }

        const data = await fetchResponse.json();
        const text = data.candidates[0].content.parts[0].text;

        res.json({ response: text });
    } catch (error) {
        const errorLog = `Error: ${error.message}\nStack: ${error.stack}\nDetails: ${JSON.stringify(error, null, 2)}\n`;
        fs.writeFileSync('error-3004.log', errorLog);
        console.error('Detailed Error:', error);
        res.status(500).json({ error: 'Error al procesar el mensaje', details: error.message });
    }
});

const PORT = 3004;
app.listen(PORT, () => {
    console.log(`✅ Debug Server running on http://localhost:${PORT}`);
});
