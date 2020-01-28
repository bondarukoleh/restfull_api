module.exports = {
	pluginRoutes: require('./routes'),
	pluginMiddleware: require('./middleware'),
	connectDB: require('./db'),
	addLogging: require('./logging'),
	handleExceptions: require('./handle.exceptions'),
	appListeners: require('./app.listeners'),
};
