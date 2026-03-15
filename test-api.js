const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
let token = '';

async function runTests() {
    console.log('🚀 Starting API Tests...');

    try {
        // 1. Register
        console.log('\n--- Testing Registration ---');
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Vinit Farmer',
                phone: '1234567890',
                district: 'Palakkad',
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log(regData);

        // 2. Login
        console.log('\n--- Testing Login ---');
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: '1234567890',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        token = loginData.token;
        console.log('Login Status:', loginRes.status);
        console.log('Token Received:', token ? 'Yes' : 'No');

        // 3. Mock Prices
        console.log('\n--- Testing Market Prices ---');
        const priceRes = await fetch(`${BASE_URL}/api/prices/rice`);
        console.log('Rice Price Status:', priceRes.status);
        console.log(await priceRes.json());

        // 4. Mock Calendar
        console.log('\n--- Testing Crop Calendar ---');
        const calRes = await fetch(`${BASE_URL}/api/calendar/palakkad`);
        console.log('Palakkad Calendar Status:', calRes.status);
        console.log(await calRes.json());

        // 5. Protected Query (AI Advice)
        // NOTE: This will fail if no actual Groq key is in .env
        console.log('\n--- Testing Protected AI Query (Unauthorized) ---');
        const queryFailRes = await fetch(`${BASE_URL}/api/query`, { method: 'POST' });
        console.log('Query (No Token) Status:', queryFailRes.status);

        if (token) {
            console.log('\n--- Testing Protected AI Query (Authorized) ---');
            console.log('(Note: Requires real API keys to succeed fully)');
            const queryRes = await fetch(`${BASE_URL}/api/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: 'Why are my paddy leaves turning yellow?',
                    district: 'Palakkad'
                })
            });
            console.log('Query (With Token) Status:', queryRes.status);
            console.log(await queryRes.json());
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

runTests();
