const {host, Urls} = require('./api.data');

const testData = {
	apiData: {
		host,
		Urls
	},
	dbData: require('./db'),
	usersData: require('./users.data'),
};

module.exports = testData;
