const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');

/**
 * GET /api/weather
 * Query: lat (required), lon (required)
 * Example: GET /api/weather?lat=19.0760&lon=72.8777
 */
router.get('/', async (req, res) => {
    const { lat, lon } = req.query;

    // 1. Validation
    if (!lat || !lon) {
        return res.status(400).json({
            error: 'Missing coordinates',
            message: 'Latitude (lat) and Longitude (lon) are required as query parameters.'
        });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
            error: 'Invalid coordinates',
            message: 'Latitude and longitude must be valid numbers.'
        });
    }

    // 2. Fetch data from service
    try {
        const weather = await getWeather(latitude, longitude);
        res.json(weather);
    } catch (error) {
        console.error('Weather Route Error:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to retrieve weather data. Please try again later.'
        });
    }
});

module.exports = router;
