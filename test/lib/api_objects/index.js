const {apiData: {host}} = require('../../data');
const {GenresApi} = require('./genres.api');
const {CustomersApi} = require('./customers.api');
const {MoviesApi} = require('./movies.api');
const {RentalsApi} = require('./rentals.api');

const apiObjects = {
	genresApi: new GenresApi(host),
	customersApi: new CustomersApi(host),
	moviesApi: new MoviesApi(host),
	rentalsApi: new RentalsApi(host),
};

module.exports = apiObjects;
