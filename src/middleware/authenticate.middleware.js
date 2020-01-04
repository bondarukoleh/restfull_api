const log = require('debug')('middleware:auth');
const jwt = require('jsonwebtoken');
const {jwt_ppk} = require('config');

function authentication(req, res, next) {
	log('Check Authentication...');
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('Access denied. No token.');

	try {
		req.user = jwt.verify(token, jwt_ppk);
		next();
	} catch (e) {
		return res.status(400).send('Invalid token.');
	}
}

module.exports = authentication;
