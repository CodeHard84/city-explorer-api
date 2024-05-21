const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Load data/weather.json into an array
const weatherData = require('./data/weather.json');

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Hello name route
app.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

// Weather route
app.get('/weather', (req, res) => {
  const city = req.query.city;
  if (city) {
    const weather = new Weather(city);
    res.json(weather.weatherInfo);
  } else {
    res.status(400).send('Please specify a city in the query string. Example: /weather?city=Seattle');
  }
});

class Weather {
  constructor(city) {
    this.city = city;
    this.weatherInfo = this.getWeather(city);
  }

  getWeather(city) {
    if (!city) {
      return { error: 'City not provided' };
    }
    const cityWeather = weatherData.find(item => item.city_name && item.city_name.toLowerCase() === city.toLowerCase());
    if (cityWeather) {
      return cityWeather;
    } else {
      return { error: 'City not found in data.' };
    }
  }
}

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
