const middleware = {
	auth: require('./authenticate.middleware'),
	errorHandle: require('./error.hendler'),
};

module.exports = middleware;
