const express = require('express');
const dotenv = require('dotenv').config();
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Import the weather module
const { Forecast } = require('./weather');

// Middleware
const cors = require('cors');
app.use(cors({ origin: '*' }));

// Home route
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

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

// Movies route and class
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

class Movies {
  constructor(searchQuery) {
    this.searchQuery = searchQuery;
  }

  async getMovies() {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          query: this.searchQuery,
          api_key: process.env.MOVIE_API_KEY
        }
      });
      const movies = response.data.results;

      return movies.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        poster_path: movie.poster_path,
        popularity: movie.popularity
      }));
    } catch (error) {
      console.log(error);
      throw new Error('Error getting movie data.');
    }
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
