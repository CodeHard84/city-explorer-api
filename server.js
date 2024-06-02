const dotenv = require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
const Cache = require('./modules/cache');

// Create a new global cache object
const cache = new Cache(560000);


// Import the weather and movies modules
const { Forecast } = require('./modules/weather');
const { Movies } = require('./modules/movies');

// Middleware
const cors = require('cors');
app.use(cors({ origin: '*' }));

app.get('/weather', (req, res) => Forecast.getForecast(req, res));

app.get('/movies', (req, res) => Movies.getMovies(req, res));

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

// Now each module needs to require the server.js file to access the cache object.
module.exports = cache;