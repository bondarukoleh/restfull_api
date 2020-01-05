const {host, Urls, Statuses} = require('./api.data');

const testData = {
	apiData: {
		host,
		Urls,
		Statuses
	},
	dbData: require('./db'),
	usersData: require('./users.data'),
};

module.exports = testData;
