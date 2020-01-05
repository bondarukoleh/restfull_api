const {host, commonHeaders, Urls, Statuses} = require('./api.data');

const testData = {
	apiData: {
		host,
		commonHeaders,
		Urls,
		Statuses
	},
	dbData: require('./db'),
	usersData: require('./users.data'),
};

module.exports = testData;
