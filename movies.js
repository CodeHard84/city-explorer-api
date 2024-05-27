const axios = require('axios');

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

module.exports = { Movies };
