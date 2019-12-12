const log = require('debug')('middleware:auth');

function authentication(req, res, next) {
	// TODO: Extend
	log('Authenticating...');
	next();
}

module.exports = authentication;
