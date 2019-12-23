const {apiData: {host}} = require('../../data');
const {GenresApi} = require('./genres.api');
const {CustomersApi} = require('./customers.api');

const apiObjects = {
	genresApi: new GenresApi(host),
	customersApi: new CustomersApi(host)
};

module.exports = apiObjects;
