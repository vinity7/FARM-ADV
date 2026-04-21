const axios = require('axios');

/**
 * Fetches weather data from Open-Meteo and returns a clean, formatted JSON.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Formatted weather data
 */
const getWeather = async (lat, lon) => {
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            hourly: [
                'temperature_2m',
                'relative_humidity_2m',
                'precipitation',
                'wind_speed_10m',
                'surface_pressure',
                'visibility',
                'uv_index',
                'soil_moisture_0_to_1cm'
            ].join(','),
            daily: 'sunrise,sunset',
            forecast_days: 7,
            timezone: 'auto'
        });

        const { data } = await axios.get(`${url.toString()}?${params.toString()}`);

        // Format the hourly data into the requested clean array structure
        const hourlyData = data.hourly.time.map((time, index) => ({
            time,
            temperature: data.hourly.temperature_2m[index],
            humidity: data.hourly.relative_humidity_2m[index],
            precipitation: data.hourly.precipitation[index],
            windSpeed: data.hourly.wind_speed_10m[index],
            pressure: data.hourly.surface_pressure[index],
            visibility: data.hourly.visibility[index],
            uvIndex: data.hourly.uv_index[index],
            soilMoisture: data.hourly.soil_moisture_0_to_1cm[index]
        }));

        return {
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                elevation: data.elevation
            },
            daily: {
                sunrise: data.daily.sunrise,
                sunset: data.daily.sunset
            },
            hourly: hourlyData
        };
    } catch (error) {
        console.error('Error in weatherService:', error.message);
        throw new Error('Failed to fetch weather data from external service');
    }
};

module.exports = {
    getWeather
};
