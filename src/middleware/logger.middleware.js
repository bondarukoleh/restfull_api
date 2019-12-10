function logger(req, res, next) {
	// TODO: extend
	console.log('Logging...');
	next()
}

module.exports = logger;
