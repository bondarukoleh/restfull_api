const {apiData: {host}} = require('../../data');
const {GenresApi} = require('./genres.api');
const {CustomersApi} = require('./customers.api');
const {MoviesApi} = require('./movies.api');

const apiObjects = {
	genresApi: new GenresApi(host),
	customersApi: new CustomersApi(host),
	moviesApi: new MoviesApi(host),
};

module.exports = apiObjects;
