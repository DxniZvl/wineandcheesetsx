const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const fs = require('fs');
            fs.writeFileSync('models.json', JSON.stringify(data.models, null, 2));
            console.log('Models written to models.json');
        } else {
            console.log('No models found or error:', data);
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
