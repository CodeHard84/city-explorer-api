const express = require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Import the weather and movies modules
const { Forecast } = require('./weather');
const { Movies } = require('./movies');

// Middleware
const cors = require('cors');
app.use(cors({ origin: '*' }));

// Weather route
app.get('/weather', async (req, res) => {
  const { searchQuery, lat, lon } = req.query;
  if (searchQuery && lat && lon) {
    try {
      const forecast = await new Forecast(searchQuery, lat, lon).getForecast();
      res.status(200).json(forecast);
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(400).send('Please specify searchQuery, lat, and lon in the query string. Example: /weather?searchQuery=Seattle&lat=47.6038321&lon=-122.330062');
  }
});

// Movies route
app.get('/movies', async (req, res) => {
  const { searchQuery } = req.query;
  if (searchQuery) {
    try {
      const movies = await new Movies(searchQuery).getMovies();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(400).send('Please specify searchQuery in the query string. Example: /movies?searchQuery=Seattle');
  }
});

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
