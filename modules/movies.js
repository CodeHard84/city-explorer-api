const axios = require('axios');

class Movies {
  static async getMovies(req, res) {
    try {
      const searchQuery = req.query.query || 'popular';
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          query: searchQuery,
          api_key: process.env.MOVIE_API_KEY
        }
      });
      const movies = response.data.results;

      res.json(movies.map(movie => ({
        title: movie.title,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        poster_path: movie.poster_path,
        popularity: movie.popularity
      })));
    } catch (error) {
      console.log(error);
      res.status(500).send('Error getting movie data.');
    }
  }
}

module.exports = { Movies };
