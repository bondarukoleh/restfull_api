const middleware = {
	logger: require('./logger.middleware'),
	authentication: require('./authenticate.middleware'),
};

module.exports = middleware;
