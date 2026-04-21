const axios = require('axios');

async function testWeatherAPI() {
    const port = 5000; // Assuming the backend is running on 5000
    const lat = 19.0760;
    const lon = 72.8777;

    console.log(`Testing KISANKART Weather API at http://localhost:${port}/api/weather...`);

    try {
        // Test Valid Request
        console.log('\n--- Testing Valid Request (Mumbai) ---');
        const res = await axios.get(`http://localhost:${port}/api/weather?lat=${lat}&lon=${lon}`);
        console.log('Status:', res.status);
        console.log('Location:', JSON.stringify(res.data.location, null, 2));
        console.log('First 2 hours of forecast:');
        console.log(JSON.stringify(res.data.hourly.slice(0, 2), null, 2));
        console.log('Daily Info:', JSON.stringify(res.data.daily, null, 2));

        // Test Missing Params
        console.log('\n--- Testing Missing Params ---');
        try {
            await axios.get(`http://localhost:${port}/api/weather?lat=${lat}`);
        } catch (err) {
            console.log('Status (Expected 400):', err.response?.status);
            console.log('Error Body:', err.response?.data);
        }

        // Test Invalid Params
        console.log('\n--- Testing Invalid Params ---');
        try {
            await axios.get(`http://localhost:${port}/api/weather?lat=abc&lon=72.8777`);
        } catch (err) {
            console.log('Status (Expected 400):', err.response?.status);
            console.log('Error Body:', err.response?.data);
        }

        console.log('\n✅ Weather API Integration Test Complete!');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Hint: Make sure the server is running on port 5000 (npm run server)');
        }
    }
}

testWeatherAPI();
