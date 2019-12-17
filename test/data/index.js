const {host, commonHeaders, Urls, Statuses} = require('./api.data');

const testData = {
	apiData: {
		host,
		commonHeaders,
		Urls,
		Statuses
	},
	dbData: require('./db')
};

module.exports = testData;
