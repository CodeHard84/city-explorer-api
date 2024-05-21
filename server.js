const express = require('express');
const env = require('dotenv').config();
const app = express();
const port = env.parsed.PORT || 3000;

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
  res.json(weatherData);
});

class Weather {
  constructor(){
    // Build stuff here
  }
}

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
