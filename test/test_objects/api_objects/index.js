const {apiData: {host}} = require('../../test_data');
const {GenresApi} = require('./genresApi');

const apiObjects = {
	genresApi: new GenresApi(host)
};

module.exports = apiObjects;
