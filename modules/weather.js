const axios = require('axios');
const cache = require('../server');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
    static async getForecast(req, res) {
        try {
            const lat = req.query.lat;
            const lon = req.query.lon;
            const cacheKey = `weather_${lat}_${lon}`;

            if (cache.has(cacheKey)) {
                return res.json(cache.get(cacheKey));
            }

            const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
                params: {
                    lat: lat,
                    lon: lon,
                    key: WEATHER_API_KEY
                }
            });

            const weatherData = response.data.data;

            const formattedData = weatherData.map(day => ({
                description: `Low of ${Forecast.celsiusToFahrenheit(day.low_temp)}°F, high of ${Forecast.celsiusToFahrenheit(day.high_temp)}°F with ${day.weather.description}.`,
                date: day.valid_date
            }));

            cache.set(cacheKey, formattedData);

            res.json(formattedData);
        } catch (error) {
            console.log(error);
            res.status(500).send('Error getting weather data.');
        }
    }

    static celsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9) / 5 + 32);
    }
}

module.exports = { Forecast };
