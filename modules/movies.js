const axios = require('axios');
const cache = require('../server');

class Movies {
  static async getMovies(req, res) {
    try {
      const searchQuery = req.query.query || 'popular';
      const cacheKey = `movies_${searchQuery}`;

      // Debug
      console.log('Cache instance:', cache);

      if (cache.has(cacheKey)) {
        return res.json(cache.get(cacheKey));
      }

      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          query: searchQuery,
          api_key: process.env.MOVIE_API_KEY
        }
      });

      const movies = response.data.results;

      const formattedMovies = movies.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        poster_path: movie.poster_path,
        popularity: movie.popularity
      }));

      cache.set(cacheKey, formattedMovies);
      console.log('Cache set:', cacheKey);

      res.json(formattedMovies);
    } catch (error) {
      console.log(error);
      res.status(500).send('Error getting movie data.');
    }
  }
}

module.exports = { Movies };
