import fetch from 'node-fetch';

async function testChat() {
    try {
        console.log('Testing /api/chat...');
        const response = await fetch('http://localhost:3004/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hola, ¿qué vinos tienes?' })
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response text:', await response.text());
        } else {
            const data = await response.json();
            console.log('Success! Response:', data);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testChat();
