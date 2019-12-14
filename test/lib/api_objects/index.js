const {apiData: {host}} = require('../../data');
const {GenresApi} = require('./genresApi');

const apiObjects = {
	genresApi: new GenresApi(host)
};

module.exports = apiObjects;
