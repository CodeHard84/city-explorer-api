const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Load data/weather.json into an array
const weatherData = require('./data/weather.json');

// Middleware
const cors = require('cors');
app.use(cors());

// Home route
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Hello name route
app.get('/hello/:name', (req, res) => {
  res.status(200).send(`Hello ${req.params.name}!`);
});

// Weather route
app.get('/weather', (req, res) => {
  const { searchQuery, lat, lon } = req.query;
  if (searchQuery && lat && lon) {
    const forecast = new Forecast(searchQuery, lat, lon);
    res.status(200).json(forecast.forecastInfo);
  } else {
    res.status(400).send('Please specify searchQuery, lat, and lon in the query string. Example: /weather?searchQuery=Seattle&lat=47.6038321&lon=-122.330062');
  }
});

class Forecast {
  constructor(searchQuery, lat, lon) {
    this.searchQuery = searchQuery;
    this.lat = lat;
    this.lon = lon;
    this.forecastInfo = this.getForecast();
  }

  getForecast() {
    const { searchQuery, lat, lon } = this;
    if (!searchQuery || !lat || !lon) {
      return { error: 'searchQuery, lat, or lon not provided' };
    }

    const cityWeather = weatherData.find(item => 
      item.city_name && 
      item.city_name.toLowerCase() === searchQuery.toLowerCase() &&
      item.lat.toString() === lat.toString() &&
      item.lon.toString() === lon.toString()
    );

    if (cityWeather) {
      // Modify the data to only include the necessary information
      return cityWeather.data.map(day => new ForecastData('Low of ' + celsiusToFahrenheit(day.low_temp) 
      + ', high of ' + celsiusToFahrenheit(day.high_temp) + ' with ' + day.weather.description, day.valid_date));
    } else {
      return { error: 'City not found in data.' };
    }
  }
}

// Let's use standard measurement units for the forecast
function celsiusToFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}

class ForecastData {
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send(error.message);
});

// Catch-all route for 404 errors
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});