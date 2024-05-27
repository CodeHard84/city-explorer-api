const axios = require('axios');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(searchQuery, lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  async getForecast() {
    try {
      const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
        params: {
          lat: this.lat,
          lon: this.lon,
          key: WEATHER_API_KEY
        }
      });
      const weatherData = response.data.data;

      return weatherData.map(day => ({
        description: `Low of ${celsiusToFahrenheit(day.low_temp)}°F, high of ${celsiusToFahrenheit(day.high_temp)}°F with ${day.weather.description}.`,
        date: day.valid_date
      }));
    } catch (error) {
      console.log(error);
      throw new Error('Error getting weather data.');
    }
  }
}

function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

module.exports = { Forecast, celsiusToFahrenheit };
