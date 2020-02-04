const middleware = {
	auth: require('./authenticate.middleware'),
	errorHandle: require('./error.hendler'),
	getValidateReqObj: require('./validate'),
};

module.exports = middleware;
