const {apiData: {host}} = require('../../data');
const {GenresApi} = require('./genres.api');
const {CustomersApi} = require('./customers.api');
const {MoviesApi} = require('./movies.api');
const {RentalsApi} = require('./rentals.api');
const {UsersApi} = require('./users.api');
const {LoginApi} = require('./login.api');

const apiObjects = {
	genresApi: new GenresApi(host),
	customersApi: new CustomersApi(host),
	moviesApi: new MoviesApi(host),
	rentalsApi: new RentalsApi(host),
	usersApi: new UsersApi(host),
	loginApi: new LoginApi(host),
};

module.exports = apiObjects;
